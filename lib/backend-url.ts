function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "")
}

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

function normalizeHost(rawHost: string): string {
  const first = rawHost.split(",")[0]?.trim().toLowerCase() ?? ""
  if (!first) return ""

  // Remove port when present (example: janarogya.vercel.app:443)
  return first.replace(/:\d+$/, "")
}

const KNOWN_BACKEND_BY_FRONTEND_HOST: Record<string, string> = {
  "janarogya.vercel.app": "https://janarogya.onrender.com",
}

function getRequestHost(request?: Request): string {
  if (!request) return ""

  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = request.headers.get("host")

  const normalized = normalizeHost(forwardedHost || host || "")
  if (normalized) return normalized

  // Fallback: derive host from Origin header when available.
  const origin = request.headers.get("origin")
  if (!origin) return ""

  try {
    return normalizeHost(new URL(origin).host)
  } catch {
    return ""
  }
}

function inferBackendFromRequestHost(request?: Request): string {
  const host = getRequestHost(request)
  if (!host) return ""

  if (KNOWN_BACKEND_BY_FRONTEND_HOST[host]) {
    return KNOWN_BACKEND_BY_FRONTEND_HOST[host]
  }

  // Vercel preview URLs for this project: janarogya-*.vercel.app
  if (/^janarogya-[a-z0-9-]+\.vercel\.app$/i.test(host)) {
    return "https://janarogya.onrender.com"
  }

  return ""
}

export function resolveBackendBaseUrl(request?: Request): string {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE?.trim()
  const inferredFromHost = inferBackendFromRequestHost(request)

  const candidates = [
    process.env.BACKEND_URL,
    process.env.API_URL,
    process.env.BACKEND_FALLBACK_URL,
    process.env.NEXT_PUBLIC_BACKEND_FALLBACK_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    apiBase && isAbsoluteHttpUrl(apiBase) ? apiBase : undefined,
    inferredFromHost,
  ]

  const found = candidates.find((value) => Boolean(value && value.trim()))
  if (found) return normalizeBaseUrl(found)

  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:5000"
  }

  return ""
}

export function backendEnvHelpText(): string {
  return "Set BACKEND_URL (recommended), BACKEND_FALLBACK_URL, or NEXT_PUBLIC_API_URL to your Python backend base URL in deployment env."
}
