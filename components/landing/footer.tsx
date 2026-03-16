import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-primary/20 bg-card/25 px-6 py-16">
      <div className="mx-auto mb-10 max-w-7xl rounded-3xl border border-primary/20 bg-background/70 p-6 backdrop-blur-xl md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.15em] text-primary">Build Better Care Access</p>
            <h3 className="font-display mt-2 text-3xl leading-tight text-foreground md:text-4xl">
              Equip every frontline worker with AI that feels human.
            </h3>
          </div>
          <Button asChild size="lg" className="h-12 rounded-xl bg-primary px-6 text-primary-foreground hover:bg-primary/90">
            <Link href="/register">
              Start Free
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JanArogya%20Logo%20With%20No%20Bg%20%28Black%20Bg%29-YlntpvuipivBOHdn8EOJj1uOQqnw1P.png"
            alt="JanArogya Logo"
            width={120}
            height={36}
            className="h-7 w-auto"
          />
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="#workflow" className="transition-colors hover:text-foreground">Workflow</Link>
          <Link href="#impact" className="transition-colors hover:text-foreground">Impact</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Right Care. Right Now.
        </p>
      </div>
    </footer>
  )
}
