"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { compare, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

interface ProfileData {
  name: string
  email: string
  role: string
  department: string
  avatarUrl: string
}

export async function updateProfile(profileData: ProfileData) {
  try {
    const { db } = await connectToDatabase()

    // In a real app, you would get the user ID from the session
    const userId = "current-user-id"

    // Update user profile
    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          name: profileData.name,
          email: profileData.email,
          department: profileData.department,
          avatarUrl: profileData.avatarUrl,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const { db } = await connectToDatabase()

    // In a real app, you would get the user ID from the session
    const userId = "current-user-id"

    // Get current user
    const user = await db.collection("users").findOne({ _id: userId })

    if (!user) {
      throw new Error("User not found")
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password)

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update password
    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    )

    return { success: true }
  } catch (error) {
    console.error("Failed to update password:", error)
    throw error
  }
}

export async function deleteAccount() {
  try {
    const { db } = await connectToDatabase()

    // In a real app, you would get the user ID from the session
    const userId = "current-user-id"

    // Delete user
    await db.collection("users").deleteOne({ _id: userId })

    // Delete user settings
    await db.collection("user_settings").deleteOne({ userId })

    // Clear auth cookie
    cookies().delete("auth-token")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete account:", error)
    throw error
  }
}
