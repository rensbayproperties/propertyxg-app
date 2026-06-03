"use client";

import React from "react";
import {
  type WebsiteGeneral,
  type WebsiteTemplateId,
  type WebsiteTemplateSection,
  type WebsiteSectionId,
} from "@/hooks/useWebsiteSettings";
import type { PublishedListing } from "./shared/template-section-props";
import { getSectionRegistry } from "./template-registry";
import { ClassicSiteHeader } from "./classic/ClassicSiteHeader";
import { ModernSiteHeader } from "./modern/ModernSiteHeader";

export interface TemplateMeta {
  id: WebsiteTemplateId;
  name: string;
  description: string;
  accent: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean grid layout with bold headings — agency-style.",
    accent: "#0166FF",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Centered serif type, plenty of white space.",
    accent: "#1f2937",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Stripped back. Just text, photos, and a CTA.",
    accent: "#111827",
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "Dark, gold accents — for premium properties.",
    accent: "#c79850",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Big colorful blocks, oversized type.",
    accent: "#dc2626",
  },
];

export const SECTION_LABELS: Record<WebsiteSectionId, string> = {
  hero: "Hero",
  features: "Featured Listings",
  about: "About",
  listings: "Why Choose Us",
  testimonials: "Testimonials",
  cta: "Call to action",
  contact: "Contact",
};

interface WebsiteTemplateProps {
  template: WebsiteTemplateId;
  sections: WebsiteTemplateSection[];
  general: WebsiteGeneral;
  onlySection?: WebsiteSectionId;
  listings?: PublishedListing[];
  children?: React.ReactNode;
}

export const WebsiteTemplate: React.FC<WebsiteTemplateProps> = ({
  template,
  sections,
  general,
  onlySection,
  listings,
  children,
}) => {
  const list = onlySection
    ? sections.filter((s) => s.id === onlySection)
    : [...sections]
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order);

  const fontClass =
    template === "classic" || template === "luxe"
      ? "font-serif"
      : "font-sans";

  const sectionRegistry = getSectionRegistry(template);

  return (
    <div className={`bg-white text-black ${fontClass}`}>
      {template === "modern" ? (
        <ModernSiteHeader general={general} />
      ) : template === "classic" ||
        template === "minimal" ||
        template === "luxe" ||
        template === "bold" ? (
        <ClassicSiteHeader general={general} />
      ) : (
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2 font-bold">
            {general.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={general.logoUrl}
                alt={general.siteName}
                className="h-7 w-auto"
              />
            ) : (
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                style={{ backgroundColor: general.primaryColor || "#0166FF" }}
              >
                {(general.siteName || "?").slice(0, 1).toUpperCase()}
              </span>
            )}
            {general.siteName}
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <span>Home</span>
            <span>About</span>
            <span>Properties</span>
            <span>Contact</span>
          </nav>
        </header>
      )}

      {children
        ? children
        : list.map((s) => {
          const Comp = sectionRegistry[s.id];
          return <Comp key={s.id} general={general} listings={listings} />;
        })}

    </div>
  );
};
