'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DatePresetButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children: React.ReactNode;
}

export const DatePresetButton = React.forwardRef<
  HTMLButtonElement,
  DatePresetButtonProps
>(({ isActive, className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:ring-offset-2',
        isActive
          ? 'bg-gradient-to-r from-[#18534F] to-[#226D68] text-white shadow-md hover:shadow-lg'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#ECF8F6] hover:border-[#18534F] hover:text-[#18534F]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

DatePresetButton.displayName = 'DatePresetButton';
