import type { AxiosError, AxiosInstance } from "axios";

/**
 * Contract §1.1: `NEXT_PUBLIC_API_URL`. This repo historically used
 * `NEXT_PUBLIC_BACKEND_API`; both are supported so env matches the guide
 * without breaking existing deployments.
 */
export const getWebsiteApiBaseUrl = (): string => {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_API?.trim() ||
    "";
  return raw.replace(/\/+$/, "");
};

export const ALLOWED_TEMPLATES = [
  "modern",
  "classic",
  "minimal",
  "luxe",
  "bold",
] as const;
export type WebsiteTemplateName = (typeof ALLOWED_TEMPLATES)[number];

export const TEMPLATE_SECTION_IDS = [
  "hero",
  "features",
  "about",
  "listings",
  "testimonials",
  "cta",
  "contact",
] as const;
export type WebsiteSectionId = (typeof TEMPLATE_SECTION_IDS)[number];

export type WebsiteTemplateSection = {
  id: WebsiteSectionId;
  enabled: boolean;
  order: number;
};

export type WebsiteTemplateSettings = {
  selectedTemplate: WebsiteTemplateName;
  sections: WebsiteTemplateSection[];
};

export type WebsitePagesVisibility = {
  about: boolean;
  contact: boolean;
  blogs: boolean;
  "dxb-projects": boolean;
  "dxb-transactions": boolean;
};

export type WebsitePagesSettings = {
  visibility: WebsitePagesVisibility;
};

export type WebsiteSocials = {
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  x: string | null;
};

export type WebsiteGeneralInfo = {
  siteName: string;
  tagline: string;
  about: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  socials: WebsiteSocials;
};

export type CustomDomainStatus = "pending" | "verified" | "failed";

export type DnsInstruction = {
  cname: { type: "CNAME"; name: string; value: string };
  txt: { type: "TXT"; name: string; value: string };
};

export type DnsRecord =
  | { type: "CNAME"; host: string; value: string }
  | { type: "A"; host: "@"; value: string }
  | { type: "TXT"; host: string; value: string };

export type CustomDomain = {
  id: string;
  domain: string;
  status: CustomDomainStatus;
  verificationToken: string;
  verifiedAt: string | null;
  lastCheckAt: string | null;
  addedAt: string;
  dnsInstructions: DnsInstruction;
  dns: DnsRecord[];
};

export type WebsiteDomains = {
  subdomain: string;
  rootDomain: string;
  customDomains: CustomDomain[];
};

export type PublicWebsiteData = {
  tenant: {
    subdomain: string;
    company: { id: string; name: string };
  };
  general: WebsiteGeneralInfo;
  template: WebsiteTemplateSettings;
  pages: WebsitePagesSettings;
};

export type UpdateGeneralInfoBody = {
  siteName?: string;
  tagline?: string;
  about?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    x?: string;
  };
};

export type UpdateTemplateBody = {
  selectedTemplate: WebsiteTemplateName;
  sections: WebsiteTemplateSection[];
};

export type UpdatePagesBody = {
  visibility: WebsitePagesVisibility;
};

export type UpdateSubdomainBody = { subdomain: string };
export type CreateCustomDomainBody = { domain: string };

export type WebsiteErrorCode =
  | "VALIDATION"
  | "CONFLICT"
  | "NOT_FOUND"
  | "HTTP_ERROR"
  | "INTERNAL";

export type FieldError = { field: string; errors: string[] };

export class WebsiteApiError extends Error {
  code: WebsiteErrorCode;
  fieldErrors?: FieldError[];

