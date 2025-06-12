"use client"

import { useState } from "react"
import { usePatientData } from "@/hooks/use-patient-data"
import { PatientFilter } from "@/components/patient-filter"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { PatientVitalsGrid } from "@/components/patient-vitals-grid"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AlertsPanel } from "@/components/alerts-panel"
import { PatientDetailsModal } from "@/components/patient-details-modal"
import type { Patient } from "@/types"

export default function Dashboard() {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState<string>("1h")
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<Patient | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { patients, vitals, isLoading, error } = usePatientData(selectedPatients, timeRange)

  const handlePatientFilterChange = (patientIds: string[]) => {
    setSelectedPatients(patientIds)
  }

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
  }

  const handlePatientCardClick = (patient: Patient) => {
    setSelectedPatientForModal(patient)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPatientForModal(null)
  }

  return (
    <DashboardShell>
      <DashboardHeader />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-9">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PatientFilter
              patients={patients}
              selectedPatients={selectedPatients}
              onChange={handlePatientFilterChange}
            />
            <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
          </div>

          <PatientVitalsGrid
            patients={patients.filter((p) => selectedPatients.length === 0 || selectedPatients.includes(p.id))}
            vitals={vitals}
            isLoading={isLoading}
            error={error}
            onPatientCardClick={handlePatientCardClick}
          />
        </div>

        <div className="md:col-span-3">
          <AlertsPanel patients={patients} vitals={vitals} />
        </div>
      </div>
      <PatientDetailsModal
        patient={selectedPatientForModal}
        vitals={selectedPatientForModal ? vitals[selectedPatientForModal.id] : null}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </DashboardShell>
  )
}
