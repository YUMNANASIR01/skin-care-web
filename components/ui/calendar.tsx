"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CalendarProps {
  mode: "single";
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  classNames?: Record<string, string>;
}

function Calendar({
  mode,
  selected,
  onSelect,
  disabled,
  className,
  classNames,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (selected) {
      return new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  // Update currentMonth when selected date changes
  React.useEffect(() => {
    if (selected) {
      setCurrentMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }, [selected]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month days
  const prevMonthDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i);
    date.setHours(0, 0, 0, 0);
    days.push({ date, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    date.setHours(0, 0, 0, 0);
    days.push({ date, isCurrentMonth: true });
  }

  // Next month days to fill the grid (6 rows x 7 cols = 42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
    date.setHours(0, 0, 0, 0);
    days.push({ date, isCurrentMonth: false });
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDisabled = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    return disabled ? disabled(date) : false;
  };

  const isSelected = (date: Date) => {
    if (!selected) return false;
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    );
  };

  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handleSelect = (date: Date) => {
    if (isDisabled(date)) return;
    // Create normalized date with time set to midnight
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    normalizedDate.setHours(0, 0, 0, 0);
    onSelect(normalizedDate);
  };

  return (
    <div className={cn("w-full max-w-[320px] select-none", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-medium text-foreground text-base">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth }, index) => {
          const disabled = isDisabled(date);
          const selected = isSelected(date);
          const isTod = isToday(date);

          return (
            <button
              key={index}
              type="button"
              onClick={() => isCurrentMonth && handleSelect(date)}
              disabled={disabled || !isCurrentMonth}
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all font-medium",
                // Non-current month days - dimmed and not clickable
                !isCurrentMonth && "text-muted-foreground/30 cursor-default pointer-events-none",
                // Disabled days - greyed out
                isCurrentMonth && disabled && "text-muted-foreground/30 cursor-not-allowed opacity-40",
                // SELECTED day - bold primary color, clear highlight
                isCurrentMonth && selected && "bg-primary text-white font-bold hover:bg-primary/90 cursor-pointer shadow-md",
                // Today (not selected) - subtle highlight
                isCurrentMonth && !selected && isTod && "bg-accent text-accent-foreground font-semibold hover:bg-accent/80 cursor-pointer",
                // Normal days
                isCurrentMonth && !selected && !disabled && "text-foreground hover:bg-secondary/50 cursor-pointer",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
