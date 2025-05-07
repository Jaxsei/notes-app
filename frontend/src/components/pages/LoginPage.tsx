"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
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
import { useAuthStore } from "../store/useAuthStore.js"
import toast from "react-hot-toast"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function LoginPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoggingIn } = useAuthStore()

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format")
    if (!formData.password) return toast.error("Password is required")
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = validateForm()
    if (success === true) {
      const form = new FormData()
      form.append("email", formData.email)
      form.append("password", formData.password)
      await login(form)
    }
  }

  const handleBlur = (field: string) => {
    if (field === "email") {
      if (!formData.email.trim()) toast.error("Email is required")
      else if (!/\S+@\S+\.\S+/.test(formData.email)) toast.error("Invalid email format")
    }
    if (field === "password") {
      if (!formData.password) toast.error("Password is required")
      else if (formData.password.length < 8) toast.error("Password must be at least 8 characters")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-6 min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        className
      )}      {...props}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md backdrop-blur-md bg-black/30 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => handleBlur("email")}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    minLength={8}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onBlur={() => handleBlur("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.97 }}>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="size-3 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
