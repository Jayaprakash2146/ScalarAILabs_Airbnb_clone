"use client";

/** Host dashboard: manage listings and view incoming bookings. */
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StarIcon } from "@/components/Icons";
import { deleteListing, hostBookings, myListings } from "@/lib/api";
import { formatPrice, formatRange, joinedIn, todayISO } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import type { Booking, ListingCardData } from "@/types";

export default function HostDashboard() {
  const { user, ready } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<"listings" | "bookings">("listings");
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [incoming, setIncoming] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    Promise.all([myListings(), hostBookings()])
      .then(([mine, host]) => {
        setListings(mine);
        setIncoming(host);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [user]);

  if (ready && !user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold">Log in to host</h1>
        <p className="mt-3 text-foggy dark:text-[#a8a8ad]">Create listings and manage bookings once you&apos;re signed in.</p>
        <button
          onClick={() => router.push("/login?next=/host")}
          className="mt-6 rounded-xl bg-gradient-to-r from-arches to-rausch px-6 py-3.5 text-sm font-semibold text-white"
        >
          Log in
        </button>
      </div>
    );
  }

  const remove = async (l: ListingCardData) => {
    if (!confirm(`Delete "${l.title}"? This also removes its bookings and reviews.`)) return;
    try {
      await deleteListing(l.id);
      setListings((prev) => prev.filter((x) => x.id !== l.id));
      toast("Listing deleted", "info");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const today = todayISO();
  const upcoming = incoming.filter((b) => b.status === "confirmed" && b.check_out >= today);
  const past = incoming.filter((b) => b.status !== "confirmed" || b.check_out < today);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Host dashboard</h1>
          {user && (
            <p className="mt-1 text-sm text-foggy dark:text-[#a8a8ad]">
              {user.is_host
                ? `Hosting since ${joinedIn(user.created_at)}`
                : "You're not hosting yet — publish your first listing below!"}
            </p>
          )}
        </div>
        <Link
          href="/host/listings/new"
          className="rounded-xl bg-gradient-to-r from-arches to-rausch px-6 py-3.5 text-sm font-semibold text-white hover:brightness-110"
        >
          + Create new listing
        </Link>
      </div>

      <div className="mt-6 flex gap-2 border-b border-line dark:border-[#38383d]">
        {(
          [
            ["listings", `Your listings (${listings.length})`],
            ["bookings", `Received bookings (${incoming.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === key ? "border-hof text-hof dark:text-[#f0f0f0]" : "border-transparent text-foggy dark:text-[#a8a8ad] hover:text-hof"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-mist dark:bg-[#2a2a2e]" />
      ) : tab === "listings" ? (
        listings.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-semibold">No listings yet</p>
            <p className="mt-2 text-foggy dark:text-[#a8a8ad]">Your listings will appear here once you create them.</p>
            <Link
              href="/host/listings/new"
              className="mt-6 inline-block rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-hof"
            >
              Create listing
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {listings.map((l) => (
              <div key={l.id} className="flex gap-4 rounded-2xl border border-line dark:border-[#38383d] p-4">
                <Link
                  href={`/listing/${l.id}`}
                  className="relative h-28 w-36 shrink-0 overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]"
                >
                  <Image src={l.images[0]?.url ?? ""} alt="" fill sizes="144px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/listing/${l.id}`} className="truncate font-semibold hover:underline">
                      {l.title}
                    </Link>
                    <span className="flex shrink-0 items-center gap-1 text-sm">
                      <StarIcon width={11} height={11} />
                      {l.rating > 0 ? l.rating.toFixed(2) : "New"}
                    </span>
                  </div>
                  <p className="truncate text-sm text-foggy dark:text-[#a8a8ad]">
                    {l.city}, {l.country} · {l.room_type}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatPrice(l.price_per_night)} <span className="font-normal">night</span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Link
                      href={`/host/listings/${l.id}/edit`}
                      className="rounded-lg border border-line dark:border-[#38383d] px-3 py-1.5 text-xs font-semibold hover:border-hof"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(l)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="mt-8 space-y-10">
          {incoming.length === 0 ? (
            <p className="py-20 text-center text-foggy dark:text-[#a8a8ad]">No bookings on your listings yet.</p>
          ) : (
            <>
              {upcoming.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-semibold">Upcoming</h2>
                  <div className="space-y-4">
                    {upcoming.map((b) => (
                      <BookingRow key={b.id} b={b} />
                    ))}
                  </div>
                </section>
              )}
              {past.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-semibold">Past & cancelled</h2>
                  <div className="space-y-4">
                    {past.map((b) => (
                      <BookingRow key={b.id} b={b} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function BookingRow({ b }: { b: Booking }) {
  const cancelled = b.status === "cancelled";
  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-line dark:border-[#38383d] p-4 ${cancelled ? "opacity-60" : ""}`}>
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-mist dark:bg-[#2a2a2e]">
        <Image src={b.listing.images[0]?.url ?? ""} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/listing/${b.listing.id}`} className="truncate font-semibold hover:underline">
          {b.listing.title}
        </Link>
        <p className="text-sm text-foggy dark:text-[#a8a8ad]">
          {formatRange(b.check_in, b.check_out)} · {b.nights} nights · {b.num_guests} guests
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {b.guest.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.guest.avatar_url} alt={b.guest.name} className="h-8 w-8 rounded-full object-cover" />
          )}
          <span className="text-sm font-medium">{b.guest.name}</span>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            cancelled ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {cancelled ? "Cancelled" : "Confirmed"}
        </span>
        <span className="w-24 text-right text-sm font-semibold">{formatPrice(b.total_price)}</span>
      </div>
    </div>
  );
}
