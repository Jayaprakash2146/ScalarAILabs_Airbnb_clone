"use client";

/**
 * The signature Airbnb pill search bar.
 * Sections: Where (location) · Check in · Check out · Who (guests).
 * Navigates to the explore page with the selected filters as query params.
 */
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, CloseIcon } from "@/components/Icons";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { formatRange, nightsBetween } from "@/lib/format";

type Panel = "where" | "dates" | "who" | null;

/** Destination suggestions — matching is prefix-based on the city name. */
const DESTINATIONS: { city: string; region: string }[] = [
  { city: "Goa", region: "For its beaches" },
  { city: "Manali", region: "For Himalayan views" },
  { city: "Jaipur", region: "For its palaces" },
  { city: "Udaipur", region: "For its lakes" },
  { city: "Mumbai", region: "For the city life" },
  { city: "Bengaluru", region: "For gardens and pubs" },
  { city: "Kochi", region: "For its backwaters" },
  { city: "Rishikesh", region: "For riverside yoga" },
  { city: "Vijayawada", region: "For its temples" },
  { city: "Visakhapatnam", region: "For beach holidays" },
  { city: "Varanasi", region: "For spiritual stays" },
  { city: "Vadodara", region: "For heritage walks" },
  { city: "Pondicherry", region: "For French quarters" },
  { city: "Alibaug", region: "For weekend beaches" },
  { city: "Shimla", region: "For hill holidays" },
  { city: "Lonavala", region: "For monsoon getaways" },
  { city: "Coorg", region: "For coffee estates" },
  { city: "Jodhpur", region: "For desert forts" },
  { city: "New Delhi", region: "For history and food" },
  { city: "Nashik", region: "For vineyards" },
  { city: "Hyderabad", region: "For its biryani" },
  { city: "Chennai", region: "For marina sunrises" },
  { city: "Kolkata", region: "For colonial charm" },
  { city: "Pune", region: "For quick getaways" },
  { city: "Mysore", region: "For royal palaces" },
  { city: "Ahmedabad", region: "For its pols" },
  { city: "Gurugram", region: "For business travel" },
  { city: "Nagpur", region: "For tiger country" },
];

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();

  const [panel, setPanel] = useState<Panel>(null);
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [checkIn, setCheckIn] = useState(params.get("check_in") ?? null);
  const [checkOut, setCheckOut] = useState(params.get("check_out") ?? null);
  const [guests, setGuests] = useState({
    adults: Number(params.get("adults") ?? 0),
    children: Number(params.get("children") ?? 0),
    infants: Number(params.get("infants") ?? 0),
    pets: Number(params.get("pets") ?? 0),
  });
  const rootRef = useRef<HTMLDivElement>(null);

  // Re-sync when URL changes (e.g. browser back).
  useEffect(() => {
    setLocation(params.get("location") ?? "");
    setCheckIn(params.get("check_in") ?? null);
    setCheckOut(params.get("check_out") ?? null);
    setGuests({
      adults: Number(params.get("adults") ?? 0),
      children: Number(params.get("children") ?? 0),
      infants: Number(params.get("infants") ?? 0),
      pets: Number(params.get("pets") ?? 0),
    });
  }, [params]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setPanel(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const totalGuests = guests.adults + guests.children;
  const guestsLabel =
    totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}` : null;
  const datesLabel = checkIn && checkOut ? formatRange(checkIn, checkOut) : null;

  // Prefix-match destinations as the user types (e.g. "v" → Vijayawada, Visakhapatnam…)
  const matches = (() => {
    const q = location.trim().toLowerCase();
    if (!q) return DESTINATIONS.slice(0, 8);
    return DESTINATIONS.filter((d) => d.city.toLowerCase().startsWith(q)).slice(0, 8);
  })();

  const submit = (locOverride?: string) => {
    setPanel(null);
    const qs = new URLSearchParams();
    const loc = locOverride ?? location;
    if (loc.trim()) qs.set("location", loc.trim());
    if (checkIn) qs.set("check_in", checkIn);
    if (checkOut) qs.set("check_out", checkOut);
    if (totalGuests > 0) {
      qs.set("guests", String(totalGuests + guests.infants));
      qs.set("adults", String(guests.adults));
      qs.set("children", String(guests.children));
      if (guests.infants) qs.set("infants", String(guests.infants));
    }
    router.push(`/?${qs.toString()}`);
  };

  const step = (key: keyof typeof guests, delta: number) => {
    setGuests((g) => {
      const min = key === "adults" ? 1 : 0;
      const next = Math.min(16, Math.max(min, g[key] + delta));
      return { ...g, [key]: next };
    });
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-3xl">
      {/* The pill — labelled Where / When / Who, as on airbnb.com */}
      <div
        className={`flex min-h-16 items-center rounded-full border border-line bg-white shadow-search transition-shadow dark:border-[#38383d] dark:bg-[#1c1c20] ${
          panel ? "shadow-pop" : ""
        }`}
      >
        <button
          onClick={() => setPanel("where")}
          className={`h-full min-w-0 flex-1 rounded-l-full px-6 py-2.5 text-left hover:bg-mist dark:hover:bg-[#2a2a2e] ${
            panel === "where" ? "bg-mist dark:bg-[#2a2a2e]" : ""
          }`}
        >
          <span
            className={`block text-[12px] leading-4 ${
              panel === "where" ? "font-bold text-hof dark:text-[#f0f0f0]" : "font-semibold text-hof dark:text-[#f0f0f0]"
            }`}
          >
            Where
          </span>
          <input
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPanel("where");
            }}
            onFocus={() => setPanel("where")}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search destinations"
            className="w-full max-w-[300px] truncate border-0 bg-transparent p-0 text-sm text-hof placeholder:text-foggy outline-none dark:text-[#f0f0f0] dark:placeholder:text-[#a8a8ad]"
          />
        </button>
        <span className="h-8 w-px shrink-0 bg-line dark:bg-[#38383d]" />
        <button
          onClick={() => setPanel("dates")}
          className={`hidden h-full px-6 py-2.5 text-left hover:bg-mist dark:hover:bg-[#2a2a2e] md:block ${
            panel === "dates" ? "bg-mist dark:bg-[#2a2a2e]" : ""
          }`}
        >
          <span className="block text-[12px] font-semibold leading-4 text-hof dark:text-[#f0f0f0]">When</span>
          <span
            className={`block max-w-[160px] truncate text-sm ${
              datesLabel ? "font-medium text-hof dark:text-[#f0f0f0]" : "text-foggy dark:text-[#a8a8ad]"
            }`}
          >
            {datesLabel ?? "Add dates"}
          </span>
        </button>
        <span className="hidden h-8 w-px shrink-0 bg-line dark:bg-[#38383d] md:block" />
        <button
          onClick={() => setPanel("who")}
          className={`hidden h-full min-w-0 flex-1 px-6 py-2.5 text-left hover:bg-mist dark:hover:bg-[#2a2a2e] md:block ${
            panel === "who" ? "bg-mist dark:bg-[#2a2a2e]" : ""
          }`}
        >
          <span className="block text-[12px] font-semibold leading-4 text-hof dark:text-[#f0f0f0]">Who</span>
          <span
            className={`block truncate text-sm ${
              guestsLabel ? "font-medium text-hof dark:text-[#f0f0f0]" : "text-foggy dark:text-[#a8a8ad]"
            }`}
          >
            {guestsLabel ?? "Add guests"}
          </span>
        </button>
        <button
          onClick={() => submit()}
          aria-label="Search"
          className="mr-2 ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-arches to-rausch text-white transition hover:brightness-110"
        >
          <SearchIcon width={18} height={18} />
        </button>
      </div>
      {/* Panels */}
      {panel === "where" && (
        <div className="absolute left-0 top-[72px] z-40 w-[460px] max-w-[92vw] rounded-3xl bg-white dark:bg-[#1c1c20] p-6 shadow-pop">
          <div className="mb-3 flex items-center rounded-xl border border-line px-3 focus-within:border-hof dark:border-[#38383d]">
            <SearchIcon className="text-foggy dark:text-[#a8a8ad]" />
            <input
              autoFocus
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Search destinations"
              className="w-full bg-transparent px-3 py-3 text-sm outline-none"
            />
            {location && (
              <button onClick={() => setLocation("")} aria-label="Clear location">
                <CloseIcon className="text-foggy dark:text-[#a8a8ad]" />
              </button>
            )}
          </div>

          {/* Prefix-matched destination suggestions (Airbnb-style list) */}
          <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wide text-hof dark:text-[#f0f0f0]">
            {location.trim() ? "Destinations matching your search" : "Suggested destinations"}
          </p>
          <div className="max-h-[320px] space-y-1 overflow-y-auto">
            {matches.length === 0 ? (
              <div className="rounded-xl p-4 text-sm text-foggy dark:text-[#a8a8ad]">
                No destinations match “{location}”. Try another city, or press Search to browse all homes.
              </div>
            ) : (
              matches.map((d) => (
                <button
                  key={d.city}
                  onClick={() => {
                    setLocation(d.city);
                    submit(d.city);
                  }}
                  className="flex w-full items-center gap-4 rounded-xl p-2 text-left hover:bg-mist dark:hover:bg-[#2a2a2e]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-lg dark:border-[#38383d]">
                    📍
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-hof dark:text-[#f0f0f0]">
                      {d.city}, {d.region.includes("For") ? "India" : "India"}
                    </span>
                    <span className="block truncate text-sm text-foggy dark:text-[#a8a8ad]">
                      {d.region}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {panel === "dates" && (
        <div className="absolute left-1/2 top-[72px] z-40 w-max max-w-[95vw] -translate-x-1/2 overflow-x-auto rounded-3xl bg-white shadow-pop">
          <DateRangeCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(ci, co) => {
              setCheckIn(ci);
              setCheckOut(co);
              if (ci && co) setPanel("who");
            }}
            months={2}
          />
          <div className="flex items-center justify-between px-6 pb-4">
            <span className="text-sm text-foggy dark:text-[#a8a8ad]">
              {checkIn && checkOut
                ? `${nightsBetween(checkIn, checkOut)} nights selected`
                : "Select your dates"}
            </span>
            <button
              onClick={() => submit()}
              className="rounded-lg bg-hof px-5 py-2.5 text-sm font-semibold text-white hover:bg-black dark:hover:bg-[#e8e8e8]"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {panel === "who" && (
        <div className="absolute right-0 top-[72px] z-40 w-[380px] max-w-[92vw] rounded-3xl bg-white dark:bg-[#1c1c20] p-6 shadow-pop">
          {(
            [
              ["adults", "Adults", "Ages 13 or above"],
              ["children", "Children", "Ages 2 – 12"],
              ["infants", "Infants", "Under 2"],
              ["pets", "Pets", "Bringing a service animal?"],
            ] as const
          ).map(([key, label, sub]) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-line dark:border-[#38383d] py-4 last:border-0"
            >
              <div>
                <p className="text-base font-semibold">{label}</p>
                <p className="text-sm text-foggy dark:text-[#a8a8ad]">{sub}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  aria-label={`Decrease ${label}`}
                  onClick={() => step(key, -1)}
                  disabled={key === "adults" ? guests.adults <= 1 : guests[key] <= 0}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line dark:border-[#38383d] text-lg text-foggy dark:text-[#a8a8ad] hover:border-hof hover:text-hof disabled:opacity-30 disabled:hover:border-line dark:border-[#38383d] dark:hover:border-[#38383d] dark:disabled:hover:border-[#38383d]"
                >
                  −
                </button>
                <span className="w-4 text-center text-base">{guests[key]}</span>
                <button
                  aria-label={`Increase ${label}`}
                  onClick={() => step(key, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line dark:border-[#38383d] text-lg text-foggy dark:text-[#a8a8ad] hover:border-hof hover:text-hof"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => submit()}
            className="mt-4 w-full rounded-xl bg-hof py-3 text-sm font-semibold text-white hover:bg-black dark:hover:bg-[#e8e8e8]"
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
}
