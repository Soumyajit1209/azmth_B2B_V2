import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CustomerList } from "@/components/customers/customer-list"
import { CustomerSearch } from "@/components/customers/customer-search"
import { CustomerFilters } from "@/components/customers/customer-filters"

export default function CustomersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Customers" text="Manage your customer relationships and data." />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <CustomerSearch />
          <CustomerFilters />
        </div>
        <CustomerList />
      </div>
    </DashboardShell>
  )
}
