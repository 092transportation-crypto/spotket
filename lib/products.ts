export type Review = {
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  /** True when the reviewer bought this product through the store. */
  verified?: boolean;
};

export type ShippingInfo = {
  /** Shipping is free for this item regardless of order total. */
  freeShipping?: boolean;
  /** Estimated delivery window, in days from the order date. */
  minDays: number;
  maxDays: number;
  /** Origin shown on the product page, e.g. "China". */
  shipsFrom?: string;
  /** e.g. "77.5% of orders arrive within 10 days" */
  onTimeNote?: string;
  /** e.g. "Collect a $1.00 coupon if your delivery arrives late" */
  lateDeliveryPerk?: string;
};

export type Variant = {
  name: string;
  /** Image shown when this variant is selected and used as the cart thumbnail. */
  image?: string;
};

export type Product = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  /** Original price, shown struck through when higher than `price`. */
  compareAtPrice?: number;
  description: string;
  features: string[];
  /** Primary image — path under /public or a remote URL. */
  image?: string;
  /** Additional gallery images shown as thumbnails on the detail page. */
  images?: string[];
  /** Style/color options the customer picks before adding to cart (same price). */
  variants?: Variant[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  /** Item-specific shipping profile; falls back to the site-wide policy when absent. */
  shipping?: ShippingInfo;
  inStock: boolean;
  /** Shows the "FAST 2-day shipping" badge. */
  fastShipping?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  /** Included in Deals of the Day / the /deals page. */
  deal?: boolean;
  /** Shown in the homepage "Trending Now" section. */
  trending?: boolean;
  /** ISO date, used for "Newest" sorting. */
  dateAdded?: string;
  /** Units sold of this product (supplier marketplace total). */
  soldCount?: number;
};

/**
 * Hero products pinned to the top of Trending, Best Sellers, and the default
 * shop sort. Matched by name because catalog ids are per-database uuids.
 */
const PROMOTED_NAMES = ["bluetooth eye massager", "cat paw mochi"];

export function promotedRank(product: Product): number {
  const name = product.name.toLowerCase();
  const index = PROMOTED_NAMES.findIndex((needle) => name.includes(needle));
  return index === -1 ? PROMOTED_NAMES.length : index;
}

export const categories = [
  "Electronics",
  "Home & Garden",
  "Health & Wellness",
  "Beauty",
  "Sports",
  "Kitchen",
  "Toys",
  "Outdoor",
] as const;

/**
 * Product catalog — empty for now. To add a product, append an object here, e.g.:
 *
 * {
 *   id: "wireless-earbuds-pro",
 *   name: "Wireless Earbuds Pro",
 *   brand: "AudioMax",
 *   category: "Electronics",
 *   price: 49.99,
 *   compareAtPrice: 79.99,
 *   description: "Crystal-clear sound with active noise cancellation.",
 *   features: ["Active noise cancellation", "32-hour battery", "IPX5 water resistant"],
 *   image: "/products/wireless-earbuds-pro.jpg",
 *   images: ["/products/wireless-earbuds-pro-2.jpg"],
 *   rating: 4.8,
 *   reviewCount: 132,
 *   inStock: true,
 *   fastShipping: true,
 *   bestSeller: true,
 *   deal: false,
 *   dateAdded: "2026-07-01",
 * }
 */
