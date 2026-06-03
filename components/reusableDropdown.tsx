import React, { useState } from "react";
import { ChevronUp } from "lucide-react";

function ReusableDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-evenly w-40 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        English (US)
        <ChevronUp
          className={`ml-2 h-4 w-4 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Menu Items */}
      {open && (
        <div className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Profile
              </button>
            </li>
            <li>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Settings
              </button>
            </li>
            <li>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReusableDropdown;
