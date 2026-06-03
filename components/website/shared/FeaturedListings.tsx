"use client";

import React from "react";
import Link from "next/link";
import type { PublishedListing, TemplateSectionProps } from "./template-section-props";

/* ── Placeholder image (until the API returns images) ──────────── */
const PLACEHOLDER_IMG = "/templates/modern-template/shed-house.webp";

/* ── Fallback data for admin preview (no API data available) ───── */
const PLACEHOLDER_LISTINGS: PublishedListing[] = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i + 1}`,
  title: `Listing ${i + 1}`,
  slug: `listing-${i + 1}`,
  description: null,
  property_bedroom: "4",
  property_bathroom: "2",
  property_size: 1500,
  price: 1_199_000,
  price_unit: null,
  price_type: "FLAT",
  max_price: null,
  dealType: "SALE",
  address: "Ave, San Francisco, CA 94122",
  locationId: null,
  imageUrl: null,
  ref: null,
}));

/* ── Formatting helpers ──────────────────────────────────────────── */

/** Convert location slug to display text: "dubai-investment-park-2" → "Dubai Investment Park 2" */
const formatLocation = (locationId: string | null): string | null => {
  if (!locationId) return null;
  return locationId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const formatPrice = (price: number | null): string => {
  if (price == null) return "Price on request";
  return `$${price.toLocaleString()}`;
};

/* ── Icons ───────────────────────────────────────────────────────── */

const HeartIcon = () => (
  <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M16.365 0C15.3123 0.0158406 14.2825 0.300129 13.3797 0.824156C12.4769 1.34818 11.733 2.09339 11.2231 2.98453C10.7133 2.09339 9.96938 1.34818 9.06657 0.824156C8.16376 0.300129 7.13399 0.0158406 6.08127 0C4.4031 0.070535 2.82199 0.78073 1.68337 1.97543C0.544757 3.17012 -0.058813 4.75221 0.00452586 6.37604C0.00452586 10.4884 4.47888 14.9796 8.2315 18.0248C9.06936 18.7059 10.1287 19.0793 11.2231 19.0793C12.3175 19.0793 13.3769 18.7059 14.2147 18.0248C17.9674 14.9796 22.4417 10.4884 22.4417 6.37604C22.5051 4.75221 21.9015 3.17012 20.7629 1.97543C19.6243 0.78073 18.0431 0.070535 16.365 0ZM13.0134 16.641C12.5123 17.0492 11.8782 17.2731 11.2231 17.2731C10.568 17.2731 9.93393 17.0492 9.43282 16.641C4.62939 12.7421 1.87429 9.00152 1.87429 6.37604C1.81038 5.23171 2.2168 4.10936 3.0049 3.25377C3.79301 2.39818 4.89886 1.87876 6.08127 1.80881C7.26367 1.87876 8.36952 2.39818 9.15763 3.25377C9.94573 4.10936 10.3521 5.23171 10.2882 6.37604C10.2882 6.6159 10.3867 6.84594 10.5621 7.01555C10.7374 7.18516 10.9752 7.28044 11.2231 7.28044C11.4711 7.28044 11.7089 7.18516 11.8842 7.01555C12.0595 6.84594 12.158 6.6159 12.158 6.37604C12.0941 5.23171 12.5005 4.10936 13.2886 3.25377C14.0767 2.39818 15.1826 1.87876 16.365 1.80881C17.5474 1.87876 18.6532 2.39818 19.4413 3.25377C20.2294 4.10936 20.6359 5.23171 20.572 6.37604C20.572 9.00152 17.8169 12.7421 13.0134 16.6374V16.641Z" fill="black"/>
  </svg>
);

const BedIcon = () => (
  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M2.60501 6.13645H14.5824V6.15729H16.1217V14.367H13.0431V11.2675H2.60501V14.367H-0.473633V0H2.60501V6.13645ZM4.23229 4.61796V2.56554H7.82404V4.61796H4.23229Z" fill="#869099"/>
  </svg>
);

const BathIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M13.7786 7.85138H15.7124V8.83401C15.7124 9.73729 15.5346 10.6317 15.1891 11.4662C14.8436 12.3008 14.3373 13.059 13.699 13.6977C13.0606 14.3365 12.3028 14.8431 11.4688 15.1888C10.6348 15.5345 9.74094 15.7124 8.83821 15.7124H6.87416C5.05102 15.7124 3.30255 14.9877 2.0134 13.6977C0.72424 12.4078 0 10.6583 0 8.83401V7.85138H11.8146V3.45396C11.8146 3.2584 11.776 3.06475 11.7012 2.88408C11.6264 2.70342 11.5168 2.53927 11.3785 2.40102C11.2403 2.26277 11.0762 2.15313 10.8956 2.07836C10.715 2.00358 10.5215 1.96515 10.326 1.96525H9.83131C9.38091 1.96525 8.99991 2.26594 8.87882 2.6782C9.18321 2.85284 9.43611 3.10482 9.61192 3.40866C9.78773 3.7125 9.88023 4.05741 9.88004 4.40851H5.89214C5.89208 4.05872 5.98394 3.71507 6.1585 3.41202C6.33307 3.10897 6.5842 2.85718 6.88671 2.6819C6.95584 1.9482 7.29604 1.26669 7.84076 0.770691C8.38548 0.274689 9.09554 -0.00012589 9.83205 4.32625e-08H10.3267C11.2422 4.32625e-08 12.1202 0.363898 12.7676 1.01164C13.4149 1.65938 13.7786 2.53791 13.7786 3.45396V7.85138Z" fill="#869099"/>
  </svg>
);

const SqftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6.20737 11.7519L3.92932 9.47088V11.7519H6.20737ZM15.6731 15.6701H3.92932V15.6731H0.0110477V15.6701H0V11.7519H0.0110477V0L15.6731 15.6701Z" fill="#869099"/>
  </svg>
);

/* ── Component ───────────────────────────────────────────────────── */

export interface FeaturedListingsProps extends TemplateSectionProps {
  /** Extra className for the outer <section> */
  className?: string;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({
  listings,
  className = "bg-[#e9ecef]",
}) => {
  const items = listings?.length ? listings : PLACEHOLDER_LISTINGS;

  return (
    <section className={`${className} py-14 font-sans md:py-16`}>
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-7 md:px-9">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0f172a] md:text-[28px]">
            Featured Listings
          </h2>
          <Link
            href="/site/search"
            className="text-sm font-medium text-neutral-700 transition hover:text-neutral-900 no-underline"
          >
            See all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 8).map((item) => (
            <article key={item.id} className="relative group">
              <Link href={`/site/search/${item.id}`} className="block no-underline text-inherit">
                <div className="relative overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || item.images?.[0]?.url || PLACEHOLDER_IMG}
                    alt={item.title}
                    className="h-[220px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-3">
                  <p className="text-[26.94px] font-bold leading-[100%] tracking-[0%] text-[#0b1220]">
                    {formatPrice(item.price)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#4b5563]">
                    {item.property_bedroom && (
                      <span className="inline-flex items-center gap-1.5">
                        <BedIcon />
                        {item.property_bedroom} bed
                      </span>
                    )}
                    {item.property_bathroom && (
                      <span className="inline-flex items-center gap-1.5">
                        <BathIcon />
                        {item.property_bathroom} bath
                      </span>
                    )}
                    {item.property_size != null && (
                      <span className="inline-flex items-center gap-1.5">
                        <SqftIcon />
                        {item.property_size.toLocaleString()} sqft
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-neutral-600">
                    {item.address || formatLocation(item.locationId) || item.title}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                aria-label="Save listing"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-110 z-10"
              >
                <HeartIcon />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
