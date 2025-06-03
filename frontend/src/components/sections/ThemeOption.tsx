import { motion } from "framer-motion";
import React from "react";

interface ThemeOptionProps {
  title: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick?: () => void;
  previewLines?: number[]; // width percentages like [0.7, 0.9, 0.5]
}

export const ThemeOption: React.FC<ThemeOptionProps> = ({
  title,
  icon,
  selected,
  onClick,
  previewLines = [0.7, 0.9, 0.5],
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ${selected
        ? "ring-2 ring-primary/30 shadow-xl shadow-primary/10 border-primary/30"
        : "border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
        }`}
      whileHover={{
        scale: 1.03,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Card */}
      <div className="relative bg-card/80 backdrop-blur-sm border border-inherit rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-br from-muted/30 via-muted/20 to-background/50 p-4 border-b border-border/50">
          {/* Icon */}
          <motion.div
            className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm ${selected
              ? "bg-primary/20 text-primary shadow-lg shadow-primary/20"
              : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            animate={{
              rotate: selected ? [0, 5, -5, 0] : 0,
              scale: selected ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: selected ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>

          {/* Preview lines */}
          <div className="mt-8">
            <div className="text-xs text-muted-foreground mb-3 font-medium">
              Dashboard Preview
            </div>
            <div className="space-y-2">
              {previewLines.map((width, index) => (
                <motion.div
                  key={index}
                  className="h-2 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 rounded-full"
                  style={{ width: `${width * 100}%` }}
                  animate={{
                    width: selected
                      ? `${width * 100 + 10}%`
                      : `${width * 100}%`,
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    width: { duration: 0.3 },
                    opacity: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
              ))}
            </div>
          </div>

          {/* Shimmer */}
          <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
              animate={{
                translateX: selected ? ["200%", "-100%"] : "-100%",
              }}
              transition={{
                duration: selected ? 2 : 0,
                repeat: selected ? Infinity : 0,
                ease: "linear",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="relative p-4 bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <motion.h4
              className={`text-sm font-semibold tracking-wide ${selected ? "text-primary" : "text-foreground"
                }`}
              animate={{
                scale: selected ? [1, 1.02, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: selected ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              {title}
            </motion.h4>

            {selected && (
              <motion.div
                className="mt-2 w-12 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
          </div>
        </div>

        {/* Overlay */}
        {selected && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
};
