"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Upload,
  Loader2,
  Volume2,
  ImageIcon,
  X,
  Pill,
  Clock,
  Calendar,
  Droplets,
  Play,
  Pause,
  Globe,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { createActivityLog, createNotification, uploadFileForUser } from "@/lib/supabase/app-data"

type Medicine = {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export default function RxVoxPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [medicines, setMedicines] = useState<Medicine[] | null>(null)
  const [language, setLanguage] = useState("hi")
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const loadLatestScan = useCallback(async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
    setUserId(user.id)

    const { data } = await supabase
      .from("rx_scans")
      .select("language,medicines")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data) return

    setLanguage(data.language || "hi")
    setMedicines(Array.isArray(data.medicines) ? (data.medicines as Medicine[]) : [])
  }, [supabase])

  useEffect(() => {
    void loadLatestScan()
  }, [loadLatestScan])

  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`rx-live-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rx_scans", filter: `user_id=eq.${userId}` },
        () => void loadLatestScan()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadLatestScan, supabase, userId])

  const languageMap: Record<string, string> = {
    en: "en-US",
    hi: "hi-IN",
    ta: "ta-IN",
    te: "te-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    kn: "kn-IN",
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type.startsWith("image/")) {
      setFile(droppedFile)
      setPreview(URL.createObjectURL(droppedFile))
      setMedicines(null)
      setErrorMessage("")
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected?.type.startsWith("image/")) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setMedicines(null)
      setErrorMessage("")
    }
  }, [])

  const handleProcess = async () => {
    if (!file) return

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
    setProgress(20)
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(`/api/rxvox`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Server responded ${res.status}: ${text}`)
      }

      const contentType = res.headers.get("content-type") || ""
      let data: any = null
      if (contentType.includes("application/json")) {
        data = await res.json()
      } else {
        const text = await res.text()
        data = JSON.parse(text)
      }

      const parsedMedicines = Array.isArray(data?.medicines) ? (data.medicines as Medicine[]) : []
      const uploaded = await uploadFileForUser(supabase, "rx-prescriptions", user.id, file)

      const insertRes = await supabase
        .from("rx_scans")
        .insert({
          user_id: user.id,
          image_path: uploaded.path,
          image_url: uploaded.publicUrl,
          language,
          medicines: parsedMedicines,
        })
        .select("id")
        .single()

      await createActivityLog(supabase, {
        userId: user.id,
        module: "rxvox",
        action: "Medicine slip scanned",
        metadata: {
          medicine_count: parsedMedicines.length,
        },
      })

      await createNotification(supabase, {
        userId: user.id,
        title: "Rx Processed",
        message: `${parsedMedicines.length} medicines extracted from your prescription scan.`,
        kind: "info",
        relatedTable: "rx_scans",
        relatedId: insertRes.data?.id,
      })

      setMedicines(parsedMedicines)
      setProgress(100)
    } catch (err) {
      console.error("Rx-Vox processing failed:", err)
      setErrorMessage("Unable to extract medicines right now. Please retry.")
      setProgress(0)
    } finally {
      setProcessing(false)
    }
  }

  const stopSpeech = () => {
    try {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    } catch {
      // no-op
    }
    utterRef.current = null
  }

  const speakText = (text: string, langCode: string) => {
    if (!synthRef.current) return

    stopSpeech()

    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = languageMap[langCode] || langCode
    utter.onend = () => setPlayingIndex(null)
    utter.onerror = () => setPlayingIndex(null)

    utterRef.current = utter
    synthRef.current.speak(utter)
  }

  const togglePlay = (index: number) => {
    if (!medicines) return

    if (playingIndex === index) {
      stopSpeech()
      setPlayingIndex(null)
      return
    }

    setPlayingIndex(index)
    const med = medicines[index]
    const text = [med.name, med.dosage, med.frequency, med.duration, med.instructions].filter(Boolean).join(". ")
    speakText(text, language)
  }

  const resetAll = () => {
    setFile(null)
    setPreview(null)
    setMedicines(null)
    setProgress(0)
    setPlayingIndex(null)
    setErrorMessage("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Rx-Vox</h1>
        <p className="text-muted-foreground">Scan medicine slips and convert to easy audio guidance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground">Prescription Upload</CardTitle>
              <CardDescription>Upload a medicine slip image to extract details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {!preview ? (
                <label
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 p-10 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Upload className="size-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Upload Prescription</p>
                    <p className="mt-1 text-xs text-muted-foreground">Drop image or click to browse</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="relative overflow-hidden rounded-xl border border-border/50">
                    <img src={preview} alt="Prescription" className="h-48 w-full object-cover" />
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
                  </div>

                  {errorMessage ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                      {errorMessage}
                    </div>
                  ) : null}

                  {processing ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="size-4 animate-spin" />
                        Running OCR extraction...
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  ) : !medicines ? (
                    <Button onClick={handleProcess} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Pill className="mr-2 size-4" />
                      Extract Medicines
                    </Button>
                  ) : null}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="size-3" />
                  Audio Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-secondary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                    <SelectItem value="mr">Marathi</SelectItem>
                    <SelectItem value="gu">Gujarati</SelectItem>
                    <SelectItem value="kn">Kannada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {medicines ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Extracted Medicines</h2>
                <Badge className="bg-success/15 text-success border-success/30" variant="outline">
                  {medicines.length} found
                </Badge>
              </div>

              <Card className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Medicine</TableHead>
                        <TableHead className="text-muted-foreground">Dosage</TableHead>
                        <TableHead className="text-muted-foreground">Frequency</TableHead>
                        <TableHead className="text-muted-foreground">Duration</TableHead>
                        <TableHead className="text-right text-muted-foreground">Audio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medicines.map((med, i) => (
                        <TableRow key={`${med.name}-${i}`} className="border-border/30 hover:bg-secondary/30">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Pill className="size-4 text-primary" />
                              <span className="font-medium text-foreground">{med.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-foreground">
                              <Droplets className="size-3 text-chart-2" />
                              {med.dosage}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="size-3" />
                              {med.frequency}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="size-3" />
                              {med.duration}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={playingIndex === i ? "default" : "ghost"}
                              onClick={() => togglePlay(i)}
                              className={playingIndex === i ? "bg-primary text-primary-foreground" : ""}
                            >
                              {playingIndex === i ? <Pause className="size-3" /> : <Play className="size-3" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {medicines.map((med, i) => (
                <Card key={`${med.name}-instruction-${i}`} className="border-border/50 bg-card/60 backdrop-blur-sm">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <Pill className="size-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{med.name}</span>
                        <p className="text-xs text-muted-foreground">{med.instructions}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => togglePlay(i)} className="gap-1.5">
                      <Volume2 className="size-3" />
                      {playingIndex === i ? "Playing..." : "Play"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="min-h-100 flex items-center justify-center border-border/50 bg-card/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-center p-8">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary/50">
                  <Volume2 className="size-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Upload a medicine slip to extract medicine details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
