/** App-wide constants: categories, property/room types, amenity icons. */

export interface Category {
  name: string;
  icon: string; // inline SVG path id
}

export const CATEGORIES: Category[] = [
  { name: "Trending", icon: "trending" },
  { name: "Amazing views", icon: "views" },
  { name: "Beachfront", icon: "beach" },
  { name: "Cabins", icon: "cabin" },
  { name: "Pools", icon: "pool" },
  { name: "Tiny homes", icon: "tiny" },
  { name: "Countryside", icon: "countryside" },
  { name: "Treehouses", icon: "treehouse" },
  { name: "Rooms", icon: "room" },
  { name: "Design", icon: "design" },
  { name: "Camping", icon: "camping" },
  { name: "Lakefront", icon: "lake" },
  { name: "Luxe", icon: "luxe" },
];

export const PROPERTY_TYPES = [
  "Any",
  "Apartment",
  "House",
  "Villa",
  "Cabin",
  "Loft",
  "Castle",
  "Tiny home",
  "Farm stay",
  "Boutique hotel",
  "Treehouse",
  "Yurt",
  "Dome",
  "Campsite",
];

export const ROOM_TYPES = ["Any", "Entire home", "Private room", "Shared room"];

/** Map amenity icon key -> emoji-free label glyph. The backend supplies the key. */
export const AMENITY_ICONS: Record<string, string> = {
  wifi: "📶",
  kitchen: "🍳",
  ac: "❄️",
  pool: "🏊",
  parking: "🚗",
  hottub: "🛁",
  washer: "🧺",
  tv: "📺",
  workspace: "💻",
  bbq: "🍖",
  fireplace: "🔥",
  gym: "🏋️",
  beach: "🏖️",
  mountain: "⛰️",
  pets: "🐾",
  sparkles: "✨",
};

export function amenityIcon(key: string): string {
  return AMENITY_ICONS[key] ?? "✨";
}
