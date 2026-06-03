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
import {
  DEFAULT_GENERAL,
  type WebsiteSectionId,
} from "@/hooks/useWebsiteSettings";
import type { TemplateSectionProps } from "../shared/template-section-props";
import { FeaturedListings } from "../shared/FeaturedListings";

const BOLD_HERO_IMAGE = "/templates/bold-template/bold-hero.webp";
const BOLD_HERO_HEADLINE = "Everything you need to grow in business";
const BOLD_RED = "#FF0000";
const BOLD_ABOUT_CARD_BG = "#FFF1F1";
const BOLD_ABOUT_BODY = "#7F1D1D";



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

const BOLD_DESIGN_ABOUT_PARAGRAPHS = [
  "For more than 30 years we have been delivering world-class construction and we've built many lasting relationships along the way.",
  "We've matured into an industry leader and trusted resource for those seeking quality, innovation and reliability when building in the U.S.",
] as const;

function splitAboutParagraphs(raw: string): string[] {
  const t = raw.trim();
  if (!t) return [...BOLD_DESIGN_ABOUT_PARAGRAPHS];
  const parts = t
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [t];
}

function boldHeroAboutParagraphs(about: string | null | undefined): string[] {
  const a = about?.trim() ?? "";
  if (!a || a === DEFAULT_GENERAL.about) return [...BOLD_DESIGN_ABOUT_PARAGRAPHS];
  return splitAboutParagraphs(a);
}

const Hero = ({ general }: TemplateSectionProps) => {
  const paragraphs = boldHeroAboutParagraphs(general.about);

  return (
    <section className="bg-white px-5 py-14 font-sans sm:px-8 md:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,44%)] lg:items-start lg:gap-x-14 lg:gap-y-0">
        <div className="flex min-w-0 flex-col">
          <h1
            className="max-w-xl text-[2rem] font-extrabold leading-[1.12] tracking-tight sm:text-[2.35rem] md:text-[2.75rem] lg:text-[3rem]"
            style={{ color: BOLD_RED }}
          >
            {BOLD_HERO_HEADLINE}
          </h1>

          <button
            type="button"
            className="mt-16 inline-flex w-fit rounded-lg px-8 py-3.5 text-base font-bold text-white shadow-sm transition hover:opacity-95 sm:mt-20 md:mt-[5.5rem]"
            style={{ backgroundColor: BOLD_RED }}
          >
            Get Started
          </button>

          <div
            className="mt-16 rounded-2xl px-6 py-7 sm:mt-20 sm:px-8 sm:py-8 md:mt-24 md:rounded-3xl lg:mt-28"
            style={{ backgroundColor: BOLD_ABOUT_CARD_BG }}
          >
            <h2
              className="text-2xl font-extrabold tracking-tight md:text-[28px]"
              style={{ color: BOLD_RED }}
            >
              About us
            </h2>
            <div
              className="mt-4 space-y-4 text-[15px] leading-relaxed sm:text-base sm:leading-[1.65]"
              style={{ color: BOLD_ABOUT_BODY }}
            >
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex justify-center self-center lg:justify-end">
          <div className="aspect-square w-[min(100%,420px)] shrink-0 overflow-hidden rounded-full shadow-[0_24px_60px_-12px_rgba(255,0,0,0.22)] sm:w-[min(100%,480px)] lg:w-full lg:max-w-[min(520px,100%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BOLD_HERO_IMAGE}
              alt="City skyline at dusk"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedTrips = ({ listings }: TemplateSectionProps) => (
  <FeaturedListings listings={listings} className="bg-[#e9ecef]" general={{} as any} />
);

const BOLD_WHY_CHOOSE_ITEMS = [
  {
    title: "Ultimate flexibility",
    body: "You're in control, with free cancellation and payment options to satisfy any plan or budget.",
    iconSrc: "/templates/bold-template/ultimate-flexibility-bold.webp",
    iconAlt: "Ultimate flexibility",
  },
  {
    title: "Memorable experiences",
    body: "Browse and book tours and activities so incredible, you'll want to tell your friends.",
    iconSrc: "/templates/bold-template/memorable-experiences-bold.webp",
    iconAlt: "Memorable experiences",
  },
  {
    title: "Quality at our core",
    body: "High-quality standards. Millions of reviews. A tourz company.",
    iconSrc: "/templates/bold-template/quality-at-our-core-bold.webp",
    iconAlt: "Quality at our core",
  },
  {
    title: "Award-winning support",
    body: "New price? New plan? No problem. We're here to help, 24/7.",
    iconSrc: "/templates/bold-template/award-winning-support-bold.webp",
    iconAlt: "Award-winning support",
  },
] as const;

const Features = (_props: TemplateSectionProps) => (
  <section className="bg-white px-5 py-14 font-sans sm:px-8 md:py-16 lg:px-12">
    <div className="mx-auto max-w-[1180px]">
      <h2 className="mb-10 text-left text-[28px] font-extrabold tracking-tight text-[#0f172a] md:mb-12 md:text-[32px] lg:text-[34px]">
        Why choose us?
      </h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
        {BOLD_WHY_CHOOSE_ITEMS.map((item) => (
          <div key={item.title} className="flex min-w-0 flex-col text-left">
            <div className="mb-5 flex h-[52px] items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.iconSrc}
                alt={item.iconAlt}
                className="max-h-[52px] w-auto max-w-full object-contain object-left"
              />
            </div>
            <h3 className="text-[17px] font-bold leading-snug text-[#0f172a] md:text-lg">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 md:text-[15px] md:leading-[1.65]">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Listings = (_props: TemplateSectionProps) => null;

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
  <section className="px-6 py-8 font-sans md:py-9" style={{ backgroundColor: BOLD_RED }}>
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

export const BOLD_SECTIONS: Record<
  WebsiteSectionId,
  React.ComponentType<TemplateSectionProps>
> = {
  hero: Hero,
  features: Features,
  about: FeaturedTrips,
  listings: Listings,
  testimonials: Testimonials,
  cta: Cta,
  contact: Contact,
};
