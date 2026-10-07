"use client";

/**
 * Airbnb-style dual-month date-range picker.
 * - Selecting sets check-in then check-out; clicking again restarts the range.
 * - Dates in `blocked` (confirmed bookings) are disabled and struck out.
 * - Past dates are disabled.
 */
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/Icons";
import { toISODate, todayISO } from "@/lib/format";

interface Props {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (checkIn: string | null, checkOut: string | null) => void;
  blocked?: Set<string>;
  months?: number;
}

interface MonthCell {
  iso: string;
  day: number;
  inMonth: boolean;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function monthMatrix(year: number, month: number): MonthCell[] {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const cells: MonthCell[] = [];
  const start = new Date(year, month, 1 - startPad);
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({
      iso: toISODate(d),
      day: d.getDate(),
      inMonth: d.getMonth() === month,
    });
  }
  return cells;
}

export default function DateRangeCalendar({
  checkIn,
  checkOut,
  onChange,
  blocked,
  months = 2,
}: Props) {
  const today = todayISO();
  const [view, setView] = useState(() => {
    const base = checkIn ? new Date(checkIn + "T00:00:00") : new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const visibleMonths = useMemo(() => {
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(view.year, view.month + i, 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
        cells: monthMatrix(d.getFullYear(), d.getMonth()),
      };
    });
  }, [view, months]);

  const canGoBack = (() => {
    const now = new Date();
    return view.year > now.getFullYear() || view.month > now.getMonth();
  })();

  const shift = (dir: -1 | 1) => {
    const d = new Date(view.year, view.month + dir, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  const isBlocked = (iso: string) => !!blocked?.has(iso);

  const handleDay = (iso: string) => {
    if (isBlocked(iso)) return;
    if (!checkIn || (checkIn && checkOut)) {
      onChange(iso, null);
      return;
    }
    if (iso <= checkIn) {
      onChange(iso, null);
      return;
    }
    // reject ranges spanning a booked night
    if (blocked) {
      for (let d = new Date(checkIn + "T00:00:00"); toISODate(d) < iso; d.setDate(d.getDate() + 1)) {
        if (isBlocked(toISODate(d))) {
          onChange(iso, null);
          return;
        }
      }
    }
    onChange(checkIn, iso);
  };

  const dayClass = (cell: MonthCell) => {
    const iso = cell.iso;
    const selectedStart = iso === checkIn;
    const selectedEnd = iso === checkOut;
    const inRange =
      checkIn && checkOut && iso > checkIn && iso < checkOut && !isBlocked(iso);
    const disabled = iso < today || isBlocked(iso);

    let cls =
      "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ";
    if (selectedStart || selectedEnd) {
      cls += "bg-hof text-white dark:bg-white dark:text-hof font-semibold";
    } else if (inRange) {
      cls += "bg-mist dark:bg-[#2a2a2e] font-medium";
    } else if (disabled) {
      cls += "text-gray-300 line-through cursor-not-allowed";
    } else {
      cls += "hover:border hover:border-hof cursor-pointer";
    }
    if (!cell.inMonth) cls += " text-gray-300";
    else if (!disabled && !selectedStart && !selectedEnd) cls += " text-hof dark:text-[#f0f0f0]";
    return cls;
  };

  return (
    <div className="select-none p-2">
      <div className="relative mb-2 flex items-center justify-between px-2">
        <button
          type="button"
          aria-label="Previous months"
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          className={`rounded-full p-2 ${canGoBack ? "hover:bg-mist dark:hover:bg-[#2a2a2e]" : "opacity-30"}`}
        >
          <ChevronLeft width={14} height={14} />
        </button>
        <div className="flex flex-1 justify-around text-[15px] font-semibold">
          {visibleMonths.map((m) => (
            <span key={m.label} className={months > 1 ? "w-64 text-center" : ""}>
              {m.label}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next months"
          onClick={() => shift(1)}
          className="rounded-full p-2 hover:bg-mist dark:hover:bg-[#2a2a2e]"
        >
          <ChevronRight width={14} height={14} />
        </button>
      </div>

      <div className="flex justify-around gap-6">
        {visibleMonths.map((m) => (
          <div key={m.label} className="w-72">
            <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-foggy dark:text-[#a8a8ad]">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="flex h-6 items-center justify-center">
                  {w}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {m.cells.map((cell) => (
                <div
                  key={cell.iso}
                  className="flex items-center justify-center py-0.5"
                >
                  <button
                    type="button"
                    disabled={cell.iso < today || isBlocked(cell.iso)}
                    onClick={() => handleDay(cell.iso)}
                    className={dayClass(cell)}
                  >
                    {cell.day}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="px-4 pb-1 pt-3 text-xs text-foggy dark:text-[#a8a8ad]">
        Pick a check-in and check-out date. Nights shown struck-through are already booked.
      </p>
    </div>
  );
}
