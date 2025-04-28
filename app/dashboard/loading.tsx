import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-[250px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
      </div>
      <div className="mt-6">
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="mt-6">
        <Skeleton className="h-[450px] rounded-xl" />
      </div>
    </DashboardShell>
  )
}
