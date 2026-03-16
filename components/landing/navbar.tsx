"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Sparkles, X } from "lucide-react"
import { useState } from "react"

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-primary/20 bg-background/70 px-4 py-3 backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JanArogya%20Logo%20With%20No%20Bg%20%28Black%20Bg%29-YlntpvuipivBOHdn8EOJj1uOQqnw1P.png"
            alt="JanArogya Logo"
            width={140}
            height={40}
            className="h-8 w-auto md:h-9"
          />
          <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary md:inline-flex">
            Rural AI Care
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#workflow" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Workflow
          </Link>
          <Link href="#impact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Impact
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild className="hover:bg-primary/10">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90">
            <Link href="/register">
              <Sparkles className="size-4" />
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-primary/20 bg-background/90 p-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="#features" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="#workflow" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Workflow
            </Link>
            <Link href="#impact" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
              Impact
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
