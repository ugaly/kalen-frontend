"use client"

import type { Patient, VitalData } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Bell, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertsPanelProps {
  patients: Patient[]
  vitals: Record<string, VitalData>
}

export function AlertsPanel({ patients, vitals }: AlertsPanelProps) {
  // Get all alerts from all patients
  const allAlerts = patients
    .filter((patient) => vitals[patient.id]?.alerts?.length > 0)
    .flatMap((patient) =>
      (vitals[patient.id]?.alerts || []).map((alert) => ({
        ...alert,
        patientId: patient.id,
        patientName: patient.name,
        roomNumber: patient.roomNumber,
      })),
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Alerts
        </CardTitle>
        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">{allAlerts.length}</span>
      </CardHeader>
      <CardContent>
        {allAlerts.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No alerts</p>
              <p className="text-xs text-muted-foreground">All patient vitals are within normal ranges</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              {allAlerts.map((alert, index) => (
                <AlertItem key={index} alert={alert} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

interface AlertItemProps {
  alert: any
}

function AlertItem({ alert }: AlertItemProps) {
  const timeAgo = getTimeAgo(new Date(alert.timestamp))

  return (
    <div
      className={cn(
        "rounded-md border p-3",
        alert.severity === "critical"
          ? "border-red-200 bg-red-50 dark:bg-red-950/10"
          : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <AlertCircle
            className={cn("mt-0.5 h-4 w-4", alert.severity === "critical" ? "text-red-600" : "text-yellow-600")}
          />
          <div>
            <p className="font-medium">{alert.message}</p>
            <p className="text-sm">
              {alert.patientName} • Room {alert.roomNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)

  if (diffMins < 1) {
    return "Just now"
  } else if (diffMins === 1) {
    return "1 min ago"
  } else if (diffMins < 60) {
    return `${diffMins} mins ago`
  } else {
    const diffHours = Math.round(diffMins / 60)
    if (diffHours === 1) {
      return "1 hour ago"
    } else {
      return `${diffHours} hours ago`
    }
  }
}
