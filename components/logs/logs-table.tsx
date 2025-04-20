"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { LogEntry } from "@/types/logs"

export function LogsTable() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        debugger;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs`)
        if (!response.ok) {
          throw new Error("Failed to fetch logs")
        }
        const data = await response.json()
        setLogs(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch logs. Using sample data instead.",
          variant: "destructive",
        })
        // Use sample data as fallback
        // setLogs(getSampleLogs())
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()

    // Set up WebSocket connection for real-time updates
    // const ws = new WebSocket(
    //   `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/logs/ws`,
    // )
    // Update WebSocket connection
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://ids-system-3k6a.onrender.com"
    const wsUrl = `${apiUrl.replace("https://", "wss://").replace("http://", "ws://")}/api/logs/ws`
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (event) => {
      const newLog = JSON.parse(event.data)
      setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 99)])
    }

    return () => {
      ws.close()
    }
  }, [toast])

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "blocked":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      case "allowed":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "logged":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      default:
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
    }
  }

  const getTypeColor = (type: string) => {
    if (type.includes("Login")) {
      return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
    } else if (type.includes("Scan")) {
      return "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
    } else if (type.includes("Access")) {
      return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
    } else if (type.includes("Attack")) {
      return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
    } else {
      return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-cyan-400 text-xl">Recent Logs</CardTitle>
        <CardDescription>View and analyze the latest intrusion detection logs</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading logs...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-cyan-400">Timestamp</TableHead>
                <TableHead className="text-cyan-400">Type</TableHead>
                <TableHead className="text-cyan-400">Source IP</TableHead>
                <TableHead className="text-cyan-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-800/50">
                    <TableCell className="font-mono">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(log.type)}>{log.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{log.source_ip}</TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action_taken)}>{log.action_taken}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

// Sample logs for fallback
function getSampleLogs(): LogEntry[] {
  const types = [
    "Suspicious Login Attempt",
    "Port Scan Detected",
    "Unauthorized Access Attempt",
    "Brute Force Attack",
    "SQL Injection Attempt",
    "XSS Attack Detected",
    "File Inclusion Attempt",
    "Command Injection Attempt",
  ]

  const actions = ["Blocked", "Logged", "Allowed", "Quarantined"]

  const generateRandomIP = () => {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(
      Math.random() * 256,
    )}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
  }

  const logs: LogEntry[] = []

  for (let i = 0; i < 50; i++) {
    const date = new Date()
    date.setMinutes(date.getMinutes() - i * Math.floor(Math.random() * 10))

    logs.push({
      timestamp: date.toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      source_ip: generateRandomIP(),
      action_taken: actions[Math.floor(Math.random() * actions.length)],
      details: {},
    })
  }

  return logs
}
