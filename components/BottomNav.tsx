"use client";

import { Flame, Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: LayoutGrid },
  { href: "/trending", label: "Trending", icon: Flame },
  { href: "/cart", label: "Cart", icon: ShoppingCart, showCartBadge: true },
  { href: "/account", label: "Account", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-700/60 bg-navy-950/95 backdrop-blur-md md:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-h-13 flex-col items-center justify-center gap-0.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] pt-1.5 transition-colors active:scale-95 ${
                  active ? "text-brand" : "text-slate-400 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span
                  id={item.showCartBadge ? "cart-icon-mobile" : undefined}
                  className="relative"
                >
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                  {item.showCartBadge && count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                      {count}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
