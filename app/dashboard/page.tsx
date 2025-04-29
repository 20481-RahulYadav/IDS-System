import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LogsTable } from "@/components/logs/logs-table"
import { LogsChart } from "@/components/logs/logs-chart"
import { LogsStats } from "@/components/logs/logs-stats"

export const metadata: Metadata = {
  title: "Dashboard | Intrusion Detection System",
  description: "View and analyze intrusion detection logs",
}

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    // Not authenticated → redirect to login
    redirect("/login")
  }
  return (
    <DashboardShell>
      <DashboardHeader heading="Security Dashboard" text="Monitor and analyze intrusion detection logs in real-time" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LogsStats />
      </div>
      <div className="mt-6">
        <LogsChart />
      </div>
      <div className="mt-6">
        <LogsTable />
      </div>
    </DashboardShell>
  )
}
