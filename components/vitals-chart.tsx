"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { VitalHistory } from "@/types"

interface VitalsChartProps {
  data: VitalHistory[]
}

export function VitalsChart({ data }: VitalsChartProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("heart-rate")

  // Prevent hydration mismatch with charts
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[200px] w-full rounded-md border" />
  }

  return (
    <Card className="p-2">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="oxygen">Oxygen</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
        </TabsList>

        <TabsContent value="heart-rate" className="h-[200px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[40, 180]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value} bpm`, "Heart Rate"]}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="blood-pressure" className="h-[200px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[40, 200]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value} mmHg`, ""]}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="oxygen" className="h-[200px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[85, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Oxygen Saturation"]}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
              <Line
                type="monotone"
                dataKey="oxygenSaturation"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="temperature" className="h-[200px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[95, 103]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${value}°F`, "Temperature"]}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
