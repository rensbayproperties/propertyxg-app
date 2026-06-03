import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check } from "lucide-react";

type Amenity = {
  id: number;
  name: string;
};

type AmenitiesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  amenities: Amenity[];
};

const AmenitiesModal = ({ open, setOpen, amenities }: AmenitiesModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">All Amenities</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2"
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
      </DialogContent>
    </Dialog>
  );
};

export default AmenitiesModal;
