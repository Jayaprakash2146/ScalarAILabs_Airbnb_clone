/** Mock data for the Services vertical (static, per assignment mocking rules). */

export interface Service {
  id: string;
  title: string;
  location: string;
  price: number;
  unit: "guest" | "group";
  rating: number;
  reviews: number;
  host: string;
  duration: string;
  images: string[];
  description: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const SERVICES: Service[] = [
  {
    id: "romantic-portraits-sherwyn",
    title: "Romantic portraits and films by Sherwyn",
    location: "South Goa",
    price: 4000,
    unit: "guest",
    rating: 5.0,
    reviews: 87,
    host: "Sherwyn",
    duration: "90 minutes",
    images: [img("1519225421980-715cb0215aed"), img("1519741497674-611481863552"), img("1522673607200-164d1b6ce486")],
    description:
      "A relaxed couple or solo portrait session across three cinematic South Goa locations — a vintage theatre, a quiet beach and a Portuguese lane. Includes 40+ colour-graded photos and a 60-second highlight film. Perfect for anniversaries, proposals or just because.",
  },
  {
    id: "goa-photo-shoot-samuel",
    title: "Goa photo shoot by Samuel",
    location: "North Goa",
    price: 7500,
    unit: "guest",
    rating: 5.0,
    reviews: 64,
    host: "Samuel",
    duration: "2 hours",
    images: [img("1441984904996-e0b6ba687e04"), img("1554080353-a576cf803bda"), img("1541519227354-08fa5d50c44d")],
    description:
      "Samuel is a fashion photographer who shoots for Goa's leading resorts. This session covers pre-shoot styling advice, two outfit changes, and 60 high-resolution retouched images delivered in a private online gallery within three days.",
  },
  {
    id: "mobility-training-shane",
    title: "Mobility and movement training by Shane",
    location: "Panjim",
    price: 1500,
    unit: "guest",
    rating: 4.9,
    reviews: 121,
    host: "Shane",
    duration: "60 minutes",
    images: [img("1571019613454-1cb2f99b2d8b"), img("1518611012118-696072aa579a"), img("1506126613408-eca07ce68773")],
    description:
      "One-on-one mobility coaching that blends FRC, yoga and strength principles. Shane builds the session around your body — desk workers, runners and new parents welcome. You leave with a personalised 15-minute daily routine.",
  },
  {
    id: "makeup-by-hazel",
    title: "Beautiful makeup by Hazel",
    location: "Assagao, Goa",
    price: 1700,
    unit: "guest",
    rating: 4.8,
    reviews: 203,
    host: "Hazel",
    duration: "75 minutes",
    images: [img("1522335789203-aabd1fc54bc9"), img("1487412947147-5cebf100ffc2"), img("1512496015851-a90fb38ba796")],
    description:
      "Soft-glam or full-glam makeup using HD products that survive Goan humidity. Hazel works with your skin tone and outfit — ideal for weddings, shoots and evenings out. Lashes and light hair styling included.",
  },
  {
    id: "holistic-yoga-manoj",
    title: "Holistic yoga class by Manoj",
    location: "Palolem, Goa",
    price: 1200,
    unit: "guest",
    rating: 5.0,
    reviews: 156,
    host: "Manoj",
    duration: "90 minutes",
    images: [img("1506126613408-eca07ce68773"), img("1545205597-3d9d02c29597"), img("1575052814086-f385e2e2ad1b")],
    description:
      "A traditional Hatha flow in an open-air shala surrounded by palm trees. Manoj tailors adjustments to every level, and the class ends with yoga nidra and homemade herbal tea. Mats and props provided.",
  },
  {
    id: "personal-chef-revanth",
    title: "Private coastal dinner by chef Revanth",
    location: "Anjuna, Goa",
    price: 5500,
    unit: "group",
    rating: 4.95,
    reviews: 48,
    host: "Revanth",
    duration: "3 hours",
    images: [img("1414235077428-338989a2e8c0"), img("1504674900247-0877df9cc836"), img("1556910103-1c02745aae4d")],
    description:
      "Chef Revanth brings a five-course coastal tasting menu to your villa — Goan classics reimagined with produce from local markets. Includes setup, service and cleanup for up to 8 guests. Menu customised to your preferences after booking.",
  },
  {
    id: "surf-lessons-arjun",
    title: "Beginner surf lessons by Arjun",
    location: "Vagator, Goa",
    price: 2500,
    unit: "guest",
    rating: 4.9,
    reviews: 174,
    host: "Arjun",
    duration: "2 hours",
    images: [img("1502680390469-be75c86b636f"), img("1502920917128-1aa500764cbd"), img("1502680390469-be75c86b636f")],
    description:
      "Learn to pop up and ride your first wave on Goa's friendliest beginner break. Soft-top boards, rash guards and a maximum 3:1 student ratio. Arjun is a certified lifeguard with 12 seasons of coaching — most guests stand on their first day.",
  },
  {
    id: "vintage-scooter-tour-priya",
    title: "Vintage scooter village tour by Priya",
    location: "Salcete, Goa",
    price: 2800,
    unit: "guest",
    rating: 4.9,
    reviews: 92,
    host: "Priya",
    duration: "4 hours",
    images: [img("1449824913935-59a10b8d2000"), img("1449824913935-59a10b8d2000"), img("1471444928139-48c5bf5173f8")],
    description:
      "Ride a restored 1960s Vespa through fishing villages, spice plantations and a 400-year-old church. Stops include a family-run bakery for poi bread and a toddy-tapper's shack. Helmets, fuel and chai included — you drive or ride pillion with Priya.",
  },
  {
    id: "airport-transfer-ravi",
    title: "Door-to-door airport transfers by Ravi",
    location: "Goa (GOI & Mopa)",
    price: 1200,
    unit: "group",
    rating: 4.9,
    reviews: 310,
    host: "Ravi",
    duration: "Per transfer",
    images: ["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"],
    description:
      "Chilled-water sedan or SUV pickups from either Goa airport, tracked and flight-monitored so delays never matter. Ravi has driven the coastal roads for a decade and doubles as an informal tour guide if you ask nicely.",
  },
  {
    id: "in-villa-massage-leela",
    title: "In-villa Ayurvedic massage by Leela",
    location: "Assagao, Goa",
    price: 2200,
    unit: "guest",
    rating: 5.0,
    reviews: 88,
    host: "Leela",
    duration: "90 minutes",
    images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=1200&q=80"],
    description:
      "Leela brings the spa to you — massage table, warm herbal oils and a soundtrack of the sea from your own balcony. Choose abhyanga, deep tissue or a pregnancy-safe blend. Certified therapist with 9 years of practice.",
  },
  {
    id: "cycle-rental-karan",
    title: "Geared cycles delivered to your door by Karan",
    location: "Bengaluru",
    price: 600,
    unit: "guest",
    rating: 4.8,
    reviews: 141,
    host: "Karan",
    duration: "Per day",
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=1200&q=80"],
    description:
      "Well-serviced geared hybrids delivered and collected from your home, with helmet and lock included. Karan maps a traffic-free 20 km loop for every customer and joins Sunday rides for free.",
  },
  {
    id: "personal-training-nadia",
    title: "Private strength coaching by Nadia",
    location: "Bandra, Mumbai",
    price: 2000,
    unit: "guest",
    rating: 4.95,
    reviews: 67,
    host: "Nadia",
    duration: "60 minutes",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"],
    description:
      "One-on-one strength sessions at your building gym or a private studio — programming built around your goals, with a written plan you keep. Nadia is an ACSM-certified coach who trains travellers, new mums and first-timers.",
  },
];
export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
