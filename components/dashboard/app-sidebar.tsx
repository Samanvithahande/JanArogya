"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border/60 bg-sidebar/85 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JanArogya%20Logo%20With%20No%20Bg%20%28Black%20Bg%29-YlntpvuipivBOHdn8EOJj1uOQqnw1P.png"
            alt="JanArogya"
            width={130}
            height={36}
            className="h-8 w-auto group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JanArogya%20Logo%20With%20No%20Bg%20%28Black%20Bg%29-YlntpvuipivBOHdn8EOJj1uOQqnw1P.png"
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
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">RK</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left text-xs">
                    <span className="font-medium text-sidebar-foreground">Rajan Kumar</span>
                    <span className="text-sidebar-foreground/60">Personal Account</span>
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
                <DropdownMenuItem asChild>
                  <Link href="/login">
                    <LogOut className="mr-2 size-4" />
                    Sign Out
                  </Link>
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
