"use client";

/**
 * Experiences landing — Airbnb-style rows and grid of bookable experiences
 * backed by static mock data (mocked vertical per the assignment).
 */
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon, StarIcon } from "@/components/Icons";
import { EXPERIENCES } from "@/lib/experiences";
import { formatPrice } from "@/lib/format";

export default function ExperiencesPage() {
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

  const originals = EXPERIENCES.filter((e) => e.tag === "Original");
  const rest = EXPERIENCES.filter((e) => e.tag !== "Original");

  const Card = ({ exp, originalsBadge }: { exp: (typeof EXPERIENCES)[number]; originalsBadge?: boolean }) => (
    <div
      className="group w-[280px] shrink-0 cursor-pointer"
      onClick={() => router.push(`/experiences/${exp.id}`)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
        <Image
          src={exp.images[0]}
          alt={exp.title}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {originalsBadge && (
          <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-bold italic text-hof shadow">
            ✏️ Original
          </span>
        )}
        <button
          aria-label="Save"
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(exp.id);
          }}
          className={`absolute right-3 top-3 z-10 transition-transform hover:scale-110 ${
            favs.has(exp.id) ? "text-rausch" : ""
          }`}
        >
          <HeartIcon filled={favs.has(exp.id)} width={24} height={24} />
        </button>
      </div>
      <p className="pt-2.5 text-[15px] font-semibold leading-5">{exp.title}</p>
      <p className="text-sm text-foggy dark:text-[#a8a8ad]">{exp.location}</p>
      <p className="flex items-center gap-1 text-sm">
        From <span className="font-semibold">{formatPrice(exp.price)}</span> /guest
        <span className="ml-1 inline-flex items-center gap-0.5">
          <StarIcon width={11} height={11} /> {exp.rating.toFixed(1)}
        </span>
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1760px] space-y-12 px-6 pb-20 pt-8 md:px-10 lg:px-20">
      <section>
        <div className="mb-5">
          <h1 className="flex items-center gap-3 text-3xl font-semibold">
            Airbnb Originals
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm dark:border-[#38383d]">
              →
            </span>
          </h1>
          <p className="mt-1 text-sm text-foggy dark:text-[#a8a8ad]">
            Hosted by the world&apos;s most interesting people
          </p>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {originals.map((e) => (
            <Card key={e.id} exp={e} originalsBadge />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-semibold">Popular with travellers from your area</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rest.map((e) => (
            <div key={e.id} className="[&>div]:w-full">
              <Card exp={e} />
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-foggy dark:text-[#a8a8ad]">
        Experiences are a mocked vertical for this assignment — booking is simulated and no payment is taken.
      </p>
    </div>
  );
}
