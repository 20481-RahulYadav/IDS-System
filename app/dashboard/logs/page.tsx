import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LogsTable } from "@/components/logs/logs-table"

export const metadata: Metadata = {
  title: "Logs | Intrusion Detection System",
  description: "View and analyze intrusion detection logs",
}

export default function LogsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Security Logs" text="View and analyze all intrusion detection logs" />
      <div className="mt-6">
        <LogsTable />
      </div>
    </DashboardShell>
  )
}
