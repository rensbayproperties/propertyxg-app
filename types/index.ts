import { Icons } from "@/components/icons";
import { StringNullableChain } from "lodash";

export interface CommonApiResponse<T = {}> {
  status: string;
  message?: string | null;
  data?: T;
  error?: string | null;
}

export interface Teammembers {
  id: number;
  role: string;
  name: string;
  status: string;
  email: string;
  user_type: string;
  avatar: string;
}
export interface Location {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parent: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface LocationResponse {
  status: string;
  message: string | null;
  data: {
    locations: Location[];
    total: number;
  };
  error: null;
}

export interface Project {
  id: string;
  project_id?: number;
  project_number?: number;
  project_name?: string;
  developer_id?: number;
  developer_number?: number;
  developer_name?: string;
  master_developer_id?: number;
  master_developer_number?: number;
  master_developer_name?: string;
  project_start_date?: string;
  project_end_date?: string;
  project_type_id?: number;
  project_classification_id?: number;
  project_classification_ar?: string;
  escrow_agent_id?: number;
  escrow_agent_name?: string;
  project_status?: string;
  percent_completed?: number;
  completion_date?: string;
  cancellation_date?: string;
  project_description_ar?: string;
  project_description_en?: string;
  property_id?: number;
  area_id?: number;
  area_name_en?: string;
  master_project_ar?: string;
  master_project_en?: string;
  zoning_authority_id?: number;
  zoning_authority_ar?: string;
  zoning_authority_en?: string;
  no_of_lands?: number;
  no_of_buildings?: number;
  no_of_villas?: number;
  no_of_units?: number;
  developer_name_en?: string;
  project_name_en: string;
  images?: string;
}


export interface NavItem {
  pages: "*" | string[];
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

// Role related types
export interface Role {
  id: number;
  name: string;
  role_description: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface CreateRoleRequest {
  name: string;
  role_description: string;
}

export interface CreateRoleResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    id: string;
    created_on: string;
    last_updated_on: string;
    name: string;
    description: string;
    companyId: string;
  };
  timestamp: string;
}

export interface RoleFormData {
  name: string;
  role_description: string;
}

export interface RolesListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    roles: Role[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
    };
  };
  timestamp: string;
}

export interface RolesListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Role data structure with permissions matching backend response
export interface RoleData {
  id: any;
  role_type: string;
  name: string;
  role_receive_leads: number;
  role_tickets: number;
  role_all_tickets: number;
  role_assigned_tickets: number;
  role_add_ticket: number;
  role_add_leads: number;
  role_manage_leads: number;
  role_add_inventories: number;
  role_manage_inventories: number;
  role_manage_approvals: number;
  role_add_roles: number;
  role_manage_roles: number;
  role_invite_users: number;
  role_is_agent: number;
  role_can_view_leads_confidential: number;
  role_can_view_list_confidential: number;
  role_add_locations: number;
  role_manage_locations: number;
  role_dncr: number;
  role_all_leads: number;
  role_all_inventories: number;
  role_manage_contacts: number;
  role_manage_properties: number;
  role_manage_rent: number;
  role_manage_tenants: number;
  role_add_landing: number;
  role_manage_landing: number;
  role_add_dxb_project: number;
  role_manage_dxb_projects: number;
  role_manage_referral_leads: number;
  role_manage_users: number;
}

// API Response wrapper for roles
export interface RoleDataResponse {
  status: string;
  message: string;
  data: RoleData[];
}

export interface TicketData {
  id: string;
  subject: string;
  message: string;
  priority: string;
  created_on: string | null;
  status: string;
  creatorid: string;
  last_updated_by: number;
  close_by: string;
  assigned_role: {
    name: string;
  };
  assigned_to: [string];
  firstComment: any;
}

export interface LeadData {
  id: string;
  ref: number;
  full_name: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  lead_status?: string | null;
  whatsapp?: string | null;
  created_on: string;
  status: string;
  lead_assigned: [string];
  firstComment: any;
  source: string | null;
  user: {
    first_name: string;
    last_name: string;
  };
}

