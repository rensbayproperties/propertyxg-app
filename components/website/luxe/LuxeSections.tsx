"use client";

import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Music2,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import type { WebsiteSectionId } from "@/hooks/useWebsiteSettings";
import type { TemplateSectionProps } from "../shared/template-section-props";
import { HeroSearchFilters } from "../shared/HeroSearchFilters";
import { FeaturedListings } from "../shared/FeaturedListings";

const LUXE_HERO_CTA_BLUE = "#2196F3";
const LUXE_CTA_BG = "#1F8BEF";
const LUXE_ABOUT_PANEL = "#2563EB";

const LUXE_ABOUT_IMAGE = "/templates/luxe-template/burj-khalifa-luxe.webp";

const LUXE_FEATURES_HEADING = "#1B3366";

const LUXE_WHY_CHOOSE_ITEMS = [
  {
    title: "Ultimate flexibility",
    body: "You're in control, with free cancellation and payment options to satisfy any plan or budget.",
    iconSrc: "/templates/luxe-template/ultimate-flexibility-luxe.webp",
    iconAlt: "Ultimate flexibility",
  },
  {
    title: "Memorable experiences",
    body: "Browse and book tours and activities so incredible, you'll want to tell your friends.",
    iconSrc: "/templates/luxe-template/memorable-experiences-luxe.webp",
    iconAlt: "Memorable experiences",
  },
  {
    title: "Quality at our core",
    body: "High-quality standards. Millions of reviews. A tourz company.",
    iconSrc: "/templates/luxe-template/quality-at-our-core-luxe.webp",
    iconAlt: "Quality at our core",
  },
  {
    title: "Award-winning support",
    body: "New price? New plan? No problem. We're here to help, 24/7.",
    iconSrc: "/templates/luxe-template/award-winning-support-luxe.webp",
    iconAlt: "Award-winning support",
  },
] as const;


const REVIEWS = [
  {
    name: "Ali Tufan",
    role: "Product Manager, Apple Inc.",
    avatar: "/templates/modern-template/avatar-1.webp",
    text: "The tours in this website are great. I had been really enjoy with my family! The team is very professional and taking care of the customers. Will surely recommend to my friend to join this company!",
  },
  {
    name: "Sarah K.",
    role: "Marketing Lead, Canva",
    avatar: "/templates/modern-template/avatar-2.webp",
    text: "Everything was smooth from booking to checkout. The support team answered quickly and the whole experience felt premium from start to finish.",
  },
  {
    name: "Michael D.",
    role: "Founder, Nova Labs",
    avatar: "/templates/modern-template/avatar-3.webp",
    text: "Clean interface, excellent tour options, and very reliable communication. This is now the first platform we use when planning group trips.",
  },
  {
    name: "Nora A.",
    role: "Operations Manager, Beam",
    avatar: "/templates/modern-template/avatar-4.webp",
    text: "Loved how easy it was to compare choices and finalize quickly. We saved time and got exactly what we were looking for without stress.",
  },
  {
    name: "Tina B.",
    role: "Creative Director, Northlight",
    avatar: "/templates/modern-template/avatar-5.webp",
    text: "Professional team, clear information, and fast responses. Our trip turned out amazing and the whole process felt very well managed.",
  },
] as const;

const Hero = (_props: TemplateSectionProps) => (
  <section className="bg-white px-6 py-24 font-serif text-black md:py-32">
    <div className="mx-auto flex w-full max-w-[920px] flex-col items-center justify-center text-center gap-6">
      <h1 className="text-balance text-[clamp(1.875rem,4.5vw,3rem)] font-normal leading-[1.2] tracking-tight md:text-[clamp(2.25rem,4vw,3.25rem)]">
        <span className="block">Everything you need to grow in</span>
        <span className="block">business</span>
      </h1>
      <div className="w-full">
        <HeroSearchFilters general={_props.general} />
      </div>
    </div>
  </section>
);

