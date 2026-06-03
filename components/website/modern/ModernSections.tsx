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
import { ModernHeroSearch } from "./ModernHeroSearch";
import { FeaturedListings } from "../shared/FeaturedListings";

const HERO_BG = "/templates/modern-template/modern-template-hero.webp";
const ABOUT_SPOTLIGHT_BG = "/templates/modern-template/burj-khalifa-image.webp";

const Hero = ({ general }: TemplateSectionProps) => {
  const watermark = (general.siteName || "CRM Dubai").replace(/\s+/g, " ").toUpperCase();

  const headline = (
    <>
      <span className="block">Everything you need to grow</span>
      <span className="block">your business</span>
    </>
  );

  return (
    <section className="relative isolate z-0 min-h-[min(88vh,840px)] w-full">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
      </div>
      <p
        className="pointer-events-none absolute left-4 top-16 max-w-[90vw] select-none break-words text-[clamp(2.25rem,9vw,6.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-white/[0.08] sm:left-8 sm:top-24 md:left-12 md:top-28 lg:left-16 lg:top-32"
        aria-hidden
      >
        {watermark}
      </p>
      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-col items-center gap-10 px-6 pb-20 pt-44 text-center sm:px-10 md:gap-12 md:px-12 md:pb-28 md:pt-52 lg:px-16 lg:pt-56 xl:px-24">
        <h1 className="max-w-4xl text-balance text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl xl:max-w-5xl xl:text-6xl xl:leading-[1.1]">
          {headline}
        </h1>
        <div className="w-full overflow-visible pb-6">
          <ModernHeroSearch general={general} />
        </div>
      </div>
    </section>
  );
};

const Features = ({ listings }: TemplateSectionProps) => (
  <FeaturedListings listings={listings} className="bg-[#e9ecef]" general={{} as any} />
);

const ABOUT_FEATURES = [
  {
    title: "Ultimate flexibility",
    body: "You're in control, with free cancellation and payment options to satisfy any plan or budget.",
    icon: "/templates/modern-template/ultimate-flexibility-icon.webp",
  },
  {
    title: "Memorable experiences",
    body: "Browse and book tours and activities so incredible, you'll want to tell your friends.",
    icon: "/templates/modern-template/memorable-experiences-icon.webp",
  },
  {
    title: "Quality at our core",
    body: "High-quality standards. Millions of reviews. A tour company you can trust.",
    icon: "/templates/modern-template/quality-at-our-core-image.webp",
  },
  {
    title: "Award-winning support",
    body: "New price? New plan? No problem. We're here to help, 24/7.",
    icon: "/templates/modern-template/award-winning-support-icon.webp",
  },
] as const;

