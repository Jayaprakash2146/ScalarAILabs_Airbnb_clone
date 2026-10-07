"use client";

/** 5-photo mosaic gallery with a "Show all photos" lightbox. */
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CloseIcon, HeartIcon, StarIcon } from "@/components/Icons";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { toggleWishlist } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { ListingDetail } from "@/types";

interface Props {
  listing: ListingDetail;
  wishlisted: boolean;
  onWishlistChange: (wished: boolean) => void;
}

export default function PhotoGallery({ listing, wishlisted, onWishlistChange }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [fav, setFav] = useState(wishlisted);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => setFav(wishlisted), [wishlisted]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % listing.images.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? null : (i - 1 + listing.images.length) % listing.images.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, listing.images.length]);

  const favClick = async () => {
    if (!user) {
      toast("Log in to save homes you love", "info");
      router.push(`/login?next=/listing/${listing.id}`);
      return;
    }
    try {
      const res = await toggleWishlist(listing.id);
      setFav(res.wishlisted);
      onWishlistChange(res.wishlisted);
      toast(res.wishlisted ? "Saved to wishlist ❤️" : "Removed from wishlist", res.wishlisted ? "success" : "info");
    } catch {
      toast("Could not update wishlist", "error");
    }
  };

  const imgs = listing.images;
  const grid = [
    "col-span-2 row-span-2",
    "", "", "", "",
  ];

  return (
    <>
      <div className="relative mx-auto max-w-[1780px] px-4 md:px-6 lg:px-10">
        <div className="relative grid aspect-[21/9] w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl max-md:aspect-square max-md:grid-cols-1 max-md:grid-rows-1">
          {imgs.slice(0, 5).map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightbox(i)}
              className={`group relative overflow-hidden bg-mist dark:bg-[#2a2a2e] max-md:hidden ${grid[i]}`}
              aria-label={`Open photo ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={`${listing.title} photo ${i + 1}`}
                fill
                priority={i < 2}
                sizes="(max-width: 1024px) 50vw, 40vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
          {/* Mobile: single cover photo */}
          <div className="relative overflow-hidden bg-mist dark:bg-[#2a2a2e] md:hidden">
            <Image
              src={imgs[0]?.url ?? ""}
              alt={listing.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <button
          onClick={() => setLightbox(0)}
          className="absolute bottom-5 right-8 rounded-lg border border-hof bg-white dark:bg-[#1c1c20] px-3.5 py-1.5 text-sm font-semibold shadow hover:bg-mist dark:hover:bg-[#2a2a2e] max-md:hidden"
        >
          Show all photos
        </button>

        <button
          onClick={favClick}
          className={`absolute right-6 top-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold underline max-md:hidden ${
            fav ? "text-rausch" : "text-hof dark:text-[#f0f0f0]"
          }`}
        >
          <HeartIcon filled={fav} width={22} height={22} />
          {fav ? "Saved" : "Save"}
        </button>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-black">
          <div className="flex items-center justify-between p-4 text-white">
            <button onClick={() => setLightbox(null)} aria-label="Close gallery" className="rounded-full p-2 hover:bg-white/10">
              <CloseIcon />
            </button>
            <p className="text-sm">
              {lightbox + 1} / {imgs.length}
            </p>
            <button onClick={favClick} className="flex items-center gap-2 text-sm">
              <HeartIcon filled={fav} width={22} height={22} />
              {fav ? "Saved" : "Save"}
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-8">
            <button
              aria-label="Previous photo"
              onClick={() => setLightbox((lightbox - 1 + imgs.length) % imgs.length)}
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#1c1c20] text-hof dark:text-[#f0f0f0]"
            >
              <ChevronLeft />
            </button>
            <div className="relative h-full max-h-[80vh] w-full max-w-5xl">
              <Image
                src={imgs[lightbox].url}
                alt={`${listing.title} photo ${lightbox + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              aria-label="Next photo"
              onClick={() => setLightbox((lightbox + 1) % imgs.length)}
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#1c1c20] text-hof dark:text-[#f0f0f0]"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="hidden justify-center gap-2 overflow-x-auto p-4 md:flex">
            {imgs.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightbox(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                  i === lightbox ? "border-white" : "border-transparent opacity-60"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
