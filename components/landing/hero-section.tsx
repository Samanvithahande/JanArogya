"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Activity, Mic } from "lucide-react"
import { useEffect, useState } from "react"

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-20 ${className}`} />
  )
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Background effects */}
      <FloatingOrb className="top-20 left-10 size-72 bg-primary animate-pulse" />
      <FloatingOrb className="bottom-20 right-10 size-96 bg-chart-3 animate-pulse delay-1000" />
      <FloatingOrb className="top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 bg-chart-2 animate-pulse delay-500" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-20 lg:flex-row lg:py-32">
        {/* Left content */}
        <div
          className={`flex max-w-2xl flex-1 flex-col gap-8 transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 w-fit">
            <Activity className="size-4 text-primary" />
            <span className="text-xs font-medium text-primary">AI-Powered Healthcare</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
            AI-Powered Rural Healthcare{" "}
            <span className="text-primary">Assistance</span>
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
            Empowering healthcare workers with intelligent trauma triage, multilingual medical scribe,
            and prescription voice support. Bringing advanced healthcare technology to every corner.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 glow-teal">
              <Link href="/dashboard">
                Launch Dashboard
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">View Modules</Link>
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">10K+</span>
              <span className="text-xs text-muted-foreground">Consultations</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">500+</span>
              <span className="text-xs text-muted-foreground">Health Workers</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">15+</span>
              <span className="text-xs text-muted-foreground">Languages</span>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div
          className={`relative flex flex-1 items-center justify-center transition-all delay-300 duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="relative size-80 md:size-96">
            {/* Central shield */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-card glow-teal flex size-48 items-center justify-center rounded-3xl md:size-56">
                <Shield className="size-20 text-primary md:size-24" strokeWidth={1} />
              </div>
            </div>

            {/* Orbiting cards */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="glass-card flex items-center gap-2 rounded-xl px-4 py-3">
                <Activity className="size-5 text-primary" />
                <span className="text-xs font-medium text-foreground">Trauma Triage</span>
              </div>
            </div>

            <div className="absolute top-1/2 -right-4 -translate-y-1/2 animate-bounce delay-300">
              <div className="glass-card flex items-center gap-2 rounded-xl px-4 py-3">
                <Mic className="size-5 text-chart-3" />
                <span className="text-xs font-medium text-foreground">Voice Rx</span>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 animate-bounce delay-700">
              <div className="glass-card flex items-center gap-2 rounded-xl px-4 py-3">
                <svg className="size-5 text-chart-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span className="text-xs font-medium text-foreground">Polyglot Scribe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
