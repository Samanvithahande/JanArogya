"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Languages, ShieldPlus, Volume2 } from "lucide-react"
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
      <Card className="group landing-glass relative overflow-hidden border-primary/15 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15">
        <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <Badge variant="secondary" className={badgeColor}>
              {badge}
            </Badge>
          </div>
          <CardTitle className="font-display pt-4 text-2xl text-card-foreground">{title}</CardTitle>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>
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
    title: "Injury Safety Check",
    description: "Quickly check injury seriousness from a photo and see clear next steps.",
    icon: <Activity className="size-6" />,
    badge: "Critical",
    badgeColor: "bg-destructive/15 text-red-300 border-destructive/30",
    details: [
      "Severity scoring (1-10)",
      "Color-coded urgency indicator",
      "Emergency flag system",
      "Immediate action recommendations",
    ],
  },
  {
    title: "Language Note Helper",
    description: "Converts spoken health details into simple notes across multiple Indian languages.",
    icon: <Languages className="size-6" />,
    badge: "AI Powered",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    details: [
      "Audio waveform visualization",
      "Automatic language detection",
      "Structured medical summaries",
      "Multi-language translation",
    ],
  },
  {
    title: "Rx Voice Guide",
    description: "Reads medicine instructions aloud so you can follow dosage clearly at home.",
    icon: <Volume2 className="size-6" />,
    badge: "Voice",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
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
    <section id="features" className="relative px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            Core Modules
          </Badge>
          <h2 className="font-display text-3xl tracking-tight text-foreground text-balance md:text-5xl">
            Three brilliant modules. One seamless care experience.
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Crafted for rural users with clear language, fast guidance, and people-first design.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-center text-sm text-primary">
          <ShieldPlus className="size-4 shrink-0" />
          Guidance support only. For danger signs or severe symptoms, contact emergency services immediately.
        </div>
      </div>
    </section>
  )
}
