"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneCall, MapPin, Shield, LifeBuoy, Users } from "lucide-react"

const contacts = {
  emergencyServices: [
    { name: "Police", phone: "+91-100" },
    { name: "Fire", phone: "+91-101" },
    { name: "Ambulance", phone: "+91-102" },
  ],
  hospitals: [
    { name: "District Hospital", phone: "+91-98765-43210" },
    { name: "City General Hospital", phone: "+91-91234-56780" },
    { name: "Trauma Centre", phone: "+91-90000-11223" },
  ],
  poisonControl: [
    { name: "National Poison Control", phone: "+91-80000-12345" },
  ],
  helplines: [
    { name: "Mental Health Helpline", phone: "+91-91522-12345" },
    { name: "Women Helpline", phone: "+91-78290-00000" },
    { name: "Child Helpline", phone: "+91-1098" },
  ],
}

export default function EmergencyContactsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Emergency Contacts</h1>
        <p className="text-muted-foreground">Quick access to all critical contact numbers and helplines.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PhoneCall className="size-4" /> Emergency Services</CardTitle>
            <CardDescription>Police, Fire and Ambulance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {contacts.emergencyServices.map((c) => (
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
            <CardDescription>Local hospitals and trauma centres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {contacts.hospitals.map((c) => (
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
              {contacts.poisonControl.map((c) => (
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
              {contacts.helplines.map((c) => (
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
