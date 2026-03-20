"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
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
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type HistoryItem = {
  id: string
  title: string
  type: string
  date: string
}

export default function HistoryPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadHistory = useCallback(async () => {
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

    const [traumaRes, scribeRes, rxRes] = await Promise.all([
      supabase
        .from("trauma_checks")
        .select("id,severity,urgency,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("scribe_entries")
        .select("id,main_issue,created_at")
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

    const rows = [
      ...(traumaRes.data ?? []).map((row) => ({
        id: row.id,
        title: `Injury Safety Check - Severity ${row.severity}/10 (${String(row.urgency).toUpperCase()})`,
        type: "Injury",
        createdAt: row.created_at,
      })),
      ...(scribeRes.data ?? []).map((row) => ({
        id: row.id,
        title: `Health Note - ${row.main_issue || "Voice summary generated"}`,
        type: "Notes",
        createdAt: row.created_at,
      })),
      ...(rxRes.data ?? []).map((row) => ({
        id: row.id,
        title: `Medicine Slip Scan - ${Array.isArray(row.medicines) ? row.medicines.length : 0} medicines extracted`,
        type: "Rx Voice",
        createdAt: row.created_at,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((row) => ({
        id: row.id.slice(0, 8),
        title: row.title,
        type: row.type,
        date: new Date(row.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))

    setHistory(rows)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  useEffect(() => {
    if (!supabase) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const subscribe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel(`history-live-${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "trauma_checks", filter: `user_id=eq.${user.id}` },
          () => void loadHistory()
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "scribe_entries", filter: `user_id=eq.${user.id}` },
          () => void loadHistory()
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "rx_scans", filter: `user_id=eq.${user.id}` },
          () => void loadHistory()
        )
        .subscribe()
    }

    void subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [loadHistory, supabase])

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
              {history.length > 0 ? (
                history.map((r) => (
                  <TableRow key={r.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell className="font-mono text-xs text-foreground">{r.id}</TableCell>
                    <TableCell className="flex items-center gap-2 text-foreground">
                      <FileText className="size-4 text-primary" />
                      <Link href="/dashboard/history" className="underline-offset-2 hover:underline">
                        {r.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border/60 text-muted-foreground">{r.type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-border/30 hover:bg-secondary/30">
                  <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                    {loading ? "Loading history..." : "No records yet."}
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
