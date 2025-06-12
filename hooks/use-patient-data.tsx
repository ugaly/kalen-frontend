"use client"

import { useEffect, useState } from "react"
import type { Patient, VitalData } from "@/types"
import { generateMockPatients, generateMockVitals } from "@/lib/mock-data"

export function usePatientData(selectedPatients: string[], timeRange: string) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [vitals, setVitals] = useState<Record<string, VitalData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)

        // In a real app, this would be an API call
        const mockPatients = generateMockPatients(8)
        setPatients(mockPatients)

        const initialVitals: Record<string, VitalData> = {}
        mockPatients.forEach((patient) => {
          initialVitals[patient.id] = generateMockVitals(patient.id, timeRange)
        })
        setVitals(initialVitals)

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load data"))
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [timeRange])

  // WebSocket connection for real-time updates
  useEffect(() => {
    // In a real app, this would connect to a real WebSocket server
    // For this demo, we'll simulate WebSocket updates
    const intervalId = setInterval(() => {
      setVitals((prevVitals) => {
        const newVitals = { ...prevVitals }

        // Update a random subset of patients
        const patientsToUpdate = patients.filter(() => Math.random() > 0.5).map((p) => p.id)

        patientsToUpdate.forEach((patientId) => {
          if (newVitals[patientId]) {
            // Update current values with small random changes
            const current = newVitals[patientId].currentValues

            // Generate new values with small variations
            const heartRateChange = Math.random() * 4 - 2 // -2 to +2
            const systolicChange = Math.random() * 6 - 3 // -3 to +3
            const diastolicChange = Math.random() * 4 - 2 // -2 to +2
            const oxygenChange = Math.random() * 1 - 0.5 // -0.5 to +0.5
            const tempChange = Math.random() * 0.4 - 0.2 // -0.2 to +0.2

            const newHeartRate = Math.round(current.heartRate + heartRateChange)
            const newSystolic = Math.round(current.systolic + systolicChange)
            const newDiastolic = Math.round(current.diastolic + diastolicChange)
            const newOxygen = Math.round((current.oxygenSaturation + oxygenChange) * 10) / 10
            const newTemp = Math.round((current.temperature + tempChange) * 10) / 10

            // Update current values
            newVitals[patientId] = {
              ...newVitals[patientId],
              currentValues: {
                heartRate: newHeartRate,
                systolic: newSystolic,
                diastolic: newDiastolic,
                oxygenSaturation: newOxygen,
                temperature: newTemp,
              },
            }

            // Add new data point to history
            const newDataPoint = {
              timestamp: new Date().toISOString(),
              heartRate: newHeartRate,
              systolic: newSystolic,
              diastolic: newDiastolic,
              oxygenSaturation: newOxygen,
              temperature: newTemp,
            }

            newVitals[patientId].history = [...newVitals[patientId].history.slice(-19), newDataPoint]

            // Check for alerts
            const alerts = []
            if (newHeartRate > 120 || newHeartRate < 50) {
              alerts.push({
                timestamp: new Date().toISOString(),
                message: `Abnormal heart rate: ${newHeartRate} bpm`,
                severity: newHeartRate > 140 || newHeartRate < 45 ? "critical" : "warning",
              })
            }

            if (newOxygen < 92) {
              alerts.push({
                timestamp: new Date().toISOString(),
                message: `Low oxygen saturation: ${newOxygen}%`,
                severity: newOxygen < 90 ? "critical" : "warning",
              })
            }

            if (newSystolic > 160 || newSystolic < 85) {
              alerts.push({
                timestamp: new Date().toISOString(),
                message: `Abnormal blood pressure: ${newSystolic}/${newDiastolic} mmHg`,
                severity: newSystolic > 180 || newSystolic < 80 ? "critical" : "warning",
              })
            }

            if (newTemp > 100.4 || newTemp < 96.8) {
              alerts.push({
                timestamp: new Date().toISOString(),
                message: `Abnormal temperature: ${newTemp}°F`,
                severity: newTemp > 102 || newTemp < 96 ? "critical" : "warning",
              })
            }

            if (alerts.length > 0) {
              newVitals[patientId].alerts = alerts
            } else {
              newVitals[patientId].alerts = []
            }
          }
        })

        return newVitals
      })
    }, 3000) // Update every 3 seconds

    return () => {
      clearInterval(intervalId)
      if (socket) {
        socket.close()
      }
    }
  }, [patients])

  return { patients, vitals, isLoading, error }
}
