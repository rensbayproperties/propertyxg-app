import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Loader2, MapPin } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { Location } from "@/types";
import { useQueryState } from "nuqs";
import { Icons } from "@/components/icons"

interface LocationSearchDropdownProps {
  onLocationSelect: (location: Location) => void;
  defaultValue?: Location;
}

const LocationSearchDropdown: React.FC<LocationSearchDropdownProps> = ({
  onLocationSelect,
  defaultValue,
}) => {
  const { allLocations, isLoading } = useLocations();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [, setName] = useQueryState("name");

  useEffect(() => {
    if (defaultValue) {
      setSearchTerm(defaultValue.name);
    }
  }, [defaultValue]);

  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setName(value);
    setIsOpen(value.length > 0);
  };

  return (
    <div className="relative">
      <Input
        placeholder="Search location"
        className="rounded-full"
        value={searchTerm}
        onChange={handleLocationSearch}
        onFocus={() => setIsOpen(true)}
        icon={Icons.location}
      />

      {isOpen && searchTerm && (
        <ul className="absolute bg-white border mt-1 rounded-md shadow-lg z-[9999] max-h-80 overflow-auto w-full p-2">
          {isLoading ? (
            <li className="p-2 flex justify-center">
              <Loader2 className="animate-spin" />
            </li>
          ) : (
            allLocations.map((location) => (
              <li
                key={location.id}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-md flex gap-2 items-center"
                onMouseDown={() => {
                  setSearchTerm(location.name);
                  setIsOpen(false);
                  onLocationSelect(location);
                }}
              >
                <i className="bi-geo-alt opacity-50 text-lg"></i>
                {location.name}
                {location.parent && (
                  <span className="opacity-40 text-sm">
                    , {location.parent.name}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default LocationSearchDropdown;
