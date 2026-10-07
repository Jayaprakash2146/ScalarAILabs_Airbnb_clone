/** Content for the footer info pages (static, Airbnb-style). */

export interface InfoPageContent {
  title: string;
  subtitle: string;
  sections: { heading: string; body: string }[];
}

export const INFO_PAGES: Record<string, InfoPageContent> = {
  "help-centre": {
    title: "Help Centre",
    subtitle: "Find answers to common questions about bookings, stays and hosting.",
    sections: [
      {
        heading: "Getting started",
        body: "Browse the explore grid, pick your dates and guests, and reserve any home instantly. Your trips appear under My Trips, where you can also cancel a booking — cancelling releases the dates back to other guests.",
      },
      {
        heading: "During your stay",
        body: "Your host's contact details, check-in instructions and the house manual are all available from your booking page. For anything urgent, message your host from the listing page.",
      },
      {
        heading: "Payments",
        body: "This clone uses a mocked checkout: confirming a booking simulates a successful card charge and no money moves. In production this step would integrate a payment provider.",
      },
    ],
  },
  safety: {
    title: "Get help with a safety issue",
    subtitle: "Urgent support for safety concerns during a stay or experience.",
    sections: [
      {
        heading: "If you are in danger",
        body: "Contact your local emergency services first. Once you are safe, report the issue and our team will follow up.",
      },
      {
        heading: "Reporting an issue",
        body: "Open your trip, choose Report a problem, and describe what happened. In this clone, reports are simulated — no data leaves your browser.",
      },
    ],
  },
  aircover: {
    title: "AirCover",
    subtitle: "Strong protection included with every booking, free of charge.",
    sections: [
      {
        heading: "Booking Protection Guarantee",
        body: "If a host cancels within 48 hours of check-in or the listing is materially different from what was described, we will find you a similar home nearby or refund you in full.",
      },
      {
        heading: "Check-in and accuracy support",
        body: "If you cannot check in, or the home does not match the listing, tell us within 72 hours and a resolution specialist will step in within minutes — in this clone, support is simulated.",
      },
    ],
  },
  "aircover-hosts": {
    title: "AirCover for Hosts",
    subtitle: "Top-to-bottom protection for every host, included free.",
    sections: [
      {
        heading: "Host damage protection",
        body: "₹30 lakh coverage for damages caused by guests to your home and belongings, with liability insurance included.",
      },
      {
        heading: "Deep cleaning protection",
        body: "Extra cleaning costs after an unauthorised party are covered. In this clone, hosting protections are illustrative only.",
      },
    ],
  },
  "anti-discrimination": {
    title: "Anti-discrimination",
    subtitle: "Our commitment to an inclusive community.",
    sections: [
      {
        heading: "Our pledge",
        body: "Hosts and guests on this platform agree to treat everyone — regardless of race, religion, national origin, ethnicity, disability, sex, gender identity, sexual orientation or age — with respect, and without judgment or bias.",
      },
      {
        heading: "In practice",
        body: "Listings may not refuse guests on the basis of any protected characteristic. Violations lead to removal from the platform.",
      },
    ],
  },
  "disability-support": {
    title: "Disability support",
    subtitle: "Accessibility is a right, not a feature.",
    sections: [
      {
        heading: "Accessible stays",
        body: "Filter listings by accessibility amenities — step-free entrances, wide doorways, and accessible bathrooms are tagged by hosts.",
      },
      {
        heading: "Support",
        body: "Our interface follows WCAG 2.1 guidelines, and a dedicated support line is available for guests with disabilities. In this clone, filters include only the amenities seeded in the database.",
      },
    ],
  },
  cancellation: {
    title: "Cancellation options",
    subtitle: "Flexible plans for the unexpected.",
    sections: [
      {
        heading: "Guest cancellations",
        body: "Cancel any booking from My Trips. In this clone cancellation is free and instant — the blocked dates are released immediately and other guests can book them again.",
      },
      {
        heading: "Host cancellations",
        body: "Hosts who cancel repeatedly face penalties, including suspension of Superhost status, to keep the marketplace reliable.",
      },
    ],
  },
  neighbourhood: {
    title: "Report neighbourhood concern",
    subtitle: "Keeping neighbourhoods healthy starts with you.",
    sections: [
      {
        heading: "Report online",
        body: "Concerned about noise, parking or party houses? Submit the listing address and describe the concern — hosts are notified and repeat offenders lose their listings.",
      },
      {
        heading: "Response times",
        body: "Community support responds within 24 hours. In this clone, reports are simulated.",
      },
    ],
  },
  "hosting-resources": {
    title: "Hosting resources",
    subtitle: "Everything you need to be a great host.",
    sections: [
      {
        heading: "The host dashboard",
        body: "Manage your listings from the Host dashboard — create, edit and delete listings, and see every booking your places receive, including guest details and totals.",
      },
      {
        heading: "Pricing",
        body: "Set a nightly price and a cleaning fee; a 14% service fee is added for guests at checkout, mirroring Airbnb's model.",
      },
    ],
  },
  community: {
    title: "Community forum",
    subtitle: "Where hosts and guests swap stories and advice.",
    sections: [
      {
        heading: "Join the conversation",
        body: "From pricing strategies to guest etiquette, the community forum is where the marketplace's collective wisdom lives. In this clone the forum is a mocked section.",
      },
    ],
  },
  "hosting-responsibly": {
    title: "Hosting responsibly",
    subtitle: "Protecting your home, your guests and your neighbourhood.",
    sections: [
      {
        heading: "House rules",
        body: "Set clear expectations — quiet hours, pet policy, maximum occupancy — directly on your listing so guests know before they book.",
      },
      {
        heading: "Safety",
        body: "Smoke alarms, carbon monoxide detectors and first-aid kits should be standard in every short-term rental.",
      },
    ],
  },
  "hosting-class": {
    title: "Join a free hosting class",
    subtitle: "Learn from Superhosts, live.",
    sections: [
      {
        heading: "What you'll learn",
        body: "A 60-minute interactive session covering listing photography, pricing, and the first-guest experience — taught by experienced Superhosts. In this clone, classes are a mocked section.",
      },
    ],
  },
  "co-host": {
    title: "Find a co-host",
    subtitle: "Someone local who manages things while you're away.",
    sections: [
      {
        heading: "What co-hosts do",
        body: "Co-hosts handle guest messages, check-ins and cleaning coordination for a share of the booking revenue. In this clone, co-host matching is a mocked section.",
      },
    ],
  },
  refer: {
    title: "Refer a host",
    subtitle: "Share hosting — earn when they welcome their first guest.",
    sections: [
      {
        heading: "How it works",
        body: "Share your referral link; when a friend publishes a listing and completes their first stay, you both earn travel credit. In this clone, referrals are simulated.",
      },
    ],
  },
  newsroom: {
    title: "Newsroom",
    subtitle: "Announcements and updates from this clone.",
    sections: [
      {
        heading: "Latest",
        body: "Version 1.0 of this Airbnb clone ships the full browse → book → host workflow, an interactive map, dark mode, and an image upload pipeline — built with Next.js, FastAPI and SQLite.",
      },
    ],
  },
  careers: {
    title: "Careers",
    subtitle: "Help create a world where anyone can belong anywhere.",
    sections: [
      {
        heading: "Open roles",
        body: "This project was built as an SDE assignment demonstrating full-stack product skills: Next.js + TypeScript on the frontend, FastAPI + SQLAlchemy on the backend, and a well-normalised SQLite schema.",
      },
    ],
  },
  investors: {
    title: "Investors",
    subtitle: "Quarterly results, strategy and shareholder letters.",
    sections: [
      {
        heading: "Note",
        body: "This is an educational clone with no real financials. The real Airbnb, Inc. investor relations site lives at airbnb2020.pathable.com — this page exists purely to make navigation complete.",
      },
    ],
  },
  "gift-cards": {
    title: "Gift cards",
    subtitle: "Give the gift of anywhere.",
    sections: [
      {
        heading: "Redeeming",
        body: "Gift cards would apply as booking credit at checkout. In this clone, payments are mocked, so gift cards are a mocked section too.",
      },
    ],
  },
  "emergency-stays": {
    title: "Airbnb.org emergency stays",
    subtitle: "Free, temporary housing for people in crisis.",
    sections: [
      {
        heading: "The programme",
        body: "Airbnb.org partners with nonprofits to arrange free temporary stays for refugees, disaster survivors and frontline workers. This clone supports the mission in spirit — no real bookings are processed.",
      },
    ],
  },
  privacy: {
    title: "Privacy",
    subtitle: "How this clone handles your data.",
    sections: [
      {
        heading: "What we store",
        body: "A name, an email address and your bookings/wishlists/reviews — all in a local SQLite database on the demo server. The login is mocked: an email alone creates an account, and no password is stored.",
      },
      {
        heading: "What we never do",
        body: "No tracking, no analytics, no third-party cookies, and no data leaves the demo environment.",
      },
    ],
  },
  terms: {
    title: "Terms",
    subtitle: "The ground rules for using this clone.",
    sections: [
      {
        heading: "Scope",
        body: "This is an educational project replicating Airbnb's design and core booking workflows for an assignment. It is not affiliated with Airbnb, Inc. and must not be used commercially.",
      },
      {
        heading: "Bookings",
        body: "All bookings, payments, reviews and messages are simulated. Availability blocking, however, is fully real: confirmed bookings persist in SQLite and genuinely block those dates.",
      },
    ],
  },
  company: {
    title: "Company details",
    subtitle: "About this project.",
    sections: [
      {
        heading: "The build",
        body: "Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS. Backend: Python FastAPI, SQLAlchemy. Database: SQLite with 8 related tables. Built as an SDE full-stack assignment.",
      },
      {
        heading: "Contact",
        body: "See the project README for setup instructions, architecture notes and the full API reference.",
      },
    ],
  },
};

export function getInfoPage(slug: string): InfoPageContent | undefined {
  return INFO_PAGES[slug];
}
