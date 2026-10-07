"use client";

/** Ratings summary (overall score + category bars) + paginated review cards. */
import { useMemo, useState } from "react";
import { StarIcon } from "@/components/Icons";
import { reviewDate } from "@/lib/format";
import type { Review } from "@/types";

interface Props {
  reviews: Review[];
  listingRating: number;
}

const PAGE = 6;

const CATEGORY_LABELS = [
  "Overall rating",
  "Cleanliness",
  "Accuracy",
  "Check-in",
  "Communication",
  "Location",
  "Value",
];

/** Deterministic pseudo-variation so category bars look organic but stable. */
function catScore(rating: number, idx: number): number {
  const jitter = [0, 0.06, -0.04, 0.08, -0.02, 0.05][idx % 6];
  return Math.max(4.3, Math.min(5, rating + jitter));
}

export default function ReviewsSection({ reviews, listingRating }: Props) {
  const [visible, setVisible] = useState(PAGE);
  const rating = listingRating || 5;

  const stars = useMemo(
    () => ({
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    }),
    [reviews]
  );

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="md:w-1/3">
          <h2 className="mb-4 text-2xl font-semibold">
            <StarIcon width={20} height={20} className="mb-1 mr-1 inline" />
            {rating.toFixed(2)} · {reviews.length} reviews
          </h2>
          <div className="space-y-2">
            {CATEGORY_LABELS.map((label, i) => {
              const score = i === 0 ? rating : catScore(rating, i - 1);
              return (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-foggy dark:text-[#a8a8ad]">{label}</span>
                  <span className="h-1 flex-1 rounded-full bg-line">
                    <span
                      className="block h-1 rounded-full bg-hof dark:bg-white"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </span>
                  <span className="w-7 text-right">{score.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:w-2/3">
          {reviews.length === 0 ? (
            <p className="text-sm text-foggy dark:text-[#a8a8ad]">No reviews yet — be the first to stay here!</p>
          ) : (
            <>
              <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                {reviews.slice(0, visible).map((r) => (
                  <div key={r.id}>
                    <div className="mb-2 flex items-center gap-3">
                      {r.author.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.author.avatar_url}
                          alt={r.author.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mist dark:bg-[#2a2a2e] text-sm font-semibold">
                          {r.author.name[0]}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold">{r.author.name}</p>
                        <p className="text-xs text-foggy dark:text-[#a8a8ad]">{reviewDate(r.created_at)}</p>
                      </div>
                      <span className="ml-auto flex items-center gap-0.5 text-xs">
                        <StarIcon width={10} height={10} /> {r.rating}
                      </span>
                    </div>
                    <p className="line-clamp-4 text-sm leading-5 text-hof/90">{r.comment}</p>
                  </div>
                ))}
              </div>
              {visible < reviews.length && (
                <button
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="mt-8 rounded-lg border border-hof px-5 py-3 text-sm font-semibold hover:bg-mist dark:hover:bg-[#2a2a2e]"
                >
                  Show all {reviews.length} reviews
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
