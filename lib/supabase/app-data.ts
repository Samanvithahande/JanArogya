import type { SupabaseClient, User } from "@supabase/supabase-js"

export type Urgency = "low" | "medium" | "high" | "critical"

export type TraumaRecord = {
  id: string
  severity: number
  urgency: Urgency
  actions: string[]
  equipment: string[]
  diagnosis: string
  created_at: string
}

export type ScribeRecord = {
  id: string
  language: string
  main_issue: string
  symptoms: string[]
  history: string
  risk_notes: string
  care_plan: string[]
  next_steps: string
  simple_summary?: string | null
  created_at: string
}

export type RxRecord = {
  id: string
  language: string
  medicines: Array<{
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }>
  created_at: string
}

export async function ensureUserProfile(client: SupabaseClient, user: User) {
  const metadata = user.user_metadata ?? {}
  const firstName = (metadata.first_name as string | undefined)?.trim() || ""
  const lastName = (metadata.last_name as string | undefined)?.trim() || ""
  const location = (metadata.location as string | undefined)?.trim() || ""

  await client.from("profiles").upsert(
    {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      location,
    },
    { onConflict: "user_id", ignoreDuplicates: false }
  )
}

export async function uploadFileForUser(
  client: SupabaseClient,
  bucket: "trauma-images" | "scribe-audio" | "rx-prescriptions",
  userId: string,
  file: File
) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${userId}/${Date.now()}-${sanitizedName}`

  const { error } = await client.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return {
    path,
    publicUrl: data.publicUrl,
  }
}

export async function createActivityLog(
  client: SupabaseClient,
  payload: {
    userId: string
    module: string
    action: string
    metadata?: Record<string, unknown>
  }
) {
  await client.from("activity_logs").insert({
    user_id: payload.userId,
    module: payload.module,
    action: payload.action,
    metadata: payload.metadata ?? {},
  })
}

export async function createNotification(
  client: SupabaseClient,
  payload: {
    userId: string
    title: string
    message: string
    kind: string
    relatedTable?: string
    relatedId?: string
  }
) {
  await client.from("notifications").insert({
    user_id: payload.userId,
    title: payload.title,
    message: payload.message,
    kind: payload.kind,
    related_table: payload.relatedTable,
    related_id: payload.relatedId,
  })
}
