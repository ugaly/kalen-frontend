"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock } from "lucide-react"

interface TimeRangeSelectorProps {
  value: string
  onChange: (value: string) => void
}

const timeRanges = [
  { value: "15m", label: "Last 15 minutes" },
  { value: "1h", label: "Last hour" },
  { value: "4h", label: "Last 4 hours" },
  { value: "12h", label: "Last 12 hours" },
  { value: "24h", label: "Last 24 hours" },
]

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const selectedRange = timeRanges.find((range) => range.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{selectedRange?.label || "Select time range"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {timeRanges.map((range) => (
          <DropdownMenuItem
            key={range.value}
            onClick={() => onChange(range.value)}
            className={value === range.value ? "bg-accent" : ""}
          >
            {range.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
