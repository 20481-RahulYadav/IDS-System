"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  updateProfile, updatePassword, deleteAccount
} from "@/lib/actions/profile-actions"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AvatarUpload } from "@/components/ui/profile/avtar-upload"

export const dynamic = "force-dynamic"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [profile, setProfile] = useState({
    name: "Security Admin",
    email: "admin@securitysystem.com",
    role: "Security Administrator",
    department: "IT Security",
    avatarUrl: "/placeholder.svg?height=96&width=96",
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Fetch profile if needed
      } catch (error) {
        console.error("Failed to load profile:", error)
      }
    }

    loadProfile()
  }, [])

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handlePasswordChange = (key: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await updateProfile(profile)
      toast({ title: "Profile updated", description: "Profile updated successfully." })
    } catch {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast({ title: "Passwords don't match", description: "Please confirm password.", variant: "destructive" })
    }
    if (passwords.newPassword.length < 8) {
      return toast({ title: "Password too short", description: "Minimum 8 characters required.", variant: "destructive" })
    }

    setIsChangingPassword(true)
    try {
      await updatePassword(passwords.currentPassword, passwords.newPassword)
      toast({ title: "Password updated", description: "Password changed successfully." })
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      toast({ title: "Error", description: "Incorrect current password.", variant: "destructive" })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteAccount()
      toast({ title: "Account deleted", description: "Account removed successfully." })
      router.push("/login")
    } catch {
      toast({ title: "Error", description: "Failed to delete account.", variant: "destructive" })
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="User Profile" text="Manage your account information and preferences" />
      <div className="mt-6 grid gap-6">
        {/* Profile Card */}
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
                <Input id="name" value={profile.name} onChange={(e) => handleProfileChange("name", e.target.value)} className="bg-gray-800 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={profile.email} onChange={(e) => handleProfileChange("email", e.target.value)} className="bg-gray-800 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile.role} disabled className="bg-gray-800 border-gray-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={profile.department} onChange={(e) => handleProfileChange("department", e.target.value)} className="bg-gray-800 border-gray-700" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        {/* Password Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-cyan-400">Security</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="current-password" type="password" placeholder="Current Password" value={passwords.currentPassword} onChange={(e) => handlePasswordChange("currentPassword", e.target.value)} className="bg-gray-800 border-gray-700" />
            <Input id="new-password" type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => handlePasswordChange("newPassword", e.target.value)} className="bg-gray-800 border-gray-700" />
            <Input id="confirm-password" type="password" placeholder="Confirm New Password" value={passwords.confirmPassword} onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)} className="bg-gray-800 border-gray-700" />
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdatePassword} disabled={isChangingPassword} className="bg-cyan-600 hover:bg-cyan-700">
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </Card>

        {/* Danger Zone Card */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back.</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. It will permanently delete your account and data.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
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
