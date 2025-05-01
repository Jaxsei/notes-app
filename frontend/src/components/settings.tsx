"use client"

import { useState } from "react"
import {
  Mail,
  Settings,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CustomAvatar } from "@/components/ui/custom-avatar"
import { useTheme } from "./theme-provider"

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('Jaxsei Inc')
  const [companyUrl, setCompanyUrl] = useState("jaxsei")
  const [selectedTheme, setSelectedThemeState] = useState("system")
  const { setTheme } = useTheme()

  const handleThemeChange = (theme) => {
    setTheme(theme)
    setSelectedThemeState(theme)
  }

  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-black dark:text-white">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 p-4">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500"></div>
            </div>
            <div>
              <div className="font-semibold">Sisyphus Ventures</div>
              <div className="text-xs text-zinc-500">untitledui.com/sisyphus</div>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<Mail size={18} />} label="Email" />
            <NavItem icon={<Settings size={18} />} label="Settings" active />
          </nav>

          <div className="mt-auto pt-6 absolute bottom-4">
            <div className="flex items-center gap-3">
              {/*Img Source*/}
              <CustomAvatar
                src="https://v0.dev/placeholder.svg?height=40&width=40"
                fallback="Sienna Hewitt"
                size="md"
              />
              <div>
                {/*Username and Email*/}
                <div className="font-medium">Jaxsei</div>
                <div className="text-xs text-zinc-500">jaxsei@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Settings</h1>
              <div className="flex gap-2">
                <Button variant="outline" className="border-zinc-300 bg-zinc-100 text-black hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                  Cancel
                </Button>
                <Button className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">Save changes</Button>
              </div>
            </div>

            <div className="space-y-8">
              <SettingsSection title="Public profile" description="This will be displayed on your profile.">
                <div className="space-y-4">
                  <Input
                    className="bg-white text-black border-zinc-300 dark:bg-black dark:text-white dark:border-zinc-800"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <div className="flex items-center">
                    <div className="mr-2 text-zinc-500 text-sm">untitledui.com/</div>
                    <Input
                      className="bg-white text-black border-zinc-300 dark:bg-black dark:text-white dark:border-zinc-800"
                      value={companyUrl}
                      onChange={(e) => setCompanyUrl(e.target.value)}
                    />
                  </div>
                </div>
              </SettingsSection>

              <Separator className="bg-zinc-200 dark:bg-zinc-800" />

              <SettingsSection title="Company logo" description="Update your company logo.">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-md">
                    <div className="h-full w-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500"></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-zinc-300 bg-zinc-100 text-black hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                      Replace logo
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-zinc-300 bg-zinc-100 text-black hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </SettingsSection>

              <Separator className="bg-zinc-200 dark:bg-zinc-800" />

              <SettingsSection title="Interface theme" description="Select or customize your UI theme.">
                <div className="grid grid-cols-3 gap-4">
                  <ThemeOption
                    title="System preference"
                    selected={selectedTheme === "system"}
                    onClick={() => handleThemeChange("system")}
                  />
                  <ThemeOption
                    title="Light"
                    selected={selectedTheme === "light"}
                    onClick={() => handleThemeChange("light")}
                  />
                  <ThemeOption
                    title="Dark"
                    selected={selectedTheme === "dark"}
                    onClick={() => handleThemeChange("dark")}
                  />
                </div>
              </SettingsSection>

              <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="mt-8 flex justify-end gap-2">
              <Button variant="outline" className="border-zinc-300 bg-zinc-100 text-black hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                Cancel
              </Button>
              <Button className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">Save changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active = false }) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? "bg-zinc-200 dark:bg-zinc-800 font-medium" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  )
}

function SettingsSection({ title, description, children }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

function ThemeOption({ title, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer overflow-hidden rounded-md border ${selected ? "border-black dark:border-white" : "border-zinc-300 dark:border-zinc-800"}`}
    >
      <div className="h-32 border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 p-2">
        <div className="mt-4 text-center text-[8px] text-zinc-500">Your dashboard</div>
        <div className="mt-2 flex flex-col gap-1">
          <div className="h-1 w-12 bg-zinc-300 dark:bg-zinc-800"></div>
          <div className="h-1 w-16 bg-zinc-300 dark:bg-zinc-800"></div>
          <div className="h-1 w-8 bg-zinc-300 dark:bg-zinc-800"></div>
        </div>
      </div>
      <div className="bg-zinc-100 dark:bg-zinc-900 p-2 text-center text-xs">{title}</div>
    </div>
  )
}

