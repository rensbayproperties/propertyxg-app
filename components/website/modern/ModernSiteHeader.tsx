"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";
import { ModernNavLogo } from "./ModernNavLogo";

const NAV_LINKS = [
  { label: "Find My Agent", href: "#" },
  { label: "Dubai Area Guide", href: "#" },
  { label: "Mortgage Services", href: "#" },
  { label: "Blogs", href: "#" },
] as const;

export function ModernSiteHeader({ general }: { general: WebsiteGeneral }) {
  const accent = general.primaryColor || "#0166FF";

  return (
    <header className="sticky top-0 z-20 overflow-visible border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1920px] items-center justify-between gap-6 overflow-visible px-6 sm:px-10 md:px-12 lg:px-16 xl:px-24">
        <Link
          href="#"
          className="flex shrink-0 items-center gap-2 overflow-visible no-underline"
        >
          {general.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={general.logoUrl}
              alt={general.siteName || "Logo"}
              className="h-10 w-auto max-h-10 max-w-[min(360px,42vw)] object-contain object-left"
            />
          ) : (
            <ModernNavLogo
              brandColor={accent}
              title={general.siteName?.trim() || "CRM Dubai"}
            />
          )}
        </Link>

        <nav
          className="hidden items-center gap-10 text-[15px] font-medium text-neutral-900 md:flex xl:gap-14"
          aria-label="Primary"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-neutral-900 no-underline transition hover:text-neutral-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-800 shadow-sm transition hover:bg-neutral-50"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
          <Link
            href="#"
            className="hidden rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 no-underline shadow-sm transition hover:bg-neutral-50 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="#"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
