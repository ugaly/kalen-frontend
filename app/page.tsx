import { Suspense } from "react"
import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export const metadata: Metadata = {
  title: "MediTrack - Patient Vitals Dashboard",
  description: "Real-time patient vitals monitoring dashboard for healthcare professionals",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  )
}
