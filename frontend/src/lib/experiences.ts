/** Mock data for the Experiences vertical (static, per assignment mocking rules). */

export interface Experience {
  id: string;
  title: string;
  location: string;
  country: string;
  price: number;
  rating: number;
  reviews: number;
  host: string;
  duration: string;
  groupSize: string;
  tag?: "Original";
  images: string[];
  description: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const EXPERIENCES: Experience[] = [
  {
    id: "goa-portrait-photoshoot",
    title: "Golden-hour portrait photoshoot in Goa",
    location: "Goa, India",
    country: "India",
    price: 4000,
    rating: 5.0,
    reviews: 128,
    host: "Sherwyn",
    duration: "2 hours",
    groupSize: "Up to 4 people",
    images: [img("1529156069898-49953e39b3ac"), img("1541519227354-08fa5d50c44d"), img("1554080353-a576cf803bda")],
    description:
      "Walk the Latin Quarter streets of Panjim at golden hour while a professional photographer captures candid portraits of you. We finish with a chilled drink at a heritage café and you receive 25+ edited photos within 48 hours. All skill levels welcome — I'll direct you the whole time, no modelling experience needed.",
  },
  {
    id: "jaipur-block-printing",
    title: "Learn Jaipur's 400-year-old block printing craft",
    location: "Jaipur, India",
    country: "India",
    price: 2500,
    rating: 4.98,
    reviews: 342,
    host: "Sunita",
    duration: "3 hours",
    groupSize: "Up to 8 people",
    tag: "Original",
    images: [img("1461360228754-6e81c478b882"), img("1556905055-8f358a7a47b2"), img("1523381210434-271e8be1f52b")],
    description:
      "Sunita's family has hand-blocked textiles in Sanganer for four generations. In her courtyard studio you'll carve practice blocks, mix natural dyes, and print your own cotton scarf to take home. Expect stories, chai, and the satisfying thump of wood on fabric.",
  },
  {
    id: "kochi-backwater-kayak",
    title: "Sunrise kayak through Kochi's backwaters",
    location: "Kochi, India",
    country: "India",
    price: 3200,
    rating: 4.97,
    reviews: 214,
    host: "Arun",
    duration: "2.5 hours",
    groupSize: "Up to 6 people",
    images: [img("1502680390469-be75c86b636f"), img("1471922694854-ff1b63b20054"), img("1439066615861-d1af74d74000")],
    description:
      "Paddle silent kayaks through mangrove channels as the village wakes up — kingfishers, prawn farmers, and the sunrise over Chinese fishing nets. Arun has guided these waters for a decade; no previous kayaking experience is required and life jackets are provided.",
  },
  {
    id: "udaipur-miniature-painting",
    title: "Miniature painting workshop in Udaipur",
    location: "Udaipur, India",
    country: "India",
    price: 2800,
    rating: 5.0,
    reviews: 96,
    host: "Rajendra",
    duration: "3 hours",
    groupSize: "Up to 6 people",
    images: [img("1507842217343-583bb7270b66"), img("1507842217343-583bb7270b66"), img("1461360228754-6e81c478b882")],
    description:
      "Sit with a third-generation miniature artist overlooking Lake Pichola. You'll learn the squirrel-hair brush technique, grind natural pigments, and complete your own postcard-sized painting of the City Palace to take home in a handmade folder.",
  },
  {
    id: "mumbai-street-food-crawl",
    title: "Mumbai street food night crawl",
    location: "Mumbai, India",
    country: "India",
    price: 3500,
    rating: 4.95,
    reviews: 451,
    host: "Farhan",
    duration: "3.5 hours",
    groupSize: "Up to 8 people",
    tag: "Original",
    images: [img("1555126634-323283e090fa"), img("1504674900247-0877df9cc836"), img("1414235077428-338989a2e8c0")],
    description:
      "Eat your way through Mohammed Ali Road and Girgaum like a local. Vada pav, kebabs, falooda and more across six stops — Farhan knows every vendor personally, and vegetarian options are available at every stop. Come hungry; dinner is included in the price.",
  },
  {
    id: "rishikesh-riverside-yoga",
    title: "Riverside yoga and meditation in Rishikesh",
    location: "Rishikesh, India",
    country: "India",
    price: 1800,
    rating: 5.0,
    reviews: 187,
    host: "Anand",
    duration: "2 hours",
    groupSize: "Up to 10 people",
    images: [img("1506126613408-eca07ce68773"), img("1506126613408-eca07ce68773"), img("1545205597-3d9d02c29597")],
    description:
      "Begin the morning with breathwork and a slow vinyasa flow on a private Ganges beach, guided by Anand, a certified yoga therapist. We close with a 20-minute guided meditation to the sound of the river. Mats provided — just bring yourself.",
  },
  {
    id: "coorg-coffee-estate-walk",
    title: "From bean to cup on a Coorg coffee estate",
    location: "Coorg, India",
    country: "India",
    price: 2600,
    rating: 4.96,
    reviews: 143,
    host: "Kaverappa",
    duration: "3 hours",
    groupSize: "Up to 8 people",
    images: [img("1447933601403-0c6688de566e"), img("1495474472287-4d71bcdd2085"), img("1509042239860-f550ce710b93")],
    description:
      "Walk a working shade-grown coffee estate with third-generation planter Kaverappa — pick ripe cherries season permitting, watch the pulping process, and end with a cupping session of five single-origin roasts on the veranda of a 100-year-old estate house.",
  },
  {
    id: "jodhpur-desert-stargazing",
    title: "Thar desert stargazing with a astronomer",
    location: "Jodhpur, India",
    country: "India",
    price: 4200,
    rating: 4.94,
    reviews: 88,
    host: "Devraj",
    duration: "4 hours",
    groupSize: "Up to 10 people",
    images: [img("1470071459604-3b5ec3a7fe05"), img("1419242902214-272b3f66ee7a"), img("1435224668334-0f82ec57b605")],
    description:
      "Drive 45 minutes into the Thar desert, share a traditional Rajasthani dinner by the fire, then lie back on cots as Devraj narrates the night sky through a professional telescope — planets, nebulae, and the stories behind Rajasthani constellations.",
  },
  {
    id: "jaipur-hot-air-balloon",
    title: "Sunrise hot air balloon over Jaipur",
    location: "Jaipur, India",
    country: "India",
    price: 12000,
    rating: 4.99,
    reviews: 76,
    host: "Rakesh",
    duration: "4 hours",
    groupSize: "Up to 8 people",
    tag: "Original",
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80"],
    description:
      "Drift over Amber Fort and the Aravalli hills as the sun rises. Rakesh has flown balloons for 15 years; the flight lasts about an hour and ends with a sparkling-wine toast and a light breakfast at the landing field. Transfers from Jaipur hotels included.",
  },
  {
    id: "netrani-scuba-discovery",
    title: "Scuba discovery dive in the Arabian Sea",
    location: "Netrani Island, India",
    country: "India",
    price: 6500,
    rating: 4.97,
    reviews: 112,
    host: "Colin",
    duration: "6 hours",
    groupSize: "Up to 6 people",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80"],
    description:
      "A PADI instructor takes you on your very first ocean dive — no certification needed. Boat ride, briefing, shallow-water practice and a 30-minute reef dive among parrotfish and turtles. Photos and videos underwater included.",
  },
  {
    id: "manali-himalayan-day-trek",
    title: "Waterfall day-trek in the Kullu Valley",
    location: "Manali, India",
    country: "India",
    price: 2200,
    rating: 4.96,
    reviews: 158,
    host: "Tenzin",
    duration: "5 hours",
    groupSize: "Up to 10 people",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"],
    description:
      "A gentle forest trail through deodar and pine to a 30-metre waterfall, led by local guide Tenzin. Includes a packed Himalayan lunch by the falls and stories of the valley's folklore. Suitable for first-time trekkers aged 10+.",
  },
  {
    id: "kochi-kathakali-evening",
    title: "Kathakali makeup & performance evening",
    location: "Kochi, India",
    country: "India",
    price: 1900,
    rating: 4.95,
    reviews: 132,
    host: "Kalamandalam troupe",
    duration: "2 hours",
    groupSize: "Up to 20 people",
    images: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=1200&q=80"],
    description:
      "Arrive early to watch the artists apply their elaborate makeup, learn the eye and hand language of Kathakali, then watch a live performance of the Ramayana to percussion. Front-row seats and a printed story guide included.",
  },
  {
    id: "nashik-vineyard-tasting",
    title: "Sunset wine tasting on a Nashik vineyard",
    location: "Nashik, India",
    country: "India",
    price: 2400,
    rating: 4.93,
    reviews: 97,
    host: "Ayesha",
    duration: "2.5 hours",
    groupSize: "Up to 12 people",
    images: ["https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1200&q=80"],
    description:
      "Tour the vines, learn how India's wine capital came to be, and taste five estate wines with cheese and sundowners overlooking the Godavari. Ayesha is a certified sommelier — beginners very welcome.",
  },
  {
    id: "pondicherry-photo-walk",
    title: "Heritage photo walk through White Town",
    location: "Pondicherry, India",
    country: "India",
    price: 1600,
    rating: 4.92,
    reviews: 74,
    host: "Meenakshi",
    duration: "2 hours",
    groupSize: "Up to 6 people",
    images: ["https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80"],
    description:
      "Shoot Yellow Town at its quietest hour with a working photographer — mustard facades, bougainvillea doorways and Promenade light. Any camera works, phones included; Meenakshi coaches composition and gives an instant portfolio review over filter coffee.",
  },
];
export function getExperience(id: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.id === id);
}
