"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  // Hide back button on the dashboard root
  if (pathname === "/dashboard" || pathname === "/dashboard/") return null

  return (
    <div className={className}>
      <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
    </div>
  )
}
