import fs from "fs/promises";
import { readFileSync, writeFileSync, statSync } from "fs";
import path from "path";

const EXCLUDE_DIRS = new Set(["node_modules", "dist", ".git", ".next", "build", "coverage"]);
const VALID_EXTENSIONS = new Set([".js", ".ts", ".mjs", ".cjs", ".jsx", ".tsx"]);

/**
 * Recursively find all files with valid extensions using async operations
 * @param {string} dir - Directory to search
 * @param {number} maxDepth - Maximum recursion depth (default: 50)
 * @returns {Promise<string[]>} Array of file paths
 */
async function walkAsync(dir, maxDepth = 50) {
  if (maxDepth <= 0) return [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results = [];

    // Process directories and files in parallel
    const promises = entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name)) return [];
        return await walkAsync(fullPath, maxDepth - 1);
      } else if (entry.isFile() && VALID_EXTENSIONS.has(path.extname(entry.name))) {
        return [fullPath];
      }
      return [];
    });

    const nestedResults = await Promise.all(promises);
    return nestedResults.flat();
  } catch (error) {
    console.warn(`Warning: Cannot read directory ${dir}: ${error.message}`);
    return [];
  }
}

/**
 * Synchronous version for smaller directories or when async isn't needed
 * @param {string} dir - Directory to search
 * @param {number} maxDepth - Maximum recursion depth
 * @returns {string[]} Array of file paths
 */
function walkSync(dir, maxDepth = 50) {
  if (maxDepth <= 0) return [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name)) continue;
        results.push(...walkSync(fullPath, maxDepth - 1));
      } else if (entry.isFile() && VALID_EXTENSIONS.has(path.extname(entry.name))) {
        results.push(fullPath);
      }
    }

    return results;
  } catch (error) {
    console.warn(`Warning: Cannot read directory ${dir}: ${error.message}`);
    return [];
  }
}

/**
 * More comprehensive regex for import/export statements
 */
