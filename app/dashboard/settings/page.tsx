"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { ensureUserProfile } from "@/lib/supabase/app-data"

export default function SettingsPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [emergencyAlerts, setEmergencyAlerts] = useState(true)
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [audioAutoplay, setAudioAutoplay] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const loadSettings = useCallback(async () => {
    if (!supabase) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
    setUserId(user.id)
    setEmail(user.email || "")

    await ensureUserProfile(supabase, user)

    const { data } = await supabase
      .from("profiles")
      .select("first_name,last_name,location,default_language,emergency_alerts_enabled,auto_translate_enabled,audio_autoplay_enabled")
      .eq("user_id", user.id)
      .single()

    if (!data) return

    setFirstName(data.first_name || "")
    setLastName(data.last_name || "")
    setLocation(data.location || "")
    setDefaultLanguage(data.default_language || "en")
    setEmergencyAlerts(Boolean(data.emergency_alerts_enabled))
    setAutoTranslate(Boolean(data.auto_translate_enabled))
    setAudioAutoplay(Boolean(data.audio_autoplay_enabled))
  }, [supabase])

  useEffect(() => {
    void loadSettings()
  }, [loadSettings])

  useEffect(() => {
    if (!supabase || !userId) return

    const channel = supabase
      .channel(`settings-live-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles", filter: `user_id=eq.${userId}` },
        () => void loadSettings()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadSettings, supabase, userId])

  const saveChanges = async () => {
    if (!supabase || !userId) return

    setSaving(true)
    setSaveMessage("")

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        location,
        default_language: defaultLanguage,
        emergency_alerts_enabled: emergencyAlerts,
        auto_translate_enabled: autoTranslate,
        audio_autoplay_enabled: audioAutoplay,
      })
      .eq("user_id", userId)

    setSaving(false)
    setSaveMessage(error ? "Failed to save changes. Please retry." : "Settings saved successfully.")
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, language, and personal preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Profile</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-secondary/30" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-secondary/30" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input value={email} disabled className="bg-secondary/30" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Your Area</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-secondary/30" />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Preferences</CardTitle>
          <CardDescription>Configure application behavior</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Default Language</p>
              <p className="text-xs text-muted-foreground">Preferred language for notes and medicine voice</p>
            </div>
            <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
              <SelectTrigger className="w-40 bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-border/50" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Emergency Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified for urgent injury warnings</p>
            </div>
            <Switch checked={emergencyAlerts} onCheckedChange={setEmergencyAlerts} />
          </div>

          <Separator className="bg-border/50" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-translate Summaries</p>
              <p className="text-xs text-muted-foreground">Automatically translate summaries to your language</p>
            </div>
            <Switch checked={autoTranslate} onCheckedChange={setAutoTranslate} />
          </div>

          <Separator className="bg-border/50" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Audio Auto-play</p>
              <p className="text-xs text-muted-foreground">Auto-play medicine audio instructions</p>
            </div>
            <Switch checked={audioAutoplay} onCheckedChange={setAudioAutoplay} />
          </div>
        </CardContent>
      </Card>

      {saveMessage ? <p className="text-xs text-muted-foreground">{saveMessage}</p> : null}

      <Button onClick={saveChanges} disabled={saving} className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
        <Save className="mr-2 size-4" />
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
