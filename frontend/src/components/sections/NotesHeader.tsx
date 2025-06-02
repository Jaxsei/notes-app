
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, ReceiptPoundSterling, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectPortal, SelectTrigger, SelectValue, SelectViewport } from "@radix-ui/react-select"; // Correct import for Radix Select
import { Button } from "../ui/button";
import { ModeToggle } from "../utils/mode-toggle";


const headerVariants = {
  hidden: {
    opacity: 0,
    y: -30, // Increased initial offset for a more noticeable entry
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring", // Changed to spring for a slightly bouncier feel
      stiffness: 100,
      damping: 20,
      duration: 0.7, // Spring doesn't strictly use duration this way, but helps hint at speed
      staggerChildren: 0.15, // Slightly increased stagger
      delayChildren: 0.2,  // Slightly increased delay
    }
  }
};

const searchVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9, // Adjusted for consistency
    x: -25
  },
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120, // Slightly adjusted spring
      damping: 18,
    }
  },
  focus: {
    scale: 1.03, // Slightly more pronounced focus scale
    boxShadow: "0px 0px 15px rgba(var(--primary-rgb), 0.3)", // Added subtle glow with CSS variable
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const controlsVariants = { // Variants for the group of controls
  hidden: {
    opacity: 0,
    x: 25, // Mirrored for right-side elements
    scale: 0.9
  },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      staggerChildren: 0.08 // Fine-tuned stagger
    }
  }
};

const itemVariants = { // For individual interactive items like buttons, select
  hidden: {
    opacity: 0,
    y: 15,
    scale: 0.85
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 180, // Made a bit stiffer for quicker response
      damping: 15
    }
  },
  hover: {
    scale: 1.08, // Increased hover scale
    y: -3,       // Subtle lift on hover
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 10
    }
  },
  tap: {
    scale: 0.92, // Slightly more pronounced tap
    y: 0,        // Ensure y resets on tap if lifted
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};

