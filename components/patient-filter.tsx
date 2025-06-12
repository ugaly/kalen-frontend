"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/types"
import { X } from "lucide-react"

interface PatientFilterProps {
  patients: Patient[]
  selectedPatients: string[]
  onChange: (value: string[]) => void
}

export function PatientFilter({ patients, selectedPatients, onChange }: PatientFilterProps) {
  const togglePatient = (patientId: string) => {
    if (selectedPatients.includes(patientId)) {
      onChange(selectedPatients.filter((id) => id !== patientId))
    } else {
      onChange([...selectedPatients, patientId])
    }
  }

  const clearSelection = () => {
    onChange([])
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="min-w-[200px] justify-between">
              {selectedPatients.length > 0
                ? `${selectedPatients.length} patient${selectedPatients.length > 1 ? "s" : ""} selected`
                : "Filter patients"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search patients..." />
              <CommandList>
                <CommandEmpty>No patient found.</CommandEmpty>
                <CommandGroup>
                  {patients.map((patient) => (
                    <CommandItem key={patient.id} value={patient.id} onSelect={() => togglePatient(patient.id)}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPatients.includes(patient.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {patient.name} ({patient.roomNumber})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedPatients.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Clear
          </Button>
        )}
      </div>

      {selectedPatients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPatients.map((id) => {
            const patient = patients.find((p) => p.id === id)
            return patient ? (
              <Badge key={id} variant="secondary" className="gap-1">
                {patient.name}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => togglePatient(id)}
                >
                  <span className="sr-only">Remove {patient.name}</span>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
