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
import { Download, FileText, Filter } from "lucide-react"

const reports = [
  { id: "RPT-001", title: "Monthly Trauma Summary", type: "Trauma", date: "Feb 28, 2026", status: "Generated" },
  { id: "RPT-002", title: "Prescription Analytics Q1", type: "Rx-Vox", date: "Feb 25, 2026", status: "Generated" },
  { id: "RPT-003", title: "Consultation Volume Report", type: "Scribe", date: "Feb 20, 2026", status: "Generated" },
  { id: "RPT-004", title: "Critical Cases Overview", type: "Trauma", date: "Feb 15, 2026", status: "Pending" },
  { id: "RPT-005", title: "Language Distribution Report", type: "Scribe", date: "Feb 10, 2026", status: "Generated" },
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground">Download and manage generated reports</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4" />
          Filter
        </Button>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Report ID</TableHead>
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs text-foreground">{r.id}</TableCell>
                  <TableCell className="flex items-center gap-2 text-foreground">
                    <FileText className="size-4 text-primary" />
                    {r.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border/60 text-muted-foreground">{r.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={r.status === "Generated" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" disabled={r.status !== "Generated"}>
                      <Download className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
