/** Typed fetch wrapper for the FastAPI backend. */
import type {
  Booking,
  DateRange,
  ListingCardData,
  ListingDetail,
  ListingPage,
  Review,
  SearchFilters,
  User,
  WishlistEntry,
} from "@/types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function userEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("airbnb_user");
    return raw ? (JSON.parse(raw) as User).email : null;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const email = userEmail();
  if (auth && email) headers["X-User-Email"] = email;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* keep statusText */
    }
    throw new ApiError(res.status, detail);
  }
  return (await res.json()) as T;
}

// ---------------- Auth ----------------
export function login(email: string, name?: string) {
  return request<User>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email, name }) },
    false
  );
}

// ---------------- Listings ----------------
export function searchListings(
  filters: SearchFilters | Record<string, string>
): Promise<ListingPage> {
  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && k !== "signal")
      qs.set(k, String(v));
  });
  return request<ListingPage>(`/api/listings?${qs.toString()}`, {}, false);
}

export function getListing(id: number | string): Promise<ListingDetail> {
  return request<ListingDetail>(`/api/listings/${id}`, {}, false);
}

export function getAvailability(id: number | string): Promise<DateRange[]> {
  return request<DateRange[]>(`/api/listings/${id}/availability`, {}, false);
}

export function getReviews(id: number | string): Promise<Review[]> {
  return request<Review[]>(`/api/listings/${id}/reviews`, {}, false);
}

export function postReview(id: number | string, rating: number, comment: string) {
  return request<Review>(`/api/listings/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
}

export interface ListingInput {
  title: string;
  description: string;
  city: string;
  country: string;
  address?: string;
  lat?: number;
  lng?: number;
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

export function createListing(payload: ListingInput): Promise<ListingDetail> {
  return request<ListingDetail>(`/api/listings`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateListing(
  id: number,
  payload: ListingInput
): Promise<ListingDetail> {
  return request<ListingDetail>(`/api/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteListing(id: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/api/listings/${id}`, { method: "DELETE" });
}

export function myListings(): Promise<ListingCardData[]> {
  return request<ListingCardData[]>(`/api/listings/mine`);
}

// ---------------- Bookings ----------------
export function createBooking(input: {
  listing_id: number;
  check_in: string;
  check_out: string;
  num_guests: number;
}): Promise<Booking> {
  return request<Booking>(`/api/bookings`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function myBookings(): Promise<Booking[]> {
  return request<Booking[]>(`/api/bookings/mine`);
}

export function cancelBooking(id: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/api/bookings/${id}`, { method: "DELETE" });
}

export function hostBookings(): Promise<Booking[]> {
  return request<Booking[]>(`/api/bookings/host`);
}

// ---------------- Wishlist ----------------
export function myWishlist(): Promise<WishlistEntry[]> {
  return request<WishlistEntry[]>(`/api/wishlist`);
}

export function myWishlistIds(): Promise<{ listing_ids: number[] }> {
  return request<{ listing_ids: number[] }>(`/api/wishlist/ids`);
}

export function toggleWishlist(
  listingId: number
): Promise<{ wishlisted: boolean }> {
  return request<{ wishlisted: boolean }>(`/api/wishlist/${listingId}`, {
    method: "POST",
  });
}

// ---------------- Meta ----------------
export function getAmenities() {
  return request<{ id: number; name: string; icon: string }[]>(
    `/api/listings/meta/amenities`,
    {},
    false
  );
}

// ---------------- Uploads ----------------
export async function uploadImage(file: File): Promise<{ url: string }> {
  const email = userEmail();
  if (!email) throw new ApiError(401, "Log in to upload images");
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${API_BASE}/api/uploads`, {
    method: "POST",
    headers: { "X-User-Email": email },
    body,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data?.detail ?? res.statusText);
  }
  return (await res.json()) as { url: string };
}
