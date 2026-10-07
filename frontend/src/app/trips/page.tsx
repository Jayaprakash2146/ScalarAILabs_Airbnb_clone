"use client";

/** My Trips: upcoming and past bookings of the logged-in guest. */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StarIcon } from "@/components/Icons";
import { cancelBooking, myBookings } from "@/lib/api";
import { formatPrice, formatRange, nightsBetween, todayISO } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import type { Booking } from "@/types";

export default function TripsPage() {
  const { user, ready } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    myBookings()
      .then(setBookings)
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, [user]);

  if (ready && !user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold">Log in to see your trips</h1>
        <p className="mt-3 text-foggy dark:text-[#a8a8ad]">Save your bookings and manage them in one place.</p>
        <button
          onClick={() => router.push("/login?next=/trips")}
          className="mt-6 rounded-xl bg-gradient-to-r from-arches to-rausch px-6 py-3.5 text-sm font-semibold text-white"
        >
          Log in
        </button>
      </div>
    );
  }

  const today = todayISO();
  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && b.check_out >= today
  );
  const past = bookings.filter((b) => b.status !== "confirmed" || b.check_out < today);

  const cancel = async (b: Booking) => {
    try {
      await cancelBooking(b.id);
      setBookings((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, status: "cancelled" } : x))
      );
      toast("Booking cancelled — dates released", "info");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not cancel", "error");
    }
  };

  const Card = ({ b }: { b: Booking }) => {
    const cancelled = b.status === "cancelled";
    const isPast = b.check_out < today && !cancelled;
    return (
      <div className={`flex gap-4 rounded-2xl border border-line dark:border-[#38383d] p-4 ${cancelled ? "opacity-60" : ""}`}>
        <div
          className="relative h-28 w-36 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]"
          onClick={() => router.push(`/listing/${b.listing.id}`)}
        >
          <Image src={b.listing.images[0]?.url ?? ""} alt="" fill sizes="144px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-wide ${cancelled ? "text-red-500" : "text-babu"}`}>
                {cancelled ? "Cancelled" : isPast ? "Completed" : "Upcoming"}
              </p>
              <Link
                href={`/listing/${b.listing.id}`}
                className="mt-0.5 block truncate font-semibold hover:underline"
              >
                {b.listing.title}
              </Link>
              <p className="truncate text-sm text-foggy dark:text-[#a8a8ad]">
                {b.listing.city}, {b.listing.country}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm">
              <StarIcon width={11} height={11} />
              {b.listing.rating > 0 ? b.listing.rating.toFixed(2) : "New"}
            </span>
          </div>
          <p className="mt-1 text-sm">
            {formatRange(b.check_in, b.check_out)} · {nightsBetween(b.check_in, b.check_out)} nights ·{" "}
            {b.num_guests} guest{b.num_guests > 1 ? "s" : ""}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-semibold">{formatPrice(b.total_price)} total</p>
            {!cancelled && !isPast && (
              <button
                onClick={() => cancel(b)}
                className="rounded-lg border border-line dark:border-[#38383d] px-3 py-1.5 text-xs font-semibold hover:border-hof"
              >
                Cancel booking
              </button>
            )}
            {isPast && (
              <Link
                href={`/listing/${b.listing.id}`}
                className="rounded-lg border border-line dark:border-[#38383d] px-3 py-1.5 text-xs font-semibold hover:border-hof"
              >
                Review stay
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Trips</h1>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-mist dark:bg-[#2a2a2e]" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-xl font-semibold">No trips booked… yet!</p>
          <p className="mt-2 text-foggy dark:text-[#a8a8ad]">Time to dust off your bags and start planning your next adventure.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-gradient-to-r from-arches to-rausch px-6 py-3.5 text-sm font-semibold text-white"
          >
            Start searching
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Upcoming reservations</h2>
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <Card key={b.id} b={b} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Where you&apos;ve been</h2>
              <div className="space-y-4">
                {past.map((b) => (
                  <Card key={b.id} b={b} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
