import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const logs = await db.collection("logs").find({}).sort({ timestamp: -1 }).limit(100).toArray()

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Failed to fetch logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

// This would be a protected route in a real application
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Validate the log data
    if (!data.type || !data.source_ip) {
      return NextResponse.json({ error: "Invalid log data" }, { status: 400 })
    }

    const log = {
      timestamp: new Date(),
      type: data.type,
      source_ip: data.source_ip,
      action_taken: data.action_taken || "Logged",
      details: data.details || {},
    }

    await db.collection("logs").insertOne(log)

    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error("Failed to create log:", error)
    return NextResponse.json({ error: "Failed to create log" }, { status: 500 })
  }
}
