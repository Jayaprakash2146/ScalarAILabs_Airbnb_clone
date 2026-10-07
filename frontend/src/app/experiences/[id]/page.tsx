"use client";

/** Experience detail — gallery, host, itinerary, reviews and a booking card. */
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { StarIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";
import { getExperience } from "@/lib/experiences";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [booking, setBooking] = useState(false);

  const exp = getExperience(id);

  if (!exp) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-semibold">Experience not found</h1>
        <button
          onClick={() => router.push("/experiences")}
          className="mt-6 rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-hof"
        >
          Browse experiences
        </button>
      </div>
    );
  }

  const book = () => {
    if (!user) {
      toast("Log in to book this experience", "info");
      router.push(`/login?next=/experiences/${exp.id}`);
      return;
    }
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      toast("Booking request sent! This is a mocked checkout — no payment taken. 🎉", "success");
    }, 900);
  };

  return (
    <div className="pb-24">
      <div className="relative mx-auto aspect-[21/9] w-full max-w-[1780px] overflow-hidden rounded-none md:rounded-xl">
        <Image src={exp.images[0]} alt={exp.title} fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="mx-auto grid max-w-[1780px] gap-12 px-6 pt-8 md:px-10 lg:grid-cols-[1fr_400px] lg:px-20">
        <div>
          {exp.tag === "Original" && (
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1.5 text-xs font-bold italic dark:bg-[#2a2a2e]">
              ✏️ Airbnb Original
            </span>
          )}
          <h1 className="text-3xl font-semibold">{exp.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
            <span className="flex items-center gap-1 font-semibold">
              <StarIcon width={12} height={12} /> {exp.rating.toFixed(2)}
            </span>
            <span className="text-foggy dark:text-[#a8a8ad]">({exp.reviews} reviews)</span>
            <span>·</span>
            <span className="font-semibold underline">{exp.location}</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            {exp.images.slice(1).map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
                <Image src={src} alt={`${exp.title} photo ${i + 2}`} fill sizes="400px" className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-line pt-6 dark:border-[#38383d]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rausch text-lg font-semibold text-white">
              {exp.host[0]}
            </span>
            <div>
              <p className="font-semibold">Hosted by {exp.host}</p>
              <p className="text-sm text-foggy dark:text-[#a8a8ad]">
                {exp.duration} · {exp.groupSize}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6 dark:border-[#38383d]">
            <h2 className="mb-3 text-xl font-semibold">What you&apos;ll do</h2>
            <p className="text-[15px] leading-6 text-hof/90 dark:text-[#f0f0f0]/90">{exp.description}</p>
          </div>

          <div className="mt-8 border-t border-line pt-6 dark:border-[#38383d]">
            <h2 className="mb-4 text-xl font-semibold">
              <StarIcon width={18} height={18} className="mr-1 inline" /> {exp.rating.toFixed(2)} ·{" "}
              {exp.reviews} reviews
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                ["Priya", "An unforgettable morning — the host made everyone feel welcome and the photos came out stunning."],
                ["Daniel", "Couldn't recommend this more. Great pace, great stories, and worth every rupee."],
              ].map(([name, text]) => (
                <div key={name}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-sm font-semibold dark:bg-[#2a2a2e]">
                      {name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-foggy dark:text-[#a8a8ad]">
                        ★★★★★ · 2 weeks ago
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-5 text-hof/90 dark:text-[#f0f0f0]/90">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking card */}
        <div className="relative">
          <div className="rounded-2xl border border-line p-6 shadow-card dark:border-[#38383d] lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <p className="text-xl">
                From <span className="font-semibold">{formatPrice(exp.price)}</span> /guest
              </p>
              <span className="flex items-center gap-1 text-sm">
                <StarIcon width={12} height={12} /> {exp.rating.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-babu">Free cancellation</p>
            <div className="mt-4 space-y-2">
              {["Friday, 9 October · 12:30 – 2:00 pm", "Saturday, 10 October · 4:30 – 6:00 pm", "Monday, 12 October · 10:30 am – 12:00 pm"].map(
                (slot, i) => (
                  <div
                    key={slot}
                    className={`rounded-xl border p-3 text-sm ${
                      i === 0
                        ? "border-2 border-hof dark:border-white"
                        : "border-line dark:border-[#38383d]"
                    }`}
                  >
                    {slot}
                    {i === 0 && <span className="float-right text-xs font-semibold text-rausch">2 spots left</span>}
                  </div>
                )
              )}
            </div>
            <button
              onClick={book}
              disabled={booking}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-arches to-rausch py-3.5 text-base font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {booking ? "Booking…" : "Book this experience"}
            </button>
            <p className="mt-3 text-center text-xs text-foggy dark:text-[#a8a8ad]">
              Mocked checkout — no payment is taken.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
