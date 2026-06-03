"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import Container from "./Container";

type ProjectData = {
  project_start_date: string;
  project_end_date: string | null;

  project_type_id: number;
  project_classification_id: number;
  project_classification_ar: string;

  project_status: string;
  percent_completed: number;

  completion_date: string | null;
  cancellation_date: string;

  project_description_en: string;

  area_name_en: string;
  master_project_en: string;
  zoning_authority_en: string;

  no_of_lands: number;
  no_of_buildings: number;
  no_of_villas: number;
  no_of_units: number;

  developer_name_en: string;
  project_name_en: string;

  images: string;

  status: string;
};

type ListingProjectShowcaseProps = {
  data: ProjectData;

  launchPrice?: string;
  paymentPlan?: string;

  onRegisterInterest?: () => void;
};

export default function ListingProjectShowcase({
  data,
  launchPrice = "Ask for Price",
  paymentPlan = "Flexible",
  onRegisterInterest,
}: ListingProjectShowcaseProps) {
  /**
   * HANDLE IMAGES
   * images = comma separated string
   */
  const imageList = data?.images
    ? data.images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean)
    : [];

  /**
   * FALLBACK IMAGE
   */
  const fallbackImage = "";

  /**
   * IF ONLY 1 IMAGE
   */
  const hasSingleImage = imageList.length <= 1;

  /**
   * FIRST 3 IMAGES
   */
  const mainImage = imageList?.[0] || fallbackImage;
  const topImage = imageList?.[1] || mainImage;
  const bottomImage = imageList?.[2] || mainImage;

  /**
   * FORMAT HANDOVER DATE
   */
  const handover = data?.completion_date
    ? new Date(data.completion_date).getFullYear()
    : "TBA";

  return (
    <Container>
      <div className="grid grid-cols-1 border lg:grid-cols-[50%_50%] gap-4 bg-gray-50 rounded-2xl p-4 mx-auto overflow-hidden">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-between min-w-0">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
              {data?.project_name_en}
            </h1>

            <p className="text-base mt-1">
              {[data?.area_name_en, data?.master_project_en]
                .filter(Boolean)
                .join(", ")}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="bg-[#7e3af2] text-white text-xs font-semibold px-3 py-1 rounded-md">
                {data?.project_status}
              </span>

              <span className="text-sm">•</span>

              <p className="text-sm">
                By{" "}
                <span className="font-semibold">{data?.developer_name_en}</span>
              </p>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="bg-white rounded-xl border mt-4 overflow-hidden shadow-sm">
            <div className="grid grid-cols-4">
              {/* PRICE */}
              <div className="p-3 border-r">
                <p className="opacity-80 text-xs">No Of Units</p>

                <h3 className="text-xl font-bold mt-1 text-[#111827]">
                  {data?.no_of_units}
                </h3>
              </div>

              {/* PAYMENT */}
              <div className="p-3 border-r">
                <p className="opacity-80 text-xs">No Of Villas</p>

                <div className="flex items-center gap-1 mt-1">
                  <h3 className="text-xl font-bold text-[#111827]">
                    {data?.no_of_villas}
                  </h3>

                  <Info size={13} className="text-gray-400" />
                </div>
              </div>

              <div className="p-3 border-r">
                <p className="opacity-80 text-xs">No Of Buildings</p>

                <h3 className="text-xl font-bold mt-1 text-[#111827]">
                  {data?.no_of_buildings}
                </h3>
              </div>

              {/* HANDOVER */}
              <div className="p-3">
                <p className="opacity-80 text-xs">HandOver</p>

                <h3 className="text-xl font-bold mt-1 text-[#111827]">
                  {handover}
                </h3>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t px-4 py-3 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-gray-500">
                <i className="bi bi-person-heart text-sm"></i>

                <p className="font-medium text-xs">
                  Express your interest in this project
                </p>
              </div>

              <button
                onClick={onRegisterInterest}
                className="bg-brand hover:bg-blue-600 transition-all text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
              >
                <i className="bi bi-whatsapp text-sm"></i>
                Register Interest
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-4">
            <p className="text-sm leading-7 text-gray-700 line-clamp-4">
              {data?.project_description_en}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full">
          {hasSingleImage ? (
            /**
             * SINGLE IMAGE LAYOUT
             */
            <div className="relative w-[97%] min-h-[420px] rounded-2xl overflow-hidden">
              <Image
                src={mainImage}
                alt={data?.project_name_en}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ) : (
            /**
             * MULTI IMAGE LAYOUT
             */
            <div className="grid grid-cols-[60%_40%] gap-3 h-full min-h-[420px] w-[97%]">
              {/* MAIN IMAGE */}
              <div className="relative h-full w-full rounded-xl overflow-hidden">
                <Image
                  src={mainImage}
                  alt={data?.project_name_en}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>

              {/* SIDE IMAGES */}
              <div className="grid grid-rows-2 gap-3 h-full">
                <div className="relative h-full w-full rounded-xl overflow-hidden">
                  <Image
                    src={topImage}
                    alt={data?.project_name_en}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>

                <div className="relative h-full w-full rounded-xl overflow-hidden">
                  <Image
                    src={bottomImage}
                    alt={data?.project_name_en}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
