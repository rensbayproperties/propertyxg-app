"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Share, Camera, Mail, Phone, BedDouble, Bath, Maximize, MapPin, Check, ChevronRight } from "lucide-react";
import {
  FacebookSVG,
  TwitterSVG,
  WhatsappSVG,
  GmailSVG,
  EmailSVG,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import ExpandableContent from "@/components/ExpandableContent";
import useListingTrend from "@/hooks/useListingTrend";
import { cn, formatMoney } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/constant/data";
import Container from "@/components/Container";
import ListingTrend from "@/components/ListingTrend";
import Link from "next/link";
import type { PublishedListing } from "@/app/(auth)/website/templates/components/shared/template-section-props";
import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";

interface ListingDetailPageWrapProps {
  listing: PublishedListing;
  general: WebsiteGeneral;
  listings: PublishedListing[];
}

export const ListingDetailPageWrap: React.FC<ListingDetailPageWrapProps> = ({
  listing,
  general,
  listings,
}) => {
  const trendOpt = useMemo(() => {
    if (!listing.locationId) return "Dubai";
    return listing.locationId
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [listing.locationId]);

  const {
    TrendData,
    gettingTrendData,
    HistoryData,
    gettingHistoryData,
  } = useListingTrend(trendOpt);

  const [shareOpen, setShareOpen] = useState(false);

  const images = useMemo(() => {
    const urls = listing.images?.map((img: any) => img.url).filter(Boolean) || [];
    if (urls.length === 0 && listing.imageUrl) {
      urls.push(listing.imageUrl);
    }
    if (urls.length === 0) {
      urls.push("/templates/modern-template/shed-house.webp");
    }
    return urls;
  }, [listing.images, listing.imageUrl]);

  const amenitiesList = useMemo(() => {
    if (!listing.amenities) return [];
    return listing.amenities.split("|").map((slug: string) => {
      const name = slug
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { slug, name };
    });
  }, [listing.amenities]);

  const usefulLinksSections = [
    {
      title: "Bedrooms",
      links: ["1", "2", "3", "4"].map((beds) => ({
        label: `${beds} Bedroom Properties in ${trendOpt}`,
        href: `/site/search?bedroom=${beds}${listing.locationId ? `&locationId=${listing.locationId}` : ""}`,
      })),
    },
    {
      title: "Bathrooms",
      links: ["1", "2", "3", "4"].map((baths) => ({
        label: `${baths} Bathroom Properties in ${trendOpt}`,
        href: `/site/search?bathroom=${baths}${listing.locationId ? `&locationId=${listing.locationId}` : ""}`,
      })),
    },
  ];

  const agentName = general.siteName || "Super Agent";
  const contactPhone = general.contactPhone || "+971505667362";
  const contactEmail = general.contactEmail || "info@rensbayproperties.com";

  return (
    <div className="bg-slate-50/50 min-h-screen py-8 text-slate-800 font-sans">
      <Container>
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/site/search" className="hover:text-brand no-underline">
            Properties
          </Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-500 line-clamp-1 max-w-[200px]">{listing.title}</span>
        </div>

        {/* PREMIUM COLLAGE / GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Main big image */}
          <div className="lg:col-span-2 h-[350px] md:h-[480px] relative rounded-3xl overflow-hidden group shadow-sm bg-slate-900">
            <img
              src={images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute bottom-4 right-4 bg-slate-950/70 text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold backdrop-blur-sm">
              <Camera size={14} />
              {images.length} Photos
            </div>
            
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              <span className={cn(
                "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-white shadow-md",
                listing.dealType?.toLowerCase() === "sale" ? "bg-indigo-600" : "bg-emerald-600"
              )}>
                {listing.dealType}
              </span>
              {listing.distress && (
                <span className="bg-rose-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-md">
                  Distress Sale
                </span>
              )}
            </div>
          </div>

          {/* Sub collage side images */}
          <div className="hidden lg:flex flex-col gap-4">
            {images.slice(1, 3).map((img: string, i: number) => (
              <div
                key={i}
                className="relative h-[232px] rounded-3xl overflow-hidden shadow-sm bg-slate-900 group"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
            {images.length < 3 &&
              Array.from({ length: 2 - (images.length - 1) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-slate-100/50 rounded-3xl h-[232px] flex flex-col items-center justify-center text-slate-350 border border-dashed border-slate-200"
                >
                  <i className="bi-image text-3xl mb-2 text-slate-300"></i>
                  <span className="text-xs font-semibold">No Image Available</span>
                </div>
              ))}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* LEFT CONTAINER */}
          <div className="space-y-8">
            {/* CORE OVERVIEW */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                      {formatMoney(Number(listing.price))}
                    </span>
                    {listing.price_unit && (
                      <span className="text-sm font-bold text-slate-400 uppercase">
                        / {listing.price_unit}
                      </span>
                    )}
                  </div>

                  <p className="text-base font-bold text-slate-650 flex items-center gap-1.5">
                    <MapPin size={18} className="text-[#EB662B]" /> {trendOpt}
                  </p>

                  <h1 className="text-slate-555 text-lg font-semibold leading-relaxed tracking-tight">{listing.title}</h1>
                </div>

                {/* SHARE COMPONENT */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl text-xs font-extrabold transition"
                  >
                    <Share size={15} />
                    SHARE PROPERTY
                  </button>

                  {shareOpen && (
                    <div className="absolute right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl w-56 z-20 overflow-hidden py-1">
                      <div className="p-3 hover:bg-slate-50 flex gap-3 cursor-pointer text-xs font-semibold text-slate-600">
                        <FacebookSVG /> Facebook
                      </div>
                      <div className="p-3 hover:bg-slate-50 flex gap-3 cursor-pointer text-xs font-semibold text-slate-600">
                        <TwitterSVG /> Twitter
                      </div>
                      <div className="p-3 hover:bg-slate-50 flex gap-3 cursor-pointer text-xs font-semibold text-slate-600">
                        <WhatsappSVG /> Whatsapp
                      </div>
                      <div className="p-3 hover:bg-slate-50 flex gap-3 cursor-pointer text-xs font-semibold text-slate-600">
                        <GmailSVG /> Gmail
                      </div>
                      <div className="p-3 hover:bg-slate-50 flex gap-3 cursor-pointer text-xs font-semibold text-slate-600">
                        <EmailSVG /> Email
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CORE METRICS GRID */}
              <div className="flex flex-wrap gap-4 py-5 border-t border-b border-slate-100 text-slate-700 text-sm font-semibold">
                {listing.property_bedroom && (
                  <div className="flex gap-2 items-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                    <BedDouble size={18} className="text-slate-400 shrink-0" />
                    <span className="capitalize">{listing.property_bedroom} Bed</span>
                  </div>
                )}
                {listing.property_bathroom && (
                  <div className="flex gap-2 items-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Bath size={18} className="text-slate-400 shrink-0" />
                    <span>{listing.property_bathroom} Bath</span>
                  </div>
                )}
                {listing.property_size != null && (
                  <div className="flex gap-2 items-center px-4 py-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Maximize size={18} className="text-slate-400 shrink-0" />
                    <span>{listing.property_size.toLocaleString()} Sqft</span>
                  </div>
                )}
                {listing.completionStatus && (
                  <div className="flex gap-2 items-center px-4 py-2 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                    <span className="capitalize text-indigo-700 font-extrabold text-xs">
                      {listing.completionStatus.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </div>
                )}
                {listing.furnished && (
                  <div className="flex gap-2 items-center px-4 py-2 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                    <span className="text-emerald-700 font-extrabold text-xs">
                      Furnished
                    </span>
                  </div>
                )}
              </div>

              {/* DESCRIPTION TEXT */}
              <div className="prose max-w-none text-slate-650 leading-relaxed text-sm">
                <ExpandableContent
                  content={
                    listing.description ||
                    "Experience modern living with this beautiful property, offering spacious interiors, premium finishes, and convenient access to key local attractions."
                  }
                />
              </div>
            </div>

            {/* DETAILED PROPERTY INFO */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <h2 className="font-extrabold text-slate-900 text-lg mb-6 tracking-tight flex items-center gap-2">
                <i className="bi-info-circle text-slate-400 text-base"></i> Property Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm text-slate-600">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                  <span className="font-medium text-slate-450">Purpose</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {listing.dealType?.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                  <span className="font-medium text-slate-450">Reference No.</span>
                  <span className="font-bold text-slate-800">
                    {listing.ref || listing.id}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                  <span className="font-medium text-slate-450">Furnished</span>
                  <span className="font-bold text-slate-800">
                    {listing.furnished ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                  <span className="font-medium text-slate-450">Parking Available</span>
                  <span className="font-bold text-slate-800">
                    {listing.has_parking ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                  <span className="font-medium text-slate-450">Negotiable</span>
                  <span className="font-bold text-slate-800">
                    {listing.negotiable ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                  <span className="font-medium text-slate-450">Distress Deal</span>
                  <span className="font-bold text-slate-800">
                    {listing.distress ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* AMENITIES */}
            {amenitiesList.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                <h2 className="font-extrabold text-slate-900 text-lg mb-6 tracking-tight flex items-center gap-2">
                  <i className="bi-stars text-slate-400 text-base"></i> Amenities
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map((a: any) => (
                    <span
                      key={a.slug}
                      className="bg-slate-50 rounded-2xl text-xs flex items-center gap-2.5 p-4 font-bold text-slate-700 border border-slate-100/50 hover:bg-slate-100 hover:border-slate-200/50 transition duration-200"
                    >
                      <Check size={16} className="text-green-600 shrink-0" />
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* HISTORICAL TRANSACTIONS */}
            {HistoryData && HistoryData.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-5">
                <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Similar Property Transactions
                </h2>

                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {listing.property_bedroom && `${listing.property_bedroom} Bed `}Properties in {trendOpt}
                </p>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-slate-400 text-left border-b border-slate-100">
                      <tr>
                        <th className="pb-3 font-bold uppercase tracking-wider">Date</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Duration</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Area (sqft)</th>
                        <th className="pb-3 text-right font-bold uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>

                    <tbody className="text-slate-700 font-semibold">
                      {HistoryData.map((item: any, i: number) => (
                        <tr key={i} className="border-b border-slate-50/50 last:border-none hover:bg-slate-50/60 transition">
                          <td className="py-4 text-slate-500 font-bold">{item.date}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              {item.duration}
                              <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                                New
                              </span>
                            </div>
                          </td>
                          <td className="text-slate-500">{item.area}</td>
                          <td className="text-right font-black text-slate-950">{item.rent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TREND DATA CHART */}
            {TrendData && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                <ListingTrend
                  data={TrendData}
                  label={`Trends in ${trendOpt}`}
                />
              </div>
            )}

            {/* RECOMMENDED PROPERTIES GRID */}
            <div className="space-y-5">
              <h2 className="font-extrabold text-slate-900 text-lg tracking-tight">
                Recommended For You
              </h2>
              <SimilarProperties
                slug={listing.id}
                locationId={listing.locationId}
                listings={listings}
              />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="sticky top-24 space-y-6">
              {/* STICKY AGENT CARD */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-brand to-indigo-500"></div>
                <div className="flex justify-center items-center border-b border-slate-100 bg-slate-50/50 h-32 p-4">
                  <Avatar className="h-24 w-24 rounded-full shadow-lg border-4 border-white bg-white">
                    {general.logoUrl ? (
                      <AvatarImage src={general.logoUrl} className="object-contain p-1" />
                    ) : null}
                    <AvatarFallback className="rounded-full bg-brand text-white font-extrabold text-2xl">
                      {getFirstLetter(agentName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="p-6 text-center space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                      {agentName}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Licensed Agent Partner</p>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <a
                      href={`mailto:${contactEmail}`}
                      className="bg-indigo-50 hover:bg-indigo-150 text-indigo-700 h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition no-underline border border-indigo-100/40"
                    >
                      <Mail size={15} /> Email Agent
                    </a>

                    <a
                      href={`tel:${contactPhone}`}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition no-underline border border-slate-200/50"
                    >
                      <Phone size={15} /> Call Agent
                    </a>

                    <a
                      href={`https://api.whatsapp.com/send/?phone=${encodeURIComponent(contactPhone)}&text=${encodeURIComponent(`Hello, I'm interested in Listing #${listing.ref || listing.id} (${listing.title})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition no-underline border border-emerald-100/50"
                    >
                      <i className="bi-whatsapp text-base"></i> WhatsApp
                    </a>
                  </div>
                </div>

                {general.logoUrl && (
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Presented by</span>
                    <img
                      src={general.logoUrl}
                      alt={general.siteName || "Logo"}
                      className="h-8 w-auto object-contain max-w-[110px]"
                    />
                  </div>
                )}
              </div>

              {/* QUICK LINKS SIDEBAR MODULE */}
              <div className="space-y-4">
                {usefulLinksSections.map((section, index) => (
                  <div
                    key={index}
                    className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden"
                  >
                    <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                        {section.title}
                      </h4>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      {section.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.href}
                          className="text-[13px] text-slate-650 hover:text-brand font-medium transition-colors leading-snug no-underline"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

interface SimilarPropertiesProps {
  slug: string;
  locationId: string | null;
  listings: PublishedListing[];
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  slug,
  locationId,
  listings,
}) => {
  const similar = useMemo(() => {
    return listings
      .filter(
        (property) =>
          property.id !== slug &&
          (!locationId || property.locationId === locationId)
      )
      .slice(0, 3);
  }, [listings, slug, locationId]);

  if (similar.length === 0) {
    return (
      <div className="p-12 text-center border border-slate-100 rounded-3xl bg-white text-slate-400 text-sm font-semibold shadow-sm">
        No similar properties available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {similar.map((property) => {
        const imageUrls =
          property.images?.map((img: any) => img.url).filter(Boolean) ||
          (property.imageUrl ? [property.imageUrl] : []);
        const imgUrl = imageUrls[0] || "/templates/modern-template/shed-house.webp";

        return (
          <div
            key={property.id}
            className="rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm flex flex-col hover:shadow-md hover:border-slate-200/60 transition duration-300 group"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={imgUrl}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-md text-[9px] font-black text-white uppercase tracking-wider",
                    property.dealType?.toLowerCase() === "sale"
                      ? "bg-indigo-650"
                      : "bg-emerald-650"
                  )}
                >
                  {property.dealType}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <Link
                href={`/site/search/${property.id}`}
                className="block no-underline text-inherit hover:text-brand"
              >
                <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1.5">
                  {formatMoney(Number(property.price))}
                </p>
                <h4 className="text-xs font-bold text-slate-700 line-clamp-1 leading-snug tracking-tight">
                  {property.title}
                </h4>
              </Link>

              <div className="flex gap-4 text-xs font-bold text-slate-450 border-t border-slate-50 pt-3">
                {property.property_bedroom && (
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={14} className="text-slate-350" />
                    {property.property_bedroom} Bed
                  </span>
                )}
                {property.property_bathroom && (
                  <span className="flex items-center gap-1.5">
                    <Bath size={14} className="text-slate-350" />
                    {property.property_bathroom} Bath
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListingDetailPageWrap;
