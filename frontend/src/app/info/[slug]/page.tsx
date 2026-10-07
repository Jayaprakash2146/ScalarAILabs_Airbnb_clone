"use client";

/** Generic content page for every footer link. */
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getInfoPage } from "@/lib/infoPages";

export default function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const page = getInfoPage(slug);

  if (!page) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-xl bg-hof px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-hof"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-10 lg:px-20">
      <Link href="/" className="text-sm font-semibold underline hover:no-underline">
        ← Back to home
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">{page.title}</h1>
      <p className="mt-3 text-lg text-foggy dark:text-[#a8a8ad]">{page.subtitle}</p>
      <div className="mt-10 space-y-8">
        {page.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-2 text-xl font-semibold">{s.heading}</h2>
            <p className="text-[15px] leading-7 text-hof/90 dark:text-[#f0f0f0]/90">{s.body}</p>
          </section>
        ))}
      </div>
      <div className="mt-14 rounded-2xl border border-line bg-mist p-6 text-sm dark:border-[#38383d] dark:bg-[#2a2a2e]">
        <p className="font-semibold">Questions?</p>
        <p className="mt-1 text-foggy dark:text-[#a8a8ad]">
          This page is part of an educational Airbnb clone. For anything booking-related, try the
          Help Centre or explore stays from the home page.
        </p>
      </div>
    </div>
  );
}
