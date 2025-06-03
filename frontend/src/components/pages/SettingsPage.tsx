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
  Moon,
  Sun,
  Monitor,
  Loader
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuthStore } from "../store/useAuthStore"
import { ThemeOption } from "../sections/ThemeOption"
import SettingsSection from "../sections/SettingsSection"
import { CustomAvatar } from "../ui/custom-avatar"


const useTheme = () => ({
  setTheme: (theme) => {
    document.documentElement.className = theme === 'dark' ? 'dark' : ''
  }
})

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
  const { authUser, logout, sendOtp, verifyOtp, isSendingOtp, isVerifyingOtp, isUpdatingProfile, updateProfile, isUpdatingUser, updateUser } = useAuthStore();
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
    updateUser({ username: userName, email: email })
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
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="flex h-screen w-full relative z-10">
        {/* Simplified Sidebar */}
        <motion.div
          className="w-72 border-r border-border/50 p-6 flex flex-col bg-card/80 backdrop-blur-xl relative"
          variants={sidebarVariants}
          initial="initial"
          animate="in"
          transition={{ duration: 0.3 }}
        >
          {/* Sidebar gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          {/* Profile Section */}
          <motion.div
            className="mb-8 flex items-center gap-4 relative z-10"
            variants={itemVariants}
            initial="initial"
            animate="in"
          >
            <div className="relative">
              <div className="relative">
                <CustomAvatar src={profilePicture} size="md" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {authUser?.isVerified === 'true' && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {userName}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <span className="truncate max-w-32">{email}</span>
                {authUser?.isVerified === 'true' && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
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

          {/* Logout Section */}
          <motion.div
            className="pt-6 border-t border-border/50 relative z-10"
            variants={itemVariants}
            initial="initial"
            animate="in"
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-destructive/5 hover:border-destructive/20 transition-all duration-300"
              onClick={logout}
            >
              <LogOut size={18} />
              Log out
            </Button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <motion.div
            className="p-8 max-w-6xl mx-auto"
            variants={contentVariants}
            initial="initial"
            animate="in"
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "Settings" ? (
                <motion.div
                  key="settings"
                  variants={contentVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="mb-12 flex items-center justify-between">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                        Settings
                      </h1>
                      <p className="text-muted-foreground">
                        Manage your account settings and preferences
                      </p>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        disabled={!hasUnsavedChanges}
                        onClick={() => setHasUnsavedChanges(false)}
                        className="hover:bg-muted/50 transition-all duration-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveChanges}
                        disabled={!hasUnsavedChanges || isLoading}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all duration-300"
                      >
                        {isUpdatingUser ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Settings Sections */}
                  <div className="space-y-12">
                    <SettingsSection title="Username" description="This will be displayed on your profile.">
                      <div className="space-y-6">
                        <Input
                          value={userName}
                          onChange={(e) => {
                            setUserName(e.target.value)
                            setHasUnsavedChanges(true)
                          }}
                          placeholder="Enter your username"
                          className="text-lg h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
                        />

                        <div className="flex items-center gap-2">
                          <div className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                            awesome_user@gmail.com/
                          </div>
                          <Input
                            value={email}
                            className="bg-muted/50 border-muted text-muted-foreground cursor-not-allowed"
                            onChange={(e) => {
                              setEmail(e.target.value)
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>
                      </div>
                    </SettingsSection>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <SettingsSection title="Profile picture" description="Update your profile picture.">
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <CustomAvatar src={profilePicture} size="lg" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                            <Upload size={24} className="text-white drop-shadow-lg" />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleProfileChange({ avatar: file, email: email, username: userName })
                            }}
                            accept="image/*"
                            className="hidden"
                          />
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
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-all duration-300"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </SettingsSection>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Email Header */}
                  <div className="mb-12 flex items-center justify-between">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                        Email
                      </h1>
                      <p className="text-muted-foreground">
                        Manage your email settings and verification
                      </p>
                      <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-12">
                    <SettingsSection
                      title='Email Address'
                      description="Your email won't be shown on your profile"
                    >
                      <div className="space-y-6">
                        <div className="flex gap-3">
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                onClick={() => { handleSendOtp({ email: email }) }}
                                disabled={!email || isLoading || isEmailVerified}
                                className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted transition-all duration-300"
                              >
                                {isSendingOtp ? (
                                  <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Send OTP"
                                )}
                              </Button>
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
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Alert className="border-primary/20 bg-primary/5">
                                <Mail className="h-4 w-4 text-primary" />
                                <AlertDescription className="text-primary">
                                  Verification code sent to {email}
                                </AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-6">
                          <div className="flex gap-3">
                            <Input
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              placeholder='Enter verification code'
                              className="h-12 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-300 font-mono tracking-wider"
                              maxLength={8}
                            />
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  onClick={() => { otp: otpCode }}
                                  disabled={!otpCode || isLoading || isEmailVerified}
                                  className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-muted disabled:to-muted transition-all duration-300"
                                >
                                  {isVerifyingOtp ? (
                                    <Loader className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Verify"
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 border-green-200/50 bg-green-50/95 dark:border-green-800/50 dark:bg-green-950/95 backdrop-blur-sm">
                                <div className="space-y-3">
                                  <h4 className="font-semibold flex items-center gap-2 text-green-800 dark:text-green-200">
                                    <Check className="h-4 w-4" />
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
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Alert className="border-green-200/50 bg-green-50/80 dark:border-green-800/50 dark:bg-green-950/80 backdrop-blur-sm">
                                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
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
}

// Simplified NavItem component
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${active
        ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-primary shadow-lg shadow-primary/10 backdrop-blur-sm border border-primary/20"
        : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-accent/50 hover:via-accent/30 hover:to-transparent hover:backdrop-blur-sm hover:border hover:border-accent/20"
        }`}
    >
      {/* Active background indicator */}
      {active && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent" />
      )}

      {/* Icon */}
      <div className={`relative z-10 flex items-center justify-center w-5 h-5 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
        {icon}
      </div>

      {/* Label */}
      <span className={`relative z-10 font-medium tracking-wide ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
        {label}
      </span>

      {/* Active indicator dot */}
      {active && (
        <div className="absolute right-2 w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/30" />
      )}
    </div>
  )
}
