"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import AmenitiesModal from "./modal/AmenitiesModal";

const campaigns = [
  { id: 1, name: "Gazebo" },
  { id: 2, name: "Pool" },
  { id: 3, name: "Gazebo" },
  { id: 4, name: "Pool" },
  { id: 5, name: "Gazebo" },
  { id: 6, name: "Pool" },
  { id: 7, name: "Gazebo" },
  { id: 8, name: "Pool" },
  { id: 9, name: "Gazebo" },
  { id: 10, name: "Pool" },
  { id: 11, name: "Gazebo" },
  { id: 12, name: "Pool" },
  { id: 13, name: "Gazebo" },
  { id: 14, name: "Pool" },
  { id: 15, name: "Gazebo" },
  { id: 16, name: "Pool" },
  { id: 17, name: "Gazebo" },
  { id: 18, name: "Pool" },
];

type Amenity = {
  id: number;
  name: string;
};

type AmenitiesProps = {
  amenities: Amenity[];
};

export const AmenitiesDivtwo = ({ amenities }: AmenitiesProps) => {
  const [open, setOpen] = useState(false);

  const previewAmenities = amenities.slice(0, 8);

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6">AMENITIES</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previewAmenities.map((amenity) => (
          <div
            key={amenity.id}
            className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center">
              <Check size={12} />
            </div>

            <span className="text-sm text-gray-700">{amenity.name}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="mt-6 px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300"
      >
        SHOW ALL <span className="text-red-500">{amenities.length}</span>{" "}
        AMENITIES
      </button>

      <AmenitiesModal
        open={open}
        setOpen={setOpen}
        amenities={campaigns}
      />
    </div>
  );
};
