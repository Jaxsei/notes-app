import { motion } from "framer-motion"

const SettingsSection = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Decorative border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-border/50 via-transparent to-border/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Header */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-4">
              {description}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            className="col-span-1 lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default SettingsSection
