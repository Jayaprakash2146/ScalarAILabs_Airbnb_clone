"use client";

/** Listing detail: gallery, key facts, amenities, calendar, reviews, booking. */
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import PhotoGallery from "@/components/PhotoGallery";
import BookingWidget from "@/components/BookingWidget";
import CheckoutModal from "@/components/CheckoutModal";
import ReviewsSection from "@/components/ReviewsSection";
import MessagingModal from "@/components/MessagingModal";
import {
  ChevronRight,
  CloseIcon,
  StarIcon,
} from "@/components/Icons";
import { amenityIcon } from "@/lib/constants";
import {
  createBooking,
  getAvailability,
  getListing,
  getReviews,
  myWishlistIds,
  postReview,
} from "@/lib/api";
import { joinedIn, nightsBetween } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import type { Booking, DateRange, ListingDetail, Review } from "@/types";

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blocked, setBlocked] = useState<DateRange[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [pending, setPending] = useState<{ ci: string; co: string; g: number } | null>(null);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [showSubnav, setShowSubnav] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSubnav(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [myCompletedStays, setMyCompletedStays] = useState<Booking[]>([]);

  useEffect(() => {
    let alive = true;
    getListing(id)
      .then((l) => alive && setListing(l))
      .catch(() => alive && setNotFound(true));
    getReviews(id).then((r) => alive && setReviews(r)).catch(() => undefined);
    getAvailability(id).then((r) => alive && setBlocked(r)).catch(() => undefined);
    if (user) {
      myWishlistIds()
        .then((res) => alive && setWishlisted(res.listing_ids.includes(Number(id))))
        .catch(() => undefined);
    }
    return () => {
      alive = false;
    };
  }, [id, user]);

  const canReview = () => {
    if (!user) {
      toast("Log in to leave a review", "info");
      router.push(`/login?next=/listing/${id}`);
      return;
    }
    // The backend enforces a completed stay; surface past trips to review.
    import("@/lib/api").then(({ myBookings }) =>
      myBookings()
        .then((bookings) => {
          const completed = bookings.filter(
            (b) => b.listing.id === Number(id) && b.status === "confirmed"
          );
          setMyCompletedStays(completed);
          setReviewModal(true);
        })
        .catch(() => setReviewModal(true))
    );
  };

  const reserve = (ci: string, co: string, g: number) => {
    if (!user) {
      toast("Log in to book this stay", "info");
      router.push(`/login?next=/listing/${id}`);
      return;
    }
    setPending({ ci, co, g });
    setCheckoutOpen(true);
  };

  const confirmBooking = async () => {
    if (!pending || !listing) return;
    await createBooking({
      listing_id: listing.id,
      check_in: pending.ci,
      check_out: pending.co,
      num_guests: pending.g,
    });
    // refresh blocked dates after successful booking
    getAvailability(id).then(setBlocked).catch(() => undefined);
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-semibold">This place isn&apos;t available</h1>
        <p className="mt-2 text-foggy dark:text-[#a8a8ad]">It may have been removed by its host.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white"
        >
          Explore homes
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-[1780px] px-4 py-6 md:px-6 lg:px-10">
        <div className="aspect-[21/9] w-full animate-pulse rounded-xl bg-mist dark:bg-[#2a2a2e]" />
        <div className="mt-8 h-6 w-1/2 animate-pulse rounded bg-mist dark:bg-[#2a2a2e]" />
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-mist dark:bg-[#2a2a2e]" />
      </div>
    );
  }

  const superhost = listing.host.is_superhost;
  const hostingYears = Math.max(1, new Date().getFullYear() - new Date(listing.host.created_at).getFullYear());

  return (
    <div className="pb-24">
      {/* Sticky section sub-nav (appears after scrolling past the gallery) */}
      {showSubnav && (
        <div className="fixed left-0 right-0 top-0 z-50 border-b border-line bg-white shadow-sm dark:border-[#38383d] dark:bg-[#1c1c20]">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3">
            <nav className="flex gap-6 text-sm font-semibold">
              <a href="#photos" className="hover:underline">Photos</a>
              <a href="#amenities" className="hover:underline">Amenities</a>
              <a href="#reviews" className="hover:underline">Reviews</a>
              <a href="#location" className="hover:underline">Location</a>
            </nav>
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  ₹{listing.price_per_night.toLocaleString("en-IN")} night{" "}
                  <span className="ml-2 text-xs font-normal text-foggy dark:text-[#a8a8ad]">
                    ★ {listing.rating.toFixed(2)} · {listing.reviews_count} reviews
                  </span>
                </p>
              </div>
              <button
                onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-lg bg-gradient-to-r from-arches to-rausch px-5 py-2.5 text-sm font-semibold text-white"
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="photos" className="scroll-mt-24">
        <PhotoGallery listing={listing} wishlisted={wishlisted} onWishlistChange={setWishlisted} />
      </div>

      <div className="mx-auto grid max-w-[1780px] gap-12 px-6 pt-8 md:px-10 lg:grid-cols-[1fr_420px] lg:px-20">
        {/* Left column */}
        <div>
          <h1 className="text-3xl font-semibold">
            {listing.room_type} in {listing.city}, {listing.country}
          </h1>
          <p className="mt-1 text-lg font-medium text-hof dark:text-[#f0f0f0]">{listing.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
            <span className="flex items-center gap-1 font-semibold">
              <StarIcon width={12} height={12} />
              {listing.rating > 0 ? listing.rating.toFixed(2) : "New"}
            </span>
            {reviews.length > 0 && (
              <>
                <span>·</span>
                <a href="#reviews" className="font-semibold underline">
                  {listing.reviews_count} Reviews
                </a>
              </>
            )}
            {superhost && (
              <>
                <span>·</span>
                <span className="font-semibold underline">Superhost</span>
              </>
            )}
            <span>·</span>
            <span className="font-semibold underline">
              {listing.city}, {listing.country}
            </span>
          </div>

          <hr className="my-6 border-line dark:border-[#38383d]" />

          {/* Guest favourite laurel banner (Airbnb style) */}
          {listing.rating >= 4.8 && listing.reviews_count >= 3 && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-mist px-6 py-5 dark:border-[#38383d] dark:bg-[#2a2a2e]">
              <div className="flex items-center gap-6">
                <span className="flex items-center text-2xl">
                  <span className="-scale-x-100">🌿</span>
                  <span className="-ml-3 flex flex-col text-[13px] font-semibold leading-tight">
                    <span>Guest</span>
                    <span>favourite</span>
                  </span>
                </span>
                <p className="max-w-[220px] text-sm">
                  One of the most loved homes on Airbnb according to guests
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-semibold">{listing.rating.toFixed(2)}</p>
                  <p className="text-xs tracking-wide">★★★★★</p>
                </div>
                <div className="border-l border-line pl-6 dark:border-[#38383d]">
                  <p className="text-2xl font-semibold">{listing.reviews_count}</p>
                  <p className="text-xs text-foggy dark:text-[#a8a8ad]">Reviews</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-base font-medium">
                {listing.max_guests} guests · {listing.bedrooms} bedroom
                {listing.bedrooms > 1 ? "s" : ""} · {listing.beds} bed{listing.beds > 1 ? "s" : ""} ·{" "}
                {listing.bathrooms} bath{listing.bathrooms > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Hosted-by row */}
          <div className="mt-5 flex items-center gap-4 border-t border-line pt-5 dark:border-[#38383d]">
            {listing.host.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.host.avatar_url}
                alt={listing.host.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold">Hosted by {listing.host.name}</p>
              <p className="text-sm text-foggy dark:text-[#a8a8ad]">
                {superhost ? "Superhost · " : ""}
                {hostingYears} year{hostingYears === 1 ? "" : "s"} hosting
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-6 space-y-5 border-t border-line pt-6 dark:border-[#38383d]">
            <div className="flex items-start gap-4">
              <span className="text-xl">🏆</span>
              <div>
                <p className="font-medium">Top 10% of homes</p>
                <p className="text-sm text-foggy dark:text-[#a8a8ad]">
                  This home is highly ranked based on ratings, reviews and reliability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl">🔑</span>
              <div>
                <p className="font-medium">Self check-in</p>
                <p className="text-sm text-foggy dark:text-[#a8a8ad]">
                  Check yourself in with the smart lock.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl">🏠</span>
              <div>
                <p className="font-medium">Roomy {listing.property_type.toLowerCase()}</p>
                <p className="text-sm text-foggy dark:text-[#a8a8ad]">
                  Guests love this home&apos;s spaciousness for a comfortable stay.
                </p>
              </div>
            </div>
          </div>

          <hr className="my-6 border-line dark:border-[#38383d]" />

          {/* About the space — truncated with a Show more floating window */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">About the space</h2>
            <p className="whitespace-pre-line text-[15px] leading-6 text-hof/90 dark:text-[#f0f0f0]/90">
              {listing.description.length > 320
                ? `${listing.description.slice(0, 320).trimEnd()}…`
                : listing.description}
            </p>
            <button
              onClick={() => setAboutOpen(true)}
              className="mt-3 rounded-lg border border-hof px-5 py-2.5 text-sm font-semibold hover:bg-mist dark:hover:bg-[#2a2a2e]"
            >
              Show more
            </button>
          </section>

          <hr className="my-6 border-line dark:border-[#38383d]" />

          {/* Where you'll sleep */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Where you&apos;ll sleep</h2>
            <div className="w-64 overflow-hidden rounded-xl border border-line dark:border-[#38383d]">
              <div className="relative aspect-[4/3] bg-mist dark:bg-[#2a2a2e]">
                <Image
                  src={listing.images[1]?.url ?? listing.images[0]?.url ?? ""}
                  alt="Bedroom"
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="font-medium">Bedroom</p>
                <p className="text-sm text-foggy dark:text-[#a8a8ad]">
                  {listing.beds} bed{listing.beds > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </section>

          <hr className="my-6 border-line dark:border-[#38383d]" />

          <section id="amenities" className="scroll-mt-24">
            <h2 className="mb-4 text-xl font-semibold">What this place offers</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {listing.amenities.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-center gap-3 text-[15px]">
                  <span className="w-6 text-center text-lg">{amenityIcon(a.icon)}</span>
                  {a.name}
                </div>
              ))}
            </div>
            {listing.amenities.length > 8 && (
              <button
                onClick={() => setAmenitiesOpen(true)}
                className="mt-5 rounded-lg border border-hof px-5 py-3 text-sm font-semibold hover:bg-mist dark:hover:bg-[#2a2a2e]"
              >
                Show all {listing.amenities.length} amenities
              </button>
            )}
          </section>

          <hr className="my-6 border-line dark:border-[#38383d]" />

          <section id="location" className="scroll-mt-24">
            <h2 className="mb-4 text-xl font-semibold">Where you&apos;ll be</h2>
            <p className="mb-4 text-[15px] text-foggy dark:text-[#a8a8ad]">
              {listing.address}, {listing.city}, {listing.country}
            </p>
            <div className="overflow-hidden rounded-xl border border-line dark:border-[#38383d]">
              <iframe
                title={`Map of ${listing.city}`}
                width="100%"
                height="320"
                className="block grayscale-[30%]"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.03}%2C${
                  listing.lat - 0.02
                }%2C${listing.lng + 0.03}%2C${listing.lat + 0.02}&layer=mapnik&marker=${listing.lat}%2C${listing.lng}`}
              />
            </div>
          </section>

          <hr className="my-6 border-line dark:border-[#38383d]" />

          <ReviewsSection reviews={reviews} listingRating={listing.rating} />

          <hr className="my-6 border-line dark:border-[#38383d]" />

          <section>
            <h2 className="mb-4 text-xl font-semibold">Meet your host</h2>
            <div className="flex items-start justify-between rounded-2xl border border-line dark:border-[#38383d] p-6 shadow-card">
              <div>
                <h3 className="text-2xl font-semibold">{listing.host.name}</h3>
                {superhost && <p className="mt-1 text-xs font-semibold uppercase text-foggy dark:text-[#a8a8ad]">Superhost</p>}
                <p className="mt-3 text-sm">
                  Hosted for {joinedIn(listing.host.created_at)}
                </p>
                <div className="mt-4 space-y-1.5 text-sm text-foggy dark:text-[#a8a8ad]">
                  <p>{superhost ? "✅ Identity verified" : "⚠️ Identity verification — coming soon"}</p>
                  <p>💬 Typically responds within an hour</p>
                </div>
                <button
                  onClick={() => setMessagingOpen(true)}
                  className="mt-6 rounded-lg bg-hof px-5 py-3 text-sm font-semibold text-white hover:bg-black dark:hover:bg-[#e8e8e8] dark:bg-white dark:text-hof dark:hover:bg-[#e8e8e8]"
                >
                  Message host
                </button>
                <p className="mt-2 text-xs text-foggy dark:text-[#a8a8ad]">
                  Replies are simulated in this clone — messaging is a mocked section.
                </p>
              </div>
              {listing.host.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.host.avatar_url}
                  alt={listing.host.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              )}
            </div>
          </section>
        </div>

        {/* Right column: booking */}
        <div className="relative">
          <div className="lg:sticky lg:top-28">
            <BookingWidget
              listingId={listing.id}
              pricePerNight={listing.price_per_night}
              cleaningFee={listing.cleaning_fee}
              rating={listing.rating}
              reviewsCount={listing.reviews_count}
              maxGuests={listing.max_guests}
              blocked={blocked}
              onReserve={reserve}
            />
          </div>
        </div>
      </div>

      {/* Amenities modal */}
      {amenitiesOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setAmenitiesOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-[#1c1c20] p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">What this place offers</h2>
              <button onClick={() => setAmenitiesOpen(false)} aria-label="Close amenities" className="rounded-full p-2 hover:bg-mist dark:hover:bg-[#2a2a2e]">
                <CloseIcon />
              </button>
            </div>
            <ul className="space-y-4">
              {listing.amenities.map((a) => (
                <li key={a.id} className="flex items-center gap-3 border-b border-line dark:border-[#38383d] pb-4 text-[15px] last:border-0">
                  <span className="w-6 text-center text-xl">{amenityIcon(a.icon)}</span>
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewModal && (
        <ReviewModal
          listingId={String(listing.id)}
          completedStays={myCompletedStays}
          onClose={() => setReviewModal(false)}
          onSubmitted={(r) => {
            setReviews((prev) => [r, ...prev]);
            toast("Thanks for your review!", "success");
          }}
        />
      )}

      <CheckoutModal
        open={checkoutOpen}
        listing={listing}
        checkIn={pending?.ci ?? ""}
        checkOut={pending?.co ?? ""}
        guests={pending?.g ?? 1}
        onClose={() => {
          setCheckoutOpen(false);
          if (pending) router.push("/trips");
        }}
        onConfirm={confirmBooking}
      />

      <MessagingModal
        open={messagingOpen}
        hostName={listing.host.name}
        listingTitle={listing.title}
        onClose={() => setMessagingOpen(false)}
      />

      {/* About the space floating window */}
      {aboutOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={() => setAboutOpen(false)}>
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-pop dark:bg-[#242428]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">About the space</h2>
              <button onClick={() => setAboutOpen(false)} aria-label="Close" className="rounded-full p-2 hover:bg-mist dark:hover:bg-[#2a2a2e]">
                <CloseIcon />
              </button>
            </div>
            <p className="whitespace-pre-line text-[15px] leading-6 text-hof/90 dark:text-[#f0f0f0]/90">
              {listing.description}
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold">The space</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-line pb-2 dark:border-[#38383d]">
                <span className="text-foggy dark:text-[#a8a8ad]">Guests</span>
                <span>Up to {listing.max_guests}</span>
              </li>
              <li className="flex justify-between border-b border-line pb-2 dark:border-[#38383d]">
                <span className="text-foggy dark:text-[#a8a8ad]">Bedrooms</span>
                <span>{listing.bedrooms}</span>
              </li>
              <li className="flex justify-between border-b border-line pb-2 dark:border-[#38383d]">
                <span className="text-foggy dark:text-[#a8a8ad]">Beds</span>
                <span>{listing.beds}</span>
              </li>
              <li className="flex justify-between border-b border-line pb-2 dark:border-[#38383d]">
                <span className="text-foggy dark:text-[#a8a8ad]">Bathrooms</span>
                <span>{listing.bathrooms}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-foggy dark:text-[#a8a8ad]">Property type</span>
                <span>
                  {listing.property_type} · {listing.room_type}
                </span>
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-lg font-semibold">Other things to note</h3>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-hof/90 dark:text-[#f0f0f0]/90">
              <li>Check-in: any time after 2 PM · Checkout: 11 AM</li>
              <li>Minimum stay: 1 night · Monthly discounts available</li>
              <li>Self check-in with a smart lock — no waiting around</li>
            </ul>
          </div>
        </div>
      )}

      {/* Floating review CTA */}
      <button
        onClick={canReview}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-hof bg-white dark:bg-[#1c1c20] px-5 py-3 text-sm font-semibold shadow-pop hover:bg-mist dark:hover:bg-[#2a2a2e]"
      >
        ⭐ Leave a review
      </button>
    </div>
  );
}

// ---------------- Review modal ----------------
function ReviewModal({
  listingId,
  completedStays,
  onClose,
  onSubmitted,
}: {
  listingId: string;
  completedStays: Booking[];
  onClose: () => void;
  onSubmitted: (r: Review) => void;
}) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const eligible = completedStays.length > 0;
  const sample = completedStays[0];

  const submit = async () => {
    setSubmitting(true);
    try {
      const { postReview: post } = await import("@/lib/api");
      const r = await post(listingId, rating, comment);
      onSubmitted(r);
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1c1c20] p-6 shadow-pop">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Leave a review</h2>
          <button onClick={onClose} aria-label="Close review" className="rounded-full p-2 hover:bg-mist dark:hover:bg-[#2a2a2e]">
            <CloseIcon />
          </button>
        </div>
        {eligible ? (
          <>
            <p className="mb-4 text-sm text-foggy dark:text-[#a8a8ad]">
              Your stay of {nightsBetween(sample.check_in, sample.check_out)} nights is completed —
              tell future guests about it.
            </p>
            <div className="mb-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} aria-label={`${s} stars`}>
                  <StarIcon
                    width={28}
                    height={28}
                    className={s <= rating ? "text-rausch" : "text-line"}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What should guests know?"
              rows={4}
              className="w-full rounded-xl border border-line dark:border-[#38383d] p-3 text-sm outline-none focus:border-hof"
            />
            <button
              onClick={submit}
              disabled={submitting}
              className="mt-4 w-full rounded-xl bg-hof py-3 text-sm font-semibold text-white hover:bg-black dark:hover:bg-[#e8e8e8] disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post review"}
            </button>
          </>
        ) : (
          <p className="text-sm text-foggy dark:text-[#a8a8ad]">
            You can review this place after a completed stay. Book it first — reviews unlock once
            your trip&apos;s checkout date has passed. <ChevronRight className="inline" />
          </p>
        )}
      </div>
    </div>
  );
}
