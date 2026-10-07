"use client";

/** Sticky reservation card: date pickers, guest count, live price breakdown. */
import { useMemo, useState } from "react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { ChevronDown, StarIcon } from "@/components/Icons";
import { formatPrice, nightsBetween } from "@/lib/format";
import type { DateRange } from "@/types";

interface Props {
  listingId: number;
  pricePerNight: number;
  cleaningFee: number;
  rating: number;
  reviewsCount: number;
  maxGuests: number;
  blocked: DateRange[];
  onReserve: (checkIn: string, checkOut: string, guests: number) => void;
}

export default function BookingWidget({
  pricePerNight,
  cleaningFee,
  rating,
  reviewsCount,
  maxGuests,
  blocked,
  onReserve,
}: Props) {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockedSet = useMemo(() => {
    const s = new Set<string>();
    blocked.forEach(({ check_in, check_out }) => {
      const d = new Date(check_in + "T00:00:00");
      const end = new Date(check_out + "T00:00:00");
      for (; d < end; d.setDate(d.getDate() + 1)) s.add(d.toISOString().slice(0, 10));
    });
    return s;
  }, [blocked]);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const subtotal = nights * pricePerNight;
  const cleaning = nights > 0 ? cleaningFee : 0;
  const serviceFee = Math.round((subtotal + cleaning) * 0.14);
  const total = subtotal + cleaning + serviceFee;

  const reserve = () => {
    setError(null);
    if (!checkIn || !checkOut) {
      setError("Select your dates to reserve");
      return;
    }
    onReserve(checkIn, checkOut, guests);
  };

  const dateLabel = (d: string | null, fallback: string) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : fallback;

  return (
    <div className="rounded-2xl border border-line dark:border-[#38383d] p-6 shadow-card">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-2xl">
          <span className="font-semibold">{formatPrice(pricePerNight)}</span>{" "}
          <span className="text-base">night</span>
        </p>
        <span className="flex items-center gap-1 text-sm">
          <StarIcon width={12} height={12} />
          {rating > 0 ? (
            <>
              <span className="font-medium">{rating.toFixed(2)}</span>
              <span className="text-foggy dark:text-[#a8a8ad]"> · {reviewsCount} reviews</span>
            </>
          ) : (
            <span className="text-foggy dark:text-[#a8a8ad]">New</span>
          )}
        </span>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-line dark:border-[#38383d]">
          <div className="grid grid-cols-2 divide-x divide-line dark:divide-[#38383d]">
            <button
              onClick={() => {
                setCalendarOpen((o) => !o);
                setGuestsOpen(false);
              }}
              className={`px-3 py-2.5 text-left text-sm hover:bg-mist dark:hover:bg-[#2a2a2e] ${calendarOpen ? "bg-mist dark:bg-[#2a2a2e]" : ""}`}
            >
              <span className="block text-[10px] font-semibold uppercase">Check-in</span>
              {dateLabel(checkIn, "Add date")}
            </button>
            <button
              onClick={() => {
                setCalendarOpen((o) => !o);
                setGuestsOpen(false);
              }}
              className={`px-3 py-2.5 text-left text-sm hover:bg-mist dark:hover:bg-[#2a2a2e] ${calendarOpen ? "bg-mist dark:bg-[#2a2a2e]" : ""}`}
            >
              <span className="block text-[10px] font-semibold uppercase">Checkout</span>
              {dateLabel(checkOut, "Add date")}
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setGuestsOpen((o) => !o);
                setCalendarOpen(false);
              }}
              className={`flex w-full items-center justify-between border-t border-line dark:border-[#38383d] px-3 py-2.5 text-left text-sm hover:bg-mist dark:hover:bg-[#2a2a2e] ${
                guestsOpen ? "bg-mist dark:bg-[#2a2a2e]" : ""
              }`}
            >
              <span>
                <span className="block text-[10px] font-semibold uppercase">Guests</span>
                {guests} guest{guests > 1 ? "s" : ""}
              </span>
              <ChevronDown className="text-hof dark:text-[#f0f0f0]" />
            </button>
            {guestsOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-line dark:border-[#38383d] bg-white dark:bg-[#1c1c20] p-4 shadow-pop">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Guests</p>
                    <p className="text-xs text-foggy dark:text-[#a8a8ad]">This place has a maximum of {maxGuests}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Decrease guests"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-line dark:border-[#38383d] text-lg text-foggy dark:text-[#a8a8ad] hover:border-hof hover:text-hof disabled:opacity-30"
                      disabled={guests <= 1}
                    >
                      −
                    </button>
                    <span className="w-4 text-center">{guests}</span>
                    <button
                      aria-label="Increase guests"
                      onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                      disabled={guests >= maxGuests}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-line dark:border-[#38383d] text-lg text-foggy dark:text-[#a8a8ad] hover:border-hof hover:text-hof disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {calendarOpen && (
          <div className="absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 rounded-3xl border border-line dark:border-[#38383d] bg-white dark:bg-[#1c1c20] shadow-pop">
            <DateRangeCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              blocked={blockedSet}
              months={1}
              onChange={(ci, co) => {
                setCheckIn(ci);
                setCheckOut(co);
                if (ci && co) setCalendarOpen(false);
              }}
            />
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}

      <button
        onClick={reserve}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-arches to-rausch py-3.5 text-base font-semibold text-white transition hover:brightness-110"
      >
        Reserve
      </button>
      <p className="mt-3 text-center text-sm text-foggy dark:text-[#a8a8ad]">You won&apos;t be charged yet</p>

      {nights > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="underline">
              {formatPrice(pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {cleaning > 0 && (
            <div className="flex justify-between text-sm">
              <span className="underline">Cleaning fee</span>
              <span>{formatPrice(cleaning)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="underline">Airbnb service fee</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <hr className="border-line dark:border-[#38383d]" />
          <div className="flex justify-between pt-1 font-semibold">
            <span>Total before taxes</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
