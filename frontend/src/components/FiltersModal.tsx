"use client";

/** Airbnb-style filters modal: price range, property/room type, amenities. */
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/Icons";
import { PROPERTY_TYPES, ROOM_TYPES, amenityIcon } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { Amenity } from "@/types";

export interface FiltersState {
  min_price?: number;
  max_price?: number;
  property_type?: string;
  room_type?: string;
  amenities?: string;
}

interface Props {
  open: boolean;
  initial: FiltersState;
  amenities: Amenity[];
  onClose: () => void;
  onApply: (filters: FiltersState) => void;
}

const PRICE_MIN = 1000;
const PRICE_MAX = 20000;

export default function FiltersModal({ open, initial, amenities, onClose, onApply }: Props) {
  const [minPrice, setMinPrice] = useState(initial.min_price ?? PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(initial.max_price ?? PRICE_MAX);
  const [propertyType, setPropertyType] = useState(initial.property_type ?? "Any");
  const [roomType, setRoomType] = useState(initial.room_type ?? "Any");
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
    initial.amenities ? initial.amenities.split(",").map(Number) : []
  );

  useEffect(() => {
    setMinPrice(initial.min_price ?? PRICE_MIN);
    setMaxPrice(initial.max_price ?? PRICE_MAX);
    setPropertyType(initial.property_type ?? "Any");
    setRoomType(initial.room_type ?? "Any");
    setSelectedAmenities(
      initial.amenities ? initial.amenities.split(",").map(Number) : []
    );
  }, [initial, open]);

  if (!open) return null;

  const toggleAmenity = (id: number) =>
    setSelectedAmenities((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );

  const apply = () => {
    const f: FiltersState = {};
    if (minPrice > PRICE_MIN) f.min_price = minPrice;
    if (maxPrice < PRICE_MAX) f.max_price = maxPrice;
    if (propertyType !== "Any") f.property_type = propertyType;
    if (roomType !== "Any") f.room_type = roomType;
    if (selectedAmenities.length) f.amenities = selectedAmenities.join(",");
    onApply(f);
    onClose();
  };

  const clearAll = () => {
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setPropertyType("Any");
    setRoomType("Any");
    setSelectedAmenities([]);
  };

  const header = "text-lg font-semibold";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[780px] flex-col rounded-2xl bg-white dark:bg-[#1c1c20] shadow-pop">
        <div className="relative border-b border-line dark:border-[#38383d] p-4 text-center">
          <button onClick={onClose} aria-label="Close filters" className="absolute left-4 top-4 rounded-full p-2 hover:bg-mist dark:hover:bg-[#2a2a2e]">
            <CloseIcon />
          </button>
          <h2 className="text-base font-semibold">Filters</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <section>
            <h3 className={header}>Price range</h3>
            <p className="mb-6 text-sm text-foggy dark:text-[#a8a8ad]">Nightly prices before fees and taxes</p>
            <div className="flex items-center justify-between px-2 text-sm font-medium">
              <span>
                Minimum
                <span className="block text-base font-normal text-hof dark:text-[#f0f0f0]">{formatPrice(minPrice)}</span>
              </span>
              <span>
                Maximum
                <span className="block text-base font-normal text-hof dark:text-[#f0f0f0]">
                  {maxPrice >= PRICE_MAX ? `${formatPrice(PRICE_MAX)}+` : formatPrice(maxPrice)}
                </span>
              </span>
            </div>
            <div className="relative mt-4 px-2">
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={100}
                value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 100))}
                className="absolute left-2 right-2 w-[calc(100%-16px)]"
                aria-label="Minimum price"
              />
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 100))}
                className="absolute left-2 right-2 w-[calc(100%-16px)]"
                aria-label="Maximum price"
              />
              <div className="h-1" style={{ marginTop: 24 }} />
            </div>
          </section>

          <hr className="my-8 border-line dark:border-[#38383d]" />

          <section>
            <h3 className={header}>Type of place</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {ROOM_TYPES.map((rt) => (
                <button
                  key={rt}
                  onClick={() => setRoomType(rt)}
                  className={`rounded-xl border p-4 text-left text-sm transition-all ${
                    roomType === rt ? "border-hof border-2 font-semibold bg-mist dark:bg-[#2a2a2e]" : "border-line dark:border-[#38383d] hover:border-hof"
                  }`}
                >
                  <span className="block">{rt === "Any" ? "Any type" : rt}</span>
                  <span className="text-xs text-foggy dark:text-[#a8a8ad]">
                    {rt === "Entire home" ? "A place all to yourself" : rt === "Private room" ? "Your own room" : rt === "Shared room" ? "A shared space" : "Whatever works"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <hr className="my-8 border-line dark:border-[#38383d]" />

          <section>
            <h3 className={header}>Rooms and beds</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {PROPERTY_TYPES.filter((p) => p !== "Any").map((pt) => (
                <button
                  key={pt}
                  onClick={() => setPropertyType(propertyType === pt ? "Any" : pt)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    propertyType === pt ? "border-hof bg-hof text-white dark:bg-white dark:text-hof" : "border-line dark:border-[#38383d] hover:border-hof"
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </section>

          <hr className="my-8 border-line dark:border-[#38383d]" />

          <section>
            <h3 className={header}>Amenities</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleAmenity(a.id)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    selectedAmenities.includes(a.id)
                      ? "border-hof bg-hof text-white dark:bg-white dark:text-hof"
                      : "border-line dark:border-[#38383d] hover:border-hof"
                  }`}
                >
                  {amenityIcon(a.icon)} {a.name}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-line dark:border-[#38383d] p-4">
          <button onClick={clearAll} className="rounded-lg px-4 py-2.5 text-sm font-semibold underline hover:bg-mist dark:hover:bg-[#2a2a2e]">
            Clear all
          </button>
          <button onClick={apply} className="rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white hover:bg-black dark:hover:bg-[#e8e8e8]">
            Show places
          </button>
        </div>
      </div>
    </div>
  );
}
