"use client";

import { Check, Download, ExternalLink, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { categories, formatPrice } from "@/lib/products";

const inputClasses =
  "min-h-12 w-full rounded-xl border border-navy-600 bg-navy-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40";
const labelClasses = "mb-1.5 block text-sm font-medium text-slate-300";
const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-95 disabled:cursor-not-allowed disabled:bg-navy-600";
const cardClasses = "rounded-2xl border border-navy-700/60 bg-navy-800/60";

const PASSWORD_KEY = "spotket-admin-password";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  features: string[];
  image: string | null;
  images: string[];
  aliexpress_url?: string | null;
  rating: number;
  review_count: number;
  stock: number;
};

type OrderRow = {
  id: string;
  customer_email: string;
  items: {
    name: string;
    variant?: string;
    quantity: number;
    price: number;
    product_id?: string | null;
    supplier_url?: string | null;
  }[];
  total: number;
  status: string;
  created_at: string;
};

type FormState = {
  id: string;
  name: string;
  price: string;
  salePrice: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  aliexpressUrl: string;
  stock: string;
};

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  price: "",
  salePrice: "",
  category: "Electronics",
  description: "",
  features: [""],
  image: "",
  images: [],
  aliexpressUrl: "",
  stock: "25",
};

const ORDER_STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"products" | "orders" | "cj">("products");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [form, setForm] = useState<FormState | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importImages, setImportImages] = useState<string[]>([]);
  const [importCost, setImportCost] = useState<number | null>(null);
  const [importShipping, setImportShipping] = useState<{
    minDays: number;
    maxDays: number;
    shipsFrom?: string;
    freeShipping?: boolean;
  } | null>(null);
  const [reviewsImportingId, setReviewsImportingId] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [cjQuery, setCjQuery] = useState("");
  const [cjBusy, setCjBusy] = useState(false);
  const [cjResults, setCjResults] = useState<
    { pid: string; name: string; image: string; cost: number | null; shippingEstimate: string }[]
  >([]);
  const [cjSource, setCjSource] = useState<{ pid: string; vid: string; cost: number | null } | null>(null);

  const api = useCallback(
    async (path: string, init?: RequestInit) => {
      const stored = sessionStorage.getItem(PASSWORD_KEY) ?? "";
      const response = await fetch(path, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": stored,
          ...init?.headers,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status})`);
      return data;
    },
    [],
  );

  const loadProducts = useCallback(async () => {
    const data = await api("/api/admin/products");
    setProducts(data.products);
  }, [api]);

  const loadOrders = useCallback(async () => {
    const data = await api("/api/admin/orders");
    setOrders(data.orders);
  }, [api]);

  useEffect(() => {
    if (sessionStorage.getItem(PASSWORD_KEY)) {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    if (tab === "cj") return;
    (tab === "products" ? loadProducts() : loadOrders()).catch((error) => {
      if (String(error.message).includes("Unauthorized")) {
        sessionStorage.removeItem(PASSWORD_KEY);
        setAuthed(false);
      } else {
        setMessage(error.message);
      }
    });
  }, [authed, tab, loadProducts, loadOrders]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sessionStorage.setItem(PASSWORD_KEY, password);
    setAuthed(true);
  };

  const startAdd = () => {
    setForm({ ...EMPTY_FORM, features: [""] });
    setEditingId(null);
    setImportUrl("");
    setImportImages([]);
    setImportCost(null);
    setImportShipping(null);
    setShowImagePicker(false);
    setCjSource(null);
    setMessage(null);
  };

  const startEdit = (product: ProductRow) => {
    setForm({
      id: product.id,
      name: product.name,
      price: String(product.compare_at_price ?? product.price),
      salePrice: product.compare_at_price ? String(product.price) : "",
      category: product.category,
      description: product.description,
      features: product.features.length > 0 ? product.features : [""],
      image: product.image ?? "",
      images: product.images ?? [],
      aliexpressUrl: product.aliexpress_url ?? "",
      stock: String(product.stock),
    });
    setEditingId(product.id);
    setImportImages(
      [...new Set([product.image, ...(product.images ?? [])])].filter(
        (imageUrl): imageUrl is string => Boolean(imageUrl),
      ),
    );
    setImportCost(null);
    setImportShipping(null);
    setShowImagePicker(false);
    setMessage(null);
  };

  const handleImport = async () => {
    if (!importUrl.trim()) return;
    setImporting(true);
    setMessage(null);
    try {
      const data = await api("/api/import-product", {
        method: "POST",
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const extracted = data.product;
      const images: string[] = Array.isArray(data.images) ? data.images : [];
      const cost = Number(extracted.originalPrice) || null;
      const shipping =
        extracted.shipping && Number(extracted.shipping.minDays) > 0
          ? {
              minDays: Number(extracted.shipping.minDays),
              maxDays: Number(extracted.shipping.maxDays) || Number(extracted.shipping.minDays) + 10,
              shipsFrom: extracted.shipping.shipsFrom ? String(extracted.shipping.shipsFrom) : undefined,
              freeShipping: Boolean(extracted.shipping.freeShipping),
            }
          : null;
      setImportImages(images);
      setImportCost(cost);
      setImportShipping(shipping);
      setShowImagePicker(images.length > 0);
      setForm((current) => ({
        ...(current ?? EMPTY_FORM),
        name: extracted.title ?? "",
        description: extracted.description ?? "",
        features:
          Array.isArray(extracted.features) && extracted.features.length > 0
            ? extracted.features.map(String)
            : [""],
        // "Your price" stays empty for the admin to set.
        price: "",
        image: images[0] ?? "",
        images: images.slice(1),
        aliexpressUrl: importUrl.trim(),
        category: (categories as readonly string[]).includes(extracted.category)
          ? extracted.category
          : "Electronics",
        id: "",
        salePrice: "",
      }));
      setMessage(
        data.source === "url-only"
          ? "The page couldn't be fetched, so this listing was AI-generated from the URL — double-check every detail before saving."
          : `Imported (${data.source}, ${data.model}).${cost ? ` Your cost: $${cost}.` : ""} Pick an image, set your price, review, and save.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed");
    }
    setImporting(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;
    setBusy(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        features: form.features.map((feature) => feature.trim()).filter(Boolean),
        images: form.images.filter((imageUrl) => imageUrl !== form.image),
        shipping: importShipping ?? undefined,
        cj: cjSource ?? undefined,
      };
      await api("/api/admin/products", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      });
      setForm(null);
      setEditingId(null);
      await loadProducts();
      setMessage(editingId ? "Product updated." : "Product added.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    }
    setBusy(false);
  };

  const handleDelete = async (product: ProductRow) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await api(`/api/admin/products?id=${encodeURIComponent(product.id)}`, {
        method: "DELETE",
      });
      await loadProducts();
      setMessage("Product deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const handleCjSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cjQuery.trim()) return;
    setCjBusy(true);
    setMessage(null);
    try {
      const data = await api(`/api/cj/search?q=${encodeURIComponent(cjQuery.trim())}`);
      setCjResults(data.results);
      if (data.results.length === 0) setMessage("No CJ products matched that search.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "CJ search failed");
    }
    setCjBusy(false);
  };

  const handleCjImport = async (pid: string) => {
    setCjBusy(true);
    setMessage(null);
    try {
      const detail = await api(`/api/cj/product?pid=${encodeURIComponent(pid)}`);
      if (!detail.vid) throw new Error("This CJ product has no orderable variant");
      setTab("products");
      setEditingId(null);
      setImportImages(detail.image ? [detail.image] : []);
      setImportCost(detail.cost);
      setImportShipping({ minDays: 7, maxDays: 15, shipsFrom: "China", freeShipping: true });
      setCjSource({ pid: detail.pid, vid: detail.vid, cost: detail.cost });
      setShowImagePicker(false);
      setForm({
        ...EMPTY_FORM,
        name: detail.name ?? "",
        description: detail.description ?? "",
        features: [""],
        image: detail.image ?? "",
        images: [],
        category: "Electronics",
      });
      setMessage(
        `CJ product loaded${detail.cost ? ` — your cost: $${detail.cost}` : ""}. Set your price, pick a category, and save. Orders for this product will auto-fulfill through CJ.`,
      );
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "CJ import failed");
    }
    setCjBusy(false);
  };

  const handleImportReviews = async (product: ProductRow) => {
    setReviewsImportingId(product.id);
    setMessage(null);
    try {
      const data = await api("/api/admin/import-reviews", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      });
      setMessage(
        `Imported ${data.imported} real supplier reviews for "${product.name.slice(0, 40)}…" — rating now ${data.rating} from ${data.reviewCount} reviews.`,
      );
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Review import failed");
    }
    setReviewsImportingId(null);
  };

  const openProductEditor = async (productId: string) => {
    try {
      const data = await api("/api/admin/products");
      setProducts(data.products);
      const product = (data.products as ProductRow[]).find((row) => row.id === productId);
      setTab("products");
      if (product) startEdit(product);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not open product");
    }
  };

  const handleStatus = async (order: OrderRow, status: string) => {
    try {
      await api("/api/admin/orders", {
        method: "PATCH",
        body: JSON.stringify({ id: order.id, status }),
      });
      setOrders((current) =>
        current.map((row) => (row.id === order.id ? { ...row, status } : row)),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status update failed");
    }
  };

  const setField = (field: keyof FormState, value: string) =>
    setForm((current) => (current ? { ...current, [field]: value } : current));

  if (!authed) {
    return (
      <form onSubmit={handleLogin} className={`mx-auto max-w-sm space-y-4 p-6 ${cardClasses}`}>
        <h1 className="text-2xl font-extrabold text-white">Admin Access</h1>
        <div>
          <label htmlFor="admin-password" className={labelClasses}>Password</label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClasses}
          />
        </div>
        <button type="submit" className={`${primaryButton} w-full`}>Enter</button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
        <div className="grid grid-cols-3 rounded-xl border border-navy-600 p-1">
          {(["products", "orders", "cj"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              className={`min-h-11 rounded-lg px-5 text-sm font-semibold capitalize transition-colors ${
                tab === option ? "bg-brand text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              {option === "cj" ? "Import from CJ" : option}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className="mt-4 rounded-xl border border-navy-600 bg-navy-900/60 px-4 py-3 text-sm text-slate-300">
          {message}
        </p>
      )}

      {tab === "products" && (
        <div className="mt-6">
          {!form && (
            <button type="button" onClick={startAdd} className={primaryButton}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Product
            </button>
          )}

          {form && (
            <form onSubmit={handleSave} className={`space-y-5 p-6 ${cardClasses}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  type="button"
                  onClick={() => setForm(null)}
                  aria-label="Close form"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {!editingId && (
                <div className="rounded-xl border border-brand/40 bg-brand/5 p-4">
                  <label htmlFor="import-url" className={labelClasses}>
                    Paste AliExpress product link
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="import-url"
                      type="url"
                      value={importUrl}
                      onChange={(event) => setImportUrl(event.target.value)}
                      placeholder="https://www.aliexpress.com/item/…"
                      className={inputClasses}
                    />
                    <button
                      type="button"
                      onClick={handleImport}
                      disabled={importing || !importUrl.trim()}
                      className={`${primaryButton} shrink-0`}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {importing ? "Importing…" : "Import Product"}
                    </button>
                  </div>
                </div>
              )}

              {importShipping && (
                <p className="rounded-xl border border-navy-600 bg-navy-900/60 px-4 py-3 text-sm text-slate-300">
                  Shipping: {importShipping.minDays}–{importShipping.maxDays} days
                  {importShipping.shipsFrom && ` from ${importShipping.shipsFrom}`}
                  {importShipping.freeShipping && " · free shipping"} — saved with the
                  product and shown on its page.
                </p>
              )}

              {!showImagePicker && (form.image || form.images.length > 0 || importImages.length > 0) && (
                <div className="rounded-xl border border-navy-600 bg-navy-900/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className={labelClasses}>Main Image</p>
                    {importImages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowImagePicker(true)}
                        className="min-h-11 rounded-xl border border-navy-600 px-4 text-sm font-semibold text-slate-300 hover:border-brand hover:text-brand"
                      >
                        Change Images
                      </button>
                    )}
                  </div>
                  <span className="relative mt-1 block h-20 w-20 overflow-hidden rounded-lg border border-navy-600">
                    {form.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.image} alt="Current main product image" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-slate-500">none</span>
                    )}
                  </span>
                  {form.images.length > 0 && (
                    <>
                      <p className={`${labelClasses} mt-4`}>
                        Additional Images
                        <span className="ml-2 font-normal text-slate-500">{form.images.length}</span>
                      </p>
                      <ul className="space-y-2">
                        {form.images.map((imageUrl) => (
                          <li
                            key={imageUrl}
                            className="flex items-center gap-3 rounded-lg border border-navy-700/60 bg-navy-800/40 p-2"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                            <span className="min-w-0 flex-1 truncate text-xs text-slate-400">{imageUrl}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((current) =>
                                  current
                                    ? { ...current, images: current.images.filter((u) => u !== imageUrl) }
                                    : current,
                                )
                              }
                              aria-label="Remove image from gallery"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:text-red-400"
                            >
                              <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {showImagePicker && importImages.length > 0 && (
                <fieldset className="overflow-hidden rounded-xl border border-navy-600 bg-navy-900/40 p-4">
                  <legend className="sr-only">Product images</legend>

                  <p className={labelClasses}>Main Image</p>
                  <div className="flex items-center gap-3">
                    <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-amber-400">
                      {form.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.image} alt="Selected main product image" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-slate-500">
                          none
                        </span>
                      )}
                    </span>
                    <p className="text-sm text-slate-400">
                      Click any image below to make it the main image (gold). Use the
                      corner button to add it to the additional gallery (blue).
                    </p>
                  </div>

                  <p className={`${labelClasses} mt-4`}>
                    Additional Images
                    <span className="ml-2 font-normal text-slate-500">
                      {form.images.length} selected
                    </span>
                  </p>
                  <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                    {importImages.map((imageUrl) => {
                      const isMain = form.image === imageUrl;
                      const inGallery = form.images.includes(imageUrl);
                      return (
                        <div
                          key={imageUrl}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                            isMain
                              ? "border-amber-400 ring-2 ring-amber-400/40"
                              : inGallery
                                ? "border-brand ring-2 ring-brand/40"
                                : "border-navy-600 hover:border-navy-400"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setField("image", imageUrl)}
                            aria-label="Set as main product image"
                            aria-pressed={isMain}
                            className="absolute inset-0"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                          </button>
                          {isMain && (
                            <span className="pointer-events-none absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-navy-950">
                              <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                            </span>
                          )}
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() =>
                                setForm((current) =>
                                  current
                                    ? {
                                        ...current,
                                        images: inGallery
                                          ? current.images.filter((u) => u !== imageUrl)
                                          : [...current.images, imageUrl],
                                      }
                                    : current,
                                )
                              }
                              aria-label={
                                inGallery ? "Remove from gallery" : "Add to gallery"
                              }
                              aria-pressed={inGallery}
                              className={`absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                                inGallery
                                  ? "bg-brand text-white"
                                  : "bg-navy-950/80 text-slate-300 hover:text-white"
                              }`}
                            >
                              {inGallery ? (
                                <Check className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <Plus className="h-4 w-4" aria-hidden="true" />
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(false)}
                    className="mt-3 min-h-11 rounded-xl border border-navy-600 px-4 text-sm font-semibold text-slate-300 hover:border-brand hover:text-brand"
                  >
                    Done
                  </button>
                </fieldset>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="p-name" className={labelClasses}>Product Name *</label>
                  <input id="p-name" required value={form.name} onChange={(e) => setField("name", e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="p-price" className={labelClasses}>
                    Your Price ($) *
                    {importCost !== null && (
                      <span className="ml-2 font-normal text-slate-500">
                        Your cost: ${importCost}
                      </span>
                    )}
                  </label>
                  <input id="p-price" type="number" min="0" step="0.01" required value={form.price} onChange={(e) => setField("price", e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="p-sale" className={labelClasses}>Sale Price ($, optional)</label>
                  <input id="p-sale" type="number" min="0" step="0.01" value={form.salePrice} onChange={(e) => setField("salePrice", e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="p-category" className={labelClasses}>Category *</label>
                  <select id="p-category" value={form.category} onChange={(e) => setField("category", e.target.value)} className={inputClasses}>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="p-image" className={labelClasses}>Image URL</label>
                  <input id="p-image" value={form.image} onChange={(e) => setField("image", e.target.value)} placeholder="https://… or /products/…" className={inputClasses} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-ali-url" className={labelClasses}>
                    AliExpress URL
                    <span className="ml-2 font-normal text-slate-500">
                      enables one-click review imports
                    </span>
                  </label>
                  <input id="p-ali-url" type="url" value={form.aliexpressUrl} onChange={(e) => setField("aliexpressUrl", e.target.value)} placeholder="https://www.aliexpress.com/item/…" className={inputClasses} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-description" className={labelClasses}>Description</label>
                  <textarea id="p-description" rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} className={`${inputClasses} min-h-28`} />
                </div>
              </div>

              <fieldset>
                <legend className={labelClasses}>Feature Bullet Points</legend>
                <div className="space-y-2">
                  {form.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={feature}
                        onChange={(event) =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  features: current.features.map((f, i) =>
                                    i === index ? event.target.value : f,
                                  ),
                                }
                              : current,
                          )
                        }
                        placeholder={`Feature ${index + 1}`}
                        className={inputClasses}
                      />
                      <button
                        type="button"
                        aria-label={`Remove feature ${index + 1}`}
                        onClick={() =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  features:
                                    current.features.length > 1
                                      ? current.features.filter((_, i) => i !== index)
                                      : [""],
                                }
                              : current,
                          )
                        }
                        className="flex min-h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-navy-600 text-slate-400 hover:border-red-400/60 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) =>
                        current ? { ...current, features: [...current.features, ""] } : current,
                      )
                    }
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand hover:text-white"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add feature
                  </button>
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="p-stock" className={labelClasses}>Stock Quantity</label>
                  <input id="p-stock" type="number" min="0" value={form.stock} onChange={(e) => setField("stock", e.target.value)} className={inputClasses} />
                </div>
                <p className="flex items-end pb-3 text-sm text-slate-500 sm:col-span-2">
                  Rating and review count are computed automatically from real
                  reviews{editingId ? " — import or collect reviews to change them" : ""}.
                </p>
              </div>

              <button type="submit" disabled={busy} className={`${primaryButton} w-full sm:w-auto`}>
                {busy ? "Saving…" : editingId ? "Save Changes" : "Add Product"}
              </button>
            </form>
          )}

          <ul className="mt-6 space-y-3">
            {products.map((product) => (
              <li key={product.id} className={`flex flex-wrap items-center gap-4 p-4 ${cardClasses}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {product.image && (
                  <img src={product.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{product.name}</p>
                  <p className="text-xs text-slate-400">
                    {product.category} · {formatPrice(Number(product.price))}
                    {product.compare_at_price &&
                      ` (was ${formatPrice(Number(product.compare_at_price))})`}{" "}
                    · stock {product.stock} · ★ {Number(product.rating).toFixed(1)} (
                    {product.review_count})
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.aliexpress_url && (
                    <button
                      type="button"
                      onClick={() => handleImportReviews(product)}
                      disabled={reviewsImportingId === product.id}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-navy-600 px-4 text-sm font-semibold text-slate-300 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {reviewsImportingId === product.id
                        ? "Importing…"
                        : "Import Reviews from AliExpress"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-navy-600 px-4 text-sm font-semibold text-slate-300 hover:border-brand hover:text-brand"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-navy-600 px-4 text-sm font-semibold text-slate-300 hover:border-red-400/60 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {products.length === 0 && (
              <li className={`p-6 text-center text-sm text-slate-400 ${cardClasses}`}>
                No products yet.
              </li>
            )}
          </ul>
        </div>
      )}

      {tab === "orders" && (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li key={order.id} className={`p-4 ${cardClasses}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {order.customer_email} · {formatPrice(Number(order.total))}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.created_at).toLocaleString("en-US")} · {order.id}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  Status
                  <select
                    value={order.status}
                    onChange={(event) => handleStatus(order, event.target.value)}
                    className="min-h-11 rounded-xl border border-navy-600 bg-navy-900/70 px-3 text-sm capitalize text-white"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <ul className="mt-3 space-y-2 border-t border-navy-700/60 pt-3 text-sm text-slate-300">
                {order.items.map((item, index) => (
                  <li key={index} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="min-w-0 flex-1">
                      {item.name}
                      {item.variant && ` (${item.variant})`} × {item.quantity} —{" "}
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    {item.supplier_url ? (
                      <a
                        href={item.supplier_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-brand/50 px-3 text-xs font-semibold text-brand hover:bg-brand/10"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        Buy from Supplier
                      </a>
                    ) : item.product_id ? (
                      <button
                        type="button"
                        onClick={() => openProductEditor(item.product_id!)}
                        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-navy-600 px-3 text-xs font-semibold text-slate-300 hover:border-brand hover:text-brand"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        Add supplier URL
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {orders.length === 0 && (
            <li className={`p-6 text-center text-sm text-slate-400 ${cardClasses}`}>
              No orders yet.
            </li>
          )}
        </ul>
      )}

      {tab === "cj" && (
        <div className="mt-6">
          <form onSubmit={handleCjSearch} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={cjQuery}
              onChange={(event) => setCjQuery(event.target.value)}
              placeholder="Search CJDropshipping products…"
              className={inputClasses}
            />
            <button type="submit" disabled={cjBusy} className={`${primaryButton} shrink-0`}>
              {cjBusy ? "Searching…" : "Search CJ"}
            </button>
          </form>

          <ul className="mt-6 space-y-3">
            {cjResults.map((item) => (
              <li key={item.pid} className={`flex flex-wrap items-center gap-4 p-4 ${cardClasses}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.image && (
                  <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.cost !== null && <>Cost: <span className="font-semibold text-gold">${item.cost}</span> · </>}
                    Shipping: {item.shippingEstimate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCjImport(item.pid)}
                  disabled={cjBusy}
                  className={primaryButton}
                >
                  Import
                </button>
              </li>
            ))}
            {cjResults.length === 0 && !cjBusy && (
              <li className={`p-8 text-center text-sm text-slate-400 ${cardClasses}`}>
                Search the CJ catalog to import products — cost price, images, and
                auto-fulfillment wiring come along automatically.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
