import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="flex min-h-screen flex-col space-y-4 p-4 md:p-8">{children}</div>
}
