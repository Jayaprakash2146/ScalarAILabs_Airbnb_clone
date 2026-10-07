"use client";

/**
 * Listing card in two Airbnb-faithful variants:
 * - "grid": search-result card (title line, rating with count, specs, price)
 * - "row" : compact landing-row card (title, price · rating)
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, HeartIcon, StarIcon } from "@/components/Icons";
import { formatPrice } from "@/lib/format";
import { toggleWishlist } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import type { ListingCardData } from "@/types";

interface Props {
  listing: ListingCardData;
  wishlisted?: boolean;
  onWishlistChange?: (id: number, wishlisted: boolean) => void;
  variant?: "grid" | "row";
}

function GuestFavouriteBadge({ compact }: { compact?: boolean }) {
  return (
    <span
      className={`absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold text-hof shadow ${
        compact ? "text-[11px]" : ""
      }`}
    >
      <span className="text-[10px] leading-none">🏆</span>
      Guest favourite
    </span>
  );
}

export default function ListingCard({
  listing,
  wishlisted = false,
  onWishlistChange,
  variant = "grid",
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [index, setIndex] = useState(0);
  const [fav, setFav] = useState(wishlisted);
  const images = listing.images.length
    ? listing.images
    : [{ id: 0, url: "/placeholder.svg", sort_order: 0 }];
  const count = images.length;
  const guestFavourite = listing.rating >= 4.8 && listing.reviews_count >= 3;

  const nav = (e: React.MouseEvent, dir: -1 | 1) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + dir + count) % count);
  };

  const favClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast("Log in to save homes you love", "info");
      router.push("/login?next=/");
      return;
    }
    try {
      const res = await toggleWishlist(listing.id);
      setFav(res.wishlisted);
      onWishlistChange?.(listing.id, res.wishlisted);
      toast(
        res.wishlisted ? "Saved to wishlist ❤️" : "Removed from wishlist",
        res.wishlisted ? "success" : "info"
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong", "error");
    }
  };

  return (
    <div className="cursor-pointer" onClick={() => router.push(`/listing/${listing.id}`)}>
      <div className="group relative aspect-[20/19] w-full overflow-hidden rounded-xl bg-mist dark:bg-[#2a2a2e]">
        <Image
          src={images[index].url}
          alt={listing.title}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {count > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={(e) => nav(e, -1)}
              className={`absolute left-2 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-hof shadow group-hover:flex ${
                index === 0 ? "opacity-0" : ""
              }`}
            >
              <ChevronLeft width={13} height={13} />
            </button>
            <button
              aria-label="Next photo"
              onClick={(e) => nav(e, 1)}
              className={`absolute right-2 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-hof shadow group-hover:flex ${
                index === count - 1 ? "opacity-0" : ""
              }`}
            >
              <ChevronRight width={13} height={13} />
            </button>
            <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
        {guestFavourite && <GuestFavouriteBadge compact={variant === "row"} />}
        <button
          aria-label={fav ? "Remove from wishlist" : "Save to wishlist"}
          onClick={favClick}
          className={`absolute right-3 top-3 z-10 transition-transform hover:scale-110 ${
            fav ? "text-rausch" : ""
          }`}
        >
          <HeartIcon filled={fav} width={24} height={24} />
        </button>
      </div>

      {variant === "row" ? (
        <div className="pt-2.5">
          <p className="truncate font-semibold leading-5">
            {listing.property_type} in {listing.city}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[15px] text-hof dark:text-[#f0f0f0]">
            <span className="font-semibold">{formatPrice(listing.price_per_night)}</span> for 1 night
            {listing.rating > 0 && (
              <span className="ml-1 inline-flex items-center gap-0.5 text-sm">
                · <StarIcon width={11} height={11} /> {listing.rating.toFixed(2)}
              </span>
            )}
          </p>
        </div>
      ) : (
        <div className="pt-2.5">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-semibold leading-5">
              {listing.property_type} in {listing.city}
            </p>
            <span className="flex shrink-0 items-center gap-1 text-sm">
              <StarIcon width={12} height={12} />
              {listing.rating > 0 ? listing.rating.toFixed(2) : "New"}
              {listing.reviews_count > 0 && (
                <span className="text-foggy dark:text-[#a8a8ad]">({listing.reviews_count})</span>
              )}
            </span>
          </div>
          <p className="truncate text-[15px] text-foggy dark:text-[#a8a8ad]">{listing.title}</p>
          <p className="text-[15px] text-foggy dark:text-[#a8a8ad]">
            {listing.bedrooms} bedroom{listing.bedrooms > 1 ? "s" : ""} · {listing.beds} bed
            {listing.beds > 1 ? "s" : ""} · {listing.bathrooms} bath
            {listing.bathrooms > 1 ? "s" : ""}
          </p>
          <p className="pt-1.5 text-[15px]">
            <span className="font-semibold">{formatPrice(listing.price_per_night)}</span> night
            {listing.superhost && (
              <span className="ml-2 rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-hof dark:bg-[#2a2a2e] dark:text-[#f0f0f0]">
                Superhost
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
