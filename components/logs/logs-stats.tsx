"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, Ban } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface LogStats {
  totalLogs: number
  logsByType: { _id: string; count: number }[]
  logsByAction: { _id: string; count: number }[]
}

export function LogsStats() {
  const [stats, setStats] = useState<LogStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch stats. Using sample data instead.",
          variant: "destructive",
        })
        // Use sample data as fallback
        setStats({
          totalLogs: 1248,
          logsByType: [
            { _id: "Suspicious Login Attempt", count: 423 },
            { _id: "Port Scan Detected", count: 312 },
            { _id: "Unauthorized Access Attempt", count: 256 },
            { _id: "Brute Force Attack", count: 178 },
            { _id: "SQL Injection Attempt", count: 79 },
          ],
          logsByAction: [
            { _id: "Blocked", count: 687 },
            { _id: "Logged", count: 423 },
            { _id: "Allowed", count: 98 },
            { _id: "Quarantined", count: 40 },
          ],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [toast])

  const getBlockedCount = () => {
    if (!stats) return 0
    const blocked = stats.logsByAction.find((item) => item._id === "Blocked")
    return blocked ? blocked.count : 0
  }

  const getHighestThreatType = () => {
    if (!stats || stats.logsByType.length === 0) return "None"
    return stats.logsByType.reduce((prev, current) => (prev.count > current.count ? prev : current))._id
  }

  return (
    <>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-cyan-400">Total Logs</CardTitle>
          <Shield className="w-4 h-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats?.totalLogs || 0}</div>
          <p className="text-xs text-muted-foreground">Total security events detected</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-cyan-400">Threats Blocked</CardTitle>
          <Ban className="w-4 h-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{isLoading ? "Loading..." : getBlockedCount()}</div>
          <p className="text-xs text-muted-foreground">Intrusion attempts prevented</p>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-cyan-400">Top Threat</CardTitle>
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">{isLoading ? "Loading..." : getHighestThreatType()}</div>
          <p className="text-xs text-muted-foreground">Most common attack vector</p>
        </CardContent>
      </Card>
    </>
  )
}