export const products: Product[] = [
  {
    id: "bluetooth-eye-massager",
    name: "Premium Bluetooth Eye Massager with Heat Compress & Vibration Therapy",
    category: "Electronics",
    price: 115.0,
    description:
      "Relax tired eyes anywhere with 9-airbag acupressure massage, gentle heat, vibration therapy, and built-in wireless music. After a long day of screens, reading, or driving, tired eyes deserve more than a quick rub. This eye massager brings together heat, air-pressure massage, and gentle vibration in one foldable, travel-ready device — designed to ease tension around the eyes and temples the way a professional massage would. Nine independent airbags apply a soft, rhythmic press-and-release pattern, while four selectable modes let you choose the intensity and combination of massage, heat, and vibration that fits your moment. Pair it with your phone over Bluetooth to layer in music or ambient sound, and the plush interior fabric keeps it comfortable through every session. Built with a durable ABS shell and a long-lasting rechargeable battery, it's made to handle daily use at home, in the office, or packed in a bag for travel.",
    features: [
      "9-Airbag Acupressure Massage — Dual-layer airbag system applies targeted press-and-release pressure around the eyes and temples to relieve tension after long hours of screen time, reading, or driving",
      "4 Customizable Massage Modes — Eye Protection, Nursing, Strong, and Refreshing modes cycle with one button, combining air compression, heat, and multi-frequency vibration (~50 pulses/second)",
      "Built-In Bluetooth Speaker — Stream music, white noise, or guided meditation directly into the headband",
      "Foldable & Travel-Ready — 180° folding hinge, soft plush interior, and adjustable headband fit most head sizes",
      "Long-Lasting 12,000mAh Battery — Up to 7–10 sessions per charge, USB cable included",
      "Specifications — Rechargeable (<50V AC input) · 12,000mAh battery · ABS shell + soft TPR padding · Bluetooth connectivity · 4 massage modes · 9 airbags · 180° fold angle · Targets eyes & temples",
      "What's Included — 1x Eye Massager, 1x USB Charging Cable, 1x Instruction Manual, 1x Storage Pouch",
    ],
    image: "/products/eye-massager-main.png",
    images: [
      "/products/eye-massager-box.png",
      "/products/eye-massager-lifestyle.png",
      "/products/eye-massager-folding.png",
      "/products/eye-massager-controls.png",
      "/products/eye-massager-size.png",
      "/products/eye-massager-in-the-box.png",
    ],
    rating: 4.9,
    reviewCount: 7,
    reviews: [
      {
        author: "Tom W.",
        rating: 5,
        title: "Great product",
        text: "Great product! Really happy with it.",
        date: "May 31, 2026",
      },
      {
        author: "David K.",
        rating: 4,
        title: "Good quality",
        text: "Good quality product — well made.",
        date: "April 8, 2026",
      },
      {
        author: "Sarah T.",
        rating: 5,
        title: "Excellent seller, fast shipping",
        text: "Excellent seller and a good product. Shipping was fast and everything arrived well packaged.",
        date: "January 15, 2026",
      },
      {
        author: "Elena P.",
        rating: 5,
        title: "Quick delivery, well packaged",
        text: "Fast delivery, good quality, and it arrived well packaged.",
        date: "November 30, 2025",
      },
      {
        author: "James R.",
        rating: 5,
        title: "Arrived fast and looks great",
        text: "Very fast delivery in the original packaging, and the product looks great. I haven't tried it yet, but I'm excited to.",
        date: "November 17, 2025",
      },
      {
        author: "Monica L.",
        rating: 5,
        title: "So relaxing",
        text: "Amazing quality. The massage is soft and really helps my eyes relax.",
        date: "October 31, 2025",
      },
      {
        author: "Aisha B.",
        rating: 5,
        title: "Perfect gift",
        text: "I got this for my daughter for Christmas — she's going to love it.",
        date: "October 28, 2025",
      },
    ],
    shipping: {
      freeShipping: true,
      minDays: 5,
      maxDays: 10,
      onTimeNote: "77.5% of orders arrive within 10 days",
      lateDeliveryPerk: "Collect a $1.00 coupon if your delivery arrives late",
    },
    inStock: true,
    newArrival: true,
    trending: true,
    dateAdded: "2026-07-12",
  },
  {
    id: "5-in-2-usb-hub",
    name: "5-in-2 USB 3.0 Hub with Gigabit Ethernet (RJ45) Adapter",
    category: "Electronics",
    price: 25.0,
    description:
      "Expand your laptop's connectivity with a compact 5-in-2 hub featuring Gigabit Ethernet and high-speed USB 3.0 ports. Modern laptops trade ports for slim designs — this 5-in-2 hub brings them back. With a Gigabit Ethernet port for a stable wired connection and multiple USB 3.0 ports for fast data transfer, it's a simple way to expand your laptop's connectivity for work, gaming, or everyday use. It's plug-and-play across Windows, macOS, and Linux, and the USB port has enough power output to run external hard drives directly — no separate power brick needed. Compact and portable, it's built to travel with your laptop bag or stay on your desk.",
    features: [
      "5-in-2 Design — Combines multiple USB 3.0 ports with a Gigabit RJ45 Ethernet port in one compact adapter",
      "USB 3.0 Speeds — Fast, reliable data transfer for external drives, peripherals, and accessories",
      "Plug-and-Play Compatibility — Recognized automatically by Windows 11, macOS, and Linux with no driver installation needed",
      "Reliable Ethernet Connection — Gigabit RJ45 port delivers a stable wired internet connection, ideal for laptops without a built-in Ethernet port",
      "Powers External Drives — USB port supplies enough power to run external hard drives without needing a separate power adapter",
      "Specifications — USB 3.0 interface · 5 ports · Gigabit RJ45 Ethernet · Compatible with Windows, macOS, and Linux",
      "What's Included — 1x 5-in-2 USB Hub",
    ],
    image: "/products/usb-hub-main.png",
    images: [
      "/products/usb-hub-dimensions.png",
      "/products/usb-hub-office.png",
      "/products/usb-hub-transfer.png",
      "/products/usb-hub-network.png",
      "/products/usb-hub-gaming.png",
    ],
    rating: 4.75,
    reviewCount: 16,
    reviews: [
      {
        author: "R.S.",
        rating: 5,
        title: "A steal for the quality",
        text: "High quality and works exactly as expected. I got a great discount too, so it's a steal for the quality.",
        date: "March 9, 2026",
      },
      {
        author: "T.G.",
        rating: 5,
        title: "Plug-and-play on Windows and Linux",
        text: "Recognized automatically as a Gigabit network adapter by both Windows 11 and Linux Mint at startup. Linux even identifies the exact chip inside.",
        date: "March 2, 2026",
      },
      {
        author: "D.U.",
        rating: 5,
        title: "Works as expected",
        text: "Works as expected.",
        date: "February 15, 2026",
      },
      {
        author: "M.K.",
        rating: 5,
        title: "Powers an external drive from a MacBook Pro",
        text: "Works well with a MacBook Pro. The USB port can power an external drive, which is great — some other hubs fail at that without a separate power supply. Easy to recommend.",
        date: "November 19, 2025",
      },
      {
        author: "A.L.",
        rating: 5,
        title: "Fast shipping, well packaged",
        text: "Fast shipping, well packaged, and everything was in order.",
        date: "November 15, 2025",
      },
      {
        author: "J.P.",
        rating: 4,
        title: "Arrived earlier than expected",
        text: "Arrived earlier than expected and well packaged — everything looked good on first inspection.",
        date: "November 8, 2025",
      },
      {
        author: "S.V.",
        rating: 5,
        title: "Well made",
        text: "Well made and good quality.",
        date: "October 29, 2025",
      },
      {
        author: "E.N.",
        rating: 5,
        title: "All ports work properly",
        text: "Works well with good speeds, and all the ports function properly.",
        date: "October 24, 2025",
      },
      {
        author: "C.B.",
        rating: 5,
        title: "Runs all my USB devices",
        text: "Works perfectly — now I can run multiple USB devices off one hub.",
        date: "October 14, 2025",
      },
      {
        author: "H.R.",
        rating: 5,
        title: "Still working great",
        text: "I accidentally ordered the version without the Ethernet port, but it's still working great — thanks!",
        date: "October 7, 2025",
      },
      {
        author: "L.M.",
        rating: 5,
        title: "Fits the description",
        text: "Good quality, fits the description, and shipped fast.",
        date: "September 13, 2025",
      },
      {
        author: "P.D.",
        rating: 5,
        title: "Perfect",
        text: "Loved it — perfect.",
        date: "September 8, 2025",
      },
      {
        author: "N.F.",
        rating: 5,
        title: "Small and convenient",
        text: "Small and convenient. Affordable and fast — recommended.",
        date: "September 4, 2025",
      },
      {
        author: "V.A.",
        rating: 4,
        title: "Sturdy, with solid Ethernet speed",
        text: "Nice looking with a sturdy feel. Ethernet speed is solid — I haven't tested the USB ports yet.",
        date: "August 30, 2025",
      },
      {
        author: "G.T.",
        rating: 3,
        title: "Slightly loose cable connection",
        text: "There was a slightly loose connection between the dock and the cable, but not enough to bother with a return.",
        date: "August 13, 2025",
      },
      {
        author: "K.W.",
        rating: 5,
        title: "Worked on the first connection",
        text: "Everything worked on the very first connection.",
        date: "August 11, 2025",
      },
    ],
    shipping: {
      freeShipping: true,
      minDays: 7,
      maxDays: 12,
      onTimeNote: "86.1% of orders arrive within 12 days",
      lateDeliveryPerk: "Collect a $1.00 coupon if your delivery arrives late",
    },
    inStock: true,
    newArrival: true,
    dateAdded: "2026-07-12",
  },
  {
    id: "squishy-butter-stress-toy",
    name: "Squishy Cheese & Butter Stress Relief Toy — Slow Rising Squeeze Fidget Ball (2-Pack)",
    category: "Toys",
    price: 15.0,
    description:
      "Satisfying, slow-rising squeeze toys perfect for stress relief, fidgeting, or a fun little gift. Sometimes the best stress relief is something small and simple to squeeze. This soft, slow-rising squishy toy delivers satisfying tactile feedback every time — perfect for fidgeting during a long day, keeping hands busy, or just as a fun little desk companion. Lightweight and pocket-sized, it's easy to toss in a bag or keep on a desk. Comes as a 2-pack — keep one and share one, or just have a backup on hand.",
    features: [
      "Slow-Rising Squish — Soft, squishy texture that slowly bounces back for satisfying tactile stress relief",
      "Great for Fidgeting & Focus — A fun way to relieve stress, anxiety, or restlessness for kids and adults alike",
      "Compact & Portable — Small, pocket-friendly size makes it easy to carry and use anywhere",
      "Fun Gift Idea — A playful, affordable gift for birthdays, holidays, or just because",
      "Safe Materials — Made without high-concern chemicals, safe for everyday play",
      "Specifications — Plastic/viscose blend · Recommended age 14+ · Non-electronic · No high-concern chemicals",
      "What's Included — 2x Squishy Squeeze Toy",
    ],
    image: "/products/squishy-butter-squeeze.jpeg",
    images: ["/products/squishy-butter-stack.jpeg"],
    rating: 5,
    reviewCount: 5,
    reviews: [
      {
        author: "E.R.",
        rating: 5,
        title: "Exactly what I wanted",
        text: "Excellent quality — exactly what I wanted.",
        date: "July 8, 2026",
      },
      {
        author: "M.Y.",
        rating: 5,
        title: "Great little stress reliever",
        text: "Excellent — a great little stress reliever.",
        date: "July 8, 2026",
      },
      {
        author: "S.D.",
        rating: 5,
        title: "Would buy again",
        text: "Excellent product, I would buy it again.",
        date: "July 8, 2026",
      },
      {
        author: "A.N.",
        rating: 5,
        title: "Happy with it",
        text: "Excellent — very happy with it.",
        date: "July 8, 2026",
      },
      {
        author: "L.K.",
        rating: 5,
        title: "Very cute",
        text: "It's very cute!",
        date: "June 22, 2026",
      },
    ],
    shipping: {
      freeShipping: true,
      minDays: 7,
      maxDays: 13,
      onTimeNote: "81.1% of orders arrive within 12 days",
    },
    inStock: true,
    newArrival: true,
    dateAdded: "2026-07-12",
  },
];

