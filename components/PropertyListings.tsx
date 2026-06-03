"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Link from "next/link";
import SearchPropertyCardSkeleton from "./SearchPropertyCardSkeleton";
import { formatMoney } from "@/lib/utils";

export const SearchPropertyCard = ({ property }: any) => {
  const images = property?.images?.map((img: any) => img.url) || [];
  return (
    <Link href={`/search/${property.id}`}>
      <div className="grid md:grid-cols-2 w-auto gap-2 p-2 rounded bg-white">
        <div className="relative">
          <Image
            src={images[0]}
            width={"100"}
            height={"100"}
            alt=""
            className="rounded object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="line-clamp-1 text-sm text-brand">{property.title}</h4>
          <div className="flex gap-1 opacity-60 items-center">
            <MapPin size={12} />
            <span className="leading-none line-clamp-1 text-xs">
              {property?.location?.name}
            </span>
          </div>
          <p className="text-money">
            <span className="text-xs line-clamp-1">
              {formatMoney(property?.price)}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};
