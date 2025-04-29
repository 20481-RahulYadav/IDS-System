"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { compare, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import { verify } from "jsonwebtoken"

interface ProfileData {
  name: string
  email: string
  role: string
  department: string
  avatarUrl: string
}

async function getUserIdFromCookie(): Promise<ObjectId | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  try {
    const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret") as {
      id: string
    }
    return new ObjectId(decoded.id)
  } catch (err) {
    console.error("Invalid token:", err)
    return null
  }
}

export async function updateProfile(profileData: ProfileData) {
  try {
    const userId = await getUserIdFromCookie()
    if (!userId) throw new Error("Unauthorized")

    const { db } = await connectToDatabase()

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
      }
    )

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update profile:", error)
    return { success: false, error: error.message || "Failed to update profile" }
  }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    const userId = await getUserIdFromCookie()
    if (!userId) throw new Error("Unauthorized")

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: userId })

    if (!user) throw new Error("User not found")

    const isPasswordValid = await compare(currentPassword, user.password)
    if (!isPasswordValid) throw new Error("Current password is incorrect")

    const hashedPassword = await hash(newPassword, 10)

    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    )

    return { success: true }
  } catch (error: any) {
    console.error("Failed to update password:", error)
    return { success: false, error: error.message || "Error" }
  }
}

export async function deleteAccount() {
  try {
    const userId = await getUserIdFromCookie()
    if (!userId) throw new Error("Unauthorized")

    const { db } = await connectToDatabase()

    await db.collection("users").deleteOne({ _id: userId })
    await db.collection("user_settings").deleteOne({ userId })

    const cookieStore = await cookies()
    cookieStore.delete("auth-token")

    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete account:", error)
    return { success: false, error: error.message || "Error" }
  }
}
