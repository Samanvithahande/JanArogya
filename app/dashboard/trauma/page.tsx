"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Siren,
  Stethoscope,
  Package,
  X,
} from "lucide-react"

type AnalysisResult = {
  severity: number
  urgency: "low" | "medium" | "high" | "critical"
  actions: string[]
  equipment: string[]
  notes: string
}

const mockResult: AnalysisResult = {
  severity: 7,
  urgency: "high",
  actions: [
    "Apply direct pressure to control bleeding",
    "Immobilize the affected limb",
    "Monitor vital signs every 5 minutes",
    "Prepare for emergency transport",
    "Administer pain management per protocol",
  ],
  equipment: [
    "Sterile gauze pads",
    "Elastic bandage",
    "Splint kit",
    "Pulse oximeter",
    "IV access kit",
  ],
  notes: "Suspected compound fracture with moderate hemorrhage. Patient requires urgent transfer to nearest district hospital for imaging and surgical consultation.",
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "critical": return "bg-destructive text-destructive-foreground"
    case "high": return "bg-warning text-warning-foreground"
    case "medium": return "bg-chart-2 text-card"
    default: return "bg-success text-success-foreground"
  }
}

function getSeverityColor(score: number) {
  if (score >= 8) return "text-destructive-foreground"
  if (score >= 5) return "text-warning"
  return "text-success"
}

export default function TraumaTriagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type.startsWith("image/")) {
      setFile(droppedFile)
      setPreview(URL.createObjectURL(droppedFile))
      setResult(null)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected?.type.startsWith("image/")) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setResult(null)
    }
  }, [])

  const handleAnalyze = useCallback(() => {
    setAnalyzing(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setAnalyzing(false)
          setResult(mockResult)
          return 100
        }
        return prev + 2
      })
    }, 40)
  }, [])

  const resetAll = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setProgress(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">ET-AI Trauma Triage</h1>
        <p className="text-muted-foreground">Upload injury images for AI-powered severity assessment</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Zone */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground">Image Upload</CardTitle>
            <CardDescription>Drag and drop or select an injury image for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {!preview ? (
              <label
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 p-12 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Upload className="size-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Drop image here or click to upload</p>
                  <p className="mt-1 text-xs text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="relative overflow-hidden rounded-xl border border-border/50">
                  <img
                    src={preview}
                    alt="Uploaded injury"
                    className="h-64 w-full object-cover"
                  />
                  <button
                    onClick={resetAll}
                    className="absolute top-2 right-2 rounded-full bg-background/80 p-1 backdrop-blur-sm hover:bg-background"
                    aria-label="Remove image"
                  >
                    <X className="size-4 text-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ImageIcon className="size-4" />
                  <span className="truncate">{file?.name}</span>
                  <span className="ml-auto text-xs">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</span>
                </div>

                {analyzing ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Loader2 className="size-4 animate-spin" />
                      Analyzing injury...
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : !result ? (
                  <Button
                    onClick={handleAnalyze}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Stethoscope className="mr-2 size-4" />
                    Analyze Injury
                  </Button>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result ? (
          <div className="flex flex-col gap-4">
            {/* Severity Score */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardContent className="flex items-center gap-6 p-6">
                <div className="relative flex size-28 items-center justify-center">
                  <svg className="size-28 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                    <circle
                      cx="60" cy="60" r="50" fill="none" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.severity / 10) * 314} 314`}
                      className={getSeverityColor(result.severity)}
                      stroke="currentColor"
                    />
                  </svg>
                  <span className={`absolute text-3xl font-bold ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">Severity Score</span>
                  <Badge className={`w-fit text-sm ${getUrgencyColor(result.urgency)}`}>
                    {result.urgency.toUpperCase()} URGENCY
                  </Badge>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {result.notes}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                  <CheckCircle2 className="size-4 text-primary" />
                  Immediate Action Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {result.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-secondary/30 p-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                  <Package className="size-4 text-chart-3" />
                  Recommended Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.equipment.map((item, i) => (
                    <Badge key={i} variant="outline" className="border-border/60 text-foreground">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Button variant="destructive" size="lg" className="w-full">
              <Siren className="mr-2 size-5" />
              Flag Emergency
            </Button>
          </div>
        ) : (
          <Card className="flex items-center justify-center border-border/50 bg-card/60 backdrop-blur-sm min-h-[300px]">
            <div className="flex flex-col items-center gap-3 text-center p-8">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary/50">
                <Stethoscope className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Upload an image and run analysis to see results here</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
