"use client";

/** Mocked auth screen styled like Airbnb's "Log in or sign up" modal over a city-poster collage. */
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Icons";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

const DEMO_ACCOUNTS = [
  { email: "guest@demo.com", label: "Demo guest (with trips & reviews)" },
  { email: "ananya@demo.com", label: "Demo host — Ananya (owns listings)" },
  { email: "rohan@demo.com", label: "Demo host — Rohan (owns listings)" },
];

const POSTER_CITIES = [
  ["PARIS", "from-rose-300 to-rose-500"],
  ["MIAMI", "from-pink-400 to-fuchsia-600"],
  ["TORONTO", "from-emerald-300 to-teal-500"],
  ["MEDELLÍN", "from-lime-300 to-green-500"],
  ["MONTREÁL", "from-orange-300 to-amber-500"],
  ["SAN DIEGO", "from-sky-300 to-blue-500"],
  ["EDINBURGH", "from-indigo-300 to-violet-500"],
  ["MEXICO", "from-red-300 to-rose-500"],
  ["BUDAPEST", "from-cyan-300 to-sky-500"],
  ["LIMA", "from-yellow-300 to-orange-400"],
  ["OSAKA", "from-purple-300 to-fuchsia-500"],
  ["SYDNEY", "from-teal-300 to-emerald-500"],
];

function LoginInner() {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const doLogin = async (e: string, n?: string) => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      toast("Enter a valid email address", "error");
      return;
    }
    setBusy(true);
    try {
      await login(e, n);
      toast(`Welcome, ${n ?? e.split("@")[0]}!`, "success");
      router.push(next);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden">
      {/* City-poster collage backdrop */}
      <div className="pointer-events-none absolute inset-0 -m-4 grid grid-cols-3 gap-4 opacity-90 blur-[1px] sm:grid-cols-4 lg:grid-cols-6" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => {
          const [city, grad] = POSTER_CITIES[i % POSTER_CITIES.length];
          return (
            <div
              key={i}
              className={`flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br p-4 shadow-inner ${grad}`}
              style={{ transform: `rotate(${((i * 7) % 9) - 4}deg) translateY(${(i % 3) * 8}px)` }}
            >
              <span className="text-xl font-extrabold tracking-wide text-white/90 drop-shadow">
                {city}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal card */}
      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-pop dark:bg-[#242428]">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo width={36} height={36} className="text-rausch" />
            <h1 className="mt-3 text-2xl font-semibold">Log in or sign up</h1>
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="mb-3 w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-hof dark:border-[#38383d] dark:bg-[#2a2a2e]"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doLogin(email, name)}
            placeholder="Phone number or email"
            type="email"
            className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-hof dark:border-[#38383d] dark:bg-[#2a2a2e]"
          />
          <button
            onClick={() => doLogin(email, name)}
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-arches to-rausch py-3.5 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Continue"}
          </button>

          <div className="my-5 flex items-center gap-4 text-xs text-foggy dark:text-[#a8a8ad]">
            <span className="h-px flex-1 bg-line dark:bg-[#38383d]" />
            or
            <span className="h-px flex-1 bg-line dark:bg-[#38383d]" />
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => doLogin(DEMO_ACCOUNTS[0].email)}
              disabled={busy}
              aria-label="Continue with Google (demo)"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-line text-xl hover:bg-mist dark:border-[#38383d] dark:hover:bg-[#2a2a2e]"
            >
              G
            </button>
            <button
              onClick={() => doLogin(DEMO_ACCOUNTS[0].email)}
              disabled={busy}
              aria-label="Continue with Apple (demo)"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-line text-xl hover:bg-mist dark:border-[#38383d] dark:hover:bg-[#2a2a2e]"
            ></button>
          </div>

          <p className="mt-5 text-center text-xs text-foggy dark:text-[#a8a8ad]">
            Real authentication is simplified per the assignment — just an email, no password.
            Unknown emails are registered as new guests.
          </p>
        </div>

        {/* Quick demo accounts */}
        <div className="mt-4 w-full max-w-md rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur dark:bg-[#242428]/95">
          <p className="mb-2 text-sm font-semibold">Quick demo accounts</p>
          <ul className="space-y-2">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <button
                  onClick={() => doLogin(a.email)}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-left text-xs hover:border-hof dark:border-[#38383d] dark:bg-[#2a2a2e]"
                >
                  <span className="block font-semibold">{a.email}</span>
                  <span className="text-foggy dark:text-[#a8a8ad]">{a.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-xs text-foggy dark:text-[#a8a8ad]">
            Want to host? Log in, then visit{" "}
            <Link href="/host" className="underline">
              Become a host
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
