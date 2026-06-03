import { cn, formatMoney, formatNumber, formatToReadableDate } from "@/lib/utils";
import { ListingsColumns } from "@/types";
import { Button } from "./ui/button";
import { Bath, BedIcon, Maximize } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import usePropertyContactReview from "@/hooks/usePropertyContactReview";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { RadioTab, RadioTabs } from "./ui/radio-tab-group";
import Link from "next/link";

interface Props {
  item: ListingsColumns;
  select: any
}

export default function MyPropertyCard({ item, select }: any) {
  const Row = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-[40%_60%]">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? "Not Available"}</p>
    </div>
  );

  const [open, setOpen] = useState(false);

  const { form, onSubmit, isPending, isDialogOpen, setIsDialogOpen } = usePropertyContactReview(item.id);

  return (
    <div key={`propp__${item.id}`}>
      <div className="card !rounded-xl flex flex-col !p-0 overflow-hidden">
        <div className="space-y-4 p-4 border-b bg-gradient-to-br from-white to-background">
          <div className="w-full flex justify-between gap-2 items-start">
            <div className="capitalize text-xs">
              <span
                className={cn(
                  `px-2 py-0.5 rounded-full`,
                  item.dealType.toLowerCase() === "sale" &&
                  "bg-purple-200 text-purple-800",
                  item.dealType.toLowerCase() === "rent" &&
                  "bg-pink-200 text-pink-800",
                )}
              >{`for ${item.dealType.toLowerCase()}`}</span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-lg flex items-center justify-center rounded-full text-brand bg-brand/10 w-8 h-8">
              <i className="bi-house-door-fill text-sm"></i>
            </div>
            <div className="text-xl font-bold">
              {formatMoney(Number(item?.price))}
            </div>
          </div>
          <div className="flex justify-between gap-2 text-sm">
            <div className="flex gap-1 items-center">
              <div className="capitalize opacity-80 font-semibold">
                {item?.category?.name}
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <i className="bi-geo-alt-fill opacity-50"></i>
              <div>{item?.location?.name}</div>
            </div>
          </div>
        </div>
        {/* <hr /> */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {(item?.property_bedroom && (
              <div className="flex gap-2 items-center">
                <BedIcon size={14} className="leading-relaxed opacity-50" />
                <div className="capitalize">{item.property_bedroom}</div>
              </div>
            )) || <></>}
            {(item?.property_bathroom && (
              <div className="flex gap-2 items-center">
                <Bath size={14} className="leading-relaxed opacity-50" />
                <div>{item.property_bathroom}</div>
              </div>
            )) || <></>}
            {(item?.property_size && (
              <div className="flex gap-2 items-center">
                <Maximize size={14} className="opacity-50 leading-relaxed" />
                <div className="capitalize">
                  {item?.property_size?.toLocaleString() + " sqft"}
                </div>
              </div>
            )) || <></>}
            {(item?.completionStatus && (
              <div className="flex gap-2 items-center">
                {item?.completionStatus?.toLowerCase() === "off_plan" ? (
                  <i className="bi-building-exclamation opacity-50"></i>
                ) : item?.completionStatus?.toLowerCase() === "ready" ? (
                  <i className="bi bi-check-circle opacity-50"></i>
                ) : (
                  <></>
                )}
                <div className="capitalize">
                  {item?.completionStatus?.toLowerCase().replace(/_/g, " ")}
                </div>
              </div>
            )) || <></>}
            {(item?.furnished && (
              <div className="flex gap-2 items-center">
                <i className="bi-house-check opacity-50"></i>
                <div className="capitalize">Furnished</div>
              </div>
            )) || <></>}
            {(item?.distres && (
              <div className="flex gap-2 items-center">
                <i className="bi bi-exclamation-triangle"></i>
                <div className="capitalize">Distress</div>
              </div>
            )) || <></>}
          </div>
          <div className="flex justify-between gap-2 opacity-80">
            <div className="text-xs flex gap-2 items-center">
              <i className="bi-calendar3 opacity-40"></i>
              {formatToReadableDate(item.created_on)}
            </div>
            <div className="flex items-center justify-center text-xs gap-1">
              <i className="bi-check-circle-fill opacity-80"></i>{" "}
              <div>Licensed Agent</div>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="text-link text-sm cursor-pointer" onClick={() => setOpen(true)}>See Details</div>
          </div>
        </div>
      </div>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-3xl h-[90vh] overflow-hidden flex flex-col border border-primary/20 bg-gradient-to-b from-background via-background/95 to-card">
          <DialogHeader className="pt-0 border-b pb-2">
            <DialogTitle className="flex items-center justify-between text-lg font-semibold tracking-tight">
              <div>
                <span className="block text-lg font-extrabold">
                  Listing #{item?.id}
                </span>
                {/* <span className="text-sm text-muted-foreground">
                  {item?.title}
                </span> */}
              </div>

              <Link href={`/property-listings/${item?.id}`} className="text-link cursor-pointer flex gap-1" onClick={() => setOpen(true)}><i className="bi-pencil"></i> Edit</Link>
            </DialogTitle>
          </DialogHeader>

          {!item ? (
            <div className="py-6 text-sm text-muted-foreground">
              No information available.
            </div>
          ) : (
            <ScrollArea className="flex-1 no-scrollbar">
              <div className="space-y-6 py-3">
                {/* BASIC INFO */}
                <section className="rounded-xl border border-primary/15 bg-gradient-to-br from-background to-primary/5 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">
                    Basic Information
                  </h3>

                  <div className="grid gap-3">
                    <Row label="Title" value={item?.title} />
                    {/* <Row label="Permit Number" value={item?.permit_number} /> */}
                    <Row label="Category" value={item?.category?.name} />
                    <Row label="Location" value={item?.location?.name} />
                    <Row label="Deal Type" value={item?.dealType} />
                  </div>
                </section>

                {/* PROPERTY DETAILS */}
                <section className="rounded-xl border border-primary/15 bg-gradient-to-br from-background to-primary/5 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">
                    Property Details
                  </h3>

                  <div className="grid gap-3">
                    <Row label="Bedrooms" value={item?.property_bedroom} />
                    <Row label="Bathrooms" value={item?.property_bathroom} />
                    <Row label="Size (Sqft)" value={formatNumber(item?.property_size || 0)} />
                    <Row
                      label="Parking"
                      value={item?.has_parking ? "Yes" : "No"}
                    />
                    <Row
                      label="Furnished"
                      value={item?.furnished ? "Yes" : "No"}
                    />
                    <Row
                      label="Distress"
                      value={item?.distres ? "Yes" : "No"}
                    />
                  </div>
                </section>

                {/* PRICE */}
                <section className="rounded-xl border border-primary/15 bg-gradient-to-br from-background to-primary/5 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">
                    Pricing
                  </h3>

                  <div className="grid gap-3">
                    <Row label="Price Type" value={item?.price_type} />
                    <Row label="Price" value={formatMoney(item?.price || 0)} />
                    <Row label="Max Price" value={formatMoney(item?.max_price || 0)} />
                    <Row label="Unit" value={item?.price_unit} />
                    <Row
                      label="Negotiable"
                      value={item?.negotiable ? "Yes" : "No"}
                    />
                  </div>
                </section>

                {/* AMENITIES */}
                <section className="rounded-xl border border-primary/15 bg-gradient-to-br from-background to-primary/5 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">
                    Amenities
                  </h3>

                  <div className="text-sm">
                    {item?.list_amenities
                      ? item?.list_amenities.split("|").join(", ")
                      : "Not Available"}
                  </div>
                </section>

                {/* VISIBILITY */}
                {/* <section className="rounded-xl border border-primary/15 bg-gradient-to-br from-background to-primary/5 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">
                    Visibility
                  </h3>

                  <div className="grid gap-3">
                    <Row label="Scope" value={item?.visibility_scope} />
                    <Row
                      label="Publish to Website"
                      value={item?.publish_to_website ? "Yes" : "No"}
                    />
                    <Row
                      label="Publish to Marketplace"
                      value={item?.publish_to_marketplace ? "Yes" : "No"}
                    />
                  </div>
                </section> */}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
