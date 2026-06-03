import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Landlord } from "@/types";

interface LandlordValue {
  id?: string;
  email?: string;
}

interface LandlordSelectorProps {
  landlords: Landlord[];
  value: LandlordValue | undefined;
  onChange: (val: LandlordValue) => void;
}

export function LandlordSelector({ landlords, value, onChange }: LandlordSelectorProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync from form
  useEffect(() => {
    if (!value) return;

    if (value.id) {
      const found = landlords.find((l) => l.id === value.id);
      setInput(found ? found.name : "");
    }

    if (value.email) {
      setInput(value.email);
    }
  }, [value, landlords]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered list
  const list = landlords ?? [];
  const filtered = list.filter(
    (l) =>
      l.name.toLowerCase().includes(input.toLowerCase()) ||
      l.email.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div ref={containerRef} className="w-full border rounded-md relative">
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Select or invite landlord..."
          value={input}
          onFocus={() => setOpen(true)}
          onValueChange={(val) => {
            setInput(val);
            onChange({ email: val }); // typing = email
            setOpen(true);
          }}
        />

        {open && (
          <CommandList className="w-full">
            {filtered.length > 0 ? (
              <CommandGroup>
                {filtered.map((landlord) => (
                  <CommandItem
                    key={landlord.id}
                    className="px-4 py-2"
                    onSelect={() => {
                      setInput(landlord.name);
                      onChange({ id: landlord.id }); // selecting = id
                      setOpen(false);
                    }}
                  >
                    {landlord.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty className="px-4 py-2 text-gray-500">
                Invite "{input}"
              </CommandEmpty>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
