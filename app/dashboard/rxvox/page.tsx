"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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

type Medicine = {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

const mockMedicines: Medicine[] = [
  {
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times daily",
    duration: "7 days",
    instructions: "Take after meals with water",
  },
  {
    name: "Paracetamol",
    dosage: "650mg",
    frequency: "As needed (max 4/day)",
    duration: "5 days",
    instructions: "Take for fever or pain",
  },
  {
    name: "Pantoprazole",
    dosage: "40mg",
    frequency: "Once daily",
    duration: "14 days",
    instructions: "Take on empty stomach, 30 min before breakfast",
  },
  {
    name: "Cetirizine",
    dosage: "10mg",
    frequency: "Once daily at bedtime",
    duration: "10 days",
    instructions: "May cause drowsiness",
  },
]

export default function RxVoxPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [medicines, setMedicines] = useState<Medicine[] | null>(null)
  const [language, setLanguage] = useState("hi")
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

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
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected?.type.startsWith("image/")) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setMedicines(null)
    }
  }, [])

  const handleProcess = async () => {

    if (!file) return

    setProcessing(true)
    setProgress(20)

    try {

      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(`/api/rxvox`, {
        method: "POST",
        body: formData
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        console.error("/api/rxvox returned error:", res.status, text)
        setProgress(0)
        return
      }

      const contentType = res.headers.get("content-type") || ""
      let data: any = null

      if (contentType.includes("application/json")) {
        data = await res.json()
      } else {
        // Backend sometimes returns HTML error pages or raw text. Try to parse JSON, otherwise bail.
        const text = await res.text()
        try {
          data = JSON.parse(text)
        } catch (e) {
          console.error("Unexpected non-JSON response from /api/rxvox:", text)
          setProgress(0)
          return
        }
      }

      setMedicines(data?.medicines || [])
      setProgress(100)

    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const stopSpeech = () => {
    try {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    } catch (e) {
      console.error("stopSpeech failed", e)
    }
    utterRef.current = null
  }

  const speakText = (text: string, langCode: string) => {
    if (!synthRef.current) {
      console.error("SpeechSynthesis not available in this browser")
      return
    }

    stopSpeech()

    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = languageMap[langCode] || langCode
    utter.onend = () => {
      setPlayingIndex(null)
    }
    utter.onerror = (e) => {
      console.error("TTS error", e)
      setPlayingIndex(null)
    }

    utterRef.current = utter
    try {
      synthRef.current.speak(utter)
    } catch (e) {
      console.error("speak failed", e)
      setPlayingIndex(null)
    }
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
    const textParts = [med.name, med.dosage, med.frequency, med.duration, med.instructions].filter(Boolean)
    const text = textParts.join('. ')

    speakText(text, language)
  }

  const resetAll = () => {
    setFile(null)
    setPreview(null)
    setMedicines(null)
    setProgress(0)
    setPlayingIndex(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Rx-Vox</h1>
        <p className="text-muted-foreground">Scan medicine slips and convert to easy audio guidance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Upload Section */}
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
                      alt="Prescription"
                      className="h-48 w-full object-cover"
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
                  </div>
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

              {/* Language Selector */}
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

        {/* Results Section */}
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
                        <TableRow key={i} className="border-border/30 hover:bg-secondary/30">
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
                              {playingIndex === i ? (
                                <Pause className="size-3" />
                              ) : (
                                <Play className="size-3" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Instruction details */}
              {medicines.map((med, i) => (
                <Card key={i} className="border-border/50 bg-card/60 backdrop-blur-sm">
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePlay(i)}
                      className="gap-1.5"
                    >
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
