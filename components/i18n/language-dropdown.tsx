"use client"

import { Languages } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/i18n/language-provider"

const labels = {
  en: "English",
  hi: "हिंदी",
  kn: "ಕನ್ನಡ",
} as const

export function LanguageDropdown({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-no-translate="true"
          variant="outline"
          size={compact ? "sm" : "default"}
          className="border-primary/25 bg-background/70"
        >
          <Languages className="mr-2 size-4" />
          {labels[language]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-no-translate="true" className="w-36">
        <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("hi")}>हिंदी</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("kn")}>ಕನ್ನಡ</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
