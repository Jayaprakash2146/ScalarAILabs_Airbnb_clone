/** TypeScript mirrors of the backend API schemas. */

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  is_host: boolean;
  is_superhost: boolean;
  created_at: string;
}

export interface ListingImage {
  id: number;
  url: string;
  sort_order: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
}

export interface Host {
  id: number;
  name: string;
  avatar_url: string;
  is_superhost: boolean;
  created_at: string;
}

export interface ListingCardData {
  id: number;
  title: string;
  city: string;
  country: string;
  price_per_night: number;
  rating: number;
  reviews_count: number;
  category: string;
  property_type: string;
  room_type: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  lat: number;
  lng: number;
  superhost: boolean;
  images: ListingImage[];
}

export interface ListingDetail extends ListingCardData {
  description: string;
  address: string;
  lat: number;
  lng: number;
  cleaning_fee: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  host: Host;
  amenities: Amenity[];
}

export interface ListingPage {
  items: ListingCardData[];
  total: number;
  page: number;
  pages: number;
}

export interface DateRange {
  check_in: string;
  check_out: string;
}

export interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  num_guests: number;
  nights: number;
  nightly_price: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: string;
  created_at: string;
  listing: ListingCardData;
  guest: { id: number; name: string; avatar_url: string };
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  author: { id: number; name: string; avatar_url: string };
}

export interface SearchFilters {
  location?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  room_type?: string;
  category?: string;
  amenities?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface WishlistEntry {
  listing: ListingCardData;
}
