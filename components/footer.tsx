import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, NAV_LINKS, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-6 sm:pb-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Image
              src="/spotket-logo.png"
              alt="Spotket Digital"
              width={1057}
              height={790}
              loading="lazy"
              className="h-16 w-auto"
            />
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              AI automation for inboxes, meetings, invoicing, content, and
              leads — plus custom websites that help small businesses grow.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Menu
              </p>
              <ul className="mt-3 space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Contact
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-neutral-400 transition-colors hover:text-white"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
