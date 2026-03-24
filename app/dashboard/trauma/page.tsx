"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
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
  ArrowLeft,
  Package,
  X,
} from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { createActivityLog, createNotification, uploadFileForUser } from "@/lib/supabase/app-data"

type AnalysisResult = {
  severity: number
  urgency: "low" | "medium" | "high" | "critical"
  actions: string[]
  equipment: string[]
  notes: string
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
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const loadLatestResult = useCallback(async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
    setUserId(user.id)

    const { data } = await supabase
      .from("trauma_checks")
      .select("severity,urgency,actions,equipment,diagnosis")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data) return

    setResult({
      severity: Number(data.severity || 0),
      urgency: data.urgency,
      actions: Array.isArray(data.actions) ? (data.actions as string[]) : [],
      equipment: Array.isArray(data.equipment) ? (data.equipment as string[]) : [],
      notes: data.diagnosis || "",
    })
  }, [supabase])

  useEffect(() => {
    void loadLatestResult()
  }, [loadLatestResult])

  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`trauma-live-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trauma_checks", filter: `user_id=eq.${userId}` },
        () => void loadLatestResult()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadLatestResult, supabase, userId])

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

const handleAnalyze = useCallback(async () => {
  if (!file) return
  setErrorMessage("")

  setAnalyzing(true)
  setProgress(20)

  if (!supabase) {
    setErrorMessage("Supabase is not configured.")
    setAnalyzing(false)
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    setErrorMessage("Please sign in again.")
    setAnalyzing(false)
    return
  }

  try {
    const formData = new FormData()
    formData.append("image", file)

    const fetchWithTimeout = async (endpoint: string, timeoutMs = 45000) => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      try {
        return await fetch(endpoint, {
          method: "POST",
          body: formData,
          mode: "cors",
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timer)
      }
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api"
    const directBackend =
      process.env.NEXT_PUBLIC_API_URL ??
      process.env.NEXT_PUBLIC_BACKEND_URL ??
      "https://janarogya.onrender.com"
    const directBackendBase = directBackend.replace(/\/+$/, "")
    const apiCandidate = `${API_BASE}/predict`
    const directCandidates = [
      directBackendBase ? `${directBackendBase}/api/predict` : "",
      directBackendBase ? `${directBackendBase}/predict` : "",
    ].filter(Boolean)

    let data: any = null
    let lastError = ""

    const runCandidates = async (endpoints: string[]) => {
      for (const endpoint of endpoints) {
        try {
          const res = await fetchWithTimeout(endpoint)

          if (res.ok) {
            data = await res.json()
            return
          }

          const text = await res.text().catch(() => "")
          lastError = `Server responded ${res.status}: ${text}`

          const backendNotConfigured =
            res.status === 500 &&
            /backend url not configured/i.test(text)

          if (backendNotConfigured) {
            continue
          }

          // Continue to next candidate only when the current route is missing.
          if (res.status !== 404 && res.status !== 405) {
            return
          }
        } catch (err) {
          const message =
            err instanceof DOMException && err.name === "AbortError"
              ? "Request timed out. Please try again."
              : err instanceof Error
                ? err.message
                : "Unknown request error"
          lastError = `Request to ${endpoint} failed: ${message}`
        }
      }
    }

    await runCandidates([apiCandidate])
    if (!data && directCandidates.length > 0 && /Server responded (404|405):/.test(lastError)) {
      await runCandidates(directCandidates)
    }

    if (!data) {
      throw new Error(lastError || "Unable to reach trauma analysis service")
    }

    const mappedResult: AnalysisResult = {
      severity: data.severity_score,
      urgency: data.urgency.toLowerCase(),
      actions: data.actions || [],
      equipment: data.equipment || [],
      notes: data.diagnosis || "No diagnosis available"
    }

    setProgress(100)
    setResult(mappedResult)

    // Persist analysis in background so UI doesn't remain in loading state on DB/storage delays.
    void (async () => {
      try {
        const uploaded = await uploadFileForUser(supabase, "trauma-images", user.id, file)

        const insertRes = await supabase.from("trauma_checks").insert({
          user_id: user.id,
          image_path: uploaded.path,
          image_url: uploaded.publicUrl,
          severity: mappedResult.severity,
          urgency: mappedResult.urgency,
          actions: mappedResult.actions,
          equipment: mappedResult.equipment,
          diagnosis: mappedResult.notes,
        }).select("id").single()

        const insertedId = insertRes.data?.id as string | undefined

        await createActivityLog(supabase, {
          userId: user.id,
          module: "trauma",
          action: "Injury safety check completed",
          metadata: {
            severity: mappedResult.severity,
            urgency: mappedResult.urgency,
          },
        })

        if (mappedResult.urgency === "high" || mappedResult.urgency === "critical") {
          await createNotification(supabase, {
            userId: user.id,
            title: "Urgent Injury Alert",
            message: `Severity ${mappedResult.severity}/10 requires quick attention.`,
            kind: "urgent",
            relatedTable: "trauma_checks",
            relatedId: insertedId,
          })
        }
      } catch (persistError) {
        console.error("Failed to persist trauma analysis:", persistError)
      }
    })()

  } catch (error) {
    console.error("Analysis failed:", error)
    const message = error instanceof Error ? error.message : "Unable to process injury check right now. Please retry."
    setErrorMessage(message)
  } finally {
    setAnalyzing(false)
  }

}, [file, supabase])

  const resetAll = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setProgress(0)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Injury Safety Check</h1>
        <p className="text-muted-foreground">Upload an injury image to get quick risk guidance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Zone */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground">Image Upload</CardTitle>
            <CardDescription>Drag and drop or select an injury image for a safety check</CardDescription>
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

                {errorMessage ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                    {errorMessage}
                  </div>
                ) : null}

                {analyzing ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Loader2 className="size-4 animate-spin" />
                      Checking injury risk...
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ) : !result ? (
                  <Button
                    onClick={handleAnalyze}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Stethoscope className="mr-2 size-4" />
                    Check Injury
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
                    {result.urgency.toUpperCase()} RISK
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
                  Immediate Safety Steps
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
                  Helpful Items
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
              Call Emergency Help
            </Button>
          </div>
        ) : (
          <Card className="flex min-h-75 items-center justify-center border-border/50 bg-card/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-center p-8">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary/50">
                <Stethoscope className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Upload an image and run safety check to see guidance here</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
