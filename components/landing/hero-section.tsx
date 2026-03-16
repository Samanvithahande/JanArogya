"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Languages, Mic, Sparkles, TriangleAlert } from "lucide-react"
import { useEffect, useState } from "react"

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-20 ${className}`} />
  )
}

const miniHighlights = [
  "AI triage in under 30s",
  "Voice prescription in local language",
  "Auto-structured visit summaries",
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 md:pb-24 md:pt-36">
      <FloatingOrb className="-left-20 top-0 size-80 bg-primary" />
      <FloatingOrb className="right-0 top-32 size-96 bg-chart-3" />
      <FloatingOrb className="bottom-0 left-1/3 size-80 bg-chart-2" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_1fr]">
        <div
          className={`relative z-10 transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-primary">
            <Sparkles className="size-3.5" />
            AI Healthcare For Every Village
          </div>

          <h1 className="font-display text-4xl leading-[1.05] text-foreground text-balance md:text-6xl lg:text-7xl">
            Beautifully simple tools for
            <span className="landing-gradient-text block">life-critical care moments.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            JanArogya helps healthcare workers triage trauma, generate multilingual clinical notes, and explain medication clearly through voice.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild className="h-12 rounded-xl bg-primary px-6 text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90">
              <Link href="/dashboard">
                Launch Dashboard
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 rounded-xl border-primary/25 bg-background/60 px-6 hover:bg-primary/10">
              <Link href="#features">Explore Modules</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-2 sm:grid-cols-2">
            {miniHighlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`relative transition-all delay-200 duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="landing-shell relative rounded-[2rem] border border-primary/20 p-4 md:p-6">
            <div className="landing-grid-pattern absolute inset-0 rounded-[2rem]" />
            <div className="relative rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">Live Triage</span>
                <span className="text-xs text-muted-foreground">Updated just now</span>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-background/65 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <TriangleAlert className="size-4 text-warning" />
                    Severity: Moderate
                  </div>
                  <p className="text-sm text-muted-foreground">Suggested action: Clean wound, assess bleeding pattern, monitor vitals for 30 minutes.</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-background/65 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Languages className="size-4 text-primary" />
                      Scribe
                    </div>
                    <p className="text-xs text-muted-foreground">Hindi detected. Summary translated to English for referral.</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/65 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mic className="size-4 text-chart-3" />
                      Rx Voice
                    </div>
                    <p className="text-xs text-muted-foreground">Medication guide generated in Kannada with simple dosage prompts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
