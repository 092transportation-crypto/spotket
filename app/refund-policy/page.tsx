import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "/refund-policy",
  "Refund Policy",
  `${SITE_NAME}'s refund policy — all sales are final, and you can cancel anytime for future months.`,
);

export default function RefundPolicyPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Refund Policy
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Last updated: October 20, 2026
        </p>

        <div className="mt-10 rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/15 via-navy-900 to-accent/15 p-6 text-center">
          <p className="text-lg font-semibold text-white">
            All sales are final. Cancel anytime for future months.
          </p>
        </div>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-neutral-400">
          <section>
            <h2 className="text-lg font-semibold text-white">
              Monthly Plans
            </h2>
            <p className="mt-3">
              All {SITE_NAME} plans are billed monthly in advance. Once a
              billing period has been charged, that charge is final and
              non-refundable — this includes partial months and months where
              a service is used less than expected.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Cancellation</h2>
            <p className="mt-3">
              You can cancel your plan at any time, with no cancellation fees
              and no questions asked. Cancelling stops billing for future
              months — it does not refund the current billing period you have
              already paid for. Your service will remain active through the
              end of the period already billed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              One-Time Services
            </h2>
            <p className="mt-3">
              For one-time services, such as a standalone website build, all
              sales are final once work has begun.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Questions About Billing
            </h2>
            <p className="mt-3">
              If you believe you were charged in error, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-brand-light transition-colors hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              and we&apos;ll take a look. See our{" "}
              <Link
                href="/terms-of-service"
                className="text-brand-light transition-colors hover:text-white"
              >
                Terms of Service
              </Link>{" "}
              for full billing details.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
