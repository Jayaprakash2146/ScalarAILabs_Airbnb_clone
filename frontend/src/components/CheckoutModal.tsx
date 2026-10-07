"use client";

/** Mocked checkout modal: trip summary + fake payment + confirmation. */
import { useState } from "react";
import Image from "next/image";
import { CloseIcon, StarIcon } from "@/components/Icons";
import { formatPrice, formatRange, nightsBetween } from "@/lib/format";
import type { ListingCardData } from "@/types";

interface Props {
  open: boolean;
  listing: ListingCardData;
  checkIn: string;
  checkOut: string;
  guests: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function CheckoutModal({ open, listing, checkIn, checkOut, guests, onClose, onConfirm }: Props) {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = nights * listing.price_per_night;
  const cover = listing.images[0]?.url ?? "";

  const confirm = async () => {
    setProcessing(true);
    try {
      await onConfirm();
      setDone(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white dark:bg-[#1c1c20] p-6 shadow-pop">
        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-semibold">Booking confirmed!</h2>
            <p className="mt-2 text-sm text-foggy dark:text-[#a8a8ad]">
              {listing.title} is booked for {formatRange(checkIn, checkOut)}. This was a mocked
              checkout — no payment was processed.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-hof py-3 text-sm font-semibold text-white hover:bg-black dark:hover:bg-[#e8e8e8]"
            >
              View trip in My Trips
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <button onClick={onClose} aria-label="Close checkout" className="rounded-full p-2 hover:bg-mist dark:hover:bg-[#2a2a2e]">
                <CloseIcon />
              </button>
              <p className="text-sm font-semibold uppercase tracking-wide text-foggy dark:text-[#a8a8ad]">Confirm & pay</p>
              <span className="w-8" />
            </div>

            <div className="mb-4 flex gap-3 rounded-xl border border-line dark:border-[#38383d] p-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-mist dark:bg-[#2a2a2e]">
                <Image src={cover} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{listing.title}</p>
                <p className="truncate text-xs text-foggy dark:text-[#a8a8ad]">
                  {listing.city}, {listing.country}
                </p>
                {listing.rating > 0 && (
                  <p className="flex items-center gap-1 text-xs">
                    <StarIcon width={10} height={10} /> {listing.rating.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <h3 className="mb-2 text-base font-semibold">Your trip</h3>
            <dl className="mb-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-foggy dark:text-[#a8a8ad]">Dates</dt>
                <dd>{formatRange(checkIn, checkOut)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foggy dark:text-[#a8a8ad]">Guests</dt>
                <dd>
                  {guests} guest{guests > 1 ? "s" : ""}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foggy dark:text-[#a8a8ad]">Nights</dt>
                <dd>{nights}</dd>
              </div>
            </dl>

            <div className="rounded-xl bg-mist dark:bg-[#2a2a2e] p-3 text-xs text-foggy dark:text-[#a8a8ad]">
              <p className="font-semibold text-hof dark:text-[#f0f0f0]">Mocked payment</p>
              <p className="mt-1">
                Real payments are out of scope for this assignment — clicking Confirm simulates a
                successful card charge.
              </p>
            </div>

            <button
              onClick={confirm}
              disabled={processing}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-arches to-rausch py-3.5 text-base font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {processing ? "Confirming…" : `Confirm and pay ${formatPrice(Math.round(subtotal * 1.14))}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
