"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  LayoutDashboard,
  Activity,
  Languages,
  Volume2,
  FileText,
  PhoneCall,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Injury Check", href: "/dashboard/trauma", icon: Activity },
  { title: "Health Notes", href: "/dashboard/scribe", icon: Languages },
  { title: "Medicine Voice", href: "/dashboard/rxvox", icon: Volume2 },
]

const secondaryNav = [
  { title: "History", href: "/dashboard/history", icon: FileText },
  { title: "Emergency", href: "/dashboard/emergency", icon: PhoneCall },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [displayName, setDisplayName] = useState("Loading...")
  const [displayRole, setDisplayRole] = useState("Personal Account")

  useEffect(() => {
    if (!supabase) {
      return
    }

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      const metadata = user.user_metadata ?? {}
      const fullName = (metadata.full_name as string | undefined)?.trim()
      const firstName = (metadata.first_name as string | undefined)?.trim()
      const lastName = (metadata.last_name as string | undefined)?.trim()
      const role = (metadata.role as string | undefined)?.trim()

      const fallbackName = user.email?.split("@")[0] || "User"
      const resolvedName = fullName || `${firstName || ""} ${lastName || ""}`.trim() || fallbackName

      setDisplayName(resolvedName)
      setDisplayRole(role === "self" ? "Personal Account" : role || "Personal Account")
    }

    void loadUser()
  }, [supabase])

  async function handleSignOut() {
    if (!supabase) {
      router.push("/login")
      return
    }

    await supabase.auth.signOut()
    router.refresh()
    router.push("/login")
  }

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U"

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border/60 bg-sidebar/85 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/JANAROGYAA.png"
            alt="JanArogya"
            width={130}
            height={36}
            className="h-8 w-auto group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/JANAROGYAA.png"
            alt="JanArogya"
            width={32}
            height={32}
            className="hidden size-8 object-contain group-data-[collapsible=icon]:block"
          />
        </Link>

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-3 group-data-[collapsible=icon]:hidden">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="size-3.5" />
            Shift Pulse
          </div>
          <p className="text-xs text-sidebar-foreground/80">Entries today: 46 | Urgent queue: 1</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Personal Health Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className="h-10 rounded-xl"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className="h-10 rounded-xl"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="rounded-xl border border-border/50 bg-card/60">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left text-xs">
                    <span className="font-medium text-sidebar-foreground">{displayName}</span>
                    <span className="text-sidebar-foreground/60">{displayRole}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
