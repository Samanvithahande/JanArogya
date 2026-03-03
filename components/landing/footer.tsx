import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
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
          <Link href="#" className="transition-colors hover:text-foreground">Privacy</Link>
          <Link href="#" className="transition-colors hover:text-foreground">Terms</Link>
          <Link href="#" className="transition-colors hover:text-foreground">Contact</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          {"Right Care. Right Now."}
        </p>
      </div>
    </footer>
  )
}
