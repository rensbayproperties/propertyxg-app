import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  CopyLinkSVG,
  DotsSVG,
  Email2SVG,
  Facebook2SVG,
  MessagesSVG,
  MessengerSVG,
  Twitter2SVG,
  Whatsapp2SVG,
} from "../icons";

type props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
function ShareModal({ open, setOpen }: props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-full 
          sm:w-[90vw] 
          md:w-[70vw] 
          lg:w-[50vw] 
          xl:w-[43vw] 
          max-w-none 
          h-auto 
          max-h-[90vh] 
          z-[1000] 
          overflow-y-auto 
          rounded-[20px] 
          pt-10 
          sm:pt-12 
          md:pt-14 
          px-4 
          sm:px-6 
          md:px-8 
          flex 
          flex-col 
          gap-y-5
        "
      >
        <p className="text-lg sm:text-xl md:text-2xl font-semibold">
          Share this property
        </p>

        <div className="w-full h-[65px] flex gap-3 items-center">
          <div className="w-[60px] sm:w-[70px] h-full rounded-[10px] sharemodDP"></div>

          <p className="text-sm sm:text-base">Home in Palm Jumeirah</p>
          <span>.</span>
          <span className="text-sm sm:text-base">1 Bed</span>
          <span>.</span>
          <span className="text-sm sm:text-base">234374 sqft</span>
        </div>

        <div className="w-full flex flex-col gap-y-3 pt-5">
          <div className="w-full h-[50px] flex justify-between">
            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-2 cursor-pointer hover:bg-[#F7F7F7]">
              <CopyLinkSVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                Copy Link
              </span>
            </div>

            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-1 cursor-pointer hover:bg-[#F7F7F7]">
              <Email2SVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                Email
              </span>
            </div>
          </div>

          <div className="w-full h-[50px] flex justify-between">
            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-2 cursor-pointer hover:bg-[#F7F7F7]">
              <MessagesSVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                Messages
              </span>
            </div>

            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-2 cursor-pointer hover:bg-[#F7F7F7]">
              <Whatsapp2SVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                WhatsApp
              </span>
            </div>
          </div>

          <div className="w-full h-[50px] flex justify-between">
            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-2 cursor-pointer hover:bg-[#F7F7F7]">
              <MessengerSVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                Messenger
              </span>
            </div>

            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-2 cursor-pointer hover:bg-[#F7F7F7]">
              <Facebook2SVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                Facebook
              </span>
            </div>
          </div>

          <div className="w-full h-[50px] flex justify-between">
            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-3 cursor-pointer hover:bg-[#F7F7F7]">
              <Twitter2SVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                Twitter
              </span>
            </div>

            <div className="w-[49%] h-full rounded-[5px] border flex pl-2 items-center gap-x-2 cursor-pointer hover:bg-[#F7F7F7]">
              <DotsSVG />
              <span className="text-[14px] sm:text-[16px] font-medium">
                More Options
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareModal;