const IMPORT_EXPORT_PATTERNS = {
  // Standard imports: import x from 'module' (simplified and more flexible)
  standardImport: /^(\s*import\s+(?:[^'"]*?\s+from\s+)?['"])([^'"]+)(['"].*?)$/gm,

  // Dynamic imports: import('module')
  dynamicImport: /(\bimport\s*\(\s*['"])([^'"]+)(['"][\s\S]*?\))/g,

  // Re-exports: export { x } from 'module'
  reExport: /^(\s*export\s+(?:[^'"]*?\s+from\s+)?['"])([^'"]+)(['"].*?)$/gm,

  // Require statements: const x = require('module')
  require: /(\brequire\s*\(\s*['"])([^'"]+)(['"][\s\S]*?\))/g
};

/**
 * Fix import/export statements in a file
 * @param {string} filePath - Path to the file
 * @param {Object} options - Processing options
 * @returns {boolean} True if file was modified
 */
function fixImportsInFile(filePath, options = {}) {
  const {
    addExtensions = true,
    fixRelativePaths = true,
    dryRun = false,
    verbose = false
  } = options;

  try {
    let content = readFileSync(filePath, "utf8");
    const originalContent = content;
    let hasChanges = false;

    // Process each pattern type
    Object.entries(IMPORT_EXPORT_PATTERNS).forEach(([patternName, regex]) => {
      content = content.replace(regex, (match, prefix, middle = '', modulePath, suffix = '') => {
        let newModulePath = modulePath;
        let modified = false;

        // Skip if it's a node module (doesn't start with . or /)
        if (!modulePath.startsWith('.') && !modulePath.startsWith('/')) {
          return match;
        }

        // Convert extensions to .js or add .js if missing
        if (addExtensions) {
          const currentExt = path.extname(modulePath);

          if (!currentExt) {
            // No extension - add .js
            const fullPath = path.resolve(path.dirname(filePath), modulePath);

            // First try adding .js extension
            try {
              const testPath = fullPath + '.js';
              statSync(testPath);
              newModulePath = modulePath + '.js';
              modified = true;
            } catch {
              // Check if it's a directory with index.js file
              try {
                const testPath = path.join(fullPath, 'index.js');
                statSync(testPath);
                newModulePath = modulePath + '/index.js';
                modified = true;
              } catch {
                // If neither exists, still add .js extension
                newModulePath = modulePath + '.js';
                modified = true;
              }
            }
          } else if (['.ts', '.tsx', '.mjs', '.cjs'].includes(currentExt)) {
            // Has extension that should be converted to .js
            const basePath = modulePath.slice(0, -currentExt.length);
            newModulePath = basePath + '.js';
            modified = true;
          }
        }

        // Normalize relative paths
        if (fixRelativePaths && newModulePath.startsWith('./')) {
          const normalized = path.posix.normalize(newModulePath);
          if (normalized !== newModulePath) {
            newModulePath = normalized;
            modified = true;
          }
        }

        if (modified) {
          hasChanges = true;
          if (verbose) {
            console.log(`  ${modulePath} → ${newModulePath}`);
          }
        }

        // Reconstruct the match based on pattern type
        if (patternName === 'dynamicImport' || patternName === 'require') {
          return `${prefix}'${newModulePath}'${suffix}`;
        } else {
          return `${prefix}${middle}'${newModulePath}'${suffix}`;
        }
      });
    });

    // Write file if changes were made and not in dry run mode
    if (hasChanges && !dryRun) {
      writeFileSync(filePath, content, "utf8");
    }

    return hasChanges;
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Process multiple files with progress reporting
 * @param {string[]} filePaths - Array of file paths to process
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Processing results
 */
async function processFiles(filePaths, options = {}) {
  const { batchSize = 10, verbose = false } = options;
  const results = {
    processed: 0,
    modified: 0,
    errors: 0,
    startTime: Date.now()
  };

  if (verbose) {
    console.log(`Processing ${filePaths.length} files...`);
  }

  // Process files in batches to avoid overwhelming the system
  for (let i = 0; i < filePaths.length; i += batchSize) {
    const batch = filePaths.slice(i, i + batchSize);

    await Promise.all(batch.map(async (filePath) => {
      try {
        const wasModified = fixImportsInFile(filePath, options);
        results.processed++;
        if (wasModified) {
          results.modified++;
          if (verbose) {
            console.log(`Modified: ${path.relative(process.cwd(), filePath)}`);
          }
        }
      } catch (error) {
        results.errors++;
        console.error(`Error processing ${filePath}: ${error.message}`);
      }
    }));

    // Progress reporting
    if (verbose && filePaths.length > 100) {
      const progress = Math.round(((i + batch.length) / filePaths.length) * 100);
      console.log(`Progress: ${progress}% (${i + batch.length}/${filePaths.length})`);
    }
  }

  results.duration = Date.now() - results.startTime;
  return results;
}

/**
 * Main function to process a directory
 * @param {string} rootDir - Root directory to process
 * @param {Object} options - Processing options
 */
async function main(rootDir = process.cwd(), options = {}) {
  const {
    useAsync = true,
    verbose = true,
    dryRun = false,
    ...processOptions
  } = options;

  console.log(`Scanning directory: ${rootDir}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);

  try {
    // Find all relevant files
    const files = useAsync
      ? await walkAsync(rootDir)
      : walkSync(rootDir);

    if (files.length === 0) {
      console.log("No files found to process.");
      return;
    }

    console.log(`Found ${files.length} files to process.`);

    // Process files
    const results = await processFiles(files, { verbose, dryRun, ...processOptions });

    // Print summary
    console.log("\n=== Processing Summary ===");
    console.log(`Files processed: ${results.processed}`);
    console.log(`Files modified: ${results.modified}`);
    console.log(`Errors: ${results.errors}`);
    console.log(`Duration: ${results.duration}ms`);

    if (dryRun && results.modified > 0) {
      console.log("\nRun without --dry-run to apply changes.");
    }
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Export functions for programmatic use
export {
  walkAsync,
  walkSync,
  fixImportsInFile,
  processFiles,
  main
};

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    verbose: !args.includes('--quiet'),
    useAsync: !args.includes('--sync')
  };

  const rootDir = args.find(arg => !arg.startsWith('--')) || process.cwd();
  main(rootDir, options);
}
