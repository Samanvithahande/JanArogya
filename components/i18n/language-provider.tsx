"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { AppLanguage, getDictionaryTranslation, getTextCore, translateTextPreservingWhitespace } from "@/lib/i18n"

type LanguageContextValue = {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const textNodeOriginal = new WeakMap<Text, string>()

type RuntimeTranslations = Record<string, string>

function shouldSkipTextNode(node: Text): boolean {
  const parent = node.parentElement
  if (!parent) return true
  if (parent.closest("[data-no-translate='true']")) return true

  const tag = parent.tagName
  return ["SCRIPT", "STYLE", "CODE", "PRE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(tag)
}

function applyTranslationToTree(
  root: Node,
  language: AppLanguage,
  runtimeTranslations: RuntimeTranslations,
  missingTexts: Set<string>
) {
  if (!(root instanceof Element) && !(root instanceof Document) && !(root instanceof DocumentFragment)) {
    return
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let current: Node | null = walker.nextNode()

  while (current) {
    const textNode = current as Text
    if (!shouldSkipTextNode(textNode)) {
      const original = textNodeOriginal.get(textNode) ?? textNode.textContent ?? ""
      if (!textNodeOriginal.has(textNode)) {
        textNodeOriginal.set(textNode, original)
      }

      const { core } = getTextCore(original)
      if (language !== "en" && core) {
        const known = getDictionaryTranslation(core, language) ?? runtimeTranslations[core]
        if (!known) {
          missingTexts.add(core)
        }
      }

      const translated = translateTextPreservingWhitespace(original, language, runtimeTranslations)
      if ((textNode.textContent ?? "") !== translated) {
        textNode.textContent = translated
      }
    }
    current = walker.nextNode()
  }

  if (root instanceof Element || root instanceof Document) {
    const elements = root instanceof Document ? root.querySelectorAll("*") : root.querySelectorAll("*")
    elements.forEach((el) => {
      if (el.closest("[data-no-translate='true']")) return

      const attrs = ["placeholder", "aria-label", "title"]
      attrs.forEach((attr) => {
        const value = el.getAttribute(attr)
        if (!value) return

        const originalAttr = `data-i18n-${attr}-original`
        const original = el.getAttribute(originalAttr) ?? value
        if (!el.hasAttribute(originalAttr)) {
          el.setAttribute(originalAttr, original)
        }

        const { core } = getTextCore(original)
        if (language !== "en" && core) {
          const known = getDictionaryTranslation(core, language) ?? runtimeTranslations[core]
          if (!known) {
            missingTexts.add(core)
          }
        }

        const translated = translateTextPreservingWhitespace(original, language, runtimeTranslations)
        if (translated !== value) {
          el.setAttribute(attr, translated)
        }
      })
    })
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>("en")
  const [runtimeTranslations, setRuntimeTranslations] = useState<RuntimeTranslations>({})
  const isApplyingRef = useRef(false)
  const pendingTextsRef = useRef<Set<string>>(new Set())

  function loadRuntimeTranslations(lang: AppLanguage): RuntimeTranslations {
    if (lang === "en") return {}
    try {
      const raw = window.localStorage.getItem(`janarogya-runtime-translations-${lang}`)
      if (!raw) return {}
      const parsed = JSON.parse(raw) as RuntimeTranslations
      return parsed && typeof parsed === "object" ? parsed : {}
    } catch {
      return {}
    }
  }

  function saveRuntimeTranslations(lang: AppLanguage, map: RuntimeTranslations) {
    if (lang === "en") return
    window.localStorage.setItem(`janarogya-runtime-translations-${lang}`, JSON.stringify(map))
  }

  async function fetchMissingTranslations(lang: AppLanguage, texts: string[]) {
    if (lang === "en" || texts.length === 0) return

    const target = lang
    const candidates = texts.filter((text) => {
      const trimmed = text.trim()
      if (!trimmed) return false
      if (runtimeTranslations[trimmed]) return false
      if (pendingTextsRef.current.has(trimmed)) return false
      return true
    })

    if (candidates.length === 0) return
    candidates.forEach((text) => pendingTextsRef.current.add(text))

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, texts: candidates }),
      })

      if (!res.ok) return
      const data = (await res.json()) as { translations?: RuntimeTranslations }
      const received = data.translations ?? {}

      if (Object.keys(received).length === 0) return

      setRuntimeTranslations((prev) => {
        const merged = { ...prev, ...received }
        saveRuntimeTranslations(lang, merged)
        return merged
      })
    } catch {
      // Ignore network errors and keep dictionary translations.
    } finally {
      candidates.forEach((text) => pendingTextsRef.current.delete(text))
    }
  }

  function applyNow(lang: AppLanguage, runtime: RuntimeTranslations) {
    isApplyingRef.current = true
    const missingTexts = new Set<string>()
    applyTranslationToTree(document.body, lang, runtime, missingTexts)
    isApplyingRef.current = false

    if (lang !== "en" && missingTexts.size > 0) {
      fetchMissingTranslations(lang, [...missingTexts])
    }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("janarogya-language") as AppLanguage | null
    if (saved === "en" || saved === "hi" || saved === "kn") {
      setLanguage(saved)
    }
  }, [])

  useEffect(() => {
    setRuntimeTranslations(loadRuntimeTranslations(language))
  }, [language])

  useEffect(() => {
    window.localStorage.setItem("janarogya-language", language)
    document.documentElement.lang = language

    applyNow(language, runtimeTranslations)

    const observer = new MutationObserver((mutations) => {
      if (isApplyingRef.current) return
      isApplyingRef.current = true

      const missingTexts = new Set<string>()

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            applyTranslationToTree(node, language, runtimeTranslations, missingTexts)
          })
        }
        if (mutation.type === "characterData" && mutation.target.parentNode) {
          applyTranslationToTree(mutation.target.parentNode, language, runtimeTranslations, missingTexts)
        }
      }

      isApplyingRef.current = false

      if (language !== "en" && missingTexts.size > 0) {
        fetchMissingTranslations(language, [...missingTexts])
      }
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    })

    return () => observer.disconnect()
  }, [language, runtimeTranslations])

  const value = useMemo(() => ({ language, setLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider")
  }
  return context
}
