"use client";

/** Footer mirroring the real Airbnb page — every link navigates somewhere real. */
import { useState } from "react";
import Link from "next/link";

const INSPIRATION: [string, string][] = [
  ["Goa", "Beach holidays"],
  ["Mumbai", "City breaks"],
  ["Manali", "Mountain cabins"],
  ["Jaipur", "Heritage stays"],
  ["Udaipur", "Lake holidays"],
  ["Bengaluru", "City breaks"],
  ["Kochi", "Backwater stays"],
  ["Rishikesh", "Wellness retreats"],
  ["Pondicherry", "Colonial quarters"],
  ["Alibaug", "Beach rentals"],
  ["Shimla", "Hill holidays"],
  ["Coorg", "Plantation stays"],
];

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/info/help-centre" },
      { label: "Get help with a safety issue", href: "/info/safety" },
      { label: "AirCover", href: "/info/aircover" },
      { label: "Anti-discrimination", href: "/info/anti-discrimination" },
      { label: "Disability support", href: "/info/disability-support" },
      { label: "Cancellation options", href: "/info/cancellation" },
      { label: "Report neighbourhood concern", href: "/info/neighbourhood" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { label: "Airbnb your home", href: "/host" },
      { label: "AirCover for Hosts", href: "/info/aircover-hosts" },
      { label: "Hosting resources", href: "/info/hosting-resources" },
      { label: "Community forum", href: "/info/community" },
      { label: "Hosting responsibly", href: "/info/hosting-responsibly" },
      { label: "Join a free hosting class", href: "/info/hosting-class" },
      { label: "Find a co-host", href: "/info/co-host" },
      { label: "Refer a host", href: "/info/refer" },
    ],
  },
  {
    title: "Airbnb",
    links: [
      { label: "Newsroom", href: "/info/newsroom" },
      { label: "Careers", href: "/info/careers" },
      { label: "Investors", href: "/info/investors" },
      { label: "Gift cards", href: "/info/gift-cards" },
      { label: "Airbnb.org emergency stays", href: "/info/emergency-stays" },
    ],
  },
];

export default function Footer() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? INSPIRATION : INSPIRATION.slice(0, 6);

  return (
    <footer className="border-t border-line bg-mist px-6 pb-8 pt-12 dark:border-[#38383d] dark:bg-[#141418] md:px-10 lg:px-20">
      <div className="mx-auto max-w-[1760px]">
        {/* Inspiration for future getaways — tiles search our real listings */}
        <section className="border-b border-line pb-10 dark:border-[#38383d]">
          <h2 className="mb-6 text-2xl font-semibold">Inspiration for future getaways</h2>
          <div className="mb-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
            {shown.map(([city, kind]) => (
              <Link
                key={city}
                href={`/?location=${encodeURIComponent(city)}`}
                className="cursor-pointer"
              >
                <p className="text-sm font-medium hover:underline">{city}</p>
                <p className="text-sm text-foggy dark:text-[#a8a8ad]">{kind}</p>
              </Link>
            ))}
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {expanded ? "Show less" : "Show more"} {!expanded && "⌄"}
          </button>
        </section>

        {/* Link columns */}
        <section className="grid gap-10 border-b border-line py-10 dark:border-[#38383d] md:grid-cols-3">
          {COLUMNS.map((s) => (
            <div key={s.title}>
              <h3 className="mb-4 text-base font-semibold">{s.title}</h3>
              <ul className="space-y-3">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-6 text-sm text-hof dark:text-[#f0f0f0] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 Airbnb, Inc.</span>
            <span>·</span>
            <Link href="/info/privacy" className="font-medium hover:underline">Privacy</Link>
            <span>·</span>
            <Link href="/info/terms" className="font-medium hover:underline">Terms</Link>
            <span>·</span>
            <Link href="/info/company" className="font-medium hover:underline">Company details</Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-semibold">
            <span className="cursor-pointer hover:underline">🌐 English (IN)</span>
            <span className="cursor-pointer hover:underline">₹ INR</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222222] text-xs text-white dark:bg-[#3a3a3f]">f</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222222] text-xs text-white dark:bg-[#3a3a3f]">𝕏</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222222] text-xs text-white dark:bg-[#3a3a3f]">◎</span>
          </div>
        </div>

        <p className="pt-6 text-xs text-foggy dark:text-[#a8a8ad]">
          This is an educational clone built for an assignment — not affiliated with Airbnb, Inc.
          Payments, messaging, identity verification and maps are mocked or simplified.
        </p>
      </div>
    </footer>
  );
}
