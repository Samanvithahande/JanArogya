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

  useEffect(() => {
    if (isRecording) {
      waveformInterval.current = setInterval(() => setTick((t) => t + 1), 150)
    } else if (waveformInterval.current) {
      clearInterval(waveformInterval.current)
    }
    return () => {
      if (waveformInterval.current) clearInterval(waveformInterval.current)
    }
  }, [isRecording])

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false)
      setProcessing(true)
      setTimeout(() => {
        setProcessing(false)
        setSummary(mockSummary)
      }, 2000)
    } else {
      setIsRecording(true)
      setSummary(null)
    }
  }

  const handleUpload = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setSummary(mockSummary)
    }, 2000)
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
