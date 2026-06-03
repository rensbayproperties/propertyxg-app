"use client";

import React, { useState } from "react";
import { Check, Building2 } from "lucide-react";
import * as Icons from "lucide-react";
import AmenitiesModal from "./modal/AmenitiesModal";
import AmenitiesDialog from "./AmentiesDialog";

const AmenitiesArray = [
  {
    id: 1,
    name: "gazebo",
  },
  {
    id: 2,
    name: "pool",
  },
  {
    id: 3,
    name: "gazebo",
  },
  {
    id: 4,
    name: "pool",
  },
  {
    id: 5,
    name: "gazebo",
  },
  {
    id: 6,
    name: "pool",
  },
  {
    id: 7,
    name: "gazebo",
  },
  {
    id: 8,
    name: "pool",
  },
  {
    id: 9,
    name: "gazebo",
  },
  {
    id: 10,
    name: "pool",
  },
  {
    id: 11,
    name: "gazebo",
  },
  {
    id: 12,
    name: "pool",
  },
  {
    id: 13,
    name: "gazebo",
  },
  {
    id: 14,
    name: "pool",
  },
  {
    id: 15,
    name: "gazebo",
  },
  {
    id: 16,
    name: "pool",
  },
  {
    id: 17,
    name: "gazebo",
  },
  {
    id: 18,
    name: "pool",
  },
  {
    id: 19,
    name: "gazebo",
  },
  {
    id: 20,
    name: "pool",
  },
];

const AmenitiesIconArray = [
  {
    id: 1,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 2,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 3,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 4,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 5,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 6,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 7,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 8,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 9,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 10,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 11,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 12,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 13,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 14,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 15,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 16,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 17,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 18,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 19,
    name: "gazebo",
    icon: "gazebo",
    created_on: "2026",
  },
  {
    id: 20,
    name: "pool",
    icon: "gazebo",
    created_on: "2026",
  },
];

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
  id: string | number;
  name: string;
  icon?: string;
  created_on?: string;
};

type AmenitiesProps = {
  amenities?: Amenity[];
  variant?: "grid" | "double" | "features";
};

const RenderIcon = ({ icon }: { icon?: string }) => {
  if (!icon) return <Building2 size={20} />;

  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
  const LucideIcon = (Icons as any)[iconName];

  if (!LucideIcon) return <Building2 size={20} />;

  return <LucideIcon size={20} />;
};

export const AmenitiesSection = ({
  amenities,
  variant = "grid",
}: AmenitiesProps) => {
  const [open, setOpen] = useState(false);

  if (!amenities || amenities.length === 0) return null;

  const previewAmenities = amenities.slice(0, 8);
  const visibleAmenities = amenities.slice(0, 4);
  const remainingCount = amenities.length - 4;

  return (
    <>
      {/* ---------------- GRID VARIANT ---------------- */}
      {variant === "grid" && (
        <div className="p-6 rounded-lg mt-6 border bg-white">
          <h2 className="text-xl font-semibold mb-4">AMENITIES</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
                  ✓
                </div>

                <p className="text-sm text-gray-800">{amenity.name}</p>
              </div>
            ))}
          </div>

          <AmenitiesModal
            open={open}
            setOpen={setOpen}
            amenities={campaigns}
          />
        </div>
      )}

      {/* ---------------- DOUBLE VARIANT ---------------- */}
      {variant === "double" && (
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">AMENITIES</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewAmenities.map((amenity) => (
              <div
                key={amenity.id}
                className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2 bg-white"
              >
                <div key={amenity.id} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
                    ✓
                  </div>
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
            amenities={AmenitiesArray}
          />
        </div>
      )}

      {/* ---------------- FEATURES VARIANT ---------------- */}
      {variant === "features" && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Features / Amenities</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {visibleAmenities.map((amenity) => (
              <div
                key={amenity.id}
                className="flex flex-col items-center justify-center gap-2 bg-white p-6 rounded-lg shadow-sm border"
              >
                <RenderIcon icon={amenity.icon} />
                <p className="text-sm text-center">{amenity.name}</p>
              </div>
            ))}

            {remainingCount > 0 && (
              <div
                onClick={() => setOpen(true)}
                className="bg-white border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              >
                <p className="text-blue-600 font-semibold">
                  +{remainingCount} more
                </p>

                <p className="text-sm text-gray-600">amenities</p>
              </div>
            )}
          </div>

          <AmenitiesDialog
            open={open}
            onClose={() => setOpen(false)}
            amenities={AmenitiesIconArray}
          />
        </div>
      )}
    </>
  );
};
