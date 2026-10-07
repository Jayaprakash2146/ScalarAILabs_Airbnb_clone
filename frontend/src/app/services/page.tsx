"use client";

/** Services landing — browsable grid of host services (mocked vertical). */
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon, StarIcon } from "@/components/Icons";
import { SERVICES } from "@/lib/services";
import { formatPrice } from "@/lib/format";

const GROUPS: { title: string; filter: (loc: string) => boolean }[] = [
  { title: "Services in Goa", filter: (loc) => loc.includes("Goa") },
  { title: "Services across India", filter: () => true },
];

export default function ServicesPage() {
  const router = useRouter();
  const [favs, setFavs] = useState<Set<string>>(new Set());

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const Card = ({ s }: { s: (typeof SERVICES)[number] }) => (
    <div className="w-full cursor-pointer" onClick={() => router.push(`/services/${s.id}`)}>
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
        <Image
          src={s.images[0]}
          alt={s.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          aria-label="Save"
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(s.id);
          }}
          className={`absolute right-3 top-3 z-10 transition-transform hover:scale-110 ${
            favs.has(s.id) ? "text-rausch" : ""
          }`}
        >
          <HeartIcon filled={favs.has(s.id)} width={24} height={24} />
        </button>
      </div>
      <p className="pt-2.5 font-semibold leading-5">{s.title}</p>
      <p className="text-sm">
        From <span className="font-semibold">{formatPrice(s.price)}</span> / {s.unit}
        {s.rating > 0 && (
          <span className="ml-1 inline-flex items-center gap-0.5">
            · <StarIcon width={11} height={11} /> {s.rating.toFixed(1)}
          </span>
        )}
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1760px] space-y-12 px-6 pb-20 pt-8 md:px-10 lg:px-20">
      <div>
        <h1 className="text-3xl font-semibold">Services that go the extra mile</h1>
        <p className="mt-1 text-sm text-foggy dark:text-[#a8a8ad]">
          Locals offering photography, wellness, food and more — booked alongside your stay.
        </p>
      </div>

      {GROUPS.map((g) => {
        const items = SERVICES.filter((s) => g.filter(s.location));
        if (items.length === 0) return null;
        return (
          <section key={g.title}>
            <h2 className="mb-5 flex items-center gap-3 text-2xl font-semibold">
              {g.title}
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sm dark:border-[#38383d]">
                →
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((s) => (
                <Card key={s.id} s={s} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-foggy dark:text-[#a8a8ad]">
        Services are a mocked vertical for this assignment — booking is simulated and no payment is taken.
      </p>
    </div>
  );
}
