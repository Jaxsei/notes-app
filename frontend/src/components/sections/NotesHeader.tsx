import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, List, ReceiptPoundSterling, Search, ChevronDown, Check } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ModeToggle } from "../utils/mode-toggle";

// Custom Select Component
const CustomSelect = ({ value, onValueChange, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    switch (selectedValue) {
      case 'recent': return 'Recent';
      case 'title': return 'Title';
      case 'starred': return 'Starred';
      default: return 'Select...';
    }
  };

  const getIndicatorColor = () => {
    switch (selectedValue) {
      case 'recent': return 'bg-green-500';
      case 'title': return 'bg-blue-500';
      case 'starred': return 'bg-yellow-500';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-32 relative z-10 bg-background/50 border border-border/50 hover:border-primary/30 hover:bg-background/80 transition-all duration-300 rounded-md px-3 py-2 text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
          {getDisplayText()}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-md border border-border/50 rounded-md shadow-xl p-1 z-50"
          >
            {[
              { value: 'recent', label: 'Recent', color: 'bg-green-500' },
              { value: 'title', label: 'Title', color: 'bg-blue-500' },
              { value: 'starred', label: 'Starred', color: 'bg-yellow-500' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full flex items-center gap-2 cursor-pointer p-2 hover:bg-accent/50 focus:bg-accent/60 rounded transition-colors duration-150 text-sm text-left focus:outline-none"
              >
                <div className={`w-2 h-2 rounded-full ${option.color}`} />
                {option.label}
                {selectedValue === option.value && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="ml-auto"
                  >
                    <Check className="h-3 w-3 text-primary" />
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.7,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const searchVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    x: -25
  },
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    }
  },
  focus: {
    scale: 1.03,
    boxShadow: "0px 0px 15px rgba(var(--primary-rgb), 0.3)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const controlsVariants = {
  hidden: {
    opacity: 0,
    x: 25,
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
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
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
      stiffness: 180,
      damping: 15
    }
  },
  hover: {
    scale: 1.08,
    y: -3,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 10
    }
  },
  tap: {
    scale: 0.92,
    y: 0,
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
    color: "hsl(var(--muted-foreground))"
  },
  focus: {
    scale: 1.15,
    rotate: 10,
    opacity: 1,
    color: "hsl(var(--primary))",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  },
  typing: {
    scale: [1, 1.25, 1, 1.15, 1],
    opacity: [0.6, 1, 0.6, 0.9, 0.6],
    rotate: [0, -8, 0, 6, 0],
    color: ["hsl(var(--muted-foreground))", "hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(var(--primary))", "hsl(var(--muted-foreground))"],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const profileVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    rotate: -120
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 12,
      delay: 0.6
    }
  },
  hover: {
    scale: 1.12,
    rotate: 8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.15, 1],
    opacity: [0.4, 0.9, 0.4],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const modeToggleHoverVariant = {
  scale: 1.15,
  rotate: [0, 20, -15, 0],
  transition: { duration: 0.5, ease: "easeInOut" }
};

export const NotesHeader = ({ searchQuery, setSearchQuery, sortBy, setSortBy, viewMode, setViewMode, authUser }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredControl, setHoveredControl] = useState(null);

  return (
    <motion.header
      className="relative overflow-hidden"
      variants={headerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "circOut", delay: 0.3 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/30 via-primary to-primary/30"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 0.7, 1] }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut", times: [0, 0.5, 0.8, 1] }}
      />

      <div className="relative z-10 border-b border-transparent px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              className="relative max-w-md flex-1"
              variants={searchVariants}
              whileFocus="focus"
              onFocusCapture={() => setIsSearchFocused(true)}
              onBlurCapture={() => setIsSearchFocused(false)}
            >
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    className="absolute -inset-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 blur-md pointer-events-none"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25, ease: "circOut" }}
                  />
                )}
              </AnimatePresence>

              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20">
                <motion.div
                  variants={searchIconVariants}
                  animate={isSearchFocused ? "focus" : searchQuery ? "typing" : "rest"}
                >
                  <Search className="h-4 w-4" />
                </motion.div>
              </div>

              <Input
                type="search"
                placeholder="Search your notes..."
                className="pl-10 pr-10 relative z-10 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
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
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="flex items-center gap-2"
              variants={controlsVariants}
            >
              <motion.div
                variants={itemVariants}
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
                <CustomSelect
                  value={sortBy}
                  onValueChange={setSortBy}
                />
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
              className="absolute top-full left-6 right-6 mt-2 p-3 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-xl z-50"
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.25 }}
            >
              <div className="text-xs text-muted-foreground">
                Searching for: <span className="text-primary font-medium">"{searchQuery}"</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-md pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-secondary/10 to-transparent blur-md pointer-events-none" />
      </div>
    </motion.header>
  );
};

export const ProfilesIndicator = ({ authUser }) => {
  return (
    <motion.div
      variants={profileVariants}
      whileHover="hover"
      className="relative"
    >
      <motion.div
        className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 pointer-events-none"
        variants={pulseVariants}
        animate="pulse"
      />
      <div className="relative">
        <img
          src={authUser?.avatar}
          alt="Profile"
          className="w-8 h-8 rounded-full border-[1px] border-background relative z-10"
        />
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full z-20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 250, damping: 12 }}
        >
          <motion.div
            className="w-full h-full rounded-full bg-green-300"
            animate={{
              scale: [1, 1.35, 1, 1.25, 1],
              opacity: [1, 0.6, 1, 0.7, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
