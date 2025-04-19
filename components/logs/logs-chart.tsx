"use client"

import { useState, useEffect } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface LogStats {
  totalLogs: number
  logsByType: { _id: string; count: number }[]
  logsByAction: { _id: string; count: number }[]
  logsByHour: { _id: { hour: number; day: number }; count: number }[]
}

export function LogsChart() {
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
        setStats(getSampleStats())
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [toast])

  const getTypeChartData = (): ChartData<"bar"> => {
    if (!stats) return { labels: [], datasets: [] }

    return {
      labels: stats.logsByType.map((item) => item._id),
      datasets: [
        {
          label: "Count",
          data: stats.logsByType.map((item) => item.count),
          backgroundColor: [
            "rgba(0, 250, 255, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(0, 250, 255, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  const getActionChartData = (): ChartData<"bar"> => {
    if (!stats) return { labels: [], datasets: [] }

    return {
      labels: stats.logsByAction.map((item) => item._id),
      datasets: [
        {
          label: "Count",
          data: stats.logsByAction.map((item) => item.count),
          backgroundColor: [
            "rgba(0, 255, 0, 0.6)",
            "rgba(255, 0, 0, 0.6)",
            "rgba(255, 255, 0, 0.6)",
            "rgba(0, 0, 255, 0.6)",
          ],
          borderColor: ["rgba(0, 255, 0, 1)", "rgba(255, 0, 0, 1)", "rgba(255, 255, 0, 1)", "rgba(0, 0, 255, 1)"],
          borderWidth: 1,
        },
      ],
    }
  }

  const getTimelineChartData = (): ChartData<"line"> => {
    if (!stats) return { labels: [], datasets: [] }

    // Create a 24-hour timeline with 0 counts for missing hours
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const hourLabels = hours.map((hour) => `${hour}:00`)

    // Map the actual data to the 24-hour timeline
    const hourCounts = hours.map((hour) => {
      const hourData = stats.logsByHour.find((item) => item._id.hour === hour)
      return hourData ? hourData.count : 0
    })

    return {
      labels: hourLabels,
      datasets: [
        {
          label: "Logs per Hour",
          data: hourCounts,
          fill: true,
          backgroundColor: "rgba(0, 250, 255, 0.2)",
          borderColor: "rgba(0, 250, 255, 1)",
          tension: 0.4,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-cyan-400 text-xl">Logs Analysis</CardTitle>
        <CardDescription>Visual representation of intrusion detection logs</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading charts...</p>
          </div>
        ) : (
          <Tabs defaultValue="timeline">
            <TabsList className="mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="types">Log Types</TabsTrigger>
              <TabsTrigger value="actions">Actions Taken</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="h-80">
              <Line data={getTimelineChartData()} options={chartOptions} />
            </TabsContent>
            <TabsContent value="types" className="h-80">
              <Bar data={getTypeChartData()} options={chartOptions} />
            </TabsContent>
            <TabsContent value="actions" className="h-80">
              <Bar data={getActionChartData()} options={chartOptions} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

// Sample stats for fallback
function getSampleStats(): LogStats {
  return {
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
    logsByHour: Array.from({ length: 24 }, (_, i) => ({
      _id: { hour: i, day: new Date().getDate() },
      count: Math.floor(Math.random() * 50) + 10,
    })),
  }
}
