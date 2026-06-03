import type {
  WebsiteSectionId,
  WebsiteTemplateId,
} from "@/hooks/useWebsiteSettings";
import type { TemplateSectionProps } from "./shared/template-section-props";
import { MODERN_SECTIONS } from "./modern/ModernSections";
import { CLASSIC_SECTIONS } from "./classic/ClassicSections";
import { MINIMAL_SECTIONS } from "./minimal/MinimalSections";
import { LUXE_SECTIONS } from "./luxe/LuxeSections";
import { BOLD_SECTIONS } from "./bold/BoldSections";
import type { ComponentType } from "react";

export type SectionRegistry = Record<
  WebsiteSectionId,
  ComponentType<TemplateSectionProps>
>;

export function getSectionRegistry(template: WebsiteTemplateId): SectionRegistry {
  switch (template) {
    case "modern":
      return MODERN_SECTIONS;
    case "classic":
      return CLASSIC_SECTIONS;
    case "minimal":
      return MINIMAL_SECTIONS;
    case "luxe":
      return LUXE_SECTIONS;
    case "bold":
      return BOLD_SECTIONS;
  }
}
