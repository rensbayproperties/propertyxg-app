"use client";

import React from "react";
import * as Icons from "lucide-react";
import { X } from "lucide-react";

type Amenity = {
  id: number;
  name: string;
  icon: string;
  created_on?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  amenities: Amenity[];
};

const RenderIcon = ({ icon }: { icon?: string }) => {
  if (!icon) return <Icons.Building2 size={20} />;

  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
  const LucideIcon = (Icons as any)[iconName];

  if (!LucideIcon) return <Icons.Building2 size={20} />;

  return <LucideIcon size={20} />;
};

export default function AmenitiesDialog({ open, onClose, amenities }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-[90%] md:w-[700px] max-h-[80vh] rounded-lg p-6 overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            
          <div className="w-full flex items-center justify-center">
            {" "}
            <h2 className="text-xl font-semibold">All Amenities</h2>
          </div>

          <X onClick={onClose} className="cursor-pointer hover:text-red-500" />
        </div>

        {/* Content */}
        {amenities?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.id}
                className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center gap-2"
              >
                <RenderIcon icon={amenity.icon} />

                <p className="text-sm text-center">{amenity.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No amenities available</p>
        )}
      </div>
    </div>
  );
}
