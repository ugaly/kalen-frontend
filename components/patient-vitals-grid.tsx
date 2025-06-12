"use client"

import type { Patient, VitalData } from "@/types"
import { PatientVitalsCard } from "@/components/patient-vitals-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PatientVitalsGridProps {
  patients: Patient[]
  vitals: Record<string, VitalData>
  isLoading: boolean
  error: Error | null
  onPatientCardClick?: (patient: Patient) => void
}

export function PatientVitalsGrid({ patients, vitals, isLoading, error, onPatientCardClick }: PatientVitalsGridProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load patient data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  if (patients.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No patients selected</p>
          <p className="text-xs text-muted-foreground">Use the filter above to select patients</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {patients.map((patient) => (
        <PatientVitalsCard
          key={patient.id}
          patient={patient}
          vitals={vitals[patient.id]}
          isLoading={isLoading}
          onCardClick={onPatientCardClick}
        />
      ))}
    </div>
  )
}
