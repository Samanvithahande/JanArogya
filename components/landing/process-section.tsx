"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AudioLines, BrainCircuit, ChevronRight, Languages, ShieldCheck, Stethoscope, Waves } from "lucide-react"

const flowSteps = [
  {
    title: "Capture",
    description: "Upload wound photos or prescription notes in seconds using guided prompts.",
    icon: <Activity className="size-5" />,
  },
  {
    title: "Understand",
    description: "AI detects severity, language context, and medical entities for cleaner decision support.",
    icon: <BrainCircuit className="size-5" />,
  },
  {
    title: "Act",
    description: "Get structured care steps, multilingual summaries, and patient-friendly voice output.",
    icon: <AudioLines className="size-5" />,
  },
]

const impactStats = [
  { value: "92%", label: "faster first triage response" },
  { value: "16+", label: "Indian language support" },
  { value: "24/7", label: "field-ready assistance" },
  { value: "10k+", label: "consultations supported" },
]

export function CareFlowSection() {
  return (
    <section id="workflow" className="relative px-6 py-24">
      <div className="landing-shell mx-auto max-w-7xl rounded-4xl border border-primary/15 p-8 md:p-12">
        <div className="mb-10 flex flex-col gap-4 md:max-w-2xl">
          <Badge className="w-fit border-0 bg-primary/15 px-3 py-1 text-primary">Smart Care Flow</Badge>
          <h2 className="font-display text-3xl leading-tight text-foreground md:text-5xl">
            From village clinic chaos to calm, guided care in one workflow.
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            JanArogya is designed for real field conditions: poor connectivity, multiple dialects, and urgent decisions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {flowSteps.map((step, index) => (
            <Card key={step.title} className="landing-glass border-primary/15">
              <CardHeader>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">{step.icon}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 0{index + 1}</span>
                </div>
                <CardTitle className="text-2xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3 text-muted-foreground">
                <p>{step.description}</p>
                {index < flowSteps.length - 1 && <ChevronRight className="hidden size-5 shrink-0 text-primary/60 md:block" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ImpactSection() {
  return (
    <section id="impact" className="relative px-6 pb-24">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="landing-glass border-primary/20 p-2">
          <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div className="space-y-4">
              <Badge className="w-fit border-0 bg-emerald-500/15 text-emerald-400">Trusted In The Field</Badge>
              <h3 className="font-display text-3xl text-foreground md:text-4xl">Built for frontline teams and people first outcomes.</h3>
              <p className="text-muted-foreground">
                We combine trauma triage, voice prescriptions, and multilingual medical notes in one lightweight experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {impactStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur">
                  <p className="font-display text-3xl text-foreground">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="landing-glass border-primary/20">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Why Health Workers Love It</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/65 p-4">
              <ShieldCheck className="mt-0.5 size-5 text-emerald-400" />
              <div>
                <p className="font-medium text-foreground">Safer Decisions</p>
                <p className="text-sm text-muted-foreground">Severity hints and emergency flags reduce missed critical cases.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/65 p-4">
              <Languages className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Language Comfort</p>
                <p className="text-sm text-muted-foreground">Patients hear medicine instructions in familiar language and tone.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/65 p-4">
              <Waves className="mt-0.5 size-5 text-chart-3" />
              <div>
                <p className="font-medium text-foreground">Faster Handoffs</p>
                <p className="text-sm text-muted-foreground">Structured summaries make referrals cleaner between rural and urban centers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/65 p-4">
              <Stethoscope className="mt-0.5 size-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">Less Admin Overload</p>
                <p className="text-sm text-muted-foreground">Field staff spend less time typing and more time treating patients.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
