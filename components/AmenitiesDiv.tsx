"use client";
import React from "react";
import { Check } from "lucide-react";


type Amenity = {
  id: number;
  name: string;
};

type AmenitiesProps = {
  amenities?: Amenity[];
};

export const AmenitiesDiv = ({ amenities }: AmenitiesProps) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="p-6 rounded-lg mt-6 border bg-white">
      <h2 className="text-xl font-semibold mb-4">AMENITIES</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center gap-2">
            {/* Tick Checkbox */}
            <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>

            {/* Name */}
            <p className="text-sm text-gray-800">{amenity.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
