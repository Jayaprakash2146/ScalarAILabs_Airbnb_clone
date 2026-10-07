"use client";

/**
 * "All" tab — Airbnb's mixed browse page: destination tiles (which run real
 * searches on our listings) plus quick rows into Homes / Experiences / Services.
 */
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchListings } from "@/lib/api";
import { EXPERIENCES } from "@/lib/experiences";
import { SERVICES } from "@/lib/services";
import type { ListingCardData } from "@/types";

const DESTINATIONS: { city: string; subtitle: string; image: string }[] = [
  { city: "Goa", subtitle: "Prime beach spot", image: "1507525428034-b723cf961d3e" },
  { city: "Manali", subtitle: "For mountain views", image: "1506905925346-21bda4d32df4" },
  { city: "Jaipur", subtitle: "For its palaces", image: "1476514525535-07fb3b4ae5f1" },
  { city: "Udaipur", subtitle: "For its lakes", image: "1439066615861-d1af74d74000" },
  { city: "Mumbai", subtitle: "For the city life", image: "1484154218962-a197022b5858" },
  { city: "Kochi", subtitle: "For its backwaters", image: "1439066615861-d1af74d74000" },
  { city: "Rishikesh", subtitle: "For riverside yoga", image: "1506126613408-eca07ce68773" },
  { city: "Pondicherry", subtitle: "For French quarters", image: "1520250497591-112f2f40a3f4" },
];

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export default function AllPage() {
  const router = useRouter();
  const [homes, setHomes] = useState<ListingCardData[]>([]);

  useEffect(() => {
    searchListings({ sort: "rating_desc", page_size: 8 })
      .then((r) => setHomes(r.items))
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-[1760px] space-y-12 px-6 pb-20 pt-8 md:px-10 lg:px-20">
      {/* Destinations for you */}
      <section>
        <h1 className="mb-5 text-2xl font-semibold">Destinations for you</h1>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {DESTINATIONS.map((d) => (
            <div
              key={d.city}
              className="w-[190px] shrink-0 cursor-pointer"
              onClick={() => router.push(`/?location=${encodeURIComponent(d.city)}`)}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-mist dark:bg-[#2a2a2e]">
                <Image src={img(d.image)} alt={d.city} fill sizes="190px" className="object-cover transition-transform duration-300 hover:scale-105" />
              </div>
              <p className="pt-2 font-medium">{d.city}</p>
              <p className="text-sm text-foggy dark:text-[#a8a8ad]">{d.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Homes */}
      <section>
        <h2 className="mb-5 flex items-center gap-3 text-2xl font-semibold">
          Homes guests love
          <span
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-line text-sm dark:border-[#38383d]"
            onClick={() => router.push("/")}
          >
            →
          </span>
        </h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {homes.map((l) => (
            <div
              key={l.id}
              className="w-[236px] shrink-0 cursor-pointer"
              onClick={() => router.push(`/listing/${l.id}`)}
            >
              <div className="relative aspect-[20/19] w-full overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
                <Image src={l.images[0]?.url ?? ""} alt={l.title} fill sizes="236px" className="object-cover" />
              </div>
              <p className="truncate pt-2 text-sm font-medium">
                {l.property_type} in {l.city}
              </p>
              <p className="text-sm text-foggy dark:text-[#a8a8ad]">
                ₹{l.price_per_night.toLocaleString("en-IN")} for 1 night
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section>
        <h2 className="mb-5 text-2xl font-semibold">Experiences</h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {EXPERIENCES.slice(0, 6).map((e) => (
            <div
              key={e.id}
              className="w-[280px] shrink-0 cursor-pointer"
              onClick={() => router.push(`/experiences/${e.id}`)}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
                <Image src={e.images[0]} alt={e.title} fill sizes="280px" className="object-cover" />
              </div>
              <p className="truncate pt-2 text-sm font-medium">{e.title}</p>
              <p className="text-sm text-foggy dark:text-[#a8a8ad]">{e.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section>
        <h2 className="mb-5 text-2xl font-semibold">Services</h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {SERVICES.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="w-[280px] shrink-0 cursor-pointer"
              onClick={() => router.push(`/services/${s.id}`)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
                <Image src={s.images[0]} alt={s.title} fill sizes="280px" className="object-cover" />
              </div>
              <p className="truncate pt-2 text-sm font-medium">{s.title}</p>
              <p className="text-sm text-foggy dark:text-[#a8a8ad]">{s.location}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
