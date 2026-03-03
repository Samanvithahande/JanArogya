"use client"

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const consultationData = [
  { month: "Sep", consultations: 180, trauma: 22, prescriptions: 95 },
  { month: "Oct", consultations: 210, trauma: 28, prescriptions: 112 },
  { month: "Nov", consultations: 245, trauma: 31, prescriptions: 130 },
  { month: "Dec", consultations: 198, trauma: 19, prescriptions: 105 },
  { month: "Jan", consultations: 320, trauma: 35, prescriptions: 168 },
  { month: "Feb", consultations: 380, trauma: 42, prescriptions: 195 },
]

const conditionData = [
  { name: "Respiratory", value: 320, fill: "#0d9488" },
  { name: "Trauma/Injury", value: 184, fill: "#0284c7" },
  { name: "Gastrointestinal", value: 156, fill: "#059669" },
  { name: "Dermatological", value: 98, fill: "#6366f1" },
  { name: "Other", value: 72, fill: "#64748b" },
]

const severityData = [
  { level: "1-2", count: 45, label: "Minor" },
  { level: "3-4", count: 62, label: "Low" },
  { level: "5-6", count: 38, label: "Moderate" },
  { level: "7-8", count: 28, label: "High" },
  { level: "9-10", count: 11, label: "Critical" },
]

const severityColors = ["#059669", "#0d9488", "#eab308", "#f97316", "#ef4444"]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track healthcare metrics and performance insights</p>
      </div>

      {/* Consultations Over Time */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Consultations Over Time</CardTitle>
          <CardDescription>Monthly consultation volume with breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              consultations: { label: "Consultations", color: "#0d9488" },
              trauma: { label: "Trauma Cases", color: "#ef4444" },
              prescriptions: { label: "Prescriptions", color: "#0284c7" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consultationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="consultations"
                  stroke="#0d9488"
                  fill="#0d9488"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Consultations"
                />
                <Area
                  type="monotone"
                  dataKey="prescriptions"
                  stroke="#0284c7"
                  fill="#0284c7"
                  fillOpacity={0.05}
                  strokeWidth={2}
                  name="Prescriptions"
                />
                <Area
                  type="monotone"
                  dataKey="trauma"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.05}
                  strokeWidth={2}
                  name="Trauma Cases"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Condition Types Pie */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground">Condition Types</CardTitle>
            <CardDescription>Distribution of medical conditions treated</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                respiratory: { label: "Respiratory", color: "#0d9488" },
                trauma: { label: "Trauma/Injury", color: "#0284c7" },
                gastro: { label: "Gastrointestinal", color: "#059669" },
                derma: { label: "Dermatological", color: "#6366f1" },
                other: { label: "Other", color: "#64748b" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={conditionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {conditionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {conditionData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: c.fill }} />
                  <span className="text-xs text-muted-foreground">{c.name} ({c.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trauma Severity Distribution */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground">Trauma Severity Distribution</CardTitle>
            <CardDescription>Number of cases by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Cases", color: "#0d9488" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="level" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Cases">
                    {severityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={severityColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex justify-center gap-4">
              {severityData.map((s, i) => (
                <div key={s.level} className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: severityColors[i] }} />
                  <span className="text-[10px] text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
