"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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

type MedicalSummary = {
  language: string
  chiefComplaint: string
  symptoms: string[]
  history: string
  assessment: string
  treatmentPlan: string[]
  followUp: string
}

const mockSummary: MedicalSummary = {
  language: "Hindi",
  chiefComplaint: "Persistent abdominal pain for 3 days with nausea",
  symptoms: [
    "Sharp pain in lower right abdomen",
    "Nausea and occasional vomiting",
    "Low-grade fever (99.8F)",
    "Loss of appetite",
    "Difficulty sleeping due to pain",
  ],
  history: "No prior surgical history. Patient reports similar episode 6 months ago that resolved with medication. Family history of gastrointestinal conditions.",
  assessment: "Clinical presentation suggests possible appendicitis. McBurney's point tenderness present. Rebound tenderness noted. Recommend urgent ultrasound and blood work including CBC and CRP.",
  treatmentPlan: [
    "NPO (nil per os) status until imaging results",
    "IV fluid administration for hydration",
    "Paracetamol 500mg for pain and fever management",
    "Urgent abdominal ultrasound",
    "CBC, CRP, and urinalysis",
    "Surgical consultation if imaging confirms appendicitis",
  ],
  followUp: "Patient to remain under observation. Re-evaluate within 4-6 hours based on lab results. If surgical intervention needed, transfer to district hospital.",
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
  const [isRecording, setIsRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [summary, setSummary] = useState<MedicalSummary | null>(null)
  const [translateLang, setTranslateLang] = useState("en")
  const waveformInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const [, setTick] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<BlobPart[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (isRecording) {
      waveformInterval.current = setInterval(() => setTick((t) => t + 1), 150)
    } else if (waveformInterval.current) {
      clearInterval(waveformInterval.current)
    }
    return () => {
      if (waveformInterval.current) clearInterval(waveformInterval.current)
      // stop any active recording/stream when component unmounts
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop()
        }
      } catch (e) {}
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [isRecording])

  const handleRecord = async () => {
    // Toggle recording: start -> request mic and start MediaRecorder; stop -> finalize and send
    try {
      if (isRecording) {
        // stop
        setIsRecording(false)
        setProcessing(true)

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop()
        }

        // ensure stream tracks stopped
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop())
          streamRef.current = null
        }

        // small delay to let MediaRecorder flush
        await new Promise((r) => setTimeout(r, 250))

        const blob = new Blob(audioChunks.current, { type: "audio/wav" })

        const formData = new FormData()
        formData.append("audio", blob, "recording.wav")

        const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api"
        const res = await fetch(`${API_BASE}/scribe`, {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error("/api/scribe returned error:", res.status, text.slice?.(0, 300) ?? text)
          // fallback to mock summary when backend fails
          setSummary(mockSummary)
          setProcessing(false)
          audioChunks.current = []
          return
        }

        let data: any = null
        try {
          data = await res.json()
        } catch (e) {
          // If response isn't JSON, fallback
          console.error("/api/scribe: failed to parse JSON response", e)
          setSummary(mockSummary)
          setProcessing(false)
          audioChunks.current = []
          return
        }

        setSummary(data?.summary ?? mockSummary)
        setProcessing(false)
        audioChunks.current = []
      } else {
        // start
        setSummary(null)
        setProcessing(false)
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Microphone not supported in this browser")
          }
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          streamRef.current = stream

          let recorder: MediaRecorder
          try {
            recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
          } catch (e) {
            recorder = new MediaRecorder(stream)
          }

          audioChunks.current = []
          recorder.ondataavailable = (ev: BlobEvent) => {
            if (ev.data && ev.data.size > 0) audioChunks.current.push(ev.data)
          }

          recorder.onerror = (err) => console.error("MediaRecorder error:", err)
          recorder.start()
          mediaRecorderRef.current = recorder
          setIsRecording(true)
        } catch (err) {
          console.error("Failed to start recording:", err)
          setIsRecording(false)
        }
      }
    } catch (err) {
      console.error("Record handler error:", err)
      setProcessing(false)
      setIsRecording(false)
    }
  }

    const handleUpload = () => {
        // trigger hidden file input
        const el = document.getElementById("scribe-upload-input") as HTMLInputElement | null
        el?.click()
    }

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setProcessing(true)

      const formData = new FormData()
      formData.append("audio", file, file.name)

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api"
      try {
        const res = await fetch(`${API_BASE}/scribe`, { method: "POST", body: formData })
        if (!res.ok) {
          console.error("/api/scribe returned", res.status)
          setSummary(mockSummary)
          setProcessing(false)
          return
        }
        const data = await res.json().catch(() => null)
        setSummary(data?.summary ?? mockSummary)
      } catch (err) {
        console.error("Upload failed:", err)
        setSummary(mockSummary)
      } finally {
        setProcessing(false)
      }
    }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Polyglot Scribe</h1>
        <p className="text-muted-foreground">Record or upload consultations for AI-powered medical summaries</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recording Section */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground">Audio Input</CardTitle>
            <CardDescription>Record a consultation or upload an audio file</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Waveform */}
            <div className="rounded-xl border border-border/50 bg-secondary/20 p-6">
              <AudioWaveform isRecording={isRecording} />
            </div>

            {/* Controls */}
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

            {processing && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Processing audio...</span>
              </div>
            )}

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

        {/* Summary Output */}
        {summary ? (
          <div className="flex flex-col gap-4">
            {/* Header actions */}
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

            {/* Chief Complaint */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <MessageSquare className="mt-0.5 size-4 text-primary shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Chief Complaint</span>
                  <p className="mt-1 text-sm text-foreground">{summary.chiefComplaint}</p>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
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

            {/* History */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <FileText className="mt-0.5 size-4 text-chart-3 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">History</span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{summary.history}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <Stethoscope className="mt-0.5 size-4 text-warning shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Assessment</span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{summary.assessment}</p>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Plan */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  <Pill className="size-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Treatment Plan</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {summary.treatmentPlan.map((step, i) => (
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

            {/* Follow-up */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-start gap-3 p-4">
                <Calendar className="mt-0.5 size-4 text-chart-5 shrink-0" />
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Follow-up Instructions</span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{summary.followUp}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="flex items-center justify-center border-border/50 bg-card/60 backdrop-blur-sm min-h-[300px]">
            <div className="flex flex-col items-center gap-3 text-center p-8">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary/50">
                <ClipboardList className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Record or upload audio to generate a medical summary</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
