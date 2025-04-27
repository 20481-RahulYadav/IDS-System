"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

interface Settings {
  darkMode: boolean
  autoRefresh: boolean
  compactView: boolean
  emailNotifications: boolean
  browserNotifications: boolean
  notificationEmail: string
  twoFactor: boolean
  sessionTimeout: boolean
}

export async function saveSettings(settings: Settings) {
  try {
    const { db } = await connectToDatabase()

    // In a real app, you would get the user ID from the session
    const userId = "current-user-id"

    // Update or insert settings for this user
    await db
      .collection("user_settings")
      .updateOne({ userId }, { $set: { ...settings, updatedAt: new Date() } }, { upsert: true })

    revalidatePath("/app/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to save settings:", error)
    return { success: false, error: "Failed to save settings" }
  }
}
