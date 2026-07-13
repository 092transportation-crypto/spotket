"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart, type CartItem } from "@/context/CartContext";
import type { CustomerInfo } from "@/lib/checkout";
import { formatPrice } from "@/lib/products";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

type Totals = { subtotal: number; shipping: number; tax: number; total: number };

const inputClasses =
  "min-h-12 w-full rounded-xl border border-navy-600 bg-navy-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40";

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  className,
}: {
  label: string;
  name: keyof CustomerInfo;
  value: string;
  onChange: (name: keyof CustomerInfo, value: string) => void;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={`checkout-${name}`} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        id={`checkout-${name}`}
        name={name}
        type={type}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(name, event.target.value)}
        className={inputClasses}
      />
    </div>
  );
}

function OrderSummary({ items, totals }: { items: CartItem[]; totals: Totals | null }) {
  return (
    <aside className="h-fit rounded-2xl border border-navy-700/60 bg-navy-800/60 p-6">
      <h2 className="text-lg font-bold text-white">Order Summary</h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-navy-900">
              {item.image && (
                <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
              )}
            </span>
            <span className="flex-1 text-sm">
              <span className="line-clamp-2 font-medium text-white">{item.name}</span>
              <span className="text-slate-400">
                {item.variant && `Style: ${item.variant} · `}Qty {item.quantity}
              </span>
            </span>
            <span className="text-sm font-semibold text-white">
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      {totals && (
        <dl className="mt-5 space-y-2 border-t border-navy-700/60 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">Subtotal</dt>
            <dd className="font-medium text-white">{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Shipping</dt>
            <dd className={`font-medium ${totals.shipping === 0 ? "text-brand" : "text-white"}`}>
              {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Estimated tax</dt>
            <dd className="font-medium text-white">{formatPrice(totals.tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-navy-700/60 pt-2 text-base">
            <dt className="font-semibold text-white">Total</dt>
            <dd className="font-bold text-white">{formatPrice(totals.total)}</dd>
          </div>
        </dl>
      )}
    </aside>
  );
}

function PaymentForm({
  items,
  totals,
  onSuccess,
}: {
  items: CartItem[];
  totals: Totals;
  onSuccess: (orderId: string, customer: CustomerInfo) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    street: user?.address?.street ?? "",
    city: user?.address?.city ?? "",
    state: user?.address?.state ?? "",
    zip: user?.address?.zip ?? "",
    country: user?.address?.country ?? "United States",
  });

  const setField = (name: keyof CustomerInfo, value: string) =>
    setCustomer((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: payError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          },
        },
      },
    });

    if (payError || paymentIntent?.status !== "succeeded") {
      console.error("Stripe confirmPayment error:", payError);
      const declineCode =
        payError && "decline_code" in payError ? payError.decline_code : undefined;
      const detail = [payError?.code, declineCode].filter(Boolean).join(" / ");
      setError(
        `${payError?.message ?? "Payment could not be completed. Please try again."}${
          detail ? ` (${detail})` : ""
        }`,
      );
      setSubmitting(false);
      return;
    }

    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId: paymentIntent.id,
        customer,
        items: items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
          variant: item.variant,
        })),
      }),
    });
    let cjOrderId: string | null = null;
    if (!response.ok) {
      // Payment went through — never leave the customer thinking it failed.
      console.error("Order notification failed", await response.text());
    } else {
      try {
        cjOrderId = (await response.json()).cjOrderId ?? null;
      } catch {
        cjOrderId = null;
      }
    }
    if (cjOrderId) window.sessionStorage.setItem("spotket-last-cj-order", cjOrderId);
    onSuccess(paymentIntent.id, customer);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <h2 className="text-lg font-bold text-white">Contact information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" value={customer.name} onChange={setField} autoComplete="name" className="sm:col-span-2" />
            <Field label="Email" name="email" type="email" value={customer.email} onChange={setField} autoComplete="email" />
            <Field label="Phone Number" name="phone" type="tel" value={customer.phone} onChange={setField} autoComplete="tel" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white">Shipping address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Street Address" name="street" value={customer.street} onChange={setField} autoComplete="street-address" className="sm:col-span-2" />
            <Field label="City" name="city" value={customer.city} onChange={setField} autoComplete="address-level2" />
            <Field label="State / Province" name="state" value={customer.state} onChange={setField} autoComplete="address-level1" />
            <Field label="ZIP / Postal Code" name="zip" value={customer.zip} onChange={setField} autoComplete="postal-code" />
            <Field label="Country" name="country" value={customer.country} onChange={setField} autoComplete="country-name" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white">Payment</h2>
          <div className="mt-4 rounded-2xl border border-navy-700/60 bg-navy-800/60 p-4">
            <PaymentElement />
          </div>
        </section>

        {error && (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!stripe || submitting}
          className="min-h-12 w-full rounded-xl bg-brand px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:scale-95 disabled:cursor-not-allowed disabled:bg-navy-600 sm:w-auto sm:text-sm"
        >
          {submitting ? "Processing payment…" : `Pay ${formatPrice(totals.total)}`}
        </button>
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Payments are processed securely by Stripe.
        </p>
      </div>

      <OrderSummary items={items} totals={totals} />
    </form>
  );
}

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const { user, addOrder, updateProfile } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  // The cart empties after success; keep a copy so the confirmation can show it.
  const [placedItems, setPlacedItems] = useState<CartItem[]>([]);

  const orderLines = useMemo(
    () =>
      items.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
        variant: item.variant,
      })),
    [items],
  );

  useEffect(() => {
    if (orderLines.length === 0 || orderId) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: orderLines }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Checkout failed");
        if (cancelled) return;
        setClientSecret(data.clientSecret);
        setTotals({
          subtotal: data.subtotal,
          shipping: data.shipping,
          tax: data.tax,
          total: data.total,
        });
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Checkout failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // Refresh the payment intent whenever the order contents change.
  }, [JSON.stringify(orderLines), orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSuccess = (paymentId: string, customer: CustomerInfo) => {
    setPlacedItems(items);
    setOrderId(paymentId);
    if (user && totals) {
      const address = {
        street: customer.street,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        country: customer.country,
      };
      void addOrder({
        items: items.map((item) => ({
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
        })),
        total: totals.total,
        address,
      });
      // Remember the customer's details for next time.
      void updateProfile({ phone: customer.phone, address });
    }
    clearCart();
  };

  if (orderId) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-navy-700/60 bg-navy-800/60 p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-bold text-white">Order placed!</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Thank you for your purchase. Your payment went through and we&apos;ve
          started preparing your order.
        </p>
        <p className="mt-3 break-all text-xs text-slate-500">Order reference: {orderId}</p>
        <ul className="mt-5 space-y-1 border-t border-navy-700/60 pt-4 text-left text-sm text-slate-300">
          {placedItems.map((item) => (
            <li key={item.id}>
              {item.name}
              {item.variant && ` (${item.variant})`} × {item.quantity}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {user && (
            <Link
              href="/account"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-brand px-6 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
            >
              View order history
            </Link>
          )}
          <Link
            href="/products"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-all hover:bg-brand-dark"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-navy-600 bg-navy-900/40 p-10 text-center">
        <p className="font-semibold text-white">Your cart is empty</p>
        <p className="mt-1 text-sm text-slate-400">
          Add something to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-all hover:bg-brand-dark"
        >
          Browse products
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
        {loadError}
      </p>
    );
  }

  if (!clientSecret || !totals) {
    return <p className="text-sm text-slate-400">Loading secure checkout…</p>;
  }

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: { colorPrimary: "#0066ff", borderRadius: "12px" },
        },
      }}
    >
      <PaymentForm items={items} totals={totals} onSuccess={handleSuccess} />
    </Elements>
  );
}
