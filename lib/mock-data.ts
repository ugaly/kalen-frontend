import type { Patient, VitalData } from "@/types"

export function generateMockPatients(count: number): Patient[] {
  const patients: Patient[] = []

  const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "Robert", "Jennifer", "William", "Maria"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    patients.push({
      id: `patient-${i + 1}`,
      name: `${firstName} ${lastName}`,
      age: Math.floor(Math.random() * 50) + 20, // 20-70 years
      gender: Math.random() > 0.5 ? "Male" : "Female",
      roomNumber: `${Math.floor(Math.random() * 5) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`, // 1A-5E
    })
  }

  return patients
}

export function generateMockVitals(patientId: string, timeRange: string): VitalData {
  // Base values
  const baseHeartRate = Math.floor(Math.random() * 30) + 65 // 65-95 bpm
  const baseSystolic = Math.floor(Math.random() * 30) + 110 // 110-140 mmHg
  const baseDiastolic = Math.floor(Math.random() * 20) + 70 // 70-90 mmHg
  const baseOxygen = Math.floor(Math.random() * 5) + 95 // 95-100%
  const baseTemp = Math.floor(Math.random() * 10) / 10 + 98 // 98.0-99.0°F

  // Generate history data
  const history = []
  const now = new Date()

  // Determine number of data points based on time range
  const dataPoints = 20
  let timeStep = 3 * 60 * 1000 // 3 minutes in milliseconds

  switch (timeRange) {
    case "15m":
      timeStep = 45 * 1000 // 45 seconds
      break
    case "1h":
      timeStep = 3 * 60 * 1000 // 3 minutes
      break
    case "4h":
      timeStep = 12 * 60 * 1000 // 12 minutes
      break
    case "12h":
      timeStep = 36 * 60 * 1000 // 36 minutes
      break
    case "24h":
      timeStep = 72 * 60 * 1000 // 72 minutes
      break
  }

  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(now.getTime() - (dataPoints - i) * timeStep)

    // Add some random variation to the values
    const heartRateVar = Math.floor(Math.random() * 10) - 5 // -5 to +5
    const systolicVar = Math.floor(Math.random() * 10) - 5 // -5 to +5
    const diastolicVar = Math.floor(Math.random() * 8) - 4 // -4 to +4
    const oxygenVar = Math.floor(Math.random() * 3) - 1 // -1 to +2
    const tempVar = (Math.floor(Math.random() * 6) - 3) / 10 // -0.3 to +0.3

    history.push({
      timestamp: timestamp.toISOString(),
      heartRate: baseHeartRate + heartRateVar,
      systolic: baseSystolic + systolicVar,
      diastolic: baseDiastolic + diastolicVar,
      oxygenSaturation: baseOxygen + oxygenVar,
      temperature: Math.round((baseTemp + tempVar) * 10) / 10,
    })
  }

  // Current values (latest in history)
  const currentValues = {
    heartRate: history[history.length - 1].heartRate,
    systolic: history[history.length - 1].systolic,
    diastolic: history[history.length - 1].diastolic,
    oxygenSaturation: history[history.length - 1].oxygenSaturation,
    temperature: history[history.length - 1].temperature,
  }

  // Generate alerts based on current values
  const alerts = []

  if (currentValues.heartRate > 120 || currentValues.heartRate < 50) {
    alerts.push({
      timestamp: now.toISOString(),
      message: `Abnormal heart rate: ${currentValues.heartRate} bpm`,
      severity: currentValues.heartRate > 140 || currentValues.heartRate < 45 ? "critical" : "warning",
    })
  }

  if (currentValues.oxygenSaturation < 92) {
    alerts.push({
      timestamp: now.toISOString(),
      message: `Low oxygen saturation: ${currentValues.oxygenSaturation}%`,
      severity: currentValues.oxygenSaturation < 90 ? "critical" : "warning",
    })
  }

  if (currentValues.systolic > 160 || currentValues.systolic < 85) {
    alerts.push({
      timestamp: now.toISOString(),
      message: `Abnormal blood pressure: ${currentValues.systolic}/${currentValues.diastolic} mmHg`,
      severity: currentValues.systolic > 180 || currentValues.systolic < 80 ? "critical" : "warning",
    })
  }

  if (currentValues.temperature > 100.4 || currentValues.temperature < 96.8) {
    alerts.push({
      timestamp: now.toISOString(),
      message: `Abnormal temperature: ${currentValues.temperature}°F`,
      severity: currentValues.temperature > 102 || currentValues.temperature < 96 ? "critical" : "warning",
    })
  }

  return {
    history,
    currentValues,
    alerts,
  }
}
