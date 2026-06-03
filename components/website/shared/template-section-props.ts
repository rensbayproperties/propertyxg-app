import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";

/** Shape returned by GET /listing/published-to-website */
export type PublishedListing = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  property_bedroom: string | null;
  property_bathroom: string | null;
  property_size: number | null;
  price: number | null;
  price_unit: string | null;
  price_type: string | null;
  max_price: number | null;
  dealType: string | null;
  address: string | null;
  locationId: string | null;
  imageUrl?: string | null;
  ref: string | null;
  images?: { id: string; url: string; file_type: string; caption: string | null }[] | null;
  amenities?: string | null;
  completionStatus?: string | null;
  furnished?: boolean | null;
  distress?: boolean | null;
  has_parking?: boolean | null;
  negotiable?: boolean | null;
  dxbProjectId?: number | null;
  listingCategoryId?: string | null;
};

export type TemplateSectionProps = {
  general: WebsiteGeneral;
  listings?: PublishedListing[];
};
