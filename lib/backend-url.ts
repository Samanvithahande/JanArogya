function normalizeBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "")
}

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

export function resolveBackendBaseUrl(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE?.trim()

  const candidates = [
    process.env.BACKEND_URL,
    process.env.API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    apiBase && isAbsoluteHttpUrl(apiBase) ? apiBase : undefined,
  ]

  const found = candidates.find((value) => Boolean(value && value.trim()))
  if (found) return normalizeBaseUrl(found)

  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:5000"
  }

  return ""
}

export function backendEnvHelpText(): string {
  return "Set BACKEND_URL (recommended) or NEXT_PUBLIC_API_URL to your Python backend base URL in deployment env."
}
