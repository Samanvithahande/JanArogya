"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { CheckCircle2, Eye, EyeOff, LogIn, ShieldCheck, Sparkles, Smartphone, Volume2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="landing-page relative flex min-h-screen items-center overflow-hidden px-4 py-8 md:px-6 md:py-12">
      <div className="absolute left-[10%] top-10 size-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-8 right-[8%] size-96 rounded-full bg-chart-3/15 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="landing-shell hidden border-primary/20 p-2 lg:block">
          <CardContent className="h-full rounded-3xl border border-border/40 bg-background/75 p-8 backdrop-blur-lg">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-primary">
                  <Sparkles className="size-3.5" />
                  Safe Rural Access
                </div>
                <h1 className="font-display text-4xl leading-tight text-foreground">
                  Welcome back to your personal health space.
                </h1>
                <p className="mt-4 max-w-md text-muted-foreground">
                  Continue injury checks, medicine voice guidance, and multilingual health notes from one secure place.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card/70 p-4">
                  <ShieldCheck className="mt-0.5 size-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Protected sessions</p>
                    <p className="text-xs text-muted-foreground">Your account and saved records stay private and protected.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card/70 p-4">
                  <Smartphone className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Simple mobile flow</p>
                    <p className="text-xs text-muted-foreground">Made for fast use even in low-network rural areas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card/70 p-4">
                  <Volume2 className="mt-0.5 size-5 text-chart-3" />
                  <div>
                    <p className="text-sm font-medium text-foreground">People-friendly communication</p>
                    <p className="text-xs text-muted-foreground">Voice and language features help everyone understand clearly.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="landing-glass border-primary/20 shadow-2xl shadow-primary/15 backdrop-blur-xl">
          <CardHeader className="space-y-4 text-center">
            <Link href="/" className="mx-auto w-fit">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JanArogya%20Logo%20With%20No%20Bg%20%28Black%20Bg%29-YlntpvuipivBOHdn8EOJj1uOQqnw1P.png"
                alt="JanArogya Logo"
                width={170}
                height={50}
                className="mx-auto h-10 w-auto"
              />
            </Link>
            <div>
              <CardTitle className="font-display text-3xl text-card-foreground">Welcome Back</CardTitle>
              <CardDescription className="mt-2">Sign in to continue using JanArogya for your personal health guidance</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-11 border-primary/20 bg-background/70"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="h-11 border-primary/20 bg-background/70 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-400" />
                Your session is encrypted and secure.
              </div>

              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="size-4" />
                    Sign In
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/register" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
