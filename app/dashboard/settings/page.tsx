"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>First Name</Label>
              <Input defaultValue="Dr. Rajan" className="bg-secondary/30" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Last Name</Label>
              <Input defaultValue="Kumar" className="bg-secondary/30" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input defaultValue="rajan.kumar@health.org" className="bg-secondary/30" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Facility</Label>
            <Input defaultValue="Primary Health Center, Varanasi" className="bg-secondary/30" />
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
              <p className="text-xs text-muted-foreground">Preferred language for scribe and Rx-Vox</p>
            </div>
            <Select defaultValue="hi">
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
              <p className="text-xs text-muted-foreground">Get notified for critical trauma cases</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator className="bg-border/50" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-translate Summaries</p>
              <p className="text-xs text-muted-foreground">Automatically translate to preferred language</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator className="bg-border/50" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Audio Auto-play</p>
              <p className="text-xs text-muted-foreground">Auto-play audio instructions in Rx-Vox</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Button className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
        <Save className="mr-2 size-4" />
        Save Changes
      </Button>
    </div>
  )
}
