"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { saveSettings } from "@/lib/actions/settings-actions"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    darkMode: true,
    autoRefresh: true,
    compactView: false,
    emailNotifications: true,
    browserNotifications: true,
    notificationEmail: "",
    twoFactor: false,
    sessionTimeout: true,
  })

  // Load settings from localStorage or API on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to load from localStorage first
        const savedSettings = localStorage.getItem("user-settings")

        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        } else {
          // If not in localStorage, could fetch from API
          // const response = await fetch("/api/settings")
          // const data = await response.json()
          // setSettings(data)
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    loadSettings()
  }, [])

  // Handle settings change
  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Save settings
  const handleSaveSettings = async () => {
    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("user-settings", JSON.stringify(settings))

      // Save to backend (if implemented)
      await saveSettings(settings)

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle password reset
  const handleResetPassword = () => {
    toast({
      title: "Password reset",
      description: "Password reset email has been sent to your email address.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Configure your intrusion detection system preferences" />

      <div className="mt-6">
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-cyan-400">General Settings</CardTitle>
                <CardDescription>Manage your dashboard preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">Always use dark mode</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh" className="text-base">
                      Auto Refresh
                    </Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => handleSettingChange("autoRefresh", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view" className="text-base">
                      Compact View
                    </Label>
                    <p className="text-sm text-muted-foreground">Use compact view for logs table</p>
                  </div>
                  <Switch
                    id="compact-view"
                    checked={settings.compactView}
                    onCheckedChange={(checked) => handleSettingChange("compactView", checked)}
                  />
                </div>

                <Button
                  className="bg-cyan-600 hover:bg-cyan-700 mt-4"
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-cyan-400">Notification Settings</CardTitle>
                <CardDescription>Configure how you receive alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browser-notifications" className="text-base">
                      Browser Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Show browser notifications for critical events</p>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={settings.browserNotifications}
                    onCheckedChange={(checked) => handleSettingChange("browserNotifications", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-email" className="text-base">
                    Notification Email
                  </Label>
                  <Input
                    id="notification-email"
                    placeholder="your@email.com"
                    className="bg-gray-800 border-gray-700"
                    value={settings.notificationEmail}
                    onChange={(e) => handleSettingChange("notificationEmail", e.target.value)}
                  />
                </div>

                <Button
                  className="bg-cyan-600 hover:bg-cyan-700 mt-4"
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-cyan-400">Security Settings</CardTitle>
                <CardDescription>Configure security preferences for your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor" className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for login</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.twoFactor}
                    onCheckedChange={(checked) => handleSettingChange("twoFactor", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-timeout" className="text-base">
                      Session Timeout
                    </Label>
                    <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                  </div>
                  <Switch
                    id="session-timeout"
                    checked={settings.sessionTimeout}
                    onCheckedChange={(checked) => handleSettingChange("sessionTimeout", checked)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleResetPassword}>
                    Reset Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
