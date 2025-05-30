"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "../store/useAuthStore"
import toast from "react-hot-toast"
import { Loader2, Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, LogIn } from "lucide-react"
import { Link } from "react-router-dom"
import NuxtakeUI from "../logos/nuxtakeUI"

interface LoginFormData {
  email: string,
  username: string,
  password: string
}

// FloatingElement component for animations
const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export function LoginPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [completedFields, setCompletedFields] = useState(new Set<string>())
  const [mounted, setMounted] = useState(false)
  const { login, isLoggingIn } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format")
    if (!formData.password) return toast.error("Password is required")
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters")
    if (!formData.username.trim()) return toast.error('Username is required')
    if (formData.username.length < 4) return toast.error('Username must be at least 4 characters')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = validateForm()
    if (success === true) {
      const form = new FormData()
      form.append("email", formData.email)
      form.append("password", formData.password)
      form.append('username', formData.username)
      await login(form)
    }
  }

  const handleBlur = (field: keyof LoginFormData) => {
    setFocusedField('')
    if (formData[field]) {
      setCompletedFields(prev => new Set([...prev, field]))
    }
    if (field === "email") {
      if (!formData.email.trim()) toast.error("Email is required")
      else if (!/\S+@\S+\.\S+/.test(formData.email)) toast.error("Invalid email format")
    }
    if (field === "password") {
      if (!formData.password) toast.error("Password is required")
      else if (formData.password.length < 8) toast.error("Password must be at least 8 characters")
    }
    if (field === "username") {
      if (!formData.username.trim()) toast.error("Username is required")
      else if (formData.username.length < 4) toast.error("Username must be at least 4 characters")
    }
  }

  const handleFocus = (field: string) => {
    setFocusedField(field)
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-background via-muted/20 to-background p-4 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s', animationDuration: '12s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-muted/30 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '2s', animationDuration: '6s' }} />

        {/* Floating particles */}
        {mounted && [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-bounce"
            style={{
              left: `${20 + i * 15}%`,
              top: `${25 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2.5 + i * 0.3}s`
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_50%)]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <FloatingElement delay={200}>
          {/* Header Section */}
          <div className="text-center mb-8 space-y-4">
            <div className="relative inline-block">
              <FloatingElement delay={400}>
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow duration-500">
                  <NuxtakeUI className='w-8 h-8 text-primary-foreground animate-pulse' />
                </div>
              </FloatingElement>

              {/* Floating badge */}
              <FloatingElement delay={600}>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-bounce">
                  <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
                </div>
              </FloatingElement>
            </div>

            <FloatingElement delay={800}>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground mt-2">Log in to your account to continue</p>
            </FloatingElement>
          </div>
        </FloatingElement>

        <FloatingElement delay={1000}>
          <Card className="backdrop-blur-sm border border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-card/80">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5 text-primary" />
                Log in
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email Field */}
                <FloatingElement delay={1200}>
                  <div className="space-y-2 group">
                    <Label htmlFor="email" className="flex items-center gap-2 transition-colors duration-200">
                      <Mail className={`w-4 h-4 transition-all duration-300 ${focusedField === 'email' ? 'text-primary scale-110' : 'text-muted-foreground'
                        }`} />
                      Email
                      {completedFields.has('email') && (
                        <CheckCircle className="w-4 h-4 text-green-500 animate-in fade-in duration-300" />
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        className={`transition-all duration-300 pl-10 ${focusedField === 'email'
                          ? 'ring-2 ring-primary/20 border-primary shadow-lg'
                          : 'hover:border-primary/50'
                          }`}
                      />
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                    </div>
                  </div>
                </FloatingElement>

                {/* Username Field */}
                <FloatingElement delay={1300}>
                  <div className="space-y-2 group">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className={`w-4 h-4 transition-all duration-300 ${focusedField === 'username' ? 'text-primary scale-110' : 'text-muted-foreground'
                        }`} />
                      Username
                      {completedFields.has('username') && (
                        <CheckCircle className="w-4 h-4 text-green-500 animate-in fade-in duration-300" />
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="awesome_user"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        onFocus={() => handleFocus('username')}
                        onBlur={() => handleBlur('username')}
                        className={`transition-all duration-300 pl-10 ${focusedField === 'username'
                          ? 'ring-2 ring-primary/20 border-primary shadow-lg'
                          : 'hover:border-primary/50'
                          }`}
                      />
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-300 ${focusedField === 'username' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                    </div>
                  </div>
                </FloatingElement>

                {/* Password Field */}
                <FloatingElement delay={1400}>
                  <div className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className={`w-4 h-4 transition-all duration-300 ${focusedField === 'password' ? 'text-primary scale-110' : 'text-muted-foreground'
                          }`} />
                        Password
                        {completedFields.has('password') && (
                          <CheckCircle className="w-4 h-4 text-green-500 animate-in fade-in duration-300" />
                        )}
                      </Label>
                      <button
                        type="button"
                        className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 hover:underline-offset-2 transition-all duration-200"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        minLength={8}
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password')}
                        className={`transition-all duration-300 pl-10 pr-10 ${focusedField === 'password'
                          ? 'ring-2 ring-primary/20 border-primary shadow-lg'
                          : 'hover:border-primary/50'
                          }`}
                      />
                      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-all duration-300 ${focusedField === 'password' ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ?
                          <EyeOff className="w-4 h-4 hover:scale-110 transition-transform" /> :
                          <Eye className="w-4 h-4 hover:scale-110 transition-transform" />
                        }
                      </button>
                    </div>
                  </div>
                </FloatingElement>

                {/* Submit Button */}
                <FloatingElement delay={1500}>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                      disabled={isLoggingIn}
                      size="lg"
                    >
                      <div className="flex items-center justify-center gap-2 relative z-10">
                        {isLoggingIn ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loging in...
                          </>
                        ) : (
                          <>
                            <span>Log In</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                          </>
                        )}
                      </div>

                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </Button>
                  </div>
                </FloatingElement>

                {/* Signup Link */}
                <FloatingElement delay={1700}>
                  <p className="pt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-primary hover:text-primary/80 underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 font-medium"
                    >
                      Sign up now
                    </Link>
                  </p>
                </FloatingElement>
              </form>
            </CardContent>
          </Card>
        </FloatingElement>

        {/* Trust indicators */}
        <FloatingElement delay={1900}>
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Trusted</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Your data is protected with enterprise-grade security
            </p>
          </div>
        </FloatingElement>
      </div>
    </div>
  )
}
