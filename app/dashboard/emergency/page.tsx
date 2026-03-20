"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneCall, MapPin, Shield, LifeBuoy, Users } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Contact = {
  id: string
  category: "emergency_services" | "hospitals" | "poison_control" | "helplines"
  name: string
  phone: string
}

export default function EmergencyContactsPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const loadContacts = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from("emergency_contacts")
      .select("id,category,name,phone,is_global,user_id")
      .or(`is_global.eq.true,user_id.eq.${user.id}`)
      .order("created_at", { ascending: true })

    setContacts((data ?? []) as Contact[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    void loadContacts()
  }, [loadContacts])

  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel("emergency-contacts-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "emergency_contacts" }, () => void loadContacts())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadContacts, supabase])

  const emergencyServices = contacts.filter((item) => item.category === "emergency_services")
  const hospitals = contacts.filter((item) => item.category === "hospitals")
  const poisonControl = contacts.filter((item) => item.category === "poison_control")
  const helplines = contacts.filter((item) => item.category === "helplines")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Emergency Help Contacts</h1>
        <p className="text-muted-foreground">Quick access to urgent phone numbers for your personal emergencies.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PhoneCall className="size-4" /> Emergency Services</CardTitle>
            <CardDescription>Police, Fire and Ambulance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {emergencyServices.map((c) => (
                <a key={c.name} href={`tel:${c.phone}`} className="flex items-center justify-between rounded-md p-3 hover:bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <Shield className="size-4 text-destructive-foreground" />
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.phone}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Call</Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="size-4" /> Nearby Hospitals</CardTitle>
            <CardDescription>Nearby hospitals and emergency centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {hospitals.map((c) => (
                <a key={c.name} href={`tel:${c.phone}`} className="flex items-center justify-between rounded-md p-3 hover:bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <Users className="size-4 text-primary" />
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.phone}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Call</Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LifeBuoy className="size-4" /> Poison Control</CardTitle>
            <CardDescription>Immediate assistance for poisoning incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {poisonControl.map((c) => (
                <a key={c.name} href={`tel:${c.phone}`} className="flex items-center justify-between rounded-md p-3 hover:bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <LifeBuoy className="size-4 text-warning-foreground" />
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.phone}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Call</Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="size-4" /> Helplines</CardTitle>
            <CardDescription>Mental health, women and child helplines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {helplines.map((c) => (
                <a key={c.name} href={`tel:${c.phone}`} className="flex items-center justify-between rounded-md p-3 hover:bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <Users className="size-4 text-chart-2" />
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.phone}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Call</Button>
                </a>
              ))}

              {loading ? <p className="text-xs text-muted-foreground px-2">Loading contacts...</p> : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
