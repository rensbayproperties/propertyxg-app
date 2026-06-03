import { cn, formatMoney, formatNumber, formatToReadableDate } from "@/lib/utils";
import { InquiriesColumns } from "@/types";
import { Button } from "./ui/button";
import { Bath, BedIcon, Maximize } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";


interface Props {
  item: InquiriesColumns;
}

export default function InquiryPropertyCard({ item }: any) {
  const Row = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-[40%_60%]">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value ?? "Not Available"}</p>
    </div>
  );

  const [open, setOpen] = useState(false);
  return (
    <div key={`propp__${item.id}`}>
      <div className="card !rounded-xl flex flex-col !p-0 overflow-hidden">
        <div className="bg-backgroundss space-y-4 p-4 border-b bg-gradient-to-br from-white to-background">
          <div className="capitalize text-xs"><span className={cn(`px-2 py-0.5 rounded-full`, item.dealType.toLowerCase() === 'sale' && 'bg-purple-200 text-purple-800', item.dealType.toLowerCase() === 'rent' && 'bg-pink-200 text-pink-800')}>{`for ${item.dealType.toLowerCase()}`}</span></div>
          <div className="flex gap-3 items-center">
            <div className="text-lg flex items-center justify-center rounded-full text-brand bg-brand/10 w-8 h-8">
              <i className="bi bi-chat-left-dots-fill text-sm"></i>
            </div>
            <div className="text-xl font-bold">
              {formatMoney(Number(item?.min_budget))}
            </div>
          </div>
          <div className="flex justify-between gap-2 text-sm">
            <div className="flex gap-1 items-center">
              <div className="capitalize opacity-80 font-semibold">{item?.category?.name}</div>
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
            {
              item?.property_bedroom && <div className="flex gap-2 items-center">
                <BedIcon size={14} className="leading-relaxed opacity-50" />
                <div className="capitalize">{item.property_bedroom}</div>
              </div> || <></>
            }
            {
              item?.property_bathroom && <div className="flex gap-2 items-center">
                <Bath size={14} className="leading-relaxed opacity-50" />
                <div>{item.property_bathroom}</div>
              </div> || <></>
            }
            {
              item?.size && <div className="flex gap-2 items-center">
                <Maximize size={14} className="opacity-50 leading-relaxed" />
                <div className="capitalize">{item?.size?.toLocaleString() + " sqft"}</div>
              </div> || <></>
            }
            {
              item?.completionStatus && <div className="flex gap-2 items-center">
                {item?.completionStatus?.toLowerCase() === 'off_plan' ? <i className="bi-building-exclamation opacity-50"></i> : item?.completionStatus?.toLowerCase() === 'ready' ? <i className="bi bi-check-circle opacity-50"></i> : <></>}
                <div className="capitalize">{item?.completionStatus?.toLowerCase().replace(/_/g, " ")}</div>
              </div> || <></>
            }
            {
              item?.furnished && <div className="flex gap-2 items-center">
                <i className="bi-house-check opacity-50"></i>
                <div className="capitalize">Furnished</div>
              </div> || <></>
            }
            {
              item?.distres && <div className="flex gap-2 items-center">
                <i className="bi bi-exclamation-triangle"></i>
                <div className="capitalize">Distress</div>
              </div> || <></>
            }
          </div>
          <div className="flex justify-between gap-2 opacity-80">
            <div className="text-xs flex gap-2 items-center">
              <i className="bi-calendar3 opacity-40"></i>
              {formatToReadableDate(item.created_on)}
            </div>
            <div className="flex items-center justify-center text-xs gap-1"><i className="bi-check-circle-fill opacity-80"></i> <div>Licensed Agent</div></div>
          </div>
          <div className="text-link text-sm cursor-pointer" onClick={() => setOpen(true)}>See Details</div>
          <Button size={"sm"}
            className="w-full bg-green-200 hover:bg-green-200 text-green-800"
          >
            <i className="bi-whatsapp"></i>WhatsApp Agent
          </Button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl h-[85vh] overflow-hidden flex flex-col border border-primary/20 bg-gradient-to-b from-background via-background/95 to-card">
          {/* HEADER */}
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-brand">
                  Inquiry #{item?.id}
                </p>
                {/* <p className="text-sm text-muted-foreground">{item?.name}</p> */}
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                {item?.dealType}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* BODY */}
          <ScrollArea className="flex-1 no-scrollbar">
            <div className="space-y-6 py-4">
              {/* BASIC INFO */}
              <section className="p-4 rounded-xl border bg-gradient-to-br from-background to-primary/5">
                <h3 className="text-sm font-bold text-brand mb-3 uppercase">
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Row label="Name" value={item?.name} />
                  <Row label="Category" value={item?.category?.name} />
                  <Row label="Location" value={item?.location?.name} />
                  <Row label="Deal Type" value={item?.dealType} />
                </div>
              </section>

              {/* BUDGET */}
              <section className="p-4 rounded-xl border bg-gradient-to-br from-background to-primary/5">
                <h3 className="text-sm font-bold text-brand mb-3 uppercase">
                  Budget
                </h3>

                <div className="space-y-2">
                  <Row label="Min Budget" value={formatNumber(item?.min_budget)} />
                  <Row label="Max Budget" value={formatNumber(item?.max_budget)} />
                </div>
              </section>

              {/* PROPERTY PREFERENCES */}
              <section className="p-4 rounded-xl border bg-gradient-to-br from-background to-primary/5">
                <h3 className="text-sm font-bold text-brand mb-3 uppercase">
                  Preferences
                </h3>

                <div className="space-y-2">
                  <Row label="Size" value={item?.size} />
                  <Row
                    label="Furnished"
                    value={item?.furnished ? "Yes" : "No"}
                  />
                  <Row label="Distress" value={item?.distres ? "Yes" : "No"} />
                  <Row
                    label="Completion Status"
                    value={item?.completionStatus.replace(/_/g, " ")}
                  />
                  <Row
                    label="Bedrooms"
                    value={item?.property_bedroom}
                  />
                  <Row
                    label="Bathrooms"
                    value={item?.property_bathroom}
                  />
                </div>
              </section>

              {/* NOTE */}
              <section className="p-4 rounded-xl border bg-gradient-to-br from-background to-primary/5">
                <h3 className="text-sm font-bold text-brand mb-3 uppercase">
                  Notes
                </h3>

                <p className="text-sm text-muted-foreground">
                  {item?.note || "No notes provided"}
                </p>
              </section>

              {/* META */}
              {/* <section className="p-4 rounded-xl border bg-gradient-to-br from-background to-primary/5">
                <h3 className="text-sm font-bold text-brand mb-3 uppercase">
                  Meta Information
                </h3>

                <div className="space-y-2">
                  <Row
                    label="Assigned User"
                    value={`${item?.user?.first_name} ${item?.user?.last_name}`}
                  />
                  <Row label="User Email" value={item?.user?.email} />
                  <Row label="Company" value={item?.company?.name} />
                  <Row
                    label="Marketplace"
                    value={item?.publish_to_marketplace ? "Yes" : "No"}
                  />
                </div>
              </section> */}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

