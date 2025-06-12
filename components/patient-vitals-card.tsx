"use client"

import type { Patient, VitalData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { VitalsChart } from "@/components/vitals-chart"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PatientVitalsCardProps {
  patient: Patient
  vitals: VitalData
  isLoading: boolean
  onCardClick?: (patient: Patient) => void
}

export function PatientVitalsCard({ patient, vitals, isLoading, onCardClick }: PatientVitalsCardProps) {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(patient)
    }
  }

  if (isLoading || !vitals) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-[200px]" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hasAlert = vitals.alerts && vitals.alerts.length > 0

  return (
    <Card
      className={cn(
        hasAlert && "border-red-200 bg-red-50 dark:bg-red-950/10",
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {patient.name}
              {hasAlert && (
                <Badge variant="destructive" className="animate-pulse">
                  Alert
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Room {patient.roomNumber} • {patient.age} yrs • {patient.gender}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <VitalsChart data={vitals.history} />

          <div className="grid grid-cols-2 gap-2">
            <VitalDisplay
              label="Heart Rate"
              value={vitals.currentValues.heartRate}
              unit="bpm"
              status={getVitalStatus(vitals.currentValues.heartRate, 60, 100)}
            />
            <VitalDisplay
              label="Blood Pressure"
              value={`${vitals.currentValues.systolic}/${vitals.currentValues.diastolic}`}
              unit="mmHg"
              status={getVitalStatus(vitals.currentValues.systolic, 90, 140)}
            />
            <VitalDisplay
              label="Oxygen Saturation"
              value={vitals.currentValues.oxygenSaturation}
              unit="%"
              status={getVitalStatus(vitals.currentValues.oxygenSaturation, 95, 100, true)}
            />
            <VitalDisplay
              label="Temperature"
              value={vitals.currentValues.temperature}
              unit="°F"
              status={getVitalStatus(vitals.currentValues.temperature, 97, 99)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
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

interface VitalDisplayProps {
  label: string
  value: number | string
  unit: string
  status: VitalStatus
}

function VitalDisplay({ label, value, unit, status }: VitalDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md border p-2",
        status === "warning" && "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10",
        status === "critical" && "border-red-200 bg-red-50 dark:bg-red-950/10",
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-lg font-bold",
          status === "warning" && "text-yellow-700 dark:text-yellow-500",
          status === "critical" && "text-red-700 dark:text-red-500",
        )}
      >
        {value} <span className="text-xs font-normal">{unit}</span>
      </span>
    </div>
  )
}
