"use client"

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

const stats = [
  {
    title: "Checks Completed Today",
    value: "46",
    trend: "+9% vs yesterday",
    icon: Users,
    chip: "bg-primary/15 text-primary",
  },
  {
    title: "Average Safety Check Time",
    value: "02:18",
    trend: "-24 sec improvement",
    icon: Timer,
    chip: "bg-emerald-500/15 text-emerald-300",
  },
  {
    title: "Open Critical Cases",
    value: "1",
    trend: "needs immediate review",
    icon: CircleAlert,
    chip: "bg-destructive/15 text-destructive-foreground",
  },
  {
    title: "Medication Audio Plays",
    value: "183",
    trend: "+14% engagement",
    icon: AudioLines,
    chip: "bg-chart-3/15 text-chart-3",
  },
]

const recentQueue = [
  {
    id: "T-1042",
    type: "Trauma",
    person: "Asha K.",
    severity: "High",
    location: "Ward 3",
    time: "12 min ago",
  },
  {
    id: "S-2891",
    type: "Scribe",
    person: "Ravi N.",
    severity: "Medium",
    location: "OPD 2",
    time: "34 min ago",
  },
  {
    id: "R-0912",
    type: "Rx-Vox",
    person: "Fatima B.",
    severity: "Low",
    location: "Pharmacy",
    time: "1 hr ago",
  },
  {
    id: "T-1041",
    type: "Trauma",
    person: "Mahesh P.",
    severity: "Critical",
    location: "Emergency",
    time: "2 hr ago",
  },
]

const quickActions = [
  {
    title: "Start Trauma Assessment",
    description: "Capture injury and generate severity guidance",
    href: "/dashboard/trauma",
    icon: Activity,
    style: "from-primary/20 to-primary/5 border-primary/25",
  },
  {
    title: "Open Polyglot Scribe",
    description: "Record and auto-structure your health voice notes",
    href: "/dashboard/scribe",
    icon: Languages,
    style: "from-chart-2/20 to-chart-2/5 border-chart-2/25",
  },
  {
    title: "Launch Rx-Vox",
    description: "Translate prescriptions into clear audio",
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

export default function DashboardPage() {
  return (
    <div className="dashboard-stack">
      <section className="dashboard-hero-card">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-primary">
              <Sparkles className="size-3.5" />
              Shift Overview
            </div>
            <h1 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
              Good morning, Rajan. Your personal health dashboard is ready.
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              One urgent injury case needs quick attention. All other modules are working normally.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/dashboard/emergency">
                  Open Emergency Help
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-primary/25 bg-background/60 hover:bg-primary/10">
                <Link href="/dashboard/history">Review Saved History</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-destructive-foreground">
                <CircleAlert className="size-4" />
                Critical watchlist
              </div>
              <p className="text-sm text-muted-foreground">Injury case T-1041 is flagged for immediate support.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/75 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <Stethoscope className="size-4 text-primary" />
                Personal status
              </div>
              <p className="text-sm text-muted-foreground">12 users online, 4 note sessions active, and 8 medicine voice requests completed this hour.</p>
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
                {recentQueue.map((item) => (
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
                ))}
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
