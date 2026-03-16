"use client"

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

const personalLogs = [
  { id: "LOG-001", action: "Injury safety check completed", module: "Injury", time: "Today, 09:14 AM" },
  { id: "LOG-002", action: "Voice note converted to summary", module: "Notes", time: "Today, 08:46 AM" },
  { id: "LOG-003", action: "Medicine slip scanned", module: "Rx Voice", time: "Yesterday, 07:22 PM" },
  { id: "LOG-004", action: "Emergency contacts opened", module: "Emergency", time: "Yesterday, 06:01 PM" },
]

const reminders = [
  { title: "Medicine Reminder", detail: "Paracetamol at 8:00 PM", status: "Active" },
  { title: "Hydration Reminder", detail: "Drink water every 2 hours", status: "Active" },
  { title: "Follow-up Check", detail: "Re-check injury photo tomorrow", status: "Pending" },
]

export default function AdminPage() {
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
            <p className="font-display mt-1 text-2xl text-foreground">18</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Voice Notes Processed</p>
            <p className="font-display mt-1 text-2xl text-foreground">9</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Medicine Scans</p>
            <p className="font-display mt-1 text-2xl text-foreground">12</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Urgent Alerts</p>
            <p className="font-display mt-1 text-2xl text-destructive-foreground">1</p>
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
                {personalLogs.map((log) => (
                  <TableRow key={log.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell className="font-mono text-xs text-foreground">{log.id}</TableCell>
                    <TableCell className="text-foreground">{log.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border/60 text-muted-foreground">
                        {log.module}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.time}</TableCell>
                  </TableRow>
                ))}
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
              <div key={item.title} className="rounded-xl border border-border/60 bg-card/70 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <Badge variant="secondary" className="text-xs">{item.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}

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
