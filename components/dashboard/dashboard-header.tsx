"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell, CalendarDays, Search, Siren, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-primary/10 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary lg:inline-flex">
        <Sparkles className="size-3.5" />
        Live Health Help
      </div>

      <div className="relative hidden flex-1 md:flex">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search your records, medicines, guides..."
          className="h-10 max-w-sm rounded-xl border-primary/15 bg-background/70 pl-10"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-xs text-muted-foreground sm:flex">
          <CalendarDays className="size-4 text-primary" />
          {today}
        </div>

        <div className="hidden items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground lg:flex">
          <Siren className="size-4" />
          1 urgent case needs attention
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10">
              <Bell className="size-4" />
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground font-medium">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-foreground">Notifications</span>
              <Badge variant="secondary" className="text-xs">3 new</Badge>
            </div>
            <Separator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium text-foreground">Urgent Injury Alert</span>
              <span className="text-xs text-muted-foreground">New high-risk injury needs quick help</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium text-foreground">Health Notes Ready</span>
              <span className="text-xs text-muted-foreground">Hindi voice note converted to summary</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium text-foreground">Rx Processed</span>
              <span className="text-xs text-muted-foreground">3 medicines extracted from scan</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