const About = () => (
  <section className="bg-[#f4f4f4] py-14 md:py-16">
    <div className="mx-auto w-full max-w-[1140px] px-6 md:px-8">
      <h2 className="text-[36px] font-bold tracking-tight text-[#0f172a]">Why choose us?</h2>
      <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-14">
        {ABOUT_FEATURES.map((item) => (
          <article key={item.title} className="max-w-[260px]">
            <img src={item.icon} alt="" className="h-[69px] w-[69px] object-contain" />
            <h3 className="mt-5 text-[20px] font-semibold tracking-tight text-[#0f172a]">{item.title}</h3>
            <p className="mt-3 text-[15px] leading-8 text-neutral-600">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const AboutSpotlight = ({ general }: TemplateSectionProps) => (
  <section className="bg-[#f4f4f4] px-6 py-14 md:px-10 md:py-20 lg:px-16">
    <div className="mx-auto w-full max-w-[1220px]">
      <div className="relative">
        <div className="w-full max-w-[1080px] overflow-hidden">
          <img
            src={ABOUT_SPOTLIGHT_BG}
            alt="Burj Khalifa in Dubai"
            className="h-[420px] w-full object-cover md:h-[520px] lg:h-[600px]"
          />
        </div>

        <article className="relative z-10 mt-[-72px] ml-auto w-full max-w-[420px] rounded-sm bg-[#2F66E8] p-8 text-white shadow-[0_18px_30px_rgba(15,23,42,0.25)] md:-mt-[300px] md:mr-2 md:p-10">
          <h2 className="text-4xl font-extrabold tracking-tight">About us</h2>
          <p className="mt-5 text-base leading-7 text-white/95">
            {general.about?.trim()
              ? general.about
              : "For more than 30 years we have been delivering world-class construction and we have built many lasting relationships along the way."}
          </p>
          {/* <p className="mt-5 text-base leading-7 text-white/95">
            We have matured into an industry leader and trusted resource for those
            seeking quality, innovation and reliability.
          </p> */}
          <button
            type="button"
            className="mt-8 inline-flex rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#2F66E8] transition hover:bg-white/90"
          >
            More on Our History
          </button>
        </article>
      </div>
    </div>
  </section>
);

// Next section after hero
const Listings = ({ general }: TemplateSectionProps) => <AboutSpotlight general={general} />;

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

const Testimonials = () => {
  const [activeReview, setActiveReview] = useState(0);
  const current = REVIEWS[activeReview];

  return (
    <section className="bg-[#F7F7F7] px-6 py-16 md:py-20">
      <div className="mx-auto w-full max-w-[980px] text-center">
        <h2 className="text-[32px] font-bold tracking-tight text-[#111827]">Customer Reviews</h2>
        <p className="mt-7 text-[56px] font-bold leading-none text-[#EB662B]">&ldquo;</p>
        <blockquote className="mx-auto mt-5 max-w-[820px] text-[19px] leading-[1.75] text-[#1f2937]">
          {current.text}
        </blockquote>
        <p className="mt-7 text-[16px] font-semibold text-[#111827]">{current.name}</p>
        <p className="mt-1 text-[13px] text-neutral-500">{current.role}</p>

        <div className="mt-10 flex items-center justify-center gap-4">
          {REVIEWS.map((review, idx) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setActiveReview(idx)}
              aria-label={`Show review by ${review.name}`}
              className={`rounded-full p-[3px] transition ${idx === activeReview
                ? "ring-2 ring-[#EB662B] ring-offset-2 ring-offset-[#F7F7F7]"
                : "ring-1 ring-transparent hover:ring-[#EB662B]/50"
                }`}
            >
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

const Cta = ({ general }: TemplateSectionProps) => {
  return (
    <section className="bg-[#1F8BEF] px-6 py-8 md:py-9">
      <div className="mx-auto flex w-full max-w-[980px] flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-7 sm:text-left">
        <h2 className="text-[40px] font-bold tracking-tight text-white">
          Ready to get started?
        </h2>
        <button
          type="button"
          className="inline-flex h-[52px] items-center justify-center rounded-lg bg-white px-8 text-[20px] font-semibold text-[#111827] transition hover:bg-neutral-100"
        >
          Get A Free Quote
        </button>
      </div>
    </section>
  );
};

const Contact = ({ general }: TemplateSectionProps) => (
  <footer className="bg-[#221d1b] px-6 py-12 text-white md:py-14">
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
          <h3 className="text-[28px] font-semibold tracking-tight">Rens Properties</h3>
          <p className="mt-2 max-w-[420px] text-[13px] leading-7 text-white/70">
            Discover Dubai&apos;s fastest-growing real estate platform: Your gateway
            to luxury homes, short-term rentals, modern apartments, and prime plots
            for sale or lease. Experience a seamless journey and feel right at home
            in the vibrant city of Dubai.
          </p>
        </div>

        <div>
          <h3 className="text-[18px] font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-[13px] text-white/80">
            <li>About Us</li>
            <li>Blog</li>
            <li>Terms And Conditions</li>
            <li>Privacy Policy</li>
            <li>Rens Properties Dubai</li>
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
          <MapPin className="h-3.5 w-3.5 text-[#EB662B]" />
          {general.address || "The Binary by Omniyat, Marasi Drive, Business Bay, Dubai, United Arab Emirates"}
        </span>
        <span className="inline-flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-[#EB662B]" />
          {general.contactEmail}
        </span>
        <span className="inline-flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-[#EB662B]" />
          {general.contactPhone}
        </span>
        <span className="inline-flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-[#EB662B]" />
          +971 (0) 50 566 7362
        </span>

        <div className="ml-auto flex items-center gap-4 text-white/90">
          <Facebook className="h-4 w-4" />
          <Twitter className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          <Music2 className="h-4 w-4" />
        </div>
      </div>
    </div>
  </footer>
);

export const MODERN_SECTIONS: Record<
  WebsiteSectionId,
  React.ComponentType<TemplateSectionProps>
> = {
  hero: Hero,
  listings: About,
  about: Listings,
  features: Features,
  testimonials: Testimonials,
  cta: Cta,
  contact: Contact,
};
