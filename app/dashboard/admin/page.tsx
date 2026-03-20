"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Activity, ArrowRight, BellRing, Clock3, Download, Sparkles } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type LogRow = {
  id: string
  action: string
  module: string
  created_at: string
}

type ReminderRow = {
  id: string
  title: string
  message: string
  kind: string
}

export default function AdminPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [personalLogs, setPersonalLogs] = useState<LogRow[]>([])
  const [reminders, setReminders] = useState<ReminderRow[]>([])
  const [stats, setStats] = useState({ checks: 0, scribe: 0, rx: 0, urgent: 0 })

  const loadInsights = useCallback(async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [logsRes, remindersRes, traumaRes, scribeRes, rxRes] = await Promise.all([
      supabase
        .from("activity_logs")
        .select("id,action,module,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(25),
      supabase
        .from("notifications")
        .select("id,title,message,kind")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("trauma_checks").select("id,urgency,created_at").eq("user_id", user.id).gte("created_at", weekAgo),
      supabase.from("scribe_entries").select("id,created_at").eq("user_id", user.id).gte("created_at", weekAgo),
      supabase.from("rx_scans").select("id,created_at").eq("user_id", user.id).gte("created_at", weekAgo),
    ])

    setPersonalLogs((logsRes.data ?? []) as LogRow[])
    setReminders((remindersRes.data ?? []) as ReminderRow[])

    const traumaRows = traumaRes.data ?? []
    setStats({
      checks: traumaRows.length,
      scribe: (scribeRes.data ?? []).length,
      rx: (rxRes.data ?? []).length,
      urgent: traumaRows.filter((row) => row.urgency === "high" || row.urgency === "critical").length,
    })
  }, [supabase])

  useEffect(() => {
    void loadInsights()
  }, [loadInsights])

  useEffect(() => {
    if (!supabase) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const subscribe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel(`admin-live-${user.id}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "activity_logs", filter: `user_id=eq.${user.id}` }, () => void loadInsights())
        .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => void loadInsights())
        .on("postgres_changes", { event: "*", schema: "public", table: "trauma_checks", filter: `user_id=eq.${user.id}` }, () => void loadInsights())
        .on("postgres_changes", { event: "*", schema: "public", table: "scribe_entries", filter: `user_id=eq.${user.id}` }, () => void loadInsights())
        .on("postgres_changes", { event: "*", schema: "public", table: "rx_scans", filter: `user_id=eq.${user.id}` }, () => void loadInsights())
        .subscribe()
    }

    void subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [loadInsights, supabase])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Personal Insights</h1>
          <p className="text-muted-foreground">Track your activity, reminders, and progress in one place.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="mr-2 size-4" />
          Export My Data
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Checks This Week</p>
            <p className="font-display mt-1 text-2xl text-foreground">{stats.checks}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Voice Notes Processed</p>
            <p className="font-display mt-1 text-2xl text-foreground">{stats.scribe}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Medicine Scans</p>
            <p className="font-display mt-1 text-2xl text-foreground">{stats.rx}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Urgent Alerts</p>
            <p className="font-display mt-1 text-2xl text-destructive-foreground">{stats.urgent}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle>My Activity Log</CardTitle>
            <CardDescription>Recent actions from your personal health tools</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personalLogs.length > 0 ? (
                  personalLogs.map((log) => (
                    <TableRow key={log.id} className="border-border/30 hover:bg-secondary/30">
                      <TableCell className="font-mono text-xs text-foreground">{log.id.slice(0, 8)}</TableCell>
                      <TableCell className="text-foreground">{log.action}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border/60 text-muted-foreground">
                          {log.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-border/30 hover:bg-secondary/30">
                    <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                      No activity logs yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              My Reminders
            </CardTitle>
            <CardDescription>Health reminders configured for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/60 bg-card/70 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <Badge variant="secondary" className="text-xs">{item.kind}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.message}</p>
              </div>
            ))}

            {reminders.length === 0 ? <p className="text-xs text-muted-foreground">No reminders or notifications yet.</p> : null}

            <div className="space-y-2 pt-1">
              <Button variant="outline" className="w-full justify-start">
                <BellRing className="mr-2 size-4" />
                Manage Reminder Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock3 className="mr-2 size-4" />
                View Full Timeline
                <ArrowRight className="ml-auto size-4" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="mr-2 size-4" />
                View Weekly Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
