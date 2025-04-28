"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, LogOut, Settings, Shield, ShieldAlert, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"

export function AppSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  // Don't render the sidebar if user is not authenticated
  // This prevents the sidebar from flashing before redirect
  if (!user && (pathname === "/login" || pathname === "/register")) {
    return null
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="bg-dark-gray border-r border-gray-800">
      <SidebarHeader className="py-6">
        <div className="flex items-center px-2">
          <ShieldAlert className="h-8 w-8 text-cyan-400" />
          <span className="ml-2 text-xl font-bold text-cyan-400 group-data-[collapsible=icon]:hidden">SecureGuard</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard">
                <Shield />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/logs"}>
              <Link href="/dashboard/logs">
                <BarChart3 />
                <span>Logs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/profile"}>
              <Link href="/dashboard/profile">
                <User />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
