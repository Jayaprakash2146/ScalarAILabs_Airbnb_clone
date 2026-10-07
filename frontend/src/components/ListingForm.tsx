"use client";

/**
 * Shared create/edit listing form used by the host experience.
 * Fields mirror the backend ListingCreate schema.
 */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CloseIcon } from "@/components/Icons";
import { createListing, getAmenities, getListing, updateListing, uploadImage } from "@/lib/api";
import { CATEGORIES, PROPERTY_TYPES, ROOM_TYPES } from "@/lib/constants";
import { useToast } from "@/lib/toast";
import type { Amenity } from "@/types";

interface Props {
  listingId?: number; // present => edit mode
}

interface FormState {
  title: string;
  description: string;
  city: string;
  country: string;
  address: string;
  price_per_night: number;
  cleaning_fee: number;
  property_type: string;
  room_type: string;
  category: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  image_urls: string[];
  amenity_ids: number[];
}

const EMPTY: FormState = {
  title: "",
  description: "",
  city: "",
  country: "India",
  address: "",
  price_per_night: 3500,
  cleaning_fee: 500,
  property_type: "Apartment",
  room_type: "Entire home",
  category: "Trending",
  max_guests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  image_urls: [""],
  amenity_ids: [],
};

export default function ListingForm({ listingId }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!!listingId);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const firstEmpty = form.image_urls.findIndex((u) => !u.trim());
      for (const file of Array.from(files).slice(0, 10)) {
        const { url } = await uploadImage(file);
        setForm((f) => {
          const urls = [...f.image_urls];
          const emptyIdx = urls.findIndex((u) => !u.trim());
          if (emptyIdx >= 0) urls[emptyIdx] = url;
          else if (urls.length < 10) urls.push(url);
          return { ...f, image_urls: urls };
        });
      }
      toast("Photo uploaded", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    getAmenities().then(setAmenities).catch(() => undefined);
    if (listingId) {
      getListing(listingId)
        .then((l) => {
          setForm({
            title: l.title,
            description: l.description,
            city: l.city,
            country: l.country,
            address: l.address,
            price_per_night: l.price_per_night,
            cleaning_fee: l.cleaning_fee,
            property_type: l.property_type,
            room_type: l.room_type,
            category: l.category,
            max_guests: l.max_guests,
            bedrooms: l.bedrooms,
            beds: l.beds,
            bathrooms: l.bathrooms,
            image_urls: l.images.map((i) => i.url).concat([""]).slice(0, 10),
            amenity_ids: l.amenities.map((a) => a.id),
          });
          setLoading(false);
        })
        .catch(() => {
          toast("Listing not found", "error");
          router.push("/host");
        });
    }
  }, [listingId, router, toast]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (id: number) =>
    set(
      "amenity_ids",
      form.amenity_ids.includes(id)
        ? form.amenity_ids.filter((x) => x !== id)
        : [...form.amenity_ids, id]
    );

  const submit = async () => {
    // validation
    if (form.title.trim().length < 5) return void toast("Title must be at least 5 characters", "error");
    if (!form.city.trim()) return void toast("City is required", "error");
    if (!Number.isFinite(form.price_per_night) || form.price_per_night <= 0)
      return void toast("Enter a valid price per night", "error");
    const urls = form.image_urls.map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) return void toast("Add at least one photo URL", "error");

    setBusy(true);
    try {
      const payload = {
        ...form,
        image_urls: urls,
        lat: 0,
        lng: 0,
      };
      if (listingId) {
        await updateListing(listingId, payload);
        toast("Listing updated", "success");
      } else {
        await createListing(payload);
        toast("Listing published 🎉", "success");
      }
      router.push("/host");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-16"><div className="h-96 animate-pulse rounded-2xl bg-mist dark:bg-[#2a2a2e]" /></div>;
  }

  const label = "mb-1.5 block text-sm font-semibold";
  const input =
    "w-full rounded-xl border border-line dark:border-[#38383d] px-4 py-3 text-sm outline-none focus:border-hof";
  const section = "rounded-2xl border border-line dark:border-[#38383d] p-6 shadow-card";

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-3xl font-semibold">
          {listingId ? "Edit your listing" : "List your home"}
        </h1>
        <p className="mt-1 text-sm text-foggy dark:text-[#a8a8ad]">
          {listingId
            ? "Update the details of your place."
            : "Tell guests about your place — it takes about 2 minutes."}
        </p>
      </div>

      <div className={section}>
        <h2 className="mb-4 text-lg font-semibold">Basics</h2>
        <div className="space-y-4">
          <div>
            <label className={label}>Listing title</label>
            <input
              className={input}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Sunlit studio near the beach"
              maxLength={200}
            />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea
              className={input}
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What makes your place special?"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={label}>City *</label>
              <input className={input} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Goa" />
            </div>
            <div>
              <label className={label}>Country</label>
              <input className={input} value={form.country} onChange={(e) => set("country", e.target.value)} />
            </div>
            <div>
              <label className={label}>Street address</label>
              <input className={input} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="12, Palm Lane" />
            </div>
          </div>
        </div>
      </div>

      <div className={section}>
        <h2 className="mb-4 text-lg font-semibold">Pricing & classification</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Price per night (₹) *</label>
            <input
              type="number"
              min={100}
              className={input}
              value={form.price_per_night}
              onChange={(e) => set("price_per_night", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={label}>Cleaning fee (₹)</label>
            <input
              type="number"
              min={0}
              className={input}
              value={form.cleaning_fee}
              onChange={(e) => set("cleaning_fee", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={label}>Property type</label>
            <select className={input} value={form.property_type} onChange={(e) => set("property_type", e.target.value)}>
              {PROPERTY_TYPES.filter((p) => p !== "Any").map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Room type</label>
            <select className={input} value={form.room_type} onChange={(e) => set("room_type", e.target.value)}>
              {ROOM_TYPES.filter((r) => r !== "Any").map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Home-page category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => set("category", c.name)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    form.category === c.name ? "border-hof bg-hof text-white dark:bg-white dark:text-hof" : "border-line dark:border-[#38383d] hover:border-hof"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={section}>
        <h2 className="mb-4 text-lg font-semibold">Capacity</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              ["max_guests", "Guests", 16],
              ["bedrooms", "Bedrooms", 10],
              ["beds", "Beds", 20],
              ["bathrooms", "Bathrooms", 8],
            ] as const
          ).map(([key, lab, max]) => (
            <div key={key}>
              <label className={label}>{lab}</label>
              <input
                type="number"
                min={key === "bathrooms" ? 0.5 : 1}
                max={max}
                step={key === "bathrooms" ? 0.5 : 1}
                className={input}
                value={form[key]}
                onChange={(e) => set(key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={section}>
        <h2 className="mb-1 text-lg font-semibold">Photos</h2>
        <p className="mb-4 text-sm text-foggy dark:text-[#a8a8ad]">
          Paste image URLs (Unsplash links work great). The first photo is your cover.
        </p>
        <div className="space-y-3">
          {form.image_urls.map((url, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                className={input}
                value={url}
                onChange={(e) =>
                  set(
                    "image_urls",
                    form.image_urls.map((u, j) => (j === i ? e.target.value : u))
                  )
                }
                placeholder="https://images.unsplash.com/photo-…"
              />
              {url.trim() && (
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-mist dark:bg-[#2a2a2e]">
                  <Image src={url} alt="" fill sizes="64px" className="object-cover" unoptimized={url ? !url.includes("unsplash") && !url.includes("pravatar") : false} />
                </div>
              )}
              {form.image_urls.length > 1 && (
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => set("image_urls", form.image_urls.filter((_, j) => j !== i))}
                  className="rounded-full p-2 text-foggy dark:text-[#a8a8ad] hover:bg-mist dark:hover:bg-[#2a2a2e]"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          ))}
        </div>
        {form.image_urls.length < 10 && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => set("image_urls", [...form.image_urls, ""])}
              className="rounded-lg border border-line dark:border-[#38383d] px-4 py-2 text-sm font-semibold hover:border-hof"
            >
              + Add another photo
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-hof px-4 py-2 text-sm font-semibold text-white hover:bg-black dark:hover:bg-[#e8e8e8] disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "⬆ Upload from device"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => onUpload(e.target.files)}
            />
            <span className="text-xs text-foggy dark:text-[#a8a8ad]">JPEG/PNG/WebP/GIF up to 5 MB each</span>
          </div>
        )}
      </div>

      <div className={section}>
        <h2 className="mb-4 text-lg font-semibold">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleAmenity(a.id)}
              className={`rounded-full border px-4 py-2 text-sm ${
                form.amenity_ids.includes(a.id)
                  ? "border-hof bg-hof text-white dark:bg-white dark:text-hof"
                  : "border-line dark:border-[#38383d] hover:border-hof"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl px-6 py-3 text-sm font-semibold hover:bg-mist dark:hover:bg-[#2a2a2e]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="rounded-xl bg-gradient-to-r from-arches to-rausch px-8 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Saving…" : listingId ? "Save changes" : "Publish listing"}
        </button>
      </div>
    </div>
  );
}