export interface ListingsColumns {
  id: string;
  ref: string;
  ad_type: string;
  property_status: string;
  status: string;
  slug: string;
  title: string;
  content: string;
  listing_categories: string;
  listing_locations: string;
  rtcl_listing_pricing: string;
  add_to_mail_list: boolean;
  price: number;
  max_price: number | null;
  pricing: string;
  price_unit: string;
  address: string;
  phone: string;
  rtcl_whatsapp_number: string;
  email: string;
  latitude: string;
  longitude: string;
  expiry_date: string;
  date: string;
  created_on: string;
  has_parking: "yes" | "no";
  property_bedroom: string | null;
  property_bathroom: string | null; // null if not provided
  property_size: number | null;
  property_year: string | null;
  developer: string | null;
  handover_date: string | null;
  completionStatus: string | null;
  furnished: boolean | null;
  distres: boolean | null;
  dealType: string;
  images: string[]; // array of image URLs
  list_amenities: string[];
  assigned: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  uploader: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  location: {
    name: string | null;
    slug: string | null;
  };
  category: {
    name: string;
  };
}
export interface InquiriesColumns {
  id: number;
  completionStatus: string;
  name: string;
  note: string;
  furnished: boolean;
  distres: boolean;
  listing_categories: string;
  listing_locations: string;
  min_budget: string;
  max_budget: string | null;
  address: string;
  phone: string;
  rtcl_whatsapp_number: string;
  date: string;
  created_on: string;
  has_parking: "yes" | "no";
  property_bedroom: string | null;
  property_bathroom: string | null; // null if not provided
  size: number | null;
  dealType: string;
  location: {
    id: string;
    name: string;
  };
  uploader: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  category: {
    name: string;
  };
}

export interface ApprovalRequest {
  id: number;
  approval_type: string;
  approval_type_id: string;
  payload: {
    prev: string;
    new: string;
  };
  status: string;
  created_on: string;
  updated_on: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface RequestCredentials {
  id: number;
  status: string;
}

export interface LeadImportColumnOption {
  key: string;
  label: string;
  /** When true, the user must map this target before import. Set by `normalizeLeadImportColumn` / API parsing. */
  required?: boolean;
  type?: "string" | "number" | "email" | "phone" | "date" | "array";
  description?: string;
  example?: string;
  /** When true, `data` lists allowed related records (amenities, locations, categories, …). */
  hasRelationship?: boolean;
  /** Nested options from GET /listing-import/columns for relationship fields. */
  data?: Record<string, unknown>[];
}

export interface LeadImportSheetPreview {
  sheetName: string;
  headers: string[];
  rows: Record<string, string>[];
}

export interface LeadImportFilePreview {
  fileName: string;
  fileSize: number;
  sheetNames: string[];
  sheets: LeadImportSheetPreview[];
}

export interface LeadImportMappingPair {
  sourceColumn: string;
  targetColumn: string;
}

export interface AmenityMappingPair {
  sourceValue: string;
  targetAmenityId: string;
}

/** Maps a distinct spreadsheet token to the backend id/name for that relationship column. */
export interface RelationshipValueMapping {
  sourceValue: string;
  targetId: string;
}

export interface LeadImportPayload {
  fileMeta: {
    fileName: string;
    fileSize: number;
  };
  sheetName: string;
  mappings: LeadImportMappingPair[];
  /** Keys match import column keys, e.g. `amenities`, `location`, `category`. */
  relationshipMappings?: Record<string, RelationshipValueMapping[]>;
  /** @deprecated Prefer relationshipMappings.amenities; kept for older APIs. */
  amenityMappings?: AmenityMappingPair[];
  /**
   * **Bulk import (current flow):** must be the **string `id`** returned from `POST /media/upload/single`
   * (`response.data.data.id`). The backend reads the file from that media record — do **not** send row objects here.
   * (Union allows legacy preview-row arrays if needed elsewhere.)
   */
  rowsPreview: string | unknown[];
}

export interface LeadImportResult {
  status: string;
  message: string;
  data?: {
    importedRows: number;
    skippedRows: number;
    totalRows: number;
  };
}

/** Lead bulk import: upload file to `/media/upload/single`, then POST `/lead-import` with `rowsPreview` = media id. */
export interface LeadImportMutationInput {
  file: File;
  fileMeta: LeadImportFilePreview;
  sheetName: string;
  mapping: Record<string, string>;
  /** Optional relationship maps, e.g. `users` for assignees. */
  relationshipMappings?: Record<string, RelationshipValueMapping[]>;
}

/** Listing bulk import: same upload + `rowsPreview` = media id; optional relationship maps unchanged. */
export interface ListingImportMutationInput extends LeadImportMutationInput {
  relationshipMappings?: Record<string, RelationshipValueMapping[]>;
  amenityMappings?: AmenityMappingPair[];
}

export interface ConnectorData {
  id: string;
  connector_type: string;
  name: string;
  created_on: string | null;
  status: string;
  companyId: string;
}
export interface CustomSettingsData {
  id: string;
  label: string;
  type: string;
  inputType: string;
  required: boolean;
  section: string;
  status: string;
  created_on: string | null
  user: {
    first_name: string;
    last_name: string;
  };
}

export interface ListCampaigns {
  id: string;
  title: string;
  caption: string;
  starting_price: number;
  content?: string | undefined;
  status?: string | undefined;
  pixel_id?: string | undefined;
  google_tag_id?: string | undefined;
  amenities?: string | undefined;
  meta_keywords?: string | undefined;
  meta_description?: string | undefined;
  project_details?: string | undefined;
  campaignTemplateId?: string | undefined;
  created_on?: string | undefined;
  slug?: string | undefined
}

export interface DncrHistoryColumns {
  id: number;
  number: string;
  status: boolean;
  response: string | null;
  checked_on: string;
}

export interface ContactColumns {
  id: number;
  interest: string;
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  description: string | null;
  created_on: string;
  user: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
}

export interface DxbProject {
  id: number;
  project_id: number;
  project_number: number;
  project_name: string;
  developer_id: number;
  developer_number: number;
  developer_name: string;
  master_developer_id: number;
  master_developer_number: number;
  master_developer_name: string;
  project_start_date: string;
  project_end_date: string;
  project_type_id: number;
  project_classification_id: number;
  project_classification_ar: string | null;
  escrow_agent_id: number;
  escrow_agent_name: string;
  project_status: string;
  percent_completed: number;
  completion_date: string;
  cancellation_date: string | null;
  project_description_ar: string | null;
  project_description_en: string;
  property_id: number;
  area_id: number;
  area_name_en: string;
  master_project_ar: string | null;
  master_project_en: string;
  zoning_authority_id: number;
  zoning_authority_ar: string | null;
  zoning_authority_en: string;
  no_of_lands: number;
  no_of_buildings: number;
  no_of_villas: number;
  no_of_units: number;
  developer_name_en: string;
  project_name_en: string;
  images: string | null;
  status: string;
}

export interface DxbTransaction {
  id?: number;
  transaction_id: string;
  trans_group_en: string;
  procedure_name_en: string;
  instance_date: string;
  property_type_en: string;
  property_sub_type_en: string;
  property_usage_en: string;
  reg_type_en: string;
  area_name_en: string;
  building_name_en: string;
  project_number: number | null;
  project_name_en: string;
  master_project_en: string;
  nearest_metro_en: string;
  nearest_mall_en: string;
  rooms_en: string;
  has_parking: number;
  procedure_area: number;
  actual_worth: number;
  meter_sale_price: number;
  rent_value: number | null;
  meter_rent_price: number | null;
  status?: string;
}

// Notification related types
export enum NotificationSource {
  TICKET_ASSIGNED = "TICKET_ASSIGNED",
  LEAD_ASSIGNED = "LEAD_ASSIGNED",
  SYSTEM = "SYSTEM",
  OTHER = "OTHER",
}

export interface Notification {
  id: string;
  source: NotificationSource;
  sourceId: string;
  created_on: string;
  read_on: string | null;
  userId: string;
  companyId: string;
  meta?: any;
}

export interface NotificationsApiResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
}

