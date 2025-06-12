"use client"

import type React from "react"

import type { Patient, VitalData } from "@/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { VitalsChart } from "@/components/vitals-chart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { AlertCircle, Clock, Heart, Thermometer, Droplets, Activity } from "lucide-react"

interface PatientDetailsModalProps {
  patient: Patient | null
  vitals: VitalData | null
  isOpen: boolean
  onClose: () => void
}

export function PatientDetailsModal({ patient, vitals, isOpen, onClose }: PatientDetailsModalProps) {
  if (!patient || !vitals) return null

  const hasAlert = vitals.alerts && vitals.alerts.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                {patient.name}
                {hasAlert && (
                  <Badge variant="destructive" className="animate-pulse">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Alert
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Room {patient.roomNumber} • {patient.age} years old • {patient.gender}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 pt-0 space-y-6">
            {/* Current Vitals - Large Display */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Current Vitals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <VitalDisplayLarge
                  label="Heart Rate"
                  value={vitals.currentValues.heartRate}
                  unit="bpm"
                  status={getVitalStatus(vitals.currentValues.heartRate, 60, 100)}
                  icon={<Heart className="h-6 w-6" />}
                />
                <VitalDisplayLarge
                  label="Blood Pressure"
                  value={`${vitals.currentValues.systolic}/${vitals.currentValues.diastolic}`}
                  unit="mmHg"
                  status={getVitalStatus(vitals.currentValues.systolic, 90, 140)}
                  icon={<Activity className="h-6 w-6" />}
                />
                <VitalDisplayLarge
                  label="Oxygen Saturation"
                  value={vitals.currentValues.oxygenSaturation}
                  unit="%"
                  status={getVitalStatus(vitals.currentValues.oxygenSaturation, 95, 100, true)}
                  icon={<Droplets className="h-6 w-6" />}
                />
                <VitalDisplayLarge
                  label="Temperature"
                  value={vitals.currentValues.temperature}
                  unit="°F"
                  status={getVitalStatus(vitals.currentValues.temperature, 97, 99)}
                  icon={<Thermometer className="h-6 w-6" />}
                />
              </div>
            </div>

            <Separator />

            {/* Charts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Vitals Trends</h3>
              <div className="h-[400px]">
                <VitalsChart data={vitals.history} />
              </div>
            </div>

            {/* Alerts Section */}
            {hasAlert && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Active Alerts ({vitals.alerts.length})
                  </h3>
                  <div className="space-y-3">
                    {vitals.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={cn(
                          "rounded-lg border p-4",
                          alert.severity === "critical"
                            ? "border-red-200 bg-red-50 dark:bg-red-950/10"
                            : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            <AlertCircle
                              className={cn(
                                "mt-0.5 h-5 w-5",
                                alert.severity === "critical" ? "text-red-600" : "text-yellow-600",
                              )}
                            />
                            <div>
                              <p className="font-medium text-base">{alert.message}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Severity: {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {getTimeAgo(new Date(alert.timestamp))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Recent History Summary */}
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Readings</h3>
              <div className="space-y-2">
                {vitals.history
                  .slice(-5)
                  .reverse()
                  .map((reading, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                      <span className="text-sm font-medium">{new Date(reading.timestamp).toLocaleTimeString()}</span>
                      <div className="flex gap-4 text-sm">
                        <span>HR: {reading.heartRate}</span>
                        <span>
                          BP: {reading.systolic}/{reading.diastolic}
                        </span>
                        <span>O2: {reading.oxygenSaturation}%</span>
                        <span>Temp: {reading.temperature}°F</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

type VitalStatus = "normal" | "warning" | "critical"

function getVitalStatus(value: number, min: number, max: number, inversed = false): VitalStatus {
  if (inversed) {
    if (value < min) return "critical"
    if (value < min + 2) return "warning"
    return "normal"
  } else {
    if (value < min || value > max) return "critical"
    if (value < min + 5 || value > max - 5) return "warning"
    return "normal"
  }
}

interface VitalDisplayLargeProps {
  label: string
  value: number | string
  unit: string
  status: VitalStatus
  icon: React.ReactNode
}

function VitalDisplayLarge({ label, value, unit, status, icon }: VitalDisplayLargeProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-6 transition-colors",
        status === "warning" && "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10",
        status === "critical" && "border-red-200 bg-red-50 dark:bg-red-950/10",
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            "p-2 rounded-md",
            status === "normal" && "bg-green-100 text-green-600 dark:bg-green-950/20",
            status === "warning" && "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/20",
            status === "critical" && "bg-red-100 text-red-600 dark:bg-red-950/20",
          )}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "text-3xl font-bold",
            status === "warning" && "text-yellow-700 dark:text-yellow-500",
            status === "critical" && "text-red-700 dark:text-red-500",
          )}
        >
          {value}
        </span>
        <span className="text-lg font-medium text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
            status === "normal" && "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400",
            status === "warning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400",
            status === "critical" && "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400",
          )}
        >
          {status === "normal" && "Normal"}
          {status === "warning" && "Warning"}
          {status === "critical" && "Critical"}
        </span>
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
