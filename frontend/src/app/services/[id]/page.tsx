"use client";

/** Service detail — gallery, host, description and a request card. */
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { StarIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";
import { getService } from "@/lib/services";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [requesting, setRequesting] = useState(false);

  const svc = getService(id);

  if (!svc) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-semibold">Service not found</h1>
        <button
          onClick={() => router.push("/services")}
          className="mt-6 rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-hof"
        >
          Browse services
        </button>
      </div>
    );
  }

  const request = () => {
    if (!user) {
      toast("Log in to request this service", "info");
      router.push(`/login?next=/services/${svc.id}`);
      return;
    }
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      toast("Request sent! The host will confirm shortly (mocked). 🎉", "success");
    }, 900);
  };

  return (
    <div className="pb-24">
      <div className="relative mx-auto aspect-[21/9] w-full max-w-[1780px] overflow-hidden md:rounded-xl">
        <Image src={svc.images[0]} alt={svc.title} fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="mx-auto grid max-w-[1780px] gap-12 px-6 pt-8 md:px-10 lg:grid-cols-[1fr_400px] lg:px-20">
        <div>
          <h1 className="text-3xl font-semibold">{svc.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
            <span className="flex items-center gap-1 font-semibold">
              <StarIcon width={12} height={12} /> {svc.rating.toFixed(1)}
            </span>
            <span className="text-foggy dark:text-[#a8a8ad]">({svc.reviews})</span>
            <span>·</span>
            <span className="font-semibold underline">{svc.location}</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            {svc.images.slice(1).map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
                <Image src={src} alt={`${svc.title} photo ${i + 2}`} fill sizes="400px" className="object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 border-t border-line pt-6 dark:border-[#38383d]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-babu text-lg font-semibold text-white">
              {svc.host[0]}
            </span>
            <div>
              <p className="font-semibold">Offered by {svc.host}</p>
              <p className="text-sm text-foggy dark:text-[#a8a8ad]">Duration: {svc.duration}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-6 dark:border-[#38383d]">
            <h2 className="mb-3 text-xl font-semibold">About this service</h2>
            <p className="text-[15px] leading-6 text-hof/90 dark:text-[#f0f0f0]/90">{svc.description}</p>
          </div>

          <div className="mt-8 border-t border-line pt-6 dark:border-[#38383d]">
            <h2 className="mb-4 text-xl font-semibold">
              <StarIcon width={18} height={18} className="mr-1 inline" /> {svc.rating.toFixed(1)} ·{" "}
              {svc.reviews} reviews
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                ["Aisha", "Professional, punctual and the results were beyond what we hoped for."],
                ["Marco", "Easy to coordinate with and clearly an expert. Would book again on our next trip."],
              ].map(([name, text]) => (
                <div key={name}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-sm font-semibold dark:bg-[#2a2a2e]">
                      {name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-foggy dark:text-[#a8a8ad]">★★★★★ · 1 month ago</p>
                    </div>
                  </div>
                  <p className="text-sm leading-5 text-hof/90 dark:text-[#f0f0f0]/90">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-line p-6 shadow-card dark:border-[#38383d] lg:sticky lg:top-28">
            <p className="text-xl">
              From <span className="font-semibold">{formatPrice(svc.price)}</span> / {svc.unit}
            </p>
            <p className="mt-1 text-xs font-medium text-babu">Free cancellation up to 48 hours before</p>
            <button
              onClick={request}
              disabled={requesting}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-arches to-rausch py-3.5 text-base font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {requesting ? "Sending…" : "Request to book"}
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
