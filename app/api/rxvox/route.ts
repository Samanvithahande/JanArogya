import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const backend = process.env.BACKEND_URL ?? 'http://127.0.0.1:5000'

  const formData = await request.formData()

  const resp = await fetch(`${backend}/rxvox`, {
    method: 'POST',
    body: formData as any,
  })

  const text = await resp.text()
  const contentType = resp.headers.get('content-type') || 'application/json'

  return new Response(text, {
    status: resp.status,
    headers: {
      'content-type': contentType,
    },
  })
}
