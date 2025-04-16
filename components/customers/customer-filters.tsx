"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

export function CustomerFilters() {
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Spend</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>{"< $1,000"}</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>{"$1,000 - $10,000"}</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>{"> $10,000"}</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Last Contact</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All Time</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last 7 Days</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last 30 Days</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Last 90 Days</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
