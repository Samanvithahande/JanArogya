"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Users,
  FileText,
  AlertTriangle,
  ArrowRight,
  Languages,
  Volume2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const stats = [
  {
    title: "Total Consultations",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Trauma Cases",
    value: "184",
    change: "+5%",
    icon: Activity,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    title: "Prescriptions Processed",
    value: "1,392",
    change: "+18%",
    icon: FileText,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    title: "Critical Alerts",
    value: "7",
    change: "-3",
    icon: AlertTriangle,
    color: "text-destructive-foreground",
    bg: "bg-destructive/10",
  },
]

const recentActivity = [
  {
    id: "T-1042",
    type: "Trauma",
    patient: "Patient #4521",
    severity: "High",
    status: "Reviewed",
    time: "12 min ago",
  },
  {
    id: "S-2891",
    type: "Scribe",
    patient: "Patient #8832",
    severity: "Medium",
    status: "Completed",
    time: "34 min ago",
  },
  {
    id: "R-0912",
    type: "Rx-Vox",
    patient: "Patient #1209",
    severity: "Low",
    status: "Processing",
    time: "1 hr ago",
  },
  {
    id: "T-1041",
    type: "Trauma",
    patient: "Patient #7723",
    severity: "Critical",
    status: "Flagged",
    time: "2 hr ago",
  },
  {
    id: "S-2890",
    type: "Scribe",
    patient: "Patient #5510",
    severity: "Low",
    status: "Completed",
    time: "3 hr ago",
  },
]

function getSeverityColor(severity: string) {
  switch (severity) {
    case "Critical":
      return "bg-destructive/15 text-destructive-foreground border-destructive/30"
    case "High":
      return "bg-warning/15 text-warning-foreground border-warning/30"
    case "Medium":
      return "bg-chart-2/15 text-chart-2 border-chart-2/30"
    default:
      return "bg-success/15 text-success border-success/30"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Flagged":
      return "bg-destructive/15 text-destructive-foreground"
    case "Reviewed":
      return "bg-primary/15 text-primary"
    case "Processing":
      return "bg-warning/15 text-warning-foreground"
    default:
      return "bg-success/15 text-success"
  }
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, Rajan
        </h1>
        <p className="text-muted-foreground">
          {"Here's what's happening at your facility today."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex size-11 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{stat.title}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-card-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Button
          asChild
          variant="outline"
          className="flex h-auto flex-col items-center gap-3 border-primary/20 bg-primary/5 py-6 hover:bg-primary/10 hover:border-primary/40"
        >
          <Link href="/dashboard/trauma">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20">
              <Activity className="size-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">New Trauma Assessment</span>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="flex h-auto flex-col items-center gap-3 border-chart-2/20 bg-chart-2/5 py-6 hover:bg-chart-2/10 hover:border-chart-2/40"
        >
          <Link href="/dashboard/scribe">
            <div className="flex size-10 items-center justify-center rounded-xl bg-chart-2/20">
              <Languages className="size-4 text-chart-2" />
            </div>
            <span className="text-sm font-medium text-foreground">Start Consultation Recording</span>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="flex h-auto flex-col items-center gap-3 border-chart-3/20 bg-chart-3/5 py-6 hover:bg-chart-3/10 hover:border-chart-3/40"
        >
          <Link href="/dashboard/rxvox">
            <div className="flex size-10 items-center justify-center rounded-xl bg-chart-3/20">
              <Volume2 className="size-4 text-chart-3" />
            </div>
            <span className="text-sm font-medium text-foreground">Scan Prescription</span>
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-card-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest consultations and assessments</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ArrowRight className="ml-1 size-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Patient</TableHead>
                <TableHead className="text-muted-foreground">Severity</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs text-foreground">{activity.id}</TableCell>
                  <TableCell className="text-foreground">{activity.type}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.patient}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(activity.severity)}>
                      {activity.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{activity.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
