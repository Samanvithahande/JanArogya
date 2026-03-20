"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Activity,
  ArrowRight,
  AudioLines,
  CircleAlert,
  FileText,
  Languages,
  PhoneCall,
  Sparkles,
  Stethoscope,
  Timer,
  Users,
  Volume2,
} from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { ensureUserProfile } from "@/lib/supabase/app-data"

type StatCard = {
  title: string
  value: string
  trend: string
  icon: typeof Users
  chip: string
}

type QueueItem = {
  id: string
  type: string
  person: string
  severity: string
  location: string
  time: string
}

type QueueItemWithTimestamp = QueueItem & {
  createdAt: string
}

const quickActions = [
  {
    title: "Check My Injury",
    description: "Upload an image and get instant risk guidance",
    href: "/dashboard/trauma",
    icon: Activity,
    style: "from-primary/20 to-primary/5 border-primary/25",
  },
  {
    title: "Record My Health Note",
    description: "Speak naturally and get a structured summary",
    href: "/dashboard/scribe",
    icon: Languages,
    style: "from-chart-2/20 to-chart-2/5 border-chart-2/25",
  },
  {
    title: "Read My Medicine Slip",
    description: "Convert medicine details into easy voice guidance",
    href: "/dashboard/rxvox",
    icon: Volume2,
    style: "from-chart-3/20 to-chart-3/5 border-chart-3/25",
  },
]

function severityStyle(severity: string) {
  if (severity === "Critical") return "bg-destructive/15 text-destructive-foreground border-destructive/30"
  if (severity === "High") return "bg-warning/15 text-warning-foreground border-warning/30"
  if (severity === "Medium") return "bg-chart-2/15 text-chart-2 border-chart-2/30"
  return "bg-success/15 text-success border-success/30"
}

function toRelativeTime(dateString: string) {
  const createdAt = new Date(dateString).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - createdAt)
  const min = Math.floor(diff / 60000)
  if (min < 1) return "just now"
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.floor(hr / 24)
  return `${day} day ago`
}

