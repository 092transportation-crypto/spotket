import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE_NAME}'s privacy policy — what information we collect, how we use it, and your rights.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Last updated: October 20, 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-neutral-400">
          <p>
            {SITE_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            provides AI automation and web design services for small
            businesses. This Privacy Policy explains what information we
            collect, how we use it, and the choices you have.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Information We Collect
            </h2>
            <p className="mt-3">We collect information you provide directly to us, such as:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Name, email address, phone number, and business details submitted through our contact or audit request forms</li>
              <li>Messages you send through our website chat widget</li>
              <li>Payment and billing information when you sign up for a plan</li>
            </ul>
            <p className="mt-3">
              We also automatically collect some technical information when
              you visit our website, including your IP address, browser type,
              device information, and pages visited, typically through
              standard analytics and hosting tools.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              How We Use Your Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To respond to inquiries and provide the services you request</li>
              <li>To set up and operate your AI chatbot, booking automation, and related tools</li>
              <li>To send you service updates, invoices, and performance summaries</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              How We Share Information
            </h2>
            <p className="mt-3">
              We do not sell your personal information. We may share
              information with trusted third-party service providers who help
              us operate our business, such as hosting providers, payment
              processors, email and SMS delivery services, and analytics
              tools. These providers are only given the information needed to
              perform their services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Cookies &amp; Tracking
            </h2>
            <p className="mt-3">
              Our website may use cookies and similar technologies to keep the
              site working properly and to understand how visitors use it.
              You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Data Retention
            </h2>
            <p className="mt-3">
              We retain information for as long as needed to provide our
              services and for legitimate business or legal purposes. You can
              request deletion of your information at any time by contacting
              us below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Your Rights</h2>
            <p className="mt-3">
              Depending on where you live, you may have the right to access,
              correct, or delete the personal information we hold about you.
              To exercise any of these rights, contact us using the
              information below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Children&apos;s Privacy
            </h2>
            <p className="mt-3">
              Our services are intended for businesses and are not directed
              at children. We do not knowingly collect personal information
              from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">
              Changes to This Policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Contact Us</h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy, contact us at{" "}
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
