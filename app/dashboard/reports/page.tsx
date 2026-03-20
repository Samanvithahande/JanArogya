"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type ReportRow = {
  id: string
  title: string
  type: string
  status: "generated" | "pending" | "failed"
  payload: Record<string, unknown>
  created_at: string
}

export default function ReportsPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const loadReports = useCallback(async () => {
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

    const { data } = await supabase
      .from("reports")
      .select("id,title,type,status,payload,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setReports((data ?? []) as ReportRow[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    void loadReports()
  }, [loadReports])

  useEffect(() => {
    if (!supabase) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const subscribe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel(`reports-live-${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` },
          () => void loadReports()
        )
        .subscribe()
    }

    void subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [loadReports, supabase])

  const generateReport = async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    setGenerating(true)

    const [traumaRes, scribeRes, rxRes] = await Promise.all([
      supabase.from("trauma_checks").select("id,urgency,severity").eq("user_id", user.id),
      supabase.from("scribe_entries").select("id,language").eq("user_id", user.id),
      supabase.from("rx_scans").select("id,medicines").eq("user_id", user.id),
    ])

    const traumaRows = traumaRes.data ?? []
    const scribeRows = scribeRes.data ?? []
    const rxRows = rxRes.data ?? []

    const medicineCount = rxRows.reduce((sum, row) => {
      const meds = Array.isArray(row.medicines) ? row.medicines : []
      return sum + meds.length
    }, 0)

    const payload = {
      generatedAt: new Date().toISOString(),
      traumaChecks: traumaRows.length,
      criticalOrHigh: traumaRows.filter((row) => row.urgency === "critical" || row.urgency === "high").length,
      averageSeverity: traumaRows.length
        ? traumaRows.reduce((sum, row) => sum + Number(row.severity || 0), 0) / traumaRows.length
        : 0,
      scribeEntries: scribeRows.length,
      languageDistribution: scribeRows.reduce<Record<string, number>>((acc, row) => {
        const key = String(row.language || "Unknown")
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {}),
      rxScans: rxRows.length,
      extractedMedicines: medicineCount,
    }

    await supabase.from("reports").insert({
      user_id: user.id,
      title: "Live Personal Usage Report",
      type: "Dashboard",
      status: "generated",
      payload,
    })

    setGenerating(false)
  }

  const downloadReport = (row: ReportRow) => {
    const blob = new Blob([JSON.stringify(row.payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${row.title.replace(/\s+/g, "-").toLowerCase()}-${row.id.slice(0, 8)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground">Download and review your personal health usage reports</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={generateReport} disabled={generating}>
          <Filter className="size-4" />
          {generating ? "Generating..." : "Generate Live Report"}
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
              {reports.length > 0 ? (
                reports.map((r) => (
                  <TableRow key={r.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell className="font-mono text-xs text-foreground">{r.id.slice(0, 8)}</TableCell>
                    <TableCell className="flex items-center gap-2 text-foreground">
                      <FileText className="size-4 text-primary" />
                      {r.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border/60 text-muted-foreground">{r.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          r.status === "generated"
                            ? "bg-success/15 text-success"
                            : r.status === "pending"
                              ? "bg-warning/15 text-warning"
                              : "bg-destructive/15 text-destructive-foreground"
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" disabled={r.status !== "generated"} onClick={() => downloadReport(r)}>
                        <Download className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-border/30 hover:bg-secondary/30">
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                    {loading ? "Loading reports..." : "No reports generated yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
