"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mic,
  MicOff,
  Upload,
  Loader2,
  FileJson,
  Globe,
  ClipboardList,
  Stethoscope,
  Pill,
  Calendar,
  MessageSquare,
  FileText,
} from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { createActivityLog, createNotification, uploadFileForUser } from "@/lib/supabase/app-data"

type MedicalSummary = {
  language: string
  mainIssue: string
  symptoms: string[]
  history: string
  riskNotes: string
  carePlan: string[]
  nextSteps: string
  simpleSummary?: string
}

function AudioWaveform({ isRecording }: { isRecording: boolean }) {
  const bars = 32

  return (
    <div className="flex h-20 items-end justify-center gap-0.5">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-150 ${
            isRecording ? "bg-primary" : "bg-muted"
          }`}
          style={{
            height: isRecording
              ? `${Math.random() * 60 + 20}%`
              : `${Math.sin(i / 3) * 15 + 20}%`,
            animationDelay: `${i * 30}ms`,
          }}
        />
      ))}
    </div>
  )
}

export default function ScribePage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [isRecording, setIsRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [summary, setSummary] = useState<MedicalSummary | null>(null)
  const [translateLang, setTranslateLang] = useState("en")
  const [errorMessage, setErrorMessage] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  const waveformInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const [, setTick] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const lastMimeRef = useRef<string | null>(null)

  const loadLatestEntry = useCallback(async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
    setUserId(user.id)

    const { data } = await supabase
      .from("scribe_entries")
      .select("language,main_issue,symptoms,history,risk_notes,care_plan,next_steps,simple_summary")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data) return

    setSummary({
      language: data.language || "Unknown",
      mainIssue: data.main_issue || "",
      symptoms: Array.isArray(data.symptoms) ? (data.symptoms as string[]) : [],
      history: data.history || "",
      riskNotes: data.risk_notes || "",
      carePlan: Array.isArray(data.care_plan) ? (data.care_plan as string[]) : [],
      nextSteps: data.next_steps || "",
      simpleSummary: data.simple_summary || undefined,
    })
  }, [supabase])

  useEffect(() => {
    void loadLatestEntry()
  }, [loadLatestEntry])

  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`scribe-live-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scribe_entries", filter: `user_id=eq.${userId}` },
        () => void loadLatestEntry()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadLatestEntry, supabase, userId])

  useEffect(() => {
    if (isRecording) {
      waveformInterval.current = setInterval(() => setTick((t) => t + 1), 150)
    } else if (waveformInterval.current) {
      clearInterval(waveformInterval.current)
    }

    return () => {
      if (waveformInterval.current) clearInterval(waveformInterval.current)
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop()
        }
      } catch {
        // no-op
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [isRecording])

  const saveSummary = useCallback(
    async (userIdValue: string, parsedSummary: MedicalSummary, audioFile: File) => {
      if (!supabase) return

      const uploaded = await uploadFileForUser(supabase, "scribe-audio", userIdValue, audioFile)

      const insertRes = await supabase
        .from("scribe_entries")
        .insert({
          user_id: userIdValue,
          audio_path: uploaded.path,
          audio_url: uploaded.publicUrl,
          language: parsedSummary.language,
          main_issue: parsedSummary.mainIssue,
          symptoms: parsedSummary.symptoms,
          history: parsedSummary.history,
          risk_notes: parsedSummary.riskNotes,
          care_plan: parsedSummary.carePlan,
          next_steps: parsedSummary.nextSteps,
          simple_summary: parsedSummary.simpleSummary,
        })
        .select("id")
        .single()

      await createActivityLog(supabase, {
        userId: userIdValue,
        module: "scribe",
        action: "Voice note converted to summary",
        metadata: {
          language: parsedSummary.language,
          symptoms: parsedSummary.symptoms.length,
        },
      })

      await createNotification(supabase, {
        userId: userIdValue,
        title: "Health Notes Ready",
        message: `Your ${parsedSummary.language} note has been converted to a structured summary.`,
        kind: "info",
        relatedTable: "scribe_entries",
        relatedId: insertRes.data?.id,
      })
    },
    [supabase]
  )

  const processAudio = useCallback(
    async (audioFile: File) => {
      if (!supabase) {
        setErrorMessage("Supabase is not configured.")
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setErrorMessage("Please sign in again.")
        return
      }

      setProcessing(true)
      setErrorMessage("")

      try {
        const formData = new FormData()
        formData.append("audio", audioFile, audioFile.name)

        const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api"
        const res = await fetch(`${API_BASE}/scribe`, { method: "POST", body: formData })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          throw new Error(`Server responded ${res.status}: ${text}`)
        }

        const data = await res.json()
        const backendSummary = data?.summary ?? {}

        const parsedSummary: MedicalSummary = {
          language: backendSummary.language || "Unknown",
          mainIssue: backendSummary.mainIssue || "",
          symptoms: Array.isArray(backendSummary.symptoms) ? backendSummary.symptoms : [],
          history: backendSummary.history || "",
          riskNotes: backendSummary.riskNotes || "",
          carePlan: Array.isArray(backendSummary.carePlan) ? backendSummary.carePlan : [],
          nextSteps: backendSummary.nextSteps || "",
          simpleSummary: backendSummary.simpleSummary,
        }

        await saveSummary(user.id, parsedSummary, audioFile)
        setSummary(parsedSummary)
      } catch (error) {
        console.error("Scribe processing failed:", error)
        setErrorMessage("Unable to process audio right now. Please retry.")
      } finally {
        setProcessing(false)
      }
    },
    [saveSummary, supabase]
  )

  const handleRecord = async () => {
    try {
      if (isRecording) {
        setIsRecording(false)

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop()
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop())
          streamRef.current = null
        }

        await new Promise((resolve) => setTimeout(resolve, 250))

        const mime = lastMimeRef.current || mediaRecorderRef.current?.mimeType || "audio/webm"
        const ext = mime.includes("webm") ? "webm" : mime.includes("wav") ? "wav" : "dat"
        const blob = new Blob(audioChunks.current, { type: mime })
        audioChunks.current = []

        const recordedFile = new File([blob], `recording-${Date.now()}.${ext}`, { type: mime })
        await processAudio(recordedFile)
      } else {
        setSummary(null)
        setErrorMessage("")

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Microphone access is not supported in this browser")
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream

        let recorder: MediaRecorder
        try {
          recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" })
        } catch {
          try {
            recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
          } catch {
            recorder = new MediaRecorder(stream)
          }
        }

        audioChunks.current = []
        lastMimeRef.current = recorder.mimeType || null
        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            audioChunks.current.push(event.data)
          }
        }
        recorder.start()

        mediaRecorderRef.current = recorder
        setIsRecording(true)
      }
    } catch (error) {
      console.error("Recording failed:", error)
      setIsRecording(false)
      setProcessing(false)
      setErrorMessage("Could not access microphone. Please check permission and try again.")
    }
  }

  const handleUpload = () => {
    const input = document.getElementById("scribe-upload-input") as HTMLInputElement | null
    input?.click()
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    await processAudio(selectedFile)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Polyglot Scribe</h1>
        <p className="text-muted-foreground">Record or upload voice notes for simple multilingual health summaries</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground">Audio Input</CardTitle>
            <CardDescription>Record a health voice note or upload an audio file</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/50 bg-secondary/20 p-6">
              <AudioWaveform isRecording={isRecording} />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleRecord}
                className={
                  isRecording
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full size-16"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full size-16"
                }
                disabled={processing}
              >
                {isRecording ? <MicOff className="size-6" /> : <Mic className="size-6" />}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {isRecording ? "Recording in progress... Click to stop" : "Click to start recording"}
            </div>

            <div className="relative flex items-center gap-4">
              <div className="flex-1 border-t border-border/50" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border/50" />
            </div>

            <Button variant="outline" onClick={handleUpload} disabled={processing} className="w-full">
              <Upload className="mr-2 size-4" />
              Upload Audio File
            </Button>
            <input id="scribe-upload-input" type="file" accept="audio/*" className="hidden" onChange={handleFileSelected} />

            {processing && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Processing audio...</span>
              </div>
            )}

            {errorMessage ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                {errorMessage}
              </div>
            ) : null}

            {summary && (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  <span className="text-sm text-foreground">Language Detected</span>
                </div>
                <Badge className="bg-primary/20 text-primary">{summary.language}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {summary ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Medical Summary</h2>
              <div className="flex items-center gap-2">
                <Select value={translateLang} onValueChange={setTranslateLang}>
                  <SelectTrigger className="w-36 bg-secondary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <FileJson className="mr-1 size-3" />
                  Export
                </Button>
              </div>
            </div>

            {summary.simpleSummary && (
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">In simple words</span>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">{summary.simpleSummary}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <MessageSquare className="mt-0.5 size-4 text-primary shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Main Issue</span>
                  <p className="mt-1 text-sm text-foreground">{summary.mainIssue}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-chart-2" />
                  <span className="text-xs font-medium text-muted-foreground">Symptoms</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {summary.symptoms.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="size-1.5 rounded-full bg-chart-2" />
                      {s}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <FileText className="mt-0.5 size-4 text-chart-3 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">History</span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{summary.history}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <Stethoscope className="mt-0.5 size-4 text-warning shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Risk Notes</span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{summary.riskNotes}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  <Pill className="size-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Care Plan</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {summary.carePlan.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-secondary/30 p-2.5">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <Calendar className="mt-0.5 size-4 text-chart-5 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Next Steps</span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{summary.nextSteps}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="min-h-75 flex items-center justify-center border-border/50 bg-card/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-center p-8">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary/50">
                <ClipboardList className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Record or upload audio to generate a health summary</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
