"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/components/i18n/language-provider"

const languageOptions = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "kn", label: "ಕನ್ನಡ" },
] as const

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div data-no-translate="true" className="fixed bottom-4 right-4 z-[60] rounded-2xl border border-primary/25 bg-background/90 p-2 shadow-xl backdrop-blur-md">
      <div className="mb-1 flex items-center gap-2 px-2 py-1 text-xs font-medium text-primary">
        <Languages className="size-3.5" />
        Language
      </div>
      <div className="flex items-center gap-1">
        {languageOptions.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
              language === item.code
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-foreground hover:bg-secondary"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
