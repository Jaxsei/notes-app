import { Folder, LogOut, Settings, Star } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NuxtakeUI from "../logos/nuxtakeUI";
import { Button } from "../ui/button";

// Animation variants for sidebar elements
const sidebarVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3
    }
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const logoVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -180
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.2
    }
  }
};

const navItemVariants = {
  hidden: {
    opacity: 0,
    x: -10,
    scale: 0.9
  },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const iconVariants = {
  rest: {
    rotate: 0,
    scale: 1
  },
  hover: {
    rotate: 5,
    scale: 1.1,
    transition: {
      duration: 0.2
    }
  },
  active: {
    rotate: 0,
    scale: 1.1,
    transition: {
      duration: 0.2
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const NotesSidebar = ({ filterBy, authUser, logout, setFilterBy }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    {
      icon: Star,
      label: "Starred",
      active: filterBy === "starred",
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-500",
      activeGlow: "shadow-yellow-500/25"
    },
    {
      icon: Folder,
      label: "Folders",
      active: filterBy === "folders",
      gradient: "from-blue-500/20 to-purple-500/20",
      iconColor: "text-blue-500",
      activeGlow: "shadow-blue-500/25"
    },
  ];

  return (
    <motion.aside
      className="w-16 sm:w-20 relative overflow-hidden"
      variants={sidebarVariants}
      initial="hidden"
      animate="show"
    >
      {/* Enhanced background with gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />

      {/* Animated border */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      <motion.div
        className="absolute right-0 top-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-primary/50"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "100%", opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Content with backdrop */}
      <div className="relative z-10 h-screen flex flex-col backdrop-blur-sm">
        {/* Logo Section */}
        <div className="p-4 border-b border-border/50">
          <div className="flex justify-center relative">
            {/* Animated glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20"
              variants={pulseVariants}
              animate="pulse"
            />

            <motion.div
              variants={logoVariants}
              whileHover="hover"
              className="relative z-10 p-2 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <NuxtakeUI className="w-8 h-8 text-primary drop-shadow-sm" />
            </motion.div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-2 space-y-3">
          {navItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredItem(idx)}
              onHoverEnd={() => setHoveredItem(null)}
              className="relative"
            >
              {/* Active indicator */}
              {item.active && (
                <motion.div
                  className="absolute -left-2 top-1/2 w-1 bg-primary rounded-r-full"
                  initial={{ height: 0, y: "-50%" }}
                  animate={{ height: "60%", y: "-50%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}

              {/* Hover glow effect */}
              <AnimatePresence>
                {hoveredItem === idx && (
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} blur-xl`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              <Button
                variant={item.active ? "secondary" : "ghost"}
                size="sm"
                className={`
                  w-full relative z-10 flex flex-col gap-1 h-auto py-3 rounded-xl
                  transition-all duration-300 group overflow-hidden
                  ${item.active
                    ? `bg-gradient-to-br ${item.gradient} border border-primary/20 ${item.activeGlow} shadow-lg`
                    : 'hover:bg-accent/50 hover:border-accent'
                  }
                `}
                onClick={() => setFilterBy(item.active ? "all" : (item.label.toLowerCase()))}
              >
                {/* Background animation for active state */}
                {item.active && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 3
                    }}
                  />
                )}

                <motion.div
                  variants={iconVariants}
                  animate={item.active ? "active" : "rest"}
                  whileHover="hover"
                  className={`relative z-10 ${item.active ? item.iconColor : ""}`}
                >
                  <item.icon className="h-4 w-4" />
                </motion.div>

                <motion.span
                  className={`text-xs font-medium relative z-10 ${item.active ? 'text-foreground' : 'text-muted-foreground'}`}
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {item.label}
                </motion.span>
              </Button>
            </motion.div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-2 border-t border-border/50 space-y-3">
          {/* Settings Button */}
          <motion.div
            variants={navItemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex flex-col gap-1 h-auto py-3 rounded-xl hover:bg-accent/50 group transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Settings
              </span>
            </Button>
          </motion.div>

          {/* Logout Button */}
          {authUser && (
            <motion.div
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex flex-col gap-1 h-auto py-3 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 group transition-all duration-300"
                onClick={logout}
              >
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <LogOut className="h-4 w-4" />
                </motion.div>
                <span className="text-xs font-medium">Logout</span>
              </Button>
            </motion.div>
          )}

          {/* User indicator */}
          {authUser && (
            <motion.div
              className="flex justify-center pt-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/25">
                <motion.div
                  className="w-full h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Ambient light effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-8 h-32 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-xl pointer-events-none" />
      </div>
    </motion.aside>
  );
};