export function getProduct(id: string, list: Product[] = products): Product | undefined {
  return list.find((product) => product.id === id);
}

export function getBestSellers(list: Product[] = products): Product[] {
  const sellers = list.filter(
    (product) => product.bestSeller || promotedRank(product) < PROMOTED_NAMES.length,
  );
  return sellers.sort(
    (a, b) => promotedRank(a) - promotedRank(b) || b.reviewCount - a.reviewCount,
  );
}

export function getNewArrivals(list: Product[] = products): Product[] {
  return list
    .filter((product) => product.newArrival)
    .sort(
      (a, b) =>
        new Date(b.dateAdded ?? 0).getTime() - new Date(a.dateAdded ?? 0).getTime(),
    );
}

export function getDeals(list: Product[] = products): Product[] {
  return list.filter((product) => product.deal);
}

export function getTrending(list: Product[] = products): Product[] {
  return list
    .filter((product) => product.trending)
    .sort((a, b) => promotedRank(a) - promotedRank(b) || b.reviewCount - a.reviewCount);
}

/** Highest-rated products with meaningful review volume. */
export function getCustomerFavorites(list: Product[] = products): Product[] {
  return list
    .filter((product) => product.rating >= 4.5)
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
}

export function getProductsByIds(ids: string[], list: Product[] = products): Product[] {
  return ids
    .map((id) => getProduct(id, list))
    .filter((product): product is Product => product !== undefined);
}

export function getRelated(product: Product, list: Product[] = products, limit = 4): Product[] {
  const sameCategory = list.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category,
  );
  const others = list.filter(
    (candidate) => candidate.id !== product.id && candidate.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getBrands(list: Product[] = products): string[] {
  return [
    ...new Set(
      list
        .map((product) => product.brand)
        .filter((brand): brand is string => brand !== undefined),
    ),
  ].sort();
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
