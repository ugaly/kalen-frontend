export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  roomNumber: string
}

export interface VitalHistory {
  timestamp: string
  heartRate: number
  systolic: number
  diastolic: number
  oxygenSaturation: number
  temperature: number
}

export interface VitalData {
  history: VitalHistory[]
  currentValues: {
    heartRate: number
    systolic: number
    diastolic: number
    oxygenSaturation: number
    temperature: number
  }
  alerts: Array<{
    timestamp: string
    message: string
    severity: "warning" | "critical"
  }>
}
