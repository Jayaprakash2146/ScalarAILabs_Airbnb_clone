"use client";

/**
 * Logged-in Airbnb landing rows: horizontally scrolling sections like
 * "Guest favourite homes in …" / "Available next month in …".
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, HeartIcon, StarIcon } from "@/components/Icons";
import { addDays, formatPrice, toISODate } from "@/lib/format";
import { searchListings } from "@/lib/api";
import type { ListingCardData } from "@/types";

interface Row {
  title: string;
  subtitle?: string;
  listings: ListingCardData[];
}

function RowCard({ listing }: { listing: ListingCardData }) {
  const router = useRouter();
  const cover = listing.images[0]?.url ?? "";
  const guestFavourite = listing.rating >= 4.8 && listing.reviews_count >= 3;
  return (
    <div
      className="w-[236px] shrink-0 cursor-pointer"
      onClick={() => router.push(`/listing/${listing.id}`)}
    >
      <div className="group relative aspect-[20/19] w-full overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
        <Image src={cover} alt={listing.title} fill sizes="248px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        {guestFavourite && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-semibold text-hof shadow">
            🏆 Guest favourite
          </span>
        )}
        <button
          aria-label="Save to wishlist"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/listing/${listing.id}`);
          }}
          className="absolute right-3 top-3 z-10 transition-transform hover:scale-110"
        >
          <HeartIcon width={24} height={24} />
        </button>
      </div>
      <div className="pt-2.5">
        <p className="truncate font-semibold leading-5">
          {listing.property_type} in {listing.city}
        </p>
        <p className="mt-0.5 text-[15px]">
          <span className="font-semibold">{formatPrice(listing.price_per_night)}</span> for 1 night
          {listing.rating > 0 && (
            <span className="ml-1 inline-flex items-center gap-0.5 text-sm">
              · <StarIcon width={11} height={11} /> {listing.rating.toFixed(2)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div className="relative">
      <div ref={scroller} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-1">
        {children}
      </div>
      <button
        aria-label="Scroll left"
        onClick={() => scroller.current?.scrollBy({ left: -540, behavior: "smooth" })}
        className="absolute -left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-search hover:scale-105 dark:border-[#38383d] dark:bg-[#2a2a2e] md:flex"
      >
        <ChevronLeft width={14} height={14} />
      </button>
      <button
        aria-label="Scroll right"
        onClick={() => scroller.current?.scrollBy({ left: 540, behavior: "smooth" })}
        className="absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-search hover:scale-105 dark:border-[#38383d] dark:bg-[#2a2a2e] md:flex"
      >
        <ChevronRight width={14} height={14} />
      </button>
    </div>
  );
}

export default function HomeRows() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const in30 = toISODate(addDays(new Date(), 30));
    const in34 = toISODate(addDays(new Date(), 34));
    Promise.all([
      searchListings({ location: "Goa", page_size: 8 }),
      searchListings({ location: "Mumbai", check_in: in30, check_out: in34, guests: 2, page_size: 8 }),
      searchListings({ sort: "rating_desc", page_size: 12 }),
    ])
      .then(([goa, mumbai, top]) => {
        const built: Row[] = [];
        const fillTo = (base: ListingCardData[], pool: ListingCardData[], n = 8) => {
          const seen = new Set(base.map((l) => l.id));
          const extra = pool.filter((l) => !seen.has(l.id));
          return [...base, ...extra].slice(0, Math.min(n, base.length + extra.length));
        };
        const goaRow = fillTo(goa.items, top.items, 6);
        const mumbaiRow = fillTo(mumbai.items, top.items, 6);
        const topRow = fillTo(top.items, top.items, 8);
        if (goaRow.length) built.push({ title: "Places to stay in Goa", listings: goaRow });
        if (mumbaiRow.length)
          built.push({
            title: "Available next month in Mumbai",
            subtitle: "Indian guests often rate these homes highly",
            listings: mumbaiRow,
          });
        if (topRow.length)
          built.push({ title: "Guest favourite homes", subtitle: "Highest rated stays on Airbnb clone", listings: topRow });
        setRows(built);
      })
      .catch(() => undefined);
  }, []);

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-[1760px] space-y-10 px-6 pb-6 pt-8 md:px-10 lg:px-20">
        {[1, 2].map((i) => (
          <div key={i}>
            <div className="mb-4 h-7 w-72 animate-pulse rounded bg-mist dark:bg-[#2a2a2e]" />
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="w-[248px] shrink-0">
                  <div className="aspect-[20/19] animate-pulse rounded-xl bg-mist dark:bg-[#2a2a2e]" />
                  <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-mist dark:bg-[#2a2a2e]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1760px] space-y-10 px-6 pb-6 pt-8 md:px-10 lg:px-20">
      {rows.map((row) => (
        <section key={row.title}>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                {row.title}
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sm dark:border-[#38383d]">
                  →
                </span>
              </h2>
              {row.subtitle && <p className="mt-0.5 text-sm text-foggy dark:text-[#a8a8ad]">{row.subtitle}</p>}
            </div>
          </div>
          <ScrollRow>
            {row.listings.map((l) => (
              <RowCard key={l.id} listing={l} />
            ))}
          </ScrollRow>
        </section>
      ))}
    </div>
  );
}
