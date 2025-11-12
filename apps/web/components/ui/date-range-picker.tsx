'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { DatePresetButton } from './date-preset-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { cn } from '@/lib/utils';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  presets?: Array<{
    label: string;
    days: number;
  }>;
  locale?: 'fr' | 'en';
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  presets,
  locale = 'fr',
  className,
}: DateRangePickerProps) {
  const [localStart, setLocalStart] = React.useState(dateRange.start);
  const [localEnd, setLocalEnd] = React.useState(dateRange.end);
  const [activePreset, setActivePreset] = React.useState<number | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultPresets = [
    { label: locale === 'fr' ? '7 derniers jours' : 'Last 7 days', days: 7 },
    { label: locale === 'fr' ? '30 derniers jours' : 'Last 30 days', days: 30 },
    { label: locale === 'fr' ? '3 derniers mois' : 'Last 3 months', days: 90 },
    { label: locale === 'fr' ? '6 derniers mois' : 'Last 6 months', days: 180 },
    { label: locale === 'fr' ? '12 derniers mois' : 'Last 12 months', days: 365 },
  ];

  const finalPresets = presets || defaultPresets;

  const t = {
    fr: {
      period: 'Période',
      allTime: 'Depuis le début',
      custom: 'Personnalisé',
      apply: 'Appliquer',
      from: 'Du',
      to: 'Au',
    },
    en: {
      period: 'Period',
      allTime: 'All time',
      custom: 'Custom',
      apply: 'Apply',
      from: 'From',
      to: 'To',
    },
  };

  const text = t[locale];

  const handlePreset = (days: number, index: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setActivePreset(index);
    setLocalStart(start);
    setLocalEnd(end);
    onDateRangeChange({ start, end });
    setIsOpen(false); // Ferme le popover
  };

  const handleApplyCustom = () => {
    setActivePreset(null);
    onDateRangeChange({ start: localStart, end: localEnd });
    setIsOpen(false); // Ferme le popover
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'gap-2 border-[#18534F]/20 hover:border-[#18534F] hover:bg-[#ECF8F6] transition-all',
            className
          )}
        >
          <CalendarIcon className="w-4 h-4 text-[#18534F]" />
          <span className="text-gray-700">
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 border-[#18534F]/20" align="end">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-[#18534F] to-[#226D68] p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {text.period}
            </h3>
          </div>

          {/* Presets */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              {finalPresets.map((preset, index) => (
                <DatePresetButton
                  key={preset.days}
                  isActive={activePreset === index}
                  onClick={() => handlePreset(preset.days, index)}
                >
                  {preset.label}
                </DatePresetButton>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div className="p-4 bg-[#ECF8F6]/30">
            <p className="text-sm font-semibold text-[#18534F] mb-3">
              {text.custom}
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  {text.from}
                </label>
                <input
                  type="date"
                  value={localStart.toISOString().split('T')[0]}
                  onChange={(e) => setLocalStart(new Date(e.currentTarget.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  {text.to}
                </label>
                <input
                  type="date"
                  value={localEnd.toISOString().split('T')[0]}
                  onChange={(e) => setLocalEnd(new Date(e.currentTarget.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent transition-all text-sm"
                />
              </div>
              <Button
                onClick={handleApplyCustom}
                className="w-full bg-linear-to-r from-[#18534F] to-[#226D68] hover:from-[#226D68] hover:to-[#18534F] text-white shadow-md hover:shadow-lg transition-all"
              >
                {text.apply}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
