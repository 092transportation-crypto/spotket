"use client";

import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Logo from "@/components/Logo";
import { useCart } from "@/context/CartContext";

const nav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Trending", href: "/trending" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/products${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "border-navy-800 bg-navy-950/95 shadow-lg shadow-black/30"
          : "border-transparent bg-navy-950/40"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo withTagline={false} />

        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    pathname === item.href ? "text-white" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-white"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-11 w-11 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-navy-800 hover:text-white sm:flex"
          >
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-white"
          >
            <span id="cart-icon" className="relative">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-navy-800 hover:text-white md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-navy-800 bg-navy-950 px-4 py-3 sm:px-6">
          <form onSubmit={handleSearch} role="search" className="mx-auto flex max-w-2xl gap-2">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products…"
              autoFocus
              className="min-h-11 w-full rounded-full border border-navy-600 bg-navy-900 px-5 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-11 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-navy-950 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-16 items-center justify-between border-b border-navy-800 px-4">
            <Logo withTagline={false} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-300 hover:bg-navy-800"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav className="px-6 py-8" aria-label="Mobile">
            <ul className="space-y-2">
              {[...nav, { label: "Account", href: "/account" }, { label: "Help", href: "/help" }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-3 text-2xl font-semibold text-white transition-colors hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
