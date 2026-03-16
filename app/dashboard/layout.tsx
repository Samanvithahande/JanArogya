import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import BackButton from "@/components/back-button"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <div className="dashboard-page flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <DashboardHeader />
          <div className="flex-1 overflow-auto px-4 pb-6 pt-4 md:px-6 md:pb-8 md:pt-5">
            <div className="mx-auto max-w-[1200px]">
              <BackButton className="mb-4" />
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
