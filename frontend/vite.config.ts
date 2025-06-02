import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  define: {
    'process.env.SSR': 'false',
  },

  build: {
    target: 'es2020',
    minify: 'terser', // ✅ safer than esbuild for CommonJS interop
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/components/ui/')) return 'shadcn';

          if (id.includes('node_modules')) {
            const map = new Map([
              ['react', 'react'],
              ['framer-motion', 'motion'],
              ['zustand', 'zustand'],
              ['@radix-ui', 'radix'],
              ['lucide-react', 'icons'],
            ]);

            for (const [lib, chunkName] of map.entries()) {
              if (id.includes(lib)) return chunkName;
            }

            return 'vendor'; // Fallback chunk
          }

          return undefined;
        },
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
