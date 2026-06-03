import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ToggleFieldProps {
  control: any;
  name: string;
  label: string;
  description?: string;
}

export function ToggleField({
  control,
  name,
  label,
  description,
}: ToggleFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded border p-3 bg-zinc-200 ">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <FormControl>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}