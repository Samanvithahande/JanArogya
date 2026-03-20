"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Bell, CalendarDays, Search, Siren, Sparkles } from "lucide-react"
import { LanguageDropdown } from "@/components/i18n/language-dropdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type NotificationRow = {
  id: string
  title: string
  message: string
  is_read: boolean
}

export function DashboardHeader() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [urgentCount, setUrgentCount] = useState(0)

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const loadHeaderData = useCallback(async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const [notificationRes, traumaRes] = await Promise.all([
      supabase
        .from("notifications")
        .select("id,title,message,is_read")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("trauma_checks").select("id,urgency").eq("user_id", user.id),
    ])

    setNotifications((notificationRes.data ?? []) as NotificationRow[])

    const traumaRows = traumaRes.data ?? []
    setUrgentCount(traumaRows.filter((row) => row.urgency === "high" || row.urgency === "critical").length)
  }, [supabase])

  useEffect(() => {
    void loadHeaderData()
  }, [loadHeaderData])

  useEffect(() => {
    if (!supabase) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const subscribe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel(`header-live-${user.id}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => void loadHeaderData())
        .on("postgres_changes", { event: "*", schema: "public", table: "trauma_checks", filter: `user_id=eq.${user.id}` }, () => void loadHeaderData())
        .subscribe()
    }

    void subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [loadHeaderData, supabase])

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
        <div
          data-no-translate="true"
          className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-2 py-1"
        >
          <span className="hidden text-xs font-medium text-primary sm:inline">Language</span>
          <LanguageDropdown compact />
        </div>

        <div className="hidden items-center gap-2 rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-xs text-muted-foreground sm:flex">
          <CalendarDays className="size-4 text-primary" />
          {today}
        </div>

        <div className="hidden items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground lg:flex">
          <Siren className="size-4" />
          {urgentCount} urgent case{urgentCount === 1 ? "" : "s"} need{urgentCount === 1 ? "s" : ""} attention
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10">
              <Bell className="size-4" />
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground font-medium">
                {notifications.filter((item) => !item.is_read).length}
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-foreground">Notifications</span>
              <Badge variant="secondary" className="text-xs">{notifications.filter((item) => !item.is_read).length} new</Badge>
            </div>
            <Separator />
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-1 py-3">
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.message}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm text-muted-foreground">No notifications yet.</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
