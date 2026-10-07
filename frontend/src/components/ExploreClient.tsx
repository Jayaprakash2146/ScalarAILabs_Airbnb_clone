"use client";

/**
 * Explore page — Airbnb search results: quick amenity filter chips (or category
 * row on the default view), results heading with fees badge, listing grid and
 * pagination, plus an optional sticky split-screen map.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryRow from "@/components/CategoryRow";
import HomeRows from "@/components/HomeRows";
import ListingCard from "@/components/ListingCard";
import FiltersModal from "@/components/FiltersModal";
import type { FiltersState } from "@/components/FiltersModal";
import { ChevronLeft, ChevronRight, FilterIcon } from "@/components/Icons";
import { getAmenities, myWishlistIds, searchListings } from "@/lib/api";
import type { Amenity, ListingCardData, ListingPage } from "@/types";

// Leaflet touches window APIs — load the map only in the browser.
const ListingsMap = dynamic(() => import("@/components/ListingsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] w-full animate-pulse rounded-2xl bg-mist dark:bg-[#2a2a2e]" />
  ),
});

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price (lowest first)" },
  { value: "price_desc", label: "Price (highest first)" },
  { value: "rating_desc", label: "Top rated" },
];

export default function ExploreClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [data, setData] = useState<ListingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const category = params.get("category") ?? "All";
  const page = Number(params.get("page") ?? 1);
  const location = params.get("location") ?? "";
  const searching = Boolean(location);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const qs = new URLSearchParams(params.toString());
      if (value === null || value === "All") qs.delete(key);
      else qs.set(key, value);
      if (key !== "page") qs.delete("page");
      router.push(`/?${qs.toString()}`);
    },
    [params, router]
  );

  // Filters are fully derived from the URL — the URL is the single source of truth.
  const filters: FiltersState = useMemo(
    () => ({
      min_price: params.get("min_price")
        ? Number(params.get("min_price"))
        : undefined,
      max_price: params.get("max_price")
        ? Number(params.get("max_price"))
        : undefined,
      property_type: params.get("property_type") ?? undefined,
      room_type: params.get("room_type") ?? undefined,
      amenities: params.get("amenities") ?? undefined,
    }),
    [params]
  );

  useEffect(() => {
    getAmenities().then(setAmenities).catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams(params.toString());
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    if (category !== "All") qs.set("category", category);
    qs.set("page", String(page));
    qs.set("page_size", "18");
    searchListings(Object.fromEntries(qs.entries()))
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params, filters, category, page]);

  useEffect(() => {
    myWishlistIds()
      .then((res) => setWishlistIds(new Set(res.listing_ids)))
      .catch(() => undefined);
  }, []);

  const onWishlistChange = (id: number, wished: boolean) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (wished) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const selectedAmenityIds = filters.amenities
    ? filters.amenities.split(",").map(Number)
    : [];

  const toggleQuickAmenity = (id: number) => {
    const next = selectedAmenityIds.includes(id)
      ? selectedAmenityIds.filter((x) => x !== id)
      : [...selectedAmenityIds, id];
    const qs = new URLSearchParams(params.toString());
    qs.delete("page");
    if (next.length) qs.set("amenities", next.join(","));
    else qs.delete("amenities");
    router.push(`/?${qs.toString()}`);
  };

  const applyFilters = (f: FiltersState) => {
    const qs = new URLSearchParams(params.toString());
    qs.delete("page");
    (
      ["min_price", "max_price", "property_type", "room_type", "amenities"] as const
    ).forEach((k) => {
      if (f[k] !== undefined && f[k] !== "") qs.set(k, String(f[k]));
      else qs.delete(k);
    });
    router.push(`/?${qs.toString()}`);
  };

  const goToPage = (p: number) => {
    const qs = new URLSearchParams(params.toString());
    qs.set("page", String(p));
    router.push(`/?${qs.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Airbnb-style landing rows only on the pristine home; city searches jump straight to results */}
      {!searching && <HomeRows />}
      {/* Airbnb shows amenity quick-filters on search results, categories otherwise */}
      {searching ? (
        <div className="sticky top-[73px] z-40 border-b border-line bg-white dark:border-[#38383d] dark:bg-[#1c1c20]">
          <div className="no-scrollbar mx-auto flex max-w-[1760px] items-center gap-3 overflow-x-auto px-6 py-3 md:px-10 lg:px-20">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-line px-4 py-3 text-xs font-medium hover:shadow-search dark:border-[#38383d]"
            >
              <FilterIcon width={14} height={14} />
              Filters
            </button>
            {amenities.slice(0, 10).map((a) => {
              const on = selectedAmenityIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleQuickAmenity(a.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-medium transition-all ${
                    on
                      ? "border-hof bg-hof text-white dark:bg-white dark:text-hof"
                      : "border-line text-hof hover:border-hof dark:border-[#38383d] dark:text-[#f0f0f0]"
                  }`}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <CategoryRow
          active={category}
          onSelect={(c) => updateParam("category", c)}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      )}

      <div className="mx-auto max-w-[1760px] px-6 pb-16 pt-6 md:px-10 lg:px-20">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
          <h1 className="text-2xl font-semibold">
            {loading ? "Searching…" : `Over ${data?.total ?? 0} homes${location ? ` in ${location}` : ""}`}
          </h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm font-medium">
              <span className="text-base">💍</span> Prices include all fees
            </span>
            <button
              onClick={() => setShowMap((m) => !m)}
              className="flex items-center gap-2 rounded-xl border border-hof px-4 py-2 text-sm font-semibold transition-colors hover:bg-mist dark:hover:bg-[#2a2a2e]"
              aria-pressed={showMap}
            >
              {showMap ? "Show list" : "Show map"}
            </button>
            <select
              value={params.get("sort") ?? "recommended"}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none dark:border-[#38383d] dark:bg-[#1c1c20]"
              aria-label="Sort listings"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split layout: results left, sticky map right (Airbnb map view) */}
        <div className={showMap ? "flex flex-col gap-6 lg:flex-row" : ""}>
          <div className={showMap ? "min-w-0 flex-1" : "contents"}>
            {loading ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[20/19] w-full rounded-xl bg-mist dark:bg-[#2a2a2e]" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-mist dark:bg-[#2a2a2e]" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-mist dark:bg-[#2a2a2e]" />
                  </div>
                ))}
              </div>
            ) : data && data.items.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.items.map((l: ListingCardData) => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    wishlisted={wishlistIds.has(l.id)}
                    onWishlistChange={onWishlistChange}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-24 text-center">
                <p className="text-xl font-semibold">No exact matches</p>
                <p className="mt-2 max-w-md text-sm text-foggy dark:text-[#a8a8ad]">
                  Try changing or removing some of your filters, or adjusting your search area.
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-6 rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white hover:bg-black dark:bg-white dark:text-hof dark:hover:bg-[#e8e8e8]"
                >
                  Remove all filters
                </button>
              </div>
            )}

            {data && data.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-14">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line hover:border-hof disabled:opacity-30 dark:border-[#38383d]"
                  aria-label="Previous page"
                >
                  <ChevronLeft width={14} height={14} />
                </button>
                {Array.from({ length: data.pages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) < 3 || p === 1 || p === data.pages)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1">…</span>}
                      <button
                        onClick={() => goToPage(p)}
                        className={`h-9 min-w-9 rounded-lg px-2 text-sm ${
                          p === page
                            ? "bg-hof text-white dark:bg-white dark:text-hof"
                            : "border border-line hover:border-hof dark:border-[#38383d]"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= data.pages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line hover:border-hof disabled:opacity-30 dark:border-[#38383d]"
                  aria-label="Next page"
                >
                  <ChevronRight width={14} height={14} />
                </button>
              </div>
            )}
          </div>

          {showMap && (
            <div className="w-full lg:sticky lg:top-[90px] lg:h-[calc(100vh-110px)] lg:w-1/2 lg:self-start">
              {data && data.items.length > 0 ? (
                <ListingsMap listings={data.items} />
              ) : (
                <div className="h-72 animate-pulse rounded-2xl bg-mist dark:bg-[#2a2a2e]" />
              )}
            </div>
          )}
        </div>
      </div>

      <FiltersModal
        open={filtersOpen}
        initial={filters}
        amenities={amenities}
        onClose={() => setFiltersOpen(false)}
        onApply={applyFilters}
      />
    </>
  );
}
