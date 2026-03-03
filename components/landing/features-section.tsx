"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Mic, FileText, Upload, Languages, Volume2, AlertTriangle, AudioWaveform } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  badge: string
  badgeColor: string
  details: string[]
  index: number
}

function FeatureCard({ title, description, icon, badge, badgeColor, details, index }: FeatureCardProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <Badge variant="secondary" className={badgeColor}>
              {badge}
            </Badge>
          </div>
          <CardTitle className="pt-4 text-xl text-card-foreground">{title}</CardTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-col gap-2">
            {details.map((detail, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="size-1.5 rounded-full bg-primary/60" />
                {detail}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const features = [
  {
    title: "ET-AI Trauma Triage",
    description: "Upload injury images for AI-powered severity assessment with instant color-coded urgency indicators.",
    icon: <Activity className="size-6" />,
    badge: "Critical",
    badgeColor: "bg-destructive/10 text-destructive-foreground border-destructive/20",
    details: [
      "Severity scoring (1-10)",
      "Color-coded urgency indicator",
      "Emergency flag system",
      "Immediate action recommendations",
    ],
  },
  {
    title: "Polyglot Scribe",
    description: "Auto-detect languages and generate structured medical summaries from audio consultations.",
    icon: <Languages className="size-6" />,
    badge: "AI Powered",
    badgeColor: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    details: [
      "Audio waveform visualization",
      "Automatic language detection",
      "Structured medical summaries",
      "Multi-language translation",
    ],
  },
  {
    title: "Rx-Vox",
    description: "Scan prescriptions and convert them to audio instructions in the patient's preferred language.",
    icon: <Volume2 className="size-6" />,
    badge: "Voice",
    badgeColor: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    details: [
      "OCR prescription scanning",
      "Medicine extraction & listing",
      "Audio instruction playback",
      "Multi-language support",
    ],
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Core Modules
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Intelligent Healthcare Tools
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Three powerful AI modules designed to support healthcare workers in rural and underserved areas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
