"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { BarChart3, Calendar, FileText, Home, Mic, Phone, Users, Menu, X } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const routes = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Voice & Video Clone",
      href: "/voice-clone",
      icon: Mic,
    },
    {
      name: "Calls",
      href: "/calls",
      icon: Phone,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: Calendar,
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FileText,
    },
  ]

  return (
    <>
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded-full bg-primary" />
            <span>Modern CRM</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <route.icon className="h-5 w-5" />
                <span>{route.name}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <ThemeToggle />
        </div>
      </aside>
    </>
  )
}
