"use client";

import { CreditCard, Gift, Heart, LogOut, MapPin, Package, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth, type SavedAddress } from "@/context/AuthContext";
import { formatPrice } from "@/lib/products";

const inputClasses =
  "min-h-12 w-full rounded-xl border border-navy-600 bg-navy-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40";
const labelClasses = "mb-1.5 block text-sm font-medium text-slate-300";
const primaryButton =
  "min-h-12 w-full rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95";
const cardClasses = "rounded-2xl border border-navy-700/60 bg-navy-800/60 p-6";

const EMPTY_ADDRESS: SavedAddress = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
};

function AuthForms() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const set = (field: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  // Supabase may respond with a "confirm your email" notice rather than an error.
  const isInfo = error?.startsWith("Almost there");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "signup" && form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    const result =
      mode === "login"
        ? await login(form.email, form.password)
        : await signup(form.name, form.email, form.password);
    setError(result);
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-center text-3xl font-extrabold text-white">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        {mode === "login"
          ? "Welcome back — sign in to see your orders."
          : "Join Spotket to track orders and check out faster."}
      </p>

      {/* Toggle */}
      <div className="mt-6 grid grid-cols-2 rounded-xl border border-navy-600 p-1">
        {(["login", "signup"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setMode(option);
              setError(null);
            }}
            aria-pressed={mode === option}
            className={`min-h-11 rounded-lg text-sm font-semibold transition-colors ${
              mode === option ? "bg-brand text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            {option === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={`mt-6 space-y-4 ${cardClasses}`}>
        {mode === "signup" && (
          <div>
            <label htmlFor="account-name" className={labelClasses}>Full Name</label>
            <input id="account-name" type="text" required value={form.name} onChange={set("name")} autoComplete="name" className={inputClasses} />
          </div>
        )}
        <div>
          <label htmlFor="account-email" className={labelClasses}>Email</label>
          <input id="account-email" type="email" required value={form.email} onChange={set("email")} autoComplete="email" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="account-password" className={labelClasses}>Password</label>
          <input
            id="account-password"
            type="password"
            required
            value={form.password}
            onChange={set("password")}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={inputClasses}
          />
        </div>
        {mode === "signup" && (
          <div>
            <label htmlFor="account-confirm" className={labelClasses}>Confirm Password</label>
            <input id="account-confirm" type="password" required value={form.confirm} onChange={set("confirm")} autoComplete="new-password" className={inputClasses} />
          </div>
        )}
        {error && (
          <p
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              isInfo
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/40 bg-red-500/10 text-red-300"
            }`}
          >
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { user, orders, logout, updateProfile } = useAuth();
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [address, setAddress] = useState<SavedAddress>(user?.address ?? EMPTY_ADDRESS);

  if (!user) return null;

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateProfile({ name: profile.name.trim() || user.name, phone: profile.phone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const saveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateProfile({ address });
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2000);
  };

  const setAddressField = (field: keyof SavedAddress) =>
    (event: { target: { value: string } }) =>
      setAddress((current) => ({ ...current, [field]: event.target.value }));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Hi, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-navy-600 px-5 text-sm font-semibold text-slate-300 transition-colors hover:border-red-400/60 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log Out
        </button>
      </div>

      {/* Order history */}
      <section className="mt-10" aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="flex items-center gap-2 text-lg font-bold text-white">
          <Package className="h-5 w-5 text-brand" aria-hidden="true" />
          Order History
        </h2>
        {orders.length === 0 ? (
          <p className={`mt-4 text-center text-sm text-slate-400 ${cardClasses}`}>
            No orders yet — they&apos;ll appear here after checkout.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className={cardClasses}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </p>
                  <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                </div>
                <p className="mt-0.5 break-all text-xs text-slate-500">Order {order.id}</p>
                <ul className="mt-3 space-y-1 border-t border-navy-700/60 pt-3 text-sm text-slate-300">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between gap-3">
                      <span>
                        {item.name}
                        {item.variant && ` (${item.variant})`} × {item.quantity}
                      </span>
                      <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                {order.address && (
                  <p className="mt-3 text-xs text-slate-500">
                    Shipped to: {order.address.street}, {order.address.city},{" "}
                    {order.address.state} {order.address.zip}, {order.address.country}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Saved address */}
        <section aria-labelledby="address-heading">
          <h2 id="address-heading" className="flex items-center gap-2 text-lg font-bold text-white">
            <MapPin className="h-5 w-5 text-brand" aria-hidden="true" />
            Saved Address
          </h2>
          <form onSubmit={saveAddress} className={`mt-4 space-y-4 ${cardClasses}`}>
            <div>
              <label htmlFor="address-street" className={labelClasses}>Street Address</label>
              <input id="address-street" type="text" required value={address.street} onChange={setAddressField("street")} autoComplete="street-address" className={inputClasses} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="address-city" className={labelClasses}>City</label>
                <input id="address-city" type="text" required value={address.city} onChange={setAddressField("city")} className={inputClasses} />
              </div>
              <div>
                <label htmlFor="address-state" className={labelClasses}>State</label>
                <input id="address-state" type="text" required value={address.state} onChange={setAddressField("state")} className={inputClasses} />
              </div>
              <div>
                <label htmlFor="address-zip" className={labelClasses}>ZIP Code</label>
                <input id="address-zip" type="text" required value={address.zip} onChange={setAddressField("zip")} className={inputClasses} />
              </div>
              <div>
                <label htmlFor="address-country" className={labelClasses}>Country</label>
                <input id="address-country" type="text" required value={address.country} onChange={setAddressField("country")} className={inputClasses} />
              </div>
            </div>
            <button type="submit" className={primaryButton}>
              {addressSaved ? "Saved ✓" : "Save Address"}
            </button>
          </form>
        </section>

        {/* Profile settings */}
        <section aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="flex items-center gap-2 text-lg font-bold text-white">
            <UserRound className="h-5 w-5 text-brand" aria-hidden="true" />
            Profile Settings
          </h2>
          <form onSubmit={saveProfile} className={`mt-4 space-y-4 ${cardClasses}`}>
            <div>
              <label htmlFor="profile-name" className={labelClasses}>Full Name</label>
              <input
                id="profile-name"
                type="text"
                required
                value={profile.name}
                onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className={labelClasses}>Phone Number</label>
              <input
                id="profile-phone"
                type="tel"
                value={profile.phone}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Email</label>
              <input type="email" value={user.email} disabled className={`${inputClasses} opacity-60`} />
            </div>
            <button type="submit" className={primaryButton}>
              {profileSaved ? "Saved ✓" : "Save Profile"}
            </button>
          </form>
        </section>
      </div>

      {/* Payments, wishlist, rewards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <section aria-labelledby="payments-heading">
          <h2 id="payments-heading" className="flex items-center gap-2 text-lg font-bold text-white">
            <CreditCard className="h-5 w-5 text-brand" aria-hidden="true" />
            Payment Methods
          </h2>
          <div className={`mt-4 p-5 text-sm leading-relaxed text-slate-400 ${cardClasses}`}>
            Payments are handled securely by Stripe at checkout — your card
            details are encrypted end-to-end and never stored on Spotket.
          </div>
        </section>
        <section aria-labelledby="wishlist-heading">
          <h2 id="wishlist-heading" className="flex items-center gap-2 text-lg font-bold text-white">
            <Heart className="h-5 w-5 text-brand" aria-hidden="true" />
            Wishlist
          </h2>
          <div className={`mt-4 p-5 text-sm leading-relaxed text-slate-400 ${cardClasses}`}>
            Coming soon — save products you love and get notified when they go
            on sale or come back in stock.
          </div>
        </section>
        <section aria-labelledby="rewards-heading">
          <h2 id="rewards-heading" className="flex items-center gap-2 text-lg font-bold text-white">
            <Gift className="h-5 w-5 text-brand" aria-hidden="true" />
            Spotket Rewards
          </h2>
          <div className={`mt-4 p-5 text-sm leading-relaxed text-slate-400 ${cardClasses}`}>
            Loyalty points are on the way — earn points on every order and
            redeem them for discounts. Watch this space.
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AccountView() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <AuthForms />;
}
