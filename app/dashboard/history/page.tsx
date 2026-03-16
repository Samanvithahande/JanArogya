"use client"

import Link from "next/link"
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
import { FileText, ArrowRight } from "lucide-react"

const history = [
  { id: "HIS-1001", title: "Injury Safety Check - Entry #4521", type: "Injury", date: "Mar 06, 2026" },
  { id: "HIS-1002", title: "Health Notes - Entry #8832", type: "Notes", date: "Mar 05, 2026" },
  { id: "HIS-1003", title: "Medicine Slip Scan - Entry #1209", type: "Rx Voice", date: "Mar 04, 2026" },
  { id: "HIS-1004", title: "Injury Safety Check - Entry #7723", type: "Injury", date: "Mar 03, 2026" },
]

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">History</h1>
          <p className="text-muted-foreground">View your recent checks, voice notes, and medicine scans</p>
        </div>
        <Button variant="ghost" size="sm">
          View Archive <ArrowRight className="ml-1 size-3" />
        </Button>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Record ID</TableHead>
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((r) => (
                <TableRow key={r.id} className="border-border/30 hover:bg-secondary/30">
                  <TableCell className="font-mono text-xs text-foreground">{r.id}</TableCell>
                  <TableCell className="flex items-center gap-2 text-foreground">
                    <FileText className="size-4 text-primary" />
                    <Link href={`/dashboard/history/${r.id}`} className="underline-offset-2 hover:underline">
                      {r.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border/60 text-muted-foreground">{r.type}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
