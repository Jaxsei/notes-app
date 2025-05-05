"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from '../components/store/useAuthStore.js'
import toast from "react-hot-toast"

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null
  })

  const [showPassword, setShowPassword] = useState(false)
  const { signup, isSigningUp } = useAuthStore()

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required")
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format")
    if (!formData.password) return toast.error("Password is required")
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters")
    return true
  }

  const handleBlur = (field: keyof typeof formData) => {
    if (field === "email" && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format")
    }
    if (field === "password" && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = validateForm()

    if (success === true) {
      const form = new FormData()
      form.append("username", formData.username)
      form.append("email", formData.email)
      form.append("password", formData.password)
      if (formData.avatar) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(formData.avatar.type)) {
          return toast.error("Only .png, .jpeg, and .jpg files are allowed");
        }
        form.append("avatar", formData.avatar);
      } await signup(form)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-4", className)}
      {...props}
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>
                Enter your details to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={() => handleBlur("email")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="idli_dosa"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.files?.[0] || null })}
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    minLength={8}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onBlur={() => handleBlur("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-8 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button type="submit" className="w-full" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Signup"
                    )}
                  </Button>
                </motion.div>

                <p className="pt-2 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="#" className="underline hover:text-primary">
                    Log in
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