export default function DashboardPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState("User")
  const [stats, setStats] = useState<StatCard[]>([])
  const [recentQueue, setRecentQueue] = useState<QueueItem[]>([])
  const [attentionText, setAttentionText] = useState("No recent high-risk entries. Keep following your care plan.")
  const [todaySummary, setTodaySummary] = useState("No activities yet today. Start with injury check, notes, or medicine scan.")

  const loadDashboard = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    await ensureUserProfile(supabase, user)

    const profileResult = await supabase
      .from("profiles")
      .select("first_name,last_name,location")
      .eq("user_id", user.id)
      .single()

    const profile = profileResult.data
    const fullName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim()
    const fallbackName = user.email?.split("@")[0] || "User"
    setDisplayName(fullName || fallbackName)

    const [traumaRes, scribeRes, rxRes] = await Promise.all([
      supabase
        .from("trauma_checks")
        .select("id,urgency,severity,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("scribe_entries")
        .select("id,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("rx_scans")
        .select("id,medicines,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
    ])

    const traumaRows = traumaRes.data ?? []
    const scribeRows = scribeRes.data ?? []
    const rxRows = rxRes.data ?? []

    const todayIso = new Date()
    todayIso.setHours(0, 0, 0, 0)

    const traumaToday = traumaRows.filter((row) => new Date(row.created_at) >= todayIso)
    const scribeToday = scribeRows.filter((row) => new Date(row.created_at) >= todayIso)
    const rxToday = rxRows.filter((row) => new Date(row.created_at) >= todayIso)

    const criticalCount = traumaRows.filter((row) => row.urgency === "critical" || row.urgency === "high").length
    const avgSeverity = traumaRows.length
      ? (traumaRows.reduce((sum, row) => sum + Number(row.severity || 0), 0) / traumaRows.length).toFixed(1)
      : "0.0"

    const extractedMedicines = rxRows.reduce((count, row) => {
      const meds = Array.isArray(row.medicines) ? row.medicines : []
      return count + meds.length
    }, 0)

    setStats([
      {
        title: "My Checks Today",
        value: String(traumaToday.length),
        trend: traumaToday.length > 0 ? "updated in real time" : "no checks today",
        icon: Users,
        chip: "bg-primary/15 text-primary",
      },
      {
        title: "My Avg Injury Score",
        value: avgSeverity,
        trend: traumaRows.length > 0 ? `${traumaRows.length} total injury checks` : "not available yet",
        icon: Timer,
        chip: "bg-emerald-500/15 text-emerald-300",
      },
      {
        title: "Open Critical Cases",
        value: String(criticalCount),
        trend: criticalCount > 0 ? "needs immediate review" : "all clear right now",
        icon: CircleAlert,
        chip: "bg-destructive/15 text-destructive-foreground",
      },
      {
        title: "Medicines Extracted",
        value: String(extractedMedicines),
        trend: rxRows.length > 0 ? `${rxRows.length} prescription scans` : "no scan records yet",
        icon: AudioLines,
        chip: "bg-chart-3/15 text-chart-3",
      },
    ])

    const queue: QueueItem[] = ([
      ...traumaRows.map((row) => ({
        id: row.id.slice(0, 8),
        type: "Trauma",
        person: fullName || fallbackName,
        severity: row.urgency.charAt(0).toUpperCase() + row.urgency.slice(1),
        location: profile?.location || "Not set",
        time: toRelativeTime(row.created_at),
        createdAt: row.created_at,
      })),
      ...scribeRows.map((row) => ({
        id: row.id.slice(0, 8),
        type: "Scribe",
        person: fullName || fallbackName,
        severity: "Medium",
        location: profile?.location || "Not set",
        time: toRelativeTime(row.created_at),
        createdAt: row.created_at,
      })),
      ...rxRows.map((row) => ({
        id: row.id.slice(0, 8),
        type: "Rx-Vox",
        person: fullName || fallbackName,
        severity: "Low",
        location: profile?.location || "Not set",
        time: toRelativeTime(row.created_at),
        createdAt: row.created_at,
      })),
    ] as QueueItemWithTimestamp[])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map(({ createdAt, ...rest }) => rest)

    setRecentQueue(queue)

    if (criticalCount > 0) {
      setAttentionText(`You have ${criticalCount} high-risk or critical entries. Review them and follow next-step guidance.`)
    } else {
      setAttentionText("No high-risk entries detected recently. Continue monitoring and keep records updated.")
    }

    setTodaySummary(
      `${scribeToday.length} notes saved, ${rxToday.length} prescription scans, and ${traumaToday.length} injury checks today.`
    )
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (!supabase) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const subscribe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel(`dashboard-live-${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "trauma_checks", filter: `user_id=eq.${user.id}` },
          () => void loadDashboard()
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "scribe_entries", filter: `user_id=eq.${user.id}` },
          () => void loadDashboard()
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rx_scans", filter: `user_id=eq.${user.id}` },
          () => void loadDashboard()
        )
        .subscribe()
    }

    void subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [loadDashboard, supabase])

  return (
    <div className="dashboard-stack">
      <section className="dashboard-hero-card">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-primary">
              <Sparkles className="size-3.5" />
              My Health Today
            </div>
            <h1 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
              Welcome back, {displayName}. Your personal health space is ready.
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Use this space to track your health notes, medicine guidance, and urgent alerts in one clear view.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/dashboard/trauma">
                  Start New Check
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-primary/25 bg-background/60 hover:bg-primary/10">
                <Link href="/dashboard/scribe">Add Voice Note</Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-xl text-primary hover:bg-primary/10">
                <Link href="/dashboard/emergency">Emergency Help</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
                <CircleAlert className="size-4" />
                Attention Needed
              </div>
              <p className="text-sm text-muted-foreground">{attentionText}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/75 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <Stethoscope className="size-4 text-primary" />
                Today at a Glance
              </div>
              <p className="text-sm text-muted-foreground">{todaySummary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="dashboard-metric-card">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${stat.chip}`}>{stat.title}</span>
                <stat.icon className="size-4 text-foreground/70" />
              </div>
              <p className="font-display text-3xl text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href} className="group">
            <Card className={`h-full border bg-linear-to-br ${action.style} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10`}>
              <CardContent className="p-5">
                <div className="mb-4 inline-flex rounded-xl border border-border/40 bg-background/75 p-2.5">
                  <action.icon className="size-5 text-foreground" />
                </div>
                <p className="text-base font-semibold text-foreground">{action.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                <div className="mt-5 flex items-center text-sm font-medium text-primary">
                  Open Module
                  <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="dashboard-data-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display text-2xl">Live Help Queue</CardTitle>
              <CardDescription>Most recent entries across injury check, notes, and medicine voice</CardDescription>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/10">
              <Link href="/dashboard/history">View full history</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Person</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQueue.length > 0 ? (
                  recentQueue.map((item) => (
                    <TableRow key={item.id} className="border-border/30 hover:bg-background/70">
                      <TableCell className="font-mono text-xs text-foreground">{item.id}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-muted-foreground">{item.person}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={severityStyle(item.severity)}>
                          {item.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.location}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{item.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-border/30 hover:bg-background/70">
                    <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                      {loading ? "Loading live records..." : "No records yet. Start with Injury Check, Health Notes, or Rx-Vox."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="dashboard-data-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Priority Shortcuts</CardTitle>
            <CardDescription>Quick access to high-frequency workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/emergency" className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-3 hover:bg-card">
              <PhoneCall className="mt-0.5 size-4 text-destructive-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Emergency Panel</p>
                <p className="text-xs text-muted-foreground">Escalate critical calls and coordinate nearest response team.</p>
              </div>
            </Link>
            <Link href="/dashboard/reports" className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-3 hover:bg-card">
              <FileText className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Daily Personal Reports</p>
                <p className="text-xs text-muted-foreground">View trends for your checks and module usage patterns.</p>
              </div>
            </Link>
            <Link href="/dashboard/settings" className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-3 hover:bg-card">
              <Users className="mt-0.5 size-4 text-chart-3" />
              <div>
                <p className="text-sm font-medium text-foreground">Personal Settings</p>
                <p className="text-xs text-muted-foreground">Manage your profile, language packs, and accessibility preferences.</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
