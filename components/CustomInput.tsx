import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ImagePlus, Plus } from "lucide-react";
import useLeadExtra from "@/hooks/useLeadExtra";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/MultiSelect";

type CustomInputProps = {
  type:
    | "TEXTBOX"
    | "TEXTAREA"
    | "MULTI_CHOICE"
    | "SINGLE_CHOICE"
    | "COUNTRY"
    | "LANGUAGE";
  field: any;
  dataOptions?: any[];
};

export default function CustomInput({
  type,
  field,
  dataOptions,
}: CustomInputProps) {
  const formattedOptions = (dataOptions ?? []).map((opt) => {
    console.log("opt --- ", opt);
    return {
      label: opt?.value || "",
      value: opt?.value || "",
    };
  });

  console.log("formattedOptions", formattedOptions);

  const languages = [
    { label: "English (US)", value: "en", flag: "🇺🇸" },
    { label: "English (UK)", value: "en-uk", flag: "🇬🇧" },
    { label: "French", value: "fr", flag: "🇫🇷" },
    { label: "Spanish", value: "es", flag: "🇪🇸" },
    { label: "German", value: "de", flag: "🇩🇪" },
    { label: "Arabic (Dubai)", value: "ar-ae", flag: "🇦🇪" },
    { label: "Arabic (General)", value: "ar", flag: "🇸🇦" },
    { label: "Chinese (Simplified)", value: "zh-cn", flag: "🇨🇳" },
    { label: "Chinese (Traditional)", value: "zh-tw", flag: "🇹🇼" },
    { label: "Hindi", value: "hi", flag: "🇮🇳" },
    { label: "Portuguese (Brazil)", value: "pt-br", flag: "🇧🇷" },
    { label: "Portuguese (Portugal)", value: "pt", flag: "🇵🇹" },
    { label: "Russian", value: "ru", flag: "🇷🇺" },
    { label: "Japanese", value: "ja", flag: "🇯🇵" },
    { label: "Korean", value: "ko", flag: "🇰🇷" },
    { label: "Italian", value: "it", flag: "🇮🇹" },
    { label: "Dutch", value: "nl", flag: "🇳🇱" },
    { label: "Turkish", value: "tr", flag: "🇹🇷" },
    { label: "Swahili", value: "sw", flag: "🇰🇪" },
  ];

  const countries = [
    { label: "United States", value: "US", flag: "🇺🇸" },
    { label: "United Kingdom", value: "GB", flag: "🇬🇧" },
    { label: "Canada", value: "CA", flag: "🇨🇦" },
    { label: "Australia", value: "AU", flag: "🇦🇺" },

    // Africa
    { label: "Nigeria", value: "NG", flag: "🇳🇬" },
    { label: "Ghana", value: "GH", flag: "🇬🇭" },
    { label: "Kenya", value: "KE", flag: "🇰🇪" },
    { label: "South Africa", value: "ZA", flag: "🇿🇦" },
    { label: "Egypt", value: "EG", flag: "🇪🇬" },
    { label: "Morocco", value: "MA", flag: "🇲🇦" },

    // Europe
    { label: "France", value: "FR", flag: "🇫🇷" },
    { label: "Germany", value: "DE", flag: "🇩🇪" },
    { label: "Spain", value: "ES", flag: "🇪🇸" },
    { label: "Italy", value: "IT", flag: "🇮🇹" },
    { label: "Netherlands", value: "NL", flag: "🇳🇱" },
    { label: "Sweden", value: "SE", flag: "🇸🇪" },
    { label: "Switzerland", value: "CH", flag: "🇨🇭" },

    // Middle East
    { label: "United Arab Emirates (Dubai)", value: "AE", flag: "🇦🇪" },
    { label: "Saudi Arabia", value: "SA", flag: "🇸🇦" },
    { label: "Qatar", value: "QA", flag: "🇶🇦" },
    { label: "Kuwait", value: "KW", flag: "🇰🇼" },
    { label: "Israel", value: "IL", flag: "🇮🇱" },
    { label: "Turkey", value: "TR", flag: "🇹🇷" },

    // Asia
    { label: "China", value: "CN", flag: "🇨🇳" },
    { label: "India", value: "IN", flag: "🇮🇳" },
    { label: "Japan", value: "JP", flag: "🇯🇵" },
    { label: "South Korea", value: "KR", flag: "🇰🇷" },
    { label: "Indonesia", value: "ID", flag: "🇮🇩" },
    { label: "Thailand", value: "TH", flag: "🇹🇭" },
    { label: "Philippines", value: "PH", flag: "🇵🇭" },
    { label: "Vietnam", value: "VN", flag: "🇻🇳" },

    // Americas
    { label: "Brazil", value: "BR", flag: "🇧🇷" },
    { label: "Mexico", value: "MX", flag: "🇲🇽" },
    { label: "Argentina", value: "AR", flag: "🇦🇷" },
    { label: "Chile", value: "CL", flag: "🇨🇱" },
    { label: "Colombia", value: "CO", flag: "🇨🇴" },
    { label: "Peru", value: "PE", flag: "🇵🇪" },

    // More Africa
    { label: "Uganda", value: "UG", flag: "🇺🇬" },
    { label: "Tanzania", value: "TZ", flag: "🇹🇿" },
    { label: "Ethiopia", value: "ET", flag: "🇪🇹" },
    { label: "Rwanda", value: "RW", flag: "🇷🇼" },

    // Others
    { label: "New Zealand", value: "NZ", flag: "🇳🇿" },
    { label: "Singapore", value: "SG", flag: "🇸🇬" },
    { label: "Malaysia", value: "MY", flag: "🇲🇾" },
    { label: "Pakistan", value: "PK", flag: "🇵🇰" },
    { label: "Bangladesh", value: "BD", flag: "🇧🇩" },
  ];

  switch (type) {
    case "TEXTBOX":
      return <Input {...field} />;
      break;

    case "TEXTAREA":
      return <Textarea rows={6} {...field} />;
      break;

    case "SINGLE_CHOICE":
      return (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dataOptions &&
              [...dataOptions].map((option: any, i: number) => (
                <SelectItem key={`input__opt_${i}`} value={option?.value}>
                  {`${option?.value}`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      );
      break;

    case "MULTI_CHOICE":
      return (
        <MultiSelect
          options={formattedOptions}
          value={field.value || []}
          onValueChange={field.onChange}
          placeholder="Select one or more"
          variant="default"
          animation={2}
          maxCount={3}
        />
      );
      break;

    case "LANGUAGE":
      return (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>

          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;

    case "COUNTRY":
      return (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>

          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;

    default:
      return <Input {...field} />;
      break;
  }
}
