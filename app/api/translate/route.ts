import { NextResponse } from "next/server"

type TranslateRequest = {
  target: "hi" | "kn"
  texts: string[]
}

async function translateText(text: string, target: "hi" | "kn"): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`

  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return text

  const data = (await res.json()) as unknown
  if (!Array.isArray(data) || !Array.isArray(data[0])) return text

  const translated = (data[0] as Array<Array<string>>)
    .map((segment) => segment[0] ?? "")
    .join("")
    .trim()

  return translated || text
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TranslateRequest
    const { target, texts } = body

    if (!target || !Array.isArray(texts)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    if (target !== "hi" && target !== "kn") {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 })
    }

    const uniqueTexts = [...new Set(texts.map((t) => (t || "").trim()).filter(Boolean))]
    const limited = uniqueTexts.slice(0, 200)

    const translatedPairs = await Promise.all(
      limited.map(async (text) => ({
        text,
        translated: await translateText(text, target),
      }))
    )

    const result: Record<string, string> = {}
    translatedPairs.forEach(({ text, translated }) => {
      result[text] = translated
    })

    return NextResponse.json({ translations: result })
  } catch {
    return NextResponse.json({ translations: {} }, { status: 200 })
  }
}