  constructor(
    code: WebsiteErrorCode,
    message: string,
    fieldErrors?: FieldError[],
  ) {
    super(message);
    this.name = "WebsiteApiError";
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

type ApiEnvelope<T> =
  | { status: "success"; message: string; data: T; error: null }
  | {
      status: "error";
      message: string;
      data: null;
      error: WebsiteErrorCode;
    };

type AxiosLike = Pick<AxiosInstance, "get" | "post" | "patch" | "delete">;

const unwrap = <T>(envelope: unknown): T => {
  const body = envelope as ApiEnvelope<T> | undefined;
  if (!body || typeof body !== "object" || !("status" in body)) {
    throw new WebsiteApiError("INTERNAL", "Malformed response from server");
  }
  if (body.status === "error") {
    throw new WebsiteApiError(
      body.error ?? "INTERNAL",
      body.message || "Request failed",
    );
  }
  if (body.status === "success") {
    if (body.data === null || body.data === undefined) {
      throw new WebsiteApiError("INTERNAL", "Success response missing data");
    }
    return body.data;
  }
  throw new WebsiteApiError("INTERNAL", "Unexpected response from server");
};

const toApiError = (err: unknown): WebsiteApiError => {
  if (err instanceof WebsiteApiError) return err;
  const axiosErr = err as AxiosError<unknown>;
  const status = axiosErr?.response?.status;
  const data = axiosErr?.response?.data as
    | {
        status?: string;
        error?: WebsiteErrorCode;
        message?: string;
        errors?: FieldError[];
      }
    | undefined;

  if (status === 400 && data && Array.isArray(data.errors)) {
    return new WebsiteApiError(
      "VALIDATION",
      data.message || "Validation failed",
      data.errors,
    );
  }

  if (data && typeof data === "object" && data.status === "error") {
    return new WebsiteApiError(
      data.error ?? "INTERNAL",
      data.message || "Request failed",
    );
  }

  if (status === 401 || status === 403) {
    return new WebsiteApiError(
      "HTTP_ERROR",
      "You are not authorized to perform this action",
    );
  }

  if (status === 404) {
    const msg =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message || "")
        : "") || "Not found";
    return new WebsiteApiError("NOT_FOUND", msg);
  }

  if (status === 409) {
    const msg =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message || "")
        : "") || "Conflict";
    return new WebsiteApiError("CONFLICT", msg);
  }

  return new WebsiteApiError(
    "INTERNAL",
    (err as Error)?.message || "Network error",
  );
};

const wrap = async <T>(promise: Promise<{ data: unknown }>): Promise<T> => {
  try {
    const res = await promise;
    return unwrap<T>(res?.data);
  } catch (err) {
    throw toApiError(err);
  }
};

export const websiteApi = (http: AxiosLike) => ({
  getGeneral: () =>
    wrap<WebsiteGeneralInfo>(http.get("/website/general")),

  patchGeneral: (body: UpdateGeneralInfoBody) =>
    wrap<WebsiteGeneralInfo>(http.patch("/website/general", body)),

  getTemplate: () =>
    wrap<WebsiteTemplateSettings>(http.get("/website/template")),

  patchTemplate: (body: UpdateTemplateBody) =>
    wrap<WebsiteTemplateSettings>(http.patch("/website/template", body)),

  getPages: () => wrap<WebsitePagesSettings>(http.get("/website/pages")),

  patchPages: (body: UpdatePagesBody) =>
    wrap<WebsitePagesSettings>(http.patch("/website/pages", body)),

  getDomains: () => wrap<WebsiteDomains>(http.get("/website/domains")),

  patchSubdomain: (body: UpdateSubdomainBody) =>
    wrap<WebsiteDomains>(http.patch("/website/domains/subdomain", body)),

  addCustomDomain: (body: CreateCustomDomainBody) =>
    wrap<WebsiteDomains>(http.post("/website/domains/custom", body)),

  removeCustomDomain: (id: string) =>
    wrap<WebsiteDomains>(http.delete(`/website/domains/custom/${id}`)),

  verifyCustomDomain: (id: string) =>
    wrap<WebsiteDomains>(http.post(`/website/domains/custom/${id}/verify`)),
});

export type WebsiteApiClient = ReturnType<typeof websiteApi>;

