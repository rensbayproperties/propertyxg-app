import { Separator } from "@/components/ui/separator";
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col gap-12 mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-start items-center gap-2">
          <p className="text-sm text-gray-500">Basic Information*</p>
          <div className="flex-1">
            <Separator />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-3">
          {Array.from(Array(9)).map((_, index) => (
            <div className="animate-pulse" key={index}>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-start items-center gap-2">
          <p className="text-sm text-gray-500">Additional Information</p>
          <div className="flex-1">
            <Separator />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 md:grid-cols-3">
          {Array.from(Array(7)).map((_, index) => (
            <div className="animate-pulse" key={index}>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
