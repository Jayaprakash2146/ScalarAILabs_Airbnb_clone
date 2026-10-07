"use client";

/**
 * Top navigation, mirroring the real Airbnb header:
 * - Landing view: centred tab row (All / Homes / Experiences / Services)
 * - Scrolled or inner pages: compact search pill
 * - Right: "Become a host", theme toggle, account + menu circle buttons
 */
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GlobeTabIcon,
  HomesTabIcon,
  ExperiencesTabIcon,
  ServicesTabIcon,
  Logo,
  MenuIcon,
  UserIcon,
} from "@/components/Icons";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";


const TABS = [
  { key: "all", label: "All", href: "/all", Icon: GlobeTabIcon },
  { key: "homes", label: "Homes", href: "/", Icon: HomesTabIcon },
  { key: "experiences", label: "Experiences", href: "/experiences", Icon: ExperiencesTabIcon },
  { key: "services", label: "Services", href: "/services", Icon: ServicesTabIcon },
];

function HeaderInner() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const isDetailPage = /^\/listing\//.test(pathname);
  const showTabs =
    (pathname === "/" ||
      pathname === "/all" ||
      pathname.startsWith("/experiences") ||
      pathname.startsWith("/services")) &&
    !scrolled;

  const activeTab = pathname.startsWith("/experiences")
    ? "experiences"
    : pathname.startsWith("/services")
      ? "services"
      : pathname === "/all"
        ? "all"
        : "homes";

  const tabClick = (tab: (typeof TABS)[number]) => {
    router.push(tab.href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-white transition-shadow dark:border-[#38383d] dark:bg-[#1c1c20] ${
        scrolled ? "shadow-sm" : ""
      } ${isDetailPage ? "hidden md:block" : ""}`}
    >
      <div className="mx-auto grid max-w-[1760px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-3 md:px-10 lg:px-20">
        <Link href="/" className="flex items-center gap-1 text-rausch" aria-label="Airbnb clone home">
          <Logo width={32} height={32} />
          <span className="hidden text-[22px] font-bold tracking-tight lg:block">airbnb</span>
        </Link>

        <div className="flex min-w-0 flex-col items-center">
          {showTabs ? (
            <nav className="hidden items-center gap-9 pb-1 pt-1 md:flex" aria-label="Airbnb categories">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => tabClick(t)}
                  className={`flex items-center gap-2.5 border-b-2 pb-2.5 pt-1 text-[15px] font-medium transition-colors ${
                    t.key === activeTab
                      ? "border-hof text-hof dark:border-white dark:text-white"
                      : "border-transparent text-[#6a6a6a] hover:text-hof dark:text-[#b8b8bd] dark:hover:text-white"
                  }`}
                >
                  <t.Icon width={26} height={26} className="shrink-0" />
                  {t.label}
                </button>
              ))}
            </nav>
          ) : null}
          <div className={showTabs ? "mt-1" : ""}>
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1">
          <Link
            href="/host"
            className="hidden rounded-full px-4 py-3 text-sm font-semibold hover:bg-mist dark:hover:bg-[#2a2a2e] lg:block"
          >
            Become a host
          </Link>
          <ThemeToggle />
          <div className="flex items-center" ref={menuRef}>
            <button
              onClick={() => (user ? setMenuOpen((o) => !o) : router.push("/login"))}
              aria-label="Account"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:shadow-search dark:border-[#38383d]"
            >
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <UserIcon width={15} height={15} />
              )}
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-line hover:shadow-search dark:border-[#38383d]"
            >
              <MenuIcon width={15} height={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-14 w-60 rounded-xl bg-white py-2 shadow-pop dark:bg-[#2a2a2e]">
                {user ? (
                  <>
                    <div className="border-b border-line px-4 py-3 dark:border-[#38383d]">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-foggy dark:text-[#a8a8ad]">{user.email}</p>
                    </div>
                    <Link href="/trips" className="block px-4 py-2.5 text-sm hover:bg-mist dark:hover:bg-[#333338]">
                      My trips
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2.5 text-sm hover:bg-mist dark:hover:bg-[#333338]">
                      Wishlists
                    </Link>
                    <Link href="/host" className="block px-4 py-2.5 text-sm hover:bg-mist dark:hover:bg-[#333338]">
                      {user.is_host ? "Host dashboard" : "Become a host"}
                    </Link>
                    <div className="border-t border-line dark:border-[#38383d]">
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          router.push("/");
                        }}
                        className="block w-full px-4 py-2.5 text-left text-sm hover:bg-mist dark:hover:bg-[#333338]"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2.5 text-sm font-semibold hover:bg-mist dark:hover:bg-[#333338]">
                      Sign up
                    </Link>
                    <Link href="/login" className="block px-4 py-2.5 text-sm hover:bg-mist dark:hover:bg-[#333338]">
                      Log in
                    </Link>
                    <div className="border-t border-line dark:border-[#38383d]">
                      <Link href="/host" className="block px-4 py-2.5 text-sm hover:bg-mist dark:hover:bg-[#333338]">
                        Become a host
                      </Link>
                      <Link href="/trips" className="block px-4 py-2.5 text-sm hover:bg-mist dark:hover:bg-[#333338]">
                        My trips
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-[73px] border-b border-line bg-white dark:border-[#38383d] dark:bg-[#1c1c20]" />}>
      <HeaderInner />
    </Suspense>
  );
}
