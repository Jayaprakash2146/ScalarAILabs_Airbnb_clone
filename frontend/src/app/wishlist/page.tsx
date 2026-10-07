"use client";

/** Simple flat wishlist page (favourites). */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import { myWishlist } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ListingCardData } from "@/types";

export default function WishlistPage() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    myWishlist()
      .then((res) => setListings(res.map((r) => r.listing)))
      .finally(() => setLoading(false));
  }, [user]);

  if (ready && !user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold">Log in to see your wishlist</h1>
        <button
          onClick={() => router.push("/login?next=/wishlist")}
          className="mt-6 rounded-xl bg-gradient-to-r from-arches to-rausch px-6 py-3.5 text-sm font-semibold text-white"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-10 md:px-10 lg:px-20">
      <h1 className="text-3xl font-semibold">Wishlists</h1>
      <p className="mt-1 text-foggy dark:text-[#a8a8ad]">Saved homes you love</p>
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[20/19] animate-pulse rounded-xl bg-mist dark:bg-[#2a2a2e]" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-xl font-semibold">Nothing saved yet</p>
          <p className="mt-2 text-foggy dark:text-[#a8a8ad]">Tap the heart on any listing to save it here.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white"
          >
            Explore homes
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              wishlisted
              onWishlistChange={(_, wished) => {
                if (!wished) setListings((prev) => prev.filter((x) => x.id !== l.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
