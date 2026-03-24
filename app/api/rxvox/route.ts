import { NextResponse } from 'next/server'
import { backendEnvHelpText, resolveBackendBaseUrl } from '@/lib/backend-url'

export async function POST(request: Request) {
  const backend = resolveBackendBaseUrl(request)

  if (!backend) {
    return NextResponse.json(
      {
        error: 'Backend URL not configured',
        details: backendEnvHelpText(),
      },
      { status: 500 }
    )
  }

  const backendBase = backend.replace(/\/+$/, '')

  try {
    const formData = await request.formData()

    const endpoints = [`${backendBase}/rxvox`, `${backendBase}/api/rxvox`]
    let resp: Response | null = null
    for (const endpoint of endpoints) {
      const candidate = await fetch(endpoint, {
        method: 'POST',
        body: formData as any,
      })
      resp = candidate
      if (candidate.status !== 404) break
    }

    if (!resp) {
      throw new Error('No backend response')
    }

    const text = await resp.text()
    const contentType = resp.headers.get('content-type') || 'application/json'

    return new Response(text, {
      status: resp.status,
      headers: {
        'content-type': contentType,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown backend error'
    return NextResponse.json(
      {
        error: 'Backend service unavailable',
        details: message,
        backend: backendBase,
      },
      { status: 503 }
    )
  }
}
