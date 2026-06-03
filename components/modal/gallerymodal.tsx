import React, { useState } from "react";
import { LocationSVG, PhotoSVG, WhatsappSVG } from "../icons";
import { Phone, Mail } from "lucide-react";
import { CallModal } from "./ContactModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/constant/data";
import useListing from "@/hooks/useListing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  images: string[];
  id: string;
  user: string
};

export default function GalleryModal({ open, setOpen, images, id, user }: Props) {
  const [openCall, setOpenCall] = useState(false);
   const {

      isDialogOpen,
      setIsDialogOpen,
      setSelectedListingId,
      selectedListingId,
      contactAgent,
      form,
      isPendingPropertyContact,
      onSubmit,
      selectedListing,
      isLoadingSelectedListing,
    } = useListing();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[70vw] max-w-none h-[80vh] z-[1000] p-0 overflow-hidden">
          <div className="relative rounded-xl shadow-2xl w-full h-full mx-auto bg-white flex flex-col">
            
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white flex items-center justify-center pt-4 pb-2">
              <div className="w-[95%] h-[50px] border p-1 rounded-[7px] flex justify-evenly items-center">
                
                <div className="w-full h-[100%] rounded-[7px] flex items-center justify-center gap-1 bg-[#e5f0ff] cursor-pointer">
                  <PhotoSVG />
                  <span className="text-[14px] text-blue-500">Photos</span>
                  <span className="text-[14px] text-blue-500">
                    ({images?.length})
                  </span>
                </div>

              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* LEFT */}
                <div className="flex flex-col gap-4">
                  {images
                    ?.filter((_, index) => index % 2 === 0)
                    .map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="property"
                        className="w-full h-[220px] object-cover rounded-lg"
                      />
                    ))}
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-4">
                  {images
                    ?.filter((_, index) => index % 2 !== 0)
                    .map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="property"
                        className="w-full h-[220px] object-cover rounded-lg"
                      />
                    ))}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-50 bg-white border-t px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
               <Avatar className="h-12 w-12 rounded-full shadow border">
                                   <AvatarImage src={""} />
                                   <AvatarFallback className="rounded-full">
                                     {getFirstLetter(user)}
                                   </AvatarFallback>
                                 </Avatar>

                <p className="text-sm">
                  Listing by
                  <span className="font-semibold ml-1 text-blue-500">
                    {user}
                  </span>
                </p>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
          <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open: boolean) => {
                      setIsDialogOpen(open);
                      if (!open) {
                        setSelectedListingId(null);
                      }
                    }}
                  >
                    <DialogContent className="max-w-3xl overflow-hidden border border-primary/20 bg-gradient-to-b from-background via-background/95 to-card">
                      <DialogHeader className="pt-0 pb-2">
                        <DialogTitle className="flex items-center justify-between text-lg font-semibold tracking-tight">
                          <div className="flex gap-2">
                            <i className="bi-whatsapp text-green-800"></i>
                            <span className="block text-lg font-extrabold text-green-800">
                              Contact Agent
                            </span>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
          
                      {isLoadingSelectedListing ? (
                        <div className="py-6 text-sm text-muted-foreground">...</div>
                      ) : !selectedListing ? (
                        <div className="py-6 text-sm text-muted-foreground">
                          No information available.
                        </div>
                      ) : (
                        <ScrollArea className="max-h-[80vh] overflow-scroll p-1">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                              <div className="flex flex-col gap-4">
                                <FormField
                                  control={form.control}
                                  name="message"
                                  render={({ field }) => (
                                    <FormItem>
                                      {/* <FormLabel>Notes</FormLabel> */}
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          placeholder="Message"
                                          rows={10}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div>
                                  <Button
                                    type="submit"
                                    loading={isPendingPropertyContact}
                                    className="w-full bg-green-800 hover:bg-green-800 text-green-100 shadow-md"
                                  >
                                    {isPendingPropertyContact
                                      ? "Please wait..."
                                      : "Continue"}
                                  </Button>
                                </div>
                              </div>
                            </form>
                          </Form>
                        </ScrollArea>
                      )}
                    </DialogContent>
                  </Dialog>

      <CallModal open={openCall} setOpen={setOpenCall} />
    </>
  );
}