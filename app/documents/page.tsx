import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DocumentUpload } from "@/components/documents/document-upload"
import { DocumentList } from "@/components/documents/document-list"

export default function DocumentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Documents" text="Upload and manage documents for your customers and business." />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <DocumentUpload />
        </div>
        <div>
          <DocumentList />
        </div>
      </div>
    </DashboardShell>
  )
}