export enum FileEntity {
  LISTING = "LISTING",
  LEAD = "LEAD",
  CAMPAIGN = "CAMPAIGN",
}
export interface PropertyColumns {
  id: number;
  status: string;
  address: string;
  created_on: string;
  assigned_landlord: {
    id: number;
    name: string | null;
    avatar: string | null;
    email: string | null;
    status: string;
  };
  uploader: {
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  location: {
    name: string | null;
    slug: string | null;
  };
  units: [];
}

export interface Landlord {
  id: string;
  name: string;
  email: string;
}

export interface CampaignDetailsResponse {
  title: string;
  date: string;
  locationId?: string
  template?: string;
  content?: string;
  project_details?: string;
  location_details?: string;
  pixel_id?: string;
  tag_id?: string;
  images: string[];
  meta_description: string;
  meta_keywords: string;
  price: number;
  amenities?: string[];
  slug: string;
  address?: string;
  property_size: string
  property_bedroom: string
  has_parking: string
  property_bathroom: string
  property_year: string
  latitude: string
  longitude: string

}

export interface TenantColumns {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_on: string;
  user: {
    username: string;
  };
  unit: {
    name: string;
  };
  property: {
    address: string;
    assigned: {
      id: number;
      first_name: string;
      last_name: string;
      avatar: string | null;
    };
  };
}

export interface ChargeColumns {
  id: string;
  name: string;
  description?: string | null;
  type: "One-off" | "Recurring" | string;
}

export interface RentColumns {
  id: string;
  amount: number;
  start_date: string;
  end_date: string;
  tenants?: {
    first_name?: string;
    last_name?: string;
  } | null;
  property?: {
    address?: string;
  } | null;
  unit?: {
    name?: string;
  } | null;
}
