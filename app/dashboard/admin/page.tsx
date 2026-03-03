"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Building2,
  Activity as ActivityIcon,
  Globe,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const users = [
  { name: "Dr. Rajan Kumar", email: "rajan@health.org", role: "Healthcare Worker", facility: "PHC Varanasi", status: "Active", lastLogin: "2 hrs ago" },
  { name: "Dr. Priya Sharma", email: "priya@health.org", role: "Healthcare Worker", facility: "CHC Lucknow", status: "Active", lastLogin: "5 hrs ago" },
  { name: "Admin Suresh", email: "suresh@health.org", role: "Admin", facility: "District Hospital", status: "Active", lastLogin: "1 day ago" },
  { name: "Dr. Anita Roy", email: "anita@health.org", role: "Healthcare Worker", facility: "PHC Patna", status: "Inactive", lastLogin: "5 days ago" },
  { name: "Dr. Mohan Das", email: "mohan@health.org", role: "Healthcare Worker", facility: "CHC Jaipur", status: "Active", lastLogin: "12 hrs ago" },
  { name: "Admin Lakshmi", email: "lakshmi@health.org", role: "Admin", facility: "State Office", status: "Active", lastLogin: "3 hrs ago" },
]

const facilities = [
  { name: "PHC Varanasi", location: "Varanasi, UP", users: 12, consultations: 834, status: "Active" },
  { name: "CHC Lucknow", location: "Lucknow, UP", users: 8, consultations: 612, status: "Active" },
  { name: "District Hospital Patna", location: "Patna, Bihar", users: 24, consultations: 1250, status: "Active" },
  { name: "PHC Jaipur", location: "Jaipur, Rajasthan", users: 6, consultations: 340, status: "Maintenance" },
]

const activityLogs = [
  { user: "Dr. Rajan", action: "Submitted trauma assessment", module: "Trauma Triage", time: "12 min ago" },
  { user: "Dr. Priya", action: "Transcribed consultation", module: "Polyglot Scribe", time: "34 min ago" },
  { user: "Admin Suresh", action: "Generated monthly report", module: "Reports", time: "1 hr ago" },
  { user: "Dr. Mohan", action: "Scanned prescription", module: "Rx-Vox", time: "2 hrs ago" },
  { user: "Dr. Anita", action: "Flagged emergency case", module: "Trauma Triage", time: "3 hrs ago" },
  { user: "Admin Lakshmi", action: "Added new facility", module: "Admin", time: "5 hrs ago" },
  { user: "Dr. Rajan", action: "Exported scribe summary", module: "Polyglot Scribe", time: "6 hrs ago" },
]

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, facilities, and system settings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Multi-language</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Total Users</span>
              <p className="text-xl font-bold text-card-foreground">48</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-chart-2/10">
              <Building2 className="size-5 text-chart-2" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Facilities</span>
              <p className="text-xl font-bold text-card-foreground">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-success/10">
              <UserCheck className="size-5 text-success" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Active Now</span>
              <p className="text-xl font-bold text-card-foreground">14</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-chart-3/10">
              <ActivityIcon className="size-5 text-chart-3" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Actions Today</span>
              <p className="text-xl font-bold text-card-foreground">127</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="flex flex-col gap-4">
        <TabsList className="w-fit bg-secondary/50">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground">User Management</CardTitle>
                <CardDescription>Manage healthcare workers and admin access</CardDescription>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add User
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Facility</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Last Login</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email} className="border-border/30 hover:bg-secondary/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          user.role === "Admin"
                            ? "border-primary/30 text-primary"
                            : "border-border/60 text-muted-foreground"
                        }>
                          {user.role === "Admin" && <Shield className="mr-1 size-3" />}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.facility}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          user.status === "Active"
                            ? "bg-success/15 text-success"
                            : "bg-muted text-muted-foreground"
                        }>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive-foreground">
                              {user.status === "Active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities">
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground">Facility Overview</CardTitle>
                <CardDescription>All registered healthcare facilities</CardDescription>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add Facility
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Facility</TableHead>
                    <TableHead className="text-muted-foreground">Location</TableHead>
                    <TableHead className="text-muted-foreground">Users</TableHead>
                    <TableHead className="text-muted-foreground">Consultations</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((f) => (
                    <TableRow key={f.name} className="border-border/30 hover:bg-secondary/30">
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-chart-2" />
                          {f.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{f.location}</TableCell>
                      <TableCell className="text-foreground">{f.users}</TableCell>
                      <TableCell className="text-foreground">{f.consultations.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={
                          f.status === "Active"
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning"
                        }>
                          {f.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground">Activity Logs</CardTitle>
              <CardDescription>Recent system activity across all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {activityLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg bg-secondary/20 p-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {log.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{log.user}</span>{" "}
                        <span className="text-muted-foreground">{log.action}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="border-border/50 text-xs text-muted-foreground">
                          {log.module}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{log.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