const Features = (_props: TemplateSectionProps) => (
  <section className="bg-white px-6 py-16 font-sans text-black md:py-20 lg:px-10">
    <div className="mx-auto w-full max-w-[1200px]">
      <h2
        className="mb-12 text-left text-3xl font-bold tracking-tight md:mb-14 md:text-[34px] md:leading-tight"
        style={{ color: LUXE_FEATURES_HEADING }}
      >
        Why choose us?
      </h2>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
        {LUXE_WHY_CHOOSE_ITEMS.map((it) => (
          <article key={it.title} className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.iconSrc}
              alt={it.iconAlt}
              width={72}
              height={72}
              className="mb-6 h-[72px] w-auto max-w-[88px] object-contain"
            />
            <h3
              className="text-[17px] font-bold leading-snug md:text-lg"
              style={{ color: LUXE_FEATURES_HEADING }}
            >
              {it.title}
            </h3>
            <p className="mt-3 max-w-[280px] text-[15px] leading-[1.65] text-neutral-600">{it.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedTrips = ({ listings }: TemplateSectionProps) => (
  <FeaturedListings listings={listings} className="bg-[#e9ecef]" general={{} as any} />
);

const Listings = ({ general }: TemplateSectionProps) => (
  <section className="overflow-visible bg-white px-5 py-14 font-sans text-black md:px-8 md:py-20">
    <div className="relative mx-auto max-w-[1180px]">
      <div className="relative md:min-h-[min(520px,58vw)]">
        <div className="overflow-hidden rounded-[2rem] shadow-[0_24px_48px_-14px_rgba(15,23,42,0.18)] md:ml-[26%] md:max-w-[58%] md:rounded-[3rem] lg:ml-[28%] lg:max-w-[54%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LUXE_ABOUT_IMAGE}
            alt="Dubai coastline and landmarks"
            className="h-[min(56vw,300px)] w-full object-cover sm:h-[360px] md:h-[460px] lg:h-[510px]"
          />
        </div>

        <article
          className="relative z-10 mx-auto mt-[-70px] w-[min(100%,380px)] rounded-[2rem] p-8 text-white shadow-[0_28px_52px_-16px_rgba(37,99,235,0.45)] sm:mx-8 sm:p-9 md:absolute md:left-8 md:top-[28%] md:mx-0 md:mt-0 md:w-[min(100%,320px)] md:max-w-[32%] md:-translate-y-1/2 md:rounded-[3rem] md:p-9 lg:left-12 lg:w-[min(100%,340px)] lg:max-w-[30%] lg:p-10 xl:left-16"
          style={{ backgroundColor: LUXE_ABOUT_PANEL }}
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-[2rem] lg:text-4xl">About us</h2>
          <p className="mt-5 text-[15px] font-medium leading-7 text-white/95">
            {general.about?.trim()
              ? general.about
              : "For more than 30 years we have been delivering world-class construction and we've built many lasting relationships along the way."}
          </p>
          <p className="mt-4 text-[15px] font-medium leading-7 text-white/95">
            We&apos;ve matured into an industry leader and trusted resource for those seeking quality,
            innovation and reliability when building in the U.S.
          </p>
        </article>
      </div>
    </div>
  </section>
);

const Testimonials = () => {
  const [activeReview, setActiveReview] = useState(0);
  const current = REVIEWS[activeReview];

  return (
    <section className="bg-[#F7F7F7] px-6 py-16 font-sans md:py-20">
      <div className="mx-auto w-full max-w-[980px] text-center">
        <h2 className="text-[32px] font-bold tracking-tight text-[#111827]">Customer Reviews</h2>
        <p className="mt-7 text-[56px] font-bold leading-none text-[#EB662B]">&ldquo;</p>
        <blockquote className="mx-auto mt-5 max-w-[820px] text-[19px] leading-[1.75] text-[#1f2937]">
          {current.text}
        </blockquote>
        <p className="mt-7 text-[16px] font-semibold text-[#111827]">{current.name}</p>
        <p className="mt-1 text-[13px] text-neutral-500">{current.role}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {REVIEWS.map((review, idx) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setActiveReview(idx)}
              aria-label={`Show review by ${review.name}`}
              className={`rounded-full p-[3px] transition ${
                idx === activeReview
                  ? "ring-2 ring-[#EB662B] ring-offset-2 ring-offset-[#F7F7F7]"
                  : "ring-1 ring-transparent hover:ring-[#EB662B]/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.avatar}
                alt={review.name}
                className="h-[54px] w-[54px] rounded-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const Cta = (_props: TemplateSectionProps) => (
  <section className="px-6 py-8 font-sans md:py-9" style={{ backgroundColor: LUXE_CTA_BG }}>
    <div className="mx-auto flex w-full max-w-[980px] flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-7 sm:text-left">
      <h2 className="text-[40px] font-bold tracking-tight text-white">Ready to get started?</h2>
      <button
        type="button"
        className="inline-flex h-[52px] items-center justify-center rounded-lg bg-white px-8 text-[20px] font-semibold text-[#111827] transition hover:bg-neutral-100"
      >
        Get A Free Quote
      </button>
    </div>
  </section>
);

const Contact = ({ general }: TemplateSectionProps) => {
  const brandName = general.siteName?.trim() || "Rens Properties";

  return (
    <footer className="bg-[#221d1b] px-6 py-12 font-sans text-white md:py-14">
      <div className="mx-auto w-full max-w-[1140px]">
        <div className="grid grid-cols-1 gap-10 border-b border-white/12 pb-8 md:grid-cols-3">
          <div>
            <h3 className="text-[18px] font-semibold">Stay in the loop</h3>
            <p className="mt-2 max-w-[290px] text-[13px] leading-6 text-white/70">
              News and insight straight to your inbox. We don&apos;t spam.
            </p>
            <div className="mt-4 flex h-11 max-w-[280px] items-center rounded-md bg-white px-4">
              <input
                type="email"
                placeholder="Enter e-mail address"
                className="w-full border-0 bg-transparent text-[13px] text-[#111827] placeholder:text-neutral-400 focus:outline-none"
              />
              <Send className="ml-3 h-3.5 w-3.5 text-[#1f1b1a]" strokeWidth={2.2} />
            </div>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold">Services</h3>
            <ul className="mt-3 space-y-2 text-[13px] text-white/80">
              <li>Dubai Area Guide</li>
              <li>Mortgage Services</li>
              <li>Commercial Projects</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold">Dubai Properties</h3>
            <ul className="mt-3 space-y-2 text-[13px] text-white/80">
              <li>Dubai properties for sale</li>
              <li>Dubai properties for rent</li>
              <li>Off Plan</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 border-b border-white/12 py-8 md:grid-cols-3">
          <div>
            <h3 className="text-[28px] font-semibold tracking-tight">{brandName}</h3>
            <p className="mt-2 max-w-[420px] text-[13px] leading-7 text-white/70">
              Discover Dubai&apos;s fastest-growing real estate platform: Your gateway to luxury homes,
              short-term rentals, modern apartments, and prime plots for sale or lease. Experience a
              seamless journey and feel right at home in the vibrant city of Dubai.
            </p>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-[13px] text-white/80">
              <li>About Us</li>
              <li>Blog</li>
              <li>Terms And Conditions</li>
              <li>Privacy Policy</li>
              <li>{brandName} Dubai</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold">Discover</h3>
            <ul className="mt-3 space-y-2 text-[13px] text-white/80">
              <li>Site Map</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 text-[12px] text-white/75">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#EB662B]" aria-hidden />
            {general.address ||
              "The Binary by Omniyat, Marasi Drive, Business Bay, Dubai, United Arab Emirates"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-[#EB662B]" aria-hidden />
            {general.contactEmail}
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-[#EB662B]" aria-hidden />
            {general.contactPhone}
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-[#EB662B]" aria-hidden />
            +971 (0) 50 566 7362
          </span>

          <div className="ml-auto flex items-center gap-4 text-white/90">
            <Facebook className="h-4 w-4" aria-hidden />
            <Twitter className="h-4 w-4" aria-hidden />
            <Instagram className="h-4 w-4" aria-hidden />
            <Music2 className="h-4 w-4" aria-hidden />
          </div>
        </div>
      </div>
    </footer>
  );
};

export const LUXE_SECTIONS: Record<
  WebsiteSectionId,
  React.ComponentType<TemplateSectionProps>
> = {
  hero: Hero,
  features: FeaturedTrips,
  about: Listings,
  listings: Features,
  testimonials: Testimonials,
  cta: Cta,
  contact: Contact,
};
