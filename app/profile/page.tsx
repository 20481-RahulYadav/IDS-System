"use client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { updateProfile, updatePassword, deleteAccount } from "@/lib/actions/profile-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AvatarUpload } from "@/components/ui/profile/avtar-upload"
export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    // Not authenticated → redirect to login
    redirect("/login")
  }
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: "Security Admin",
    email: "admin@securitysystem.com",
    role: "Security Administrator",
    department: "IT Security",
    avatarUrl: "/placeholder.svg?height=96&width=96",
  })

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // In a real app, fetch from API
        // const response = await fetch("/api/profile")
        // const data = await response.json()
        // setProfile(data)
      } catch (error) {
        console.error("Failed to load profile:", error)
      }
    }

    loadProfile()
  }, [])

  // Handle profile changes
  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Handle password changes
  const handlePasswordChange = (key: string, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      await updateProfile(profile)

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update password
  const handleUpdatePassword = async () => {
    // Validate passwords
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      })
      return
    }

    if (passwords.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      await updatePassword(passwords.currentPassword, passwords.newPassword)

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })

      // Reset password fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Delete account
  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      await deleteAccount()

      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="User Profile" text="Manage your account information and preferences" />

      <div className="mt-6 grid gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-cyan-400">Profile Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AvatarUpload
              initialAvatarUrl={profile.avatarUrl}
              userName={profile.name}
              onAvatarChange={(url) => handleProfileChange("avatarUrl", url)}
            />

            <Separator className="bg-gray-800" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="Security Analyst"
                  value={profile.role}
                  className="bg-gray-800 border-gray-700"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="IT Security"
                  value={profile.department}
                  onChange={(e) => handleProfileChange("department", e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-cyan-400">Security</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="bg-cyan-600 hover:bg-cyan-700"
              onClick={handleUpdatePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
