import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get total logs count
    const totalLogs = await db.collection("logs").countDocuments()

    // Get logs by type
    const logsByType = await db
      .collection("logs")
      .aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
      .toArray()

    // Get logs by action
    const logsByAction = await db
      .collection("logs")
      .aggregate([{ $group: { _id: "$action_taken", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
      .toArray()

    // Get logs by hour (last 24 hours)
    const last24Hours = new Date()
    last24Hours.setHours(last24Hours.getHours() - 24)

    const logsByHour = await db
      .collection("logs")
      .aggregate([
        { $match: { timestamp: { $gte: last24Hours } } },
        {
          $group: {
            _id: {
              hour: { $hour: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.day": 1, "_id.hour": 1 } },
      ])
      .toArray()

    return NextResponse.json({
      totalLogs,
      logsByType,
      logsByAction,
      logsByHour,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
