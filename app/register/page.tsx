"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LanguageDropdown } from "@/components/i18n/language-dropdown"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Eye, EyeOff, Languages, MailCheck, Sparkles, UserPlus, Waves } from "lucide-react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("self")
  const [errorMessage, setErrorMessage] = useState("")
  const [showVerifyPopup, setShowVerifyPopup] = useState(false)
  const [redirectSeconds, setRedirectSeconds] = useState(5)
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  useEffect(() => {
    if (!showVerifyPopup) {
      return
    }

    setRedirectSeconds(5)

    const intervalId = window.setInterval(() => {
      setRedirectSeconds((prev) => (prev > 1 ? prev - 1 : 1))
    }, 1000)

    const redirectId = window.setTimeout(() => {
      router.push("/login")
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(redirectId)
    }
  }, [showVerifyPopup, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage("")
    setShowVerifyPopup(false)
    setLoading(true)

    if (!supabase) {
      setErrorMessage("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
          location,
          role,
        },
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    if (!data.session) {
      setShowVerifyPopup(true)
      setLoading(false)
      return
    }

    router.refresh()
    router.push("/dashboard")
  }

  return (
    <div className="landing-page relative flex min-h-screen items-center overflow-hidden px-4 py-8 md:px-6 md:py-12">
      <div className="absolute right-4 top-4 z-20">
        <LanguageDropdown compact />
      </div>

      <div className="absolute right-[10%] top-6 size-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-8 left-[7%] size-96 rounded-full bg-chart-2/15 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="landing-glass border-primary/20 shadow-2xl shadow-primary/15 backdrop-blur-xl">
          <CardHeader className="space-y-4 text-center">
            <Link href="/" className="mx-auto w-fit">
              <Image
                src="/JANAROGYAA.png"
                alt="JanArogya Logo"
                width={170}
                height={50}
                className="mx-auto h-10 w-auto"
              />
            </Link>
            <div>
              <CardTitle className="font-display text-3xl text-card-foreground">Create Account</CardTitle>
              <CardDescription className="mt-2">Join JanArogya and get simple personal health guidance</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First"
                    required
                    className="h-11 border-primary/20 bg-background/70"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last"
                    required
                    className="h-11 border-primary/20 bg-background/70"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-11 border-primary/20 bg-background/70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Your Area</Label>
                <Input
                  id="location"
                  placeholder="Your location"
                  required
                  className="h-11 border-primary/20 bg-background/70"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Using As</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-11 border-primary/20 bg-background/70">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Myself</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    className="h-11 border-primary/20 bg-background/70 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
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
                Safe signup built for rural individual users.
              </div>

              {errorMessage ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                  {errorMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                className="mt-2 h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="size-4" />
                    Create Account
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <Card className="landing-shell hidden border-primary/20 p-2 lg:block">
          <CardContent className="h-full rounded-3xl border border-border/40 bg-background/75 p-8 backdrop-blur-lg">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-primary">
                  <Sparkles className="size-3.5" />
                  Personal Onboarding
                </div>
                <h1 className="font-display text-4xl leading-tight text-foreground">
                  Start using safer, faster, people-friendly health support.
                </h1>
                <p className="mt-4 max-w-md text-muted-foreground">
                  Set up your account once and unlock injury checks, multilingual note support, and voice guidance for medicines.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card/70 p-4">
                  <Languages className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Multilingual support</p>
                    <p className="text-xs text-muted-foreground">Designed for real conversations across local languages.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card/70 p-4">
                  <Waves className="mt-0.5 size-5 text-chart-3" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Faster workflow</p>
                    <p className="text-xs text-muted-foreground">Reduce confusion and improve clarity during urgent health moments.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showVerifyPopup ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/65 p-4 backdrop-blur-sm">
          <div className="landing-glass w-full max-w-md rounded-3xl border border-primary/25 bg-background/90 p-6 shadow-2xl shadow-primary/20 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-2.5">
                <MailCheck className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground">Check your email</h3>
                <p className="text-xs text-muted-foreground">Verification link has been sent.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Please verify your account from your inbox, then sign in to continue.
            </p>

            <div className="mt-5 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm text-primary">
              Redirecting to login in {redirectSeconds}s...
            </div>

            <Button
              onClick={() => router.push("/login")}
              className="mt-4 h-10 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Go to Login Now
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