const searchIconVariants = {
  rest: {
    scale: 1,
    rotate: 0,
    opacity: 0.6,
    color: "hsl(var(--muted-foreground))" // Ensure color resets
  },
  focus: {
    scale: 1.15,
    rotate: 10,
    opacity: 1,
    color: "hsl(var(--primary))", // Change color to primary on focus
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  typing: {
    scale: [1, 1.25, 1, 1.15, 1], // More dynamic scaling
    opacity: [0.6, 1, 0.6, 0.9, 0.6],
    rotate: [0, -8, 0, 6, 0], // Added a slight wiggle
    color: ["hsl(var(--muted-foreground))", "hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(var(--primary))", "hsl(var(--muted-foreground))"],
    transition: {
      duration: 1.8, // Slightly longer for a more varied feel
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const profileVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    rotate: -120 // More dramatic entry rotation
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 180, // Adjusted spring
      damping: 12,
      delay: 0.6 // Slightly adjusted delay
    }
  },
  hover: {
    scale: 1.12,
    rotate: 8, // More pronounced hover rotation
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

const pulseVariants = { // For the profile status ring
  pulse: {
    scale: [1, 1.15, 1], // More noticeable pulse
    opacity: [0.4, 0.9, 0.4], // Adjusted opacity for more contrast
    transition: {
      duration: 2.5, // Slightly longer duration
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// New variant for the ModeToggle hover to make it distinct
const modeToggleHoverVariant = {
  scale: 1.15,
  rotate: [0, 20, -15, 0], // A playful wiggle
  transition: { duration: 0.5, ease: "easeInOut" }
};

// New variant for animated SelectItems (if you can wrap them)
const selectItemVariant = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, x: 15, transition: { duration: 0.15, ease: "easeIn" } }
};


export const NotesHeader = ({ searchQuery, setSearchQuery, sortBy, setSortBy, viewMode, setViewMode, authUser }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredControl, setHoveredControl] = useState(null); // For hover glows, already well implemented

  // Assuming your primary color is defined as CSS variable like: --primary-rgb: 255, 0, 0;
  // If not, replace rgba(var(--primary-rgb), 0.3) with a suitable color.

  return (
    <motion.header
      className="relative overflow-hidden" // Keep overflow hidden for some effects
      variants={headerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Enhanced background - already good */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      {/* Enhanced Animated Borders */}
      <motion.div // Main bottom border - subtle draw effect
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "circOut", delay: 0.3 }} // Draws after initial header elements
      />
      <motion.div // Highlight border - appears with a shimmer/pulse
        className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/30 via-primary to-primary/30"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 0.7, 1] }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut", times: [0, 0.5, 0.8, 1] }}
      />

      <div className="relative z-10 border-b border-transparent px-6 py-4 backdrop-blur-sm"> {/* Border transparent to rely on animated ones */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              className="relative max-w-md flex-1"
              variants={searchVariants}
              // `animate` will be handled by `initial` and `parent.animate="show"`
              whileFocus="focus" // Uses the 'focus' key from searchVariants
              onFocusCapture={() => setIsSearchFocused(true)}
              onBlurCapture={() => setIsSearchFocused(false)}
            >
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    className="absolute -inset-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-md pointer-events-none" // Slightly larger glow area
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25, ease: "circOut" }}
                  />
                )}
              </AnimatePresence>

              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20"> {/* Ensure icon is above glow */}
                <motion.div
                  variants={searchIconVariants}
                  animate={isSearchFocused ? "focus" : searchQuery ? "typing" : "rest"}
                >
                  <Search className="h-4 w-4" /> {/* Text color will be animated by variant */}
                </motion.div>
              </div>

              <Input
                type="search"
                placeholder="Search your notes..."
                className="pl-10 pr-10 relative z-10 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300" // Existing transitions are fine
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }} // Springy appearance
                  >
                    <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" /> {/* Slightly more opaque pulse dot */}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              variants={controlsVariants} // This will apply to the group, children get itemVariants
            >
              <motion.div
                variants={itemVariants} // Applied for entry, hover, tap
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredControl('sort')}
                onHoverEnd={() => setHoveredControl(null)}
                className="relative"
              >
                <AnimatePresence>
                  {hoveredControl === 'sort' && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 relative z-10 bg-background/50 border-border/50 hover:border-primary/30 hover:bg-background/80 transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="bg-background/95 backdrop-blur-md border-border/50 rounded-md shadow-xl p-1 z-50"
                      >
                        <SelectViewport>
                          <SelectItem value="recent" className="flex items-center gap-2 cursor-pointer p-2 hover:bg-accent/50 focus:bg-accent/60 rounded transition-colors duration-150">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> Recent
                          </SelectItem>
                          <SelectItem value="title" className="flex items-center gap-2 cursor-pointer p-2 hover:bg-accent/50 focus:bg-accent/60 rounded transition-colors duration-150">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Title
                          </SelectItem>
                          <SelectItem value="starred" className="flex items-center gap-2 cursor-pointer p-2 hover:bg-accent/50 focus:bg-accent/60 rounded transition-colors duration-150">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" /> Starred
                          </SelectItem>
                        </SelectViewport>
                      </motion.div>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredControl('view')}
                onHoverEnd={() => setHoveredControl(null)}
                className="relative"
              >
                <AnimatePresence>
                  {hoveredControl === 'view' && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 to-pink-500/20 blur-lg pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="relative z-10 bg-background/50 border-border/50 hover:border-primary/30 hover:bg-background/80 transition-all duration-300"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={viewMode}
                      initial={{ rotate: viewMode === "grid" ? -90 : 90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: viewMode === "grid" ? 90 : -90, opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 220, damping: 18 }}
                      className="flex items-center justify-center"
                    >
                      {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-3"
            variants={controlsVariants}
          >
            <motion.div
              variants={itemVariants}
              whileHover={modeToggleHoverVariant}
              whileTap="tap"
              className="relative"
            >
              <ModeToggle />
            </motion.div>
            <ProfilesIndicator authUser={authUser} />
          </motion.div>
        </div>

        <AnimatePresence>
          {searchQuery && (
            <motion.div
              className="absolute top-full left-6 right-6 mt-2 p-3 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl z-50" // Enhanced shadow
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.25 }} // Springy appearance
            >
              <div className="text-xs text-muted-foreground">
                Searching for: <span className="text-primary font-medium">"{searchQuery}"</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient light effects - already good, subtle */}
        <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-md pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-secondary/10 to-transparent blur-md pointer-events-none" />
      </div>
    </motion.header>
  );
};


export const ProfilesIndicator = ({ authUser }) => {
  const profileVariants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
      rotate: -120 // More dramatic entry rotation
    },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 180, // Adjusted spring
        damping: 12,
        delay: 0.6 // Slightly adjusted delay
      }
    },
    hover: {
      scale: 1.12,
      rotate: 8, // More pronounced hover rotation
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const pulseVariants = { // For the profile status ring
    pulse: {
      scale: [1, 1.15, 1], // More noticeable pulse
      opacity: [0.4, 0.9, 0.4], // Adjusted opacity for more contrast
      transition: {
        duration: 2.5, // Slightly longer duration
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={profileVariants}
      whileHover="hover" //
      className="relative"
    >
      <motion.div
        className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 pointer-events-none"
        variants={pulseVariants}
        animate="pulse"
      />
      <div className="relative">
        <img
          src={authUser?.avatar} // Consider a local placeholder
          alt="Profile"
          className="w-8 h-8 rounded-full border-[1px] border-background relative z-10"
        />
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full z-20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 250, damping: 12 }} // Enhanced spring
        >
          <motion.div // Inner dot of online indicator
            className="w-full h-full rounded-full bg-green-300" // Lighter green for inner dot
            animate={{
              scale: [1, 1.35, 1, 1.25, 1],
              opacity: [1, 0.6, 1, 0.7, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5 // Start pulsing after initial appearance
            }}
          />
        </motion.div>
      </div>
    </motion.div>

  )
}
