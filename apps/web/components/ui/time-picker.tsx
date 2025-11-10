"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface TimePickerProps {
  time?: string // Format "HH:mm"
  onTimeChange?: (time: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  locale?: "fr" | "en"
}

/**
 * TimePicker - Composant moderne pour la sélection d'heure
 * 
 * @example
 * <TimePicker 
 *   time={startTime} 
 *   onTimeChange={setStartTime}
 *   placeholder="Heure de début"
 * />
 */
export function TimePicker({
  time,
  onTimeChange,
  placeholder = "Sélectionner l'heure",
  className,
  disabled = false,
  locale = "fr",
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hours, setHours] = React.useState<string>(time?.split(':')[0] || '09')
  const [minutes, setMinutes] = React.useState<string>(time?.split(':')[1] || '00')

  React.useEffect(() => {
    if (time) {
      const [h, m] = time.split(':')
      setHours(h || '09')
      setMinutes(m || '00')
    }
  }, [time])

  const formatTime = (h: string, m: string) => {
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
  }

  const handleConfirm = () => {
    const formattedTime = formatTime(hours, minutes)
    onTimeChange?.(formattedTime)
    setOpen(false)
  }

  const handleHoursChange = (value: string) => {
    const num = parseInt(value) || 0
    if (num >= 0 && num <= 23) {
      setHours(String(num).padStart(2, '0'))
    }
  }

  const handleMinutesChange = (value: string) => {
    const num = parseInt(value) || 0
    if (num >= 0 && num <= 59) {
      setMinutes(String(num).padStart(2, '0'))
    }
  }

  const quickTimes = [
    { label: locale === 'fr' ? 'Matin' : 'Morning', time: '09:00' },
    { label: locale === 'fr' ? 'Midi' : 'Noon', time: '12:00' },
    { label: locale === 'fr' ? 'Après-midi' : 'Afternoon', time: '14:00' },
    { label: locale === 'fr' ? 'Soir' : 'Evening', time: '18:00' },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            !time && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? (
            <span>{time}</span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
        <div className="p-3 space-y-3 bg-white rounded-lg shadow-lg">
          {/* Sélection rapide */}
          <div className="grid grid-cols-4 gap-1">
            {quickTimes.map((qt) => (
              <button
                key={qt.time}
                type="button"
                onClick={() => {
                  const [h, m] = qt.time.split(':')
                  setHours(h)
                  setMinutes(m)
                  onTimeChange?.(qt.time)
                  setOpen(false)
                }}
                className={cn(
                  "px-2 py-1.5 text-xs rounded-md transition-colors",
                  "hover:bg-[#ECF8F6] hover:text-[#18534F]",
                  time === qt.time && "bg-[#18534F] text-white hover:bg-[#226D68]"
                )}
              >
                {qt.label}
              </button>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleHoursChange(String((parseInt(hours) + 1) % 24))}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ECF8F6] transition-colors"
                >
                  ▲
                </button>
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e: any) => handleHoursChange(e.target.value)}
                  className="h-12 w-16 text-center text-xl font-semibold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => handleHoursChange(String((parseInt(hours) - 1 + 24) % 24))}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ECF8F6] transition-colors"
                >
                  ▼
                </button>
              </div>

              <span className="text-2xl font-bold text-gray-400">:</span>

              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMinutesChange(String((parseInt(minutes) + 5) % 60))}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ECF8F6] transition-colors"
                >
                  ▲
                </button>
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e: any) => handleMinutesChange(e.target.value)}
                  className="h-12 w-16 text-center text-xl font-semibold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => handleMinutesChange(String((parseInt(minutes) - 5 + 60) % 60))}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ECF8F6] transition-colors"
                >
                  ▼
                </button>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              className="w-full h-8 text-xs bg-[#18534F] hover:bg-[#226D68]"
            >
              {locale === "fr" ? "Confirmer" : "Confirm"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
