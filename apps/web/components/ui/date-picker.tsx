"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  locale?: "fr" | "en"
  withTime?: boolean
}

/**
 * DateTimePicker - Composant moderne pour la sélection de date et heure
 * 
 * @example
 * <DatePicker 
 *   date={selectedDate} 
 *   onDateChange={setSelectedDate}
 *   placeholder="Sélectionner une date"
 *   withTime={true}
 * />
 */
export function DatePicker({
  date,
  onDateChange,
  placeholder = "Sélectionner une date",
  className,
  disabled = false,
  locale = "fr",
  withTime = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    date?.getMonth() ?? new Date().getMonth()
  )
  const [selectedYear, setSelectedYear] = React.useState<number>(
    date?.getFullYear() ?? new Date().getFullYear()
  )
  const [hours, setHours] = React.useState<string>(
    date ? String(date.getHours()).padStart(2, '0') : '00'
  )
  const [minutes, setMinutes] = React.useState<string>(
    date ? String(date.getMinutes()).padStart(2, '0') : '00'
  )

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date)
      setSelectedMonth(date.getMonth())
      setSelectedYear(date.getFullYear())
      setHours(String(date.getHours()).padStart(2, '0'))
      setMinutes(String(date.getMinutes()).padStart(2, '0'))
    }
  }, [date])

  const selectedLocale = locale === "fr" ? fr : enUS

  const months = locale === "fr" ? 
    ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] :
    ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i)

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Lundi = 0
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(selectedYear, selectedMonth, day, parseInt(hours), parseInt(minutes))
    
    // Si on clique sur le jour déjà sélectionné, on désélectionne
    if (selectedDate && 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === selectedMonth &&
        selectedDate.getFullYear() === selectedYear) {
      setSelectedDate(undefined)
      onDateChange?.(undefined)
      setOpen(false)
      return
    }
    
    // Sinon on sélectionne la nouvelle date
    setSelectedDate(clickedDate)
    if (!withTime) {
      onDateChange?.(clickedDate)
      setOpen(false)
    } else {
      // Avec heure : on met à jour aussi
      onDateChange?.(clickedDate)
    }
  }

  const handleTimeChange = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      newDate.setHours(parseInt(hours))
      newDate.setMinutes(parseInt(minutes))
      setSelectedDate(newDate)
      onDateChange?.(newDate)
      setOpen(false)
    }
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const today = new Date()
  const isToday = (day: number) => {
    return day === today.getDate() && 
           selectedMonth === today.getMonth() && 
           selectedYear === today.getFullYear()
  }

  const isSelected = (day: number) => {
    return selectedDate?.getDate() === day &&
           selectedDate?.getMonth() === selectedMonth &&
           selectedDate?.getFullYear() === selectedYear
  }

  const weekDays = locale === "fr" ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-medium h-11 border-2 border-gray-300 bg-white rounded-lg shadow-sm transition-all hover:border-[#226D68] focus:border-[#18534F] focus:outline-none focus:ring-2 focus:ring-[#18534F]/20",
            !date && "text-gray-500",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#18534F]" />
          {date ? (
            <span className="text-sm">
              {format(date, withTime ? "PPP 'à' HH:mm" : "PPP", { locale: selectedLocale })}
            </span>
          ) : (
            <span className="text-sm">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
        <div className="p-3 space-y-3 bg-white rounded-lg shadow-lg max-h-[480px] overflow-y-auto">
          {/* Sélecteurs mois/année - Plus compacts */}
          <div className="flex gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="h-9 w-[110px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="h-9 w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendrier - Plus compact */}
          <div className="space-y-1">
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {weekDays.map((day) => (
                <div key={day} className="text-[10px] font-medium text-gray-500 py-1 w-8">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="h-8" />
              ))}
              {daysArray.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "h-8 w-8 rounded-md text-xs font-normal transition-colors",
                    "hover:bg-[#ECF8F6]",
                    isToday(day) && "ring-1 ring-[#18534F] ring-inset",
                    isSelected(day) && "bg-[#18534F] text-white hover:bg-[#226D68]",
                    !isSelected(day) && "hover:text-[#18534F]"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Sélection heure - Plus compact */}
          {withTime && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  <Label className="text-xs font-medium">
                    {locale === "fr" ? "Heure" : "Time"}
                  </Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e: any) => setHours(e.target.value.padStart(2, '0'))}
                    className="h-8 w-12 text-center text-xs p-0"
                    placeholder="HH"
                  />
                  <span className="text-sm font-semibold">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e: any) => setMinutes(e.target.value.padStart(2, '0'))}
                    className="h-8 w-12 text-center text-xs p-0"
                    placeholder="MM"
                  />
                </div>
              </div>
              <Button
                onClick={handleTimeChange}
                className="w-full h-8 text-xs bg-[#18534F] hover:bg-[#226D68]"
                disabled={!selectedDate}
              >
                {locale === "fr" ? "Confirmer" : "Confirm"}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
