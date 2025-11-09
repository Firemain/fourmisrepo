"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  locale?: "fr" | "en"
  dateFormat?: string
}

/**
 * DatePicker - Composant réutilisable pour la sélection de dates
 * 
 * @example
 * // Utilisation simple
 * <DatePicker 
 *   date={selectedDate} 
 *   onDateChange={setSelectedDate}
 *   placeholder="Sélectionner une date"
 * />
 * 
 * @example
 * // Avec locale et format personnalisé
 * <DatePicker 
 *   date={startDate} 
 *   onDateChange={setStartDate}
 *   locale="fr"
 *   dateFormat="dd MMMM yyyy"
 *   placeholder="Date de début"
 * />
 */
export function DatePicker({
  date,
  onDateChange,
  placeholder = "Sélectionner une date",
  className,
  disabled = false,
  locale = "fr",
  dateFormat = "P",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const selectedLocale = locale === "fr" ? fr : enUS

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, dateFormat, { locale: selectedLocale })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            onDateChange?.(newDate)
            setOpen(false)
          }}
          locale={selectedLocale}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export interface DateRangePickerProps {
  dateFrom?: Date
  dateTo?: Date
  onDateFromChange?: (date: Date | undefined) => void
  onDateToChange?: (date: Date | undefined) => void
  placeholderFrom?: string
  placeholderTo?: string
  className?: string
  disabled?: boolean
  locale?: "fr" | "en"
  dateFormat?: string
}

/**
 * DateRangePicker - Composant pour la sélection d'une plage de dates
 * 
 * @example
 * <DateRangePicker 
 *   dateFrom={startDate}
 *   dateTo={endDate}
 *   onDateFromChange={setStartDate}
 *   onDateToChange={setEndDate}
 *   placeholderFrom="Date de début"
 *   placeholderTo="Date de fin"
 * />
 */
export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  placeholderFrom = "Date de début",
  placeholderTo = "Date de fin",
  className,
  disabled = false,
  locale = "fr",
  dateFormat = "P",
}: DateRangePickerProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <DatePicker
        date={dateFrom}
        onDateChange={onDateFromChange}
        placeholder={placeholderFrom}
        disabled={disabled}
        locale={locale}
        dateFormat={dateFormat}
        className="flex-1"
      />
      <DatePicker
        date={dateTo}
        onDateChange={onDateToChange}
        placeholder={placeholderTo}
        disabled={disabled}
        locale={locale}
        dateFormat={dateFormat}
        className="flex-1"
      />
    </div>
  )
}