const SUBDOMAIN_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "admin",
  "api",
  "nic",
  "whois",
  "mail",
  "example",
  "test",
  "localhost",
  "invalid",
]);

export const validateSubdomain = (raw: string): string | null => {
  const slug = raw.trim().toLowerCase();
  if (!slug) return "Enter a subdomain";
  if (!SUBDOMAIN_REGEX.test(slug)) {
    return "Use 1–32 lowercase letters, numbers, or hyphens. Cannot start or end with a hyphen.";
  }
  if (slug.length === 2) {
    return "Two-character subdomains are reserved";
  }
  if (
    slug.length >= 4 &&
    slug[2] === "-" &&
    slug[3] === "-" &&
    !slug.startsWith("xn--")
  ) {
    return "Tagged labels (with hyphens in 3rd/4th position) are reserved";
  }
  if (RESERVED_SUBDOMAINS.has(slug)) {
    return "This subdomain is reserved";
  }
  return null;
};

const FQDN_REGEX =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export const validateCustomDomain = (raw: string): string | null => {
  const domain = raw.trim().toLowerCase();
  if (!domain) return "Enter a domain";
  if (!FQDN_REGEX.test(domain)) {
    return "Enter a valid domain (e.g. www.example.com)";
  }
  return null;
};

export const densifyTemplateSections = (
  sections: WebsiteTemplateSection[],
): WebsiteTemplateSection[] =>
  [...sections]
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({ ...s, order: i }));

/**
 * Client-side guard matching PATCH /website/template validation (contract §3.4).
 * Returns an English message if invalid; otherwise null.
 */
export const validateTemplateSections = (
  sections: WebsiteTemplateSection[],
): string | null => {
  const n = TEMPLATE_SECTION_IDS.length;
  if (sections.length !== n) {
    return `Sections must include exactly ${n} entries (one per id).`;
  }
  const ids = sections.map((s) => s.id);
  if (new Set(ids).size !== ids.length) {
    return "Each section id must appear exactly once.";
  }
  for (const id of TEMPLATE_SECTION_IDS) {
    if (!ids.includes(id)) {
      return `Missing required section id: ${id}.`;
    }
  }
  const dense = densifyTemplateSections(sections);
  for (const s of dense) {
    if (typeof s.enabled !== "boolean") {
      return "Each section must have a boolean enabled flag.";
    }
    if (!Number.isInteger(s.order)) {
      return "Each section order must be an integer.";
    }
  }
  for (let i = 0; i < dense.length; i++) {
    if (dense[i].order !== i) {
      return "Section order must be dense from 0 to N-1.";
    }
  }
  return null;
};

export const DEFAULT_GENERAL_INFO: WebsiteGeneralInfo = {
  siteName: "Your Company",
  tagline: "Real estate, simplified.",
  about: null,
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#0166FF",
  contactEmail: null,
  contactPhone: null,
  address: null,
  socials: { instagram: null, linkedin: null, facebook: null, x: null },
};

export const DEFAULT_TEMPLATE_SETTINGS: WebsiteTemplateSettings = {
  selectedTemplate: "modern",
  sections: [
    { id: "hero", enabled: true, order: 0 },
    { id: "features", enabled: true, order: 2 },
    { id: "about", enabled: true, order: 1 },
    { id: "listings", enabled: true, order: 3 },
    { id: "testimonials", enabled: false, order: 4 },
    { id: "cta", enabled: true, order: 5 },
    { id: "contact", enabled: true, order: 6 },
  ],
};

export const DEFAULT_PAGES_SETTINGS: WebsitePagesSettings = {
  visibility: {
    about: true,
    contact: true,
    blogs: false,
    "dxb-projects": true,
    "dxb-transactions": false,
  },
};

export const DEFAULT_DOMAINS: WebsiteDomains = {
  subdomain: "",
  rootDomain: "",
  customDomains: [],
};
