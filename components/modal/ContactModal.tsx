import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import spinningCirlce from "@/public/assets/images/spinning-circles.svg"
import { PhotoSVG } from "../icons";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};


export function CallModal({ open, setOpen }: Props) {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
      if (open) {
        setShowLoader(true);

        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full z-[1100] rounded-2xl p-6 bg-white">
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-sm text-gray-500">Nika Estate Homes Properties</p>
        </div>

        {/* Phone */}
        <div>
          {open && (
            <>
              {showLoader ? (
                <div className="w-full h-[fit] pt-3 flex items-center justify-center">
                  <img src={spinningCirlce.src} alt="" />
                </div>
              ) : (
                <div>
                  <div className="mt-6 flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <Phone size={18} className="text-blue-600" />
                      </div>
                      <span className="text-gray-800 font-medium">
                        +971-4-4383779
                      </span>
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      Call
                    </button>
                  </div>

                  {/* Divider */}
                  <hr className="my-4" />

                  {/* Agent */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Agent</span>
                    <span className="font-medium text-gray-800">
                      Victor Sadygov
                    </span>
                  </div>

                  <hr className="my-4" />

                  {/* Property Reference */}
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Please quote property reference{" "}
                    <span className="font-medium text-gray-700">
                      Bayut - 101526-IiLpGh
                    </span>{" "}
                    when calling us.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
