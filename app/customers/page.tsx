import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CustomerList } from "@/components/customers/customer-list"
import { CustomerSearch } from "@/components/customers/customer-search"
import { CustomerFilters } from "@/components/customers/customer-filters"

export default function CustomersPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          
        </div>
        <CustomerList />
      </div>
    </DashboardShell>
  )
}
