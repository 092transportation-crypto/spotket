import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing your use of ${SITE_NAME}'s website and services.`,
};

export default function TermsOfServicePage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Last updated: October 20, 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-neutral-400">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
            the {SITE_NAME} website and services. By using our website or
            signing up for a plan, you agree to these Terms.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Description of Services
            </h2>
            <p className="mt-3">
              {SITE_NAME} provides AI automation services (including chatbots,
              booking automation, review requests, and related tools) and web
              design services for small businesses, as described on our{" "}
              <Link
                href="/pricing"
                className="text-brand-light transition-colors hover:text-white"
              >
                pricing page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Payments &amp; Billing
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Plans are billed monthly in advance unless otherwise agreed in writing.</li>
              <li>There are no long-term contracts — you may cancel at any time, effective at the end of your current billing period.</li>
              <li>Pricing for each plan is listed on our pricing page and may be updated from time to time; changes will not apply retroactively to a period already billed.</li>
              <li>See our Refund Policy for details on refunds and cancellations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Acceptable Use
            </h2>
            <p className="mt-3">
              You agree not to use our services for any unlawful purpose, to
              misrepresent your business, or to interfere with the proper
              functioning of our systems. We reserve the right to suspend
              service for any account that violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Intellectual Property
            </h2>
            <p className="mt-3">
              Upon full payment, you own the content and branding specific to
              your business that we create for you (such as your website
              copy and design). {SITE_NAME} retains ownership of its
              underlying tools, templates, software, and automation systems
              used to deliver our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Disclaimer of Warranties
            </h2>
            <p className="mt-3">
              Our services are provided &ldquo;as is&rdquo; without
              warranties of any kind, express or implied. While we work to
              keep your automation running reliably, we do not guarantee
              uninterrupted or error-free service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Limitation of Liability
            </h2>
            <p className="mt-3">
              To the fullest extent permitted by law, {SITE_NAME} will not be
              liable for any indirect, incidental, or consequential damages
              arising from your use of our services. Our total liability for
              any claim will not exceed the amount you paid us in the three
              months prior to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Termination</h2>
            <p className="mt-3">
              You may cancel your plan at any time. We may suspend or
              terminate service for non-payment or violation of these Terms,
              with notice where reasonably possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Changes to These Terms
            </h2>
            <p className="mt-3">
              We may update these Terms from time to time. Continued use of
              our services after changes are posted means you accept the
              updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Contact Us</h2>
            <p className="mt-3">
              Questions about these Terms? Contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-brand-light transition-colors hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
