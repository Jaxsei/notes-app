"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Settings,
  Trash2,
  LogOut,
  Upload,
  Check,
  X,
  Moon,
  Sun,
  Monitor,
  Loader
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "../store/useAuthStore"



const useTheme = () => ({
  setTheme: (theme) => {
    document.documentElement.className = theme === 'dark' ? 'dark' : ''
  }
})

const CustomAvatar = ({ src, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden bg-muted flex items-center justify-center`}>
      {src ? (
        <img src={src} alt="Avatar" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
          JD
        </div>
      )}
    </div>
  )
}

// Animation variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.02 }
}

const sidebarVariants = {
  initial: { x: -60, opacity: 0 },
  in: { x: 0, opacity: 1 }
}

const contentVariants = {
  initial: { y: 30, opacity: 0 },
  in: { y: 0, opacity: 1 },
  out: { y: -20, opacity: 0 }
}

const itemVariants = {
  initial: { y: 15, opacity: 0 },
  in: { y: 0, opacity: 1 }
}

export default function SettingsPage() {
  const [userName, setUserName] = useState('John Doe')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [selectedTheme, setSelectedThemeState] = useState("system")
  const [activeTab, setActiveTab] = useState("Settings")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { setTheme } = useTheme()
  const { authUser, logout, sendOtp, verifyOtp, isSendingOtp, isVerifyingOtp, isUpdatingProfile, updateProfile } = useAuthStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      setEmail(authUser.email);
      setUserName(authUser.username)
      setProfilePicture(authUser.avatar)
    }
  }, [authUser])

  const handleThemeChange = useCallback((theme) => {
    setTheme(theme)
    setSelectedThemeState(theme)
    setHasUnsavedChanges(true)
  })

  const handleSendOtp = useCallback((data) => {
    setIsLoading(true)
    sendOtp(data)

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  })

  const handleVerifyEmail = useCallback((data) => {
    if (!otpCode.trim()) return

    setIsLoading(true)
    verifyOtp(data)
    setTimeout(() => {
      setIsEmailVerified(true)
      setShowVerificationSuccess(true)
      setIsLoading(false)
      setTimeout(() => setShowVerificationSuccess(false), 3000)
    }, 1000)
  })

  //TODO: Mqke Save changes work
  const handleSaveChanges = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setHasUnsavedChanges(false)
      setIsLoading(false)
    }, 1000)
  })

  const handleProfileChange = useCallback((data) => {
    updateProfile(data)
  })

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 text-foreground relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="flex h-screen w-full relative z-10">
        {/* Enhanced Sidebar */}
        <motion.div
          className="w-72 border-r border-border/50 p-6 flex flex-col bg-card/80 backdrop-blur-xl relative"
          variants={sidebarVariants}
          initial="initial"
          animate="in"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Sidebar gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          {/* Profile Section */}
          <motion.div
            className="mb-8 flex items-center gap-4 relative z-10"
            variants={itemVariants}
            initial="initial"
            animate="in"
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CustomAvatar src={profilePicture} size="md" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {isEmailVerified && (
                <motion.div
                  className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Check size={10} className="text-white" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-green-400/50"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              )}
            </div>

            <div className="flex-1">
              <motion.div
                className="font-semibold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {userName}
              </motion.div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="truncate max-w-32">{email}</span>
                {isEmailVerified && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                      Verified
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Navigation */}
          <nav className="space-y-2 flex-1">
            <NavItem
              icon={<Mail size={18} />}
              label="Email"
              active={activeTab === "Email"}
              onClick={() => setActiveTab("Email")}
            />
            <NavItem
              icon={<Settings size={18} />}
              label="Settings"
              active={activeTab === "Settings"}
              onClick={() => setActiveTab("Settings")}
            />
          </nav>

          {/* Enhanced Logout Section */}
          <motion.div
            className="pt-6 border-t border-border/50 relative z-10"
            variants={itemVariants}
            initial="initial"
            animate="in"
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-destructive/5 hover:border-destructive/20 transition-all duration-300"
                onClick={logout}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LogOut size={18} />
                </motion.div>
                Log out
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Main Content */}
        <div className="flex-1 overflow-auto">
          <motion.div
            className="p-8 max-w-6xl mx-auto"
            variants={contentVariants}
            initial="initial"
            animate="in"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "Settings" ? (
                <motion.div
                  key="settings"
                  variants={contentVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Enhanced Header */}
                  <motion.div
                    className="mb-12 flex items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                        Settings
                      </h1>
                      <p className="text-muted-foreground">
                        Manage your account settings and preferences
                      </p>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                    </div>

                    <motion.div
                      className="flex gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          disabled={!hasUnsavedChanges}
                          onClick={() => setHasUnsavedChanges(false)}
                          className="hover:bg-muted/50 transition-all duration-300"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleSaveChanges}
                          disabled={!hasUnsavedChanges || isLoading}
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300"
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Settings Sections */}
                  <div className="space-y-12">
                    <SettingsSection title="Username" description="This will be displayed on your profile.">
                      <div className="space-y-6">
                        <motion.div
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Input
                            value={userName}
                            onChange={(e) => {
                              setUserName(e.target.value)
                              setHasUnsavedChanges(true)
                            }}
                            placeholder="Enter your username"
                            className="text-lg h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
                          />
                        </motion.div>

                        <div className="flex items-center gap-2">
                          <div className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                            awesome_user@gmail.co/
                          </div>
                          <Input
                            value={email}
                            readOnly
                            className="bg-muted/50 border-muted text-muted-foreground cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </SettingsSection>

                    <motion.div
                      className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />

                    <SettingsSection title="Profile picture" description="Update your profile picture.">
                      <div className="flex items-center gap-6">
                        <motion.div
                          className="relative group"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CustomAvatar src={profilePicture} size="lg" />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                            whileHover={{ backdropFilter: "blur(2px)" }}
                          >
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              whileHover={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <Upload size={24} className="text-white drop-shadow-lg" />
                            </motion.div>
                          </motion.div>

                          {/* Animated ring on hover */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/50 opacity-0 group-hover:opacity-100"
                            animate={{
                              rotate: [0, 360],
                              scale: [0.95, 1.05, 0.95]
                            }}
                            transition={{
                              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                          />
                        </motion.div>

                        <div className="flex gap-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              // Handle the file here
                              handleProfileChange({ avatar: file, email: email, username: userName })
                            }}
                            accept="image/*"
                            className="hidden"
                          />
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                            >
                              {isUpdatingProfile ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Upload size={16} className="mr-2" />
                                  Update
                                </>
                              )}
                            </Button>
                          </motion.div>
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-all duration-300"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </motion.div>
                        </div>                      </div>
                    </SettingsSection>

                    <motion.div
                      className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />

                    <SettingsSection title="Interface theme" description="Select or customize your UI theme.">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ThemeOption
                          title="System preference"
                          icon={<Monitor size={16} />}
                          selected={selectedTheme === "system"}
                          onClick={() => handleThemeChange("system")}
                        />
                        <ThemeOption
                          title="Light"
                          icon={<Sun size={16} />}
                          selected={selectedTheme === "light"}
                          onClick={() => handleThemeChange("light")}
                        />
                        <ThemeOption
                          title="Dark"
                          icon={<Moon size={16} />}
                          selected={selectedTheme === "dark"}
                          onClick={() => handleThemeChange("dark")}
                        />
                      </div>
                    </SettingsSection>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="email"
                  variants={contentVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Enhanced Email Header */}
                  <motion.div
                    className="mb-12 flex items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                        Email
                      </h1>
                      <p className="text-muted-foreground">
                        Manage your email settings and verification
                      </p>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                    </div>

                  </motion.div>

                  <div className="space-y-12">
                    <SettingsSection
                      title='Email Address'
                      description="Your email won't be shown on your profile"
                    >
                      <div className="space-y-6">
                        <div className="flex gap-3">
                          <motion.div
                            className="flex-1"
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder='Enter your email'
                              className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
                            />
                          </motion.div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => { handleSendOtp({ email: email }) }}
                                  disabled={!email || isLoading || isEmailVerified}
                                  className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted transition-all duration-300"
                                >
                                  {isLoading ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                      <Loader className="h-4 w-4" />
                                    </motion.div>
                                  ) : (
                                    "Send OTP"
                                  )}
                                </Button>
                              </motion.div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 border-border/50 bg-card/95 backdrop-blur-sm">
                              <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-primary" />
                                  OTP Sent
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  We sent a verification code to: <strong className="text-foreground">{email}</strong>
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <AnimatePresence>
                          {isSendingOtp && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Alert className="border-primary/20 bg-primary/5">
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Mail className="h-4 w-4 text-primary" />
                                </motion.div>
                                <AlertDescription className="text-primary">
                                  Verification code sent to {email}
                                </AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-6">
                          <div className="flex gap-3">
                            <motion.div
                              className="flex-1"
                              whileFocus={{ scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Input
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder='Enter verification code'
                                className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300 font-mono tracking-wider"
                                maxLength={8}
                              />
                            </motion.div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <motion.div whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => { otp: otpCode }}
                                    disabled={!otpCode || isLoading || isEmailVerified}
                                    className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-muted disabled:to-muted transition-all duration-300"
                                  >
                                    {isVerifyingOtp ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      >
                                        <Loader className="h-4 w-4" />
                                      </motion.div>
                                    ) : (
                                      "Verify"
                                    )}
                                  </Button>
                                </motion.div>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 border-green-200/50 bg-green-50/95 dark:border-green-800/50 dark:bg-green-950/95 backdrop-blur-sm">
                                <div className="space-y-3">
                                  <h4 className="font-semibold flex items-center gap-2 text-green-800 dark:text-green-200">
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500 }}
                                    >
                                      <Check className="h-4 w-4" />
                                    </motion.div>
                                    Email Verified
                                  </h4>
                                  <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                                    Your email verification for <strong>{email}</strong> was successful!
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <AnimatePresence>
                            {showVerificationSuccess && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Alert className="border-green-200/50 bg-green-50/80 dark:border-green-800/50 dark:bg-green-950/80 backdrop-blur-sm">
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                                  >
                                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  </motion.div>
                                  <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                                    Email successfully verified!
                                  </AlertDescription>
                                </Alert>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </SettingsSection>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}// Enhanced NavItem with glassmorphism and sophisticated animations
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${active
        ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-primary shadow-lg shadow-primary/10 backdrop-blur-sm border border-primary/20"
        : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-accent/50 hover:via-accent/30 hover:to-transparent hover:backdrop-blur-sm hover:border hover:border-accent/20"
        }`}
      whileHover={{
        x: 6,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{
        scale: 0.96,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glowing background effect for active state */}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent"
          layoutId="navItemGlow"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Hover shimmer effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
          whileHover={{
            translateX: "200%",
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
        />
      </div>

      {/* Icon container with enhanced animations */}
      <motion.div
        className={`relative z-10 flex items-center justify-center w-5 h-5 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          }`}
        animate={{
          rotate: active ? [0, 10, -10, 0] : 0,
          scale: active ? [1, 1.1, 1] : 1
        }}
        transition={{
          duration: active ? 0.6 : 0.3,
          ease: "easeInOut"
        }}
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 }
        }}
      >
        {icon}

        {/* Pulse effect for active state */}
        {active && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Label with enhanced typography */}
      <motion.span
        className={`relative z-10 font-medium tracking-wide ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          }`}
        animate={{
          x: active ? [0, 2, 0] : 0
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      >
        {label}
      </motion.span>

      {/* Active indicator dot */}
      {active && (
        <motion.div
          className="absolute right-2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

// Enhanced SettingsSection with sophisticated layout and animations
function SettingsSection({ title, description, children }) {
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
          {/* Header section with enhanced styling */}
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

          {/* Content section */}
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

// Enhanced ThemeOption with premium visual effects
function ThemeOption({ title, icon, selected, onClick }) {
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
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Background with glassmorphism */}
      <div className="relative bg-card/80 backdrop-blur-sm border border-inherit rounded-2xl overflow-hidden">
        {/* Header section with preview */}
        <div className="relative h-40 bg-gradient-to-br from-muted/30 via-muted/20 to-background/50 p-4 border-b border-border/50">
          {/* Floating icon with glow */}
          <motion.div
            className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm ${selected
              ? "bg-primary/20 text-primary shadow-lg shadow-primary/20"
              : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            animate={{
              rotate: selected ? [0, 5, -5, 0] : 0,
              scale: selected ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: selected ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {icon}
          </motion.div>

          {/* Preview content */}
          <div className="mt-8">
            <div className="text-xs text-muted-foreground mb-3 font-medium">
              Dashboard Preview
            </div>
            <div className="space-y-2">
              {[0.7, 0.9, 0.5].map((width, index) => (
                <motion.div
                  key={index}
                  className="h-2 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 rounded-full"
                  style={{ width: `${width * 100}%` }}
                  animate={{
                    width: selected ? `${width * 100 + 10}%` : `${width * 100}%`,
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    width: { duration: 0.3 },
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
              animate={{
                translateX: selected ? ["200%", "-100%"] : "-100%"
              }}
              transition={{
                duration: selected ? 2 : 0,
                repeat: selected ? Infinity : 0,
                ease: "linear"
              }}
            />
          </div>
        </div>

        {/* Title section */}
        <div className="relative p-4 bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <motion.h4
              className={`text-sm font-semibold tracking-wide ${selected ? "text-primary" : "text-foreground"
                }`}
              animate={{
                scale: selected ? [1, 1.02, 1] : 1
              }}
              transition={{
                duration: 1,
                repeat: selected ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {title}
            </motion.h4>

            {/* Selection indicator */}
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

        {/* Selection overlay */}
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
  )
}
