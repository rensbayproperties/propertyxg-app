"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";
import {
  WebsiteApiError,
  websiteApi,
  densifyTemplateSections,
  validateTemplateSections,
  DEFAULT_DOMAINS,
  DEFAULT_GENERAL_INFO,
  DEFAULT_PAGES_SETTINGS,
  DEFAULT_TEMPLATE_SETTINGS,
  type CustomDomain,
  type CustomDomainStatus,
  type CreateCustomDomainBody,
  type UpdateGeneralInfoBody,
  type UpdatePagesBody,
  type UpdateSubdomainBody,
  type UpdateTemplateBody,
  type WebsiteDomains,
  type WebsiteGeneralInfo,
  type WebsitePagesSettings,
  type WebsitePagesVisibility,
  type WebsiteSectionId,
  type WebsiteSocials,
  type WebsiteTemplateName,
  type WebsiteTemplateSection,
  type WebsiteTemplateSettings,
} from "@/lib/websiteApi";

export type WebsiteGeneral = WebsiteGeneralInfo;
export type WebsiteCustomDomain = CustomDomain;
export type WebsitePageKey = keyof WebsitePagesVisibility;
export type WebsiteTemplateId = WebsiteTemplateName;
export {
  type WebsiteDomains,
  type WebsitePagesSettings,
  type WebsitePagesVisibility,
  type WebsiteSectionId,
  type WebsiteSocials,
  type WebsiteTemplateSection,
  type WebsiteTemplateSettings,
  type CustomDomainStatus,
};

export const DEFAULT_GENERAL = DEFAULT_GENERAL_INFO;
export const DEFAULT_TEMPLATE = DEFAULT_TEMPLATE_SETTINGS;
export const DEFAULT_PAGES = DEFAULT_PAGES_SETTINGS;
export { DEFAULT_DOMAINS };

export const WEBSITE_QUERY_KEYS = {
  general: ["website", "general"] as const,
  domains: ["website", "domains"] as const,
  template: ["website", "template"] as const,
  pages: ["website", "pages"] as const,
};

const errorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof WebsiteApiError) {
    const base = err.message || fallback;
    const first = err.fieldErrors?.[0];
    if (first?.errors?.length) {
      return `${base} (${first.field}: ${first.errors.join(", ")})`;
    }
    return base;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};

const useWebsiteClient = () => {
  const axiosAuth = useAxiosAuth();
  return useMemo(() => websiteApi(axiosAuth), [axiosAuth]);
};

export const useWebsiteGeneral = () => {
  const api = useWebsiteClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: WEBSITE_QUERY_KEYS.general,
    queryFn: () => api.getGeneral(),
  });

  const mutation = useMutation({
    mutationFn: (body: UpdateGeneralInfoBody) => api.patchGeneral(body),
    onSuccess: (data) => {
      queryClient.setQueryData(WEBSITE_QUERY_KEYS.general, data);
      toast.success("General settings saved");
    },
    onError: (err) =>
      toast.error(errorMessage(err, "Could not save settings")),
  });

  return {
    data: query.data ?? DEFAULT_GENERAL_INFO,
    isLoading: query.isLoading,
    error: query.error as WebsiteApiError | null,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
};

export const useWebsiteDomains = () => {
  const api = useWebsiteClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: WEBSITE_QUERY_KEYS.domains,
    queryFn: () => api.getDomains(),
  });

  const setDomainsCache = (next: WebsiteDomains) => {
    queryClient.setQueryData(WEBSITE_QUERY_KEYS.domains, next);
  };

  const updateSubdomain = useMutation({
    mutationFn: (body: UpdateSubdomainBody) => api.patchSubdomain(body),
    onSuccess: (data) => {
      setDomainsCache(data);
      toast.success("Subdomain updated. DNS may take a few minutes to propagate.");
    },
    onError: (err) =>
      toast.error(errorMessage(err, "Could not update subdomain")),
  });

  const addCustomDomain = useMutation({
    mutationFn: (body: CreateCustomDomainBody) => api.addCustomDomain(body),
    onSuccess: (data) => {
      setDomainsCache(data);
      toast.success("Custom domain added");
    },
    onError: (err) =>
      toast.error(errorMessage(err, "Could not add domain")),
  });

  const removeCustomDomain = useMutation({
    mutationFn: (id: string) => api.removeCustomDomain(id),
    onSuccess: (data) => {
      setDomainsCache(data);
      toast.success("Custom domain removed");
    },
    onError: (err) =>
      toast.error(errorMessage(err, "Could not remove domain")),
  });

  const verifyCustomDomain = useMutation({
    mutationFn: (id: string) => api.verifyCustomDomain(id),
    onSuccess: (data, id) => {
      setDomainsCache(data);
      const match = data.customDomains.find((d) => d.id === id);
      if (match?.status === "verified") {
        toast.success("Domain verified");
      } else if (match?.status === "failed") {
        toast.error("Verification failed. Double-check your DNS records and try again.");
      } else {
        toast.message("Verification check completed");
      }
    },
    onError: (err) =>
      toast.error(errorMessage(err, "Verification check failed")),
  });

  return {
    data: query.data ?? DEFAULT_DOMAINS,
    isLoading: query.isLoading,
    error: query.error as WebsiteApiError | null,
    updateSubdomain: updateSubdomain.mutateAsync,
    addCustomDomain: addCustomDomain.mutateAsync,
    removeCustomDomain: removeCustomDomain.mutateAsync,
    verifyCustomDomain: verifyCustomDomain.mutateAsync,
    isMutating:
      updateSubdomain.isPending ||
      addCustomDomain.isPending ||
      removeCustomDomain.isPending ||
      verifyCustomDomain.isPending,
  };
};

export const useWebsiteTemplate = () => {
  const api = useWebsiteClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: WEBSITE_QUERY_KEYS.template,
    queryFn: () => api.getTemplate(),
  });

  const mutation = useMutation({
    mutationFn: (values: WebsiteTemplateSettings) => {
      const validation = validateTemplateSections(values.sections);
      if (validation) {
        throw new WebsiteApiError("VALIDATION", validation);
      }
      const body: UpdateTemplateBody = {
        selectedTemplate: values.selectedTemplate,
        sections: densifyTemplateSections(values.sections),
      };
      return api.patchTemplate(body);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(WEBSITE_QUERY_KEYS.template, data);
      toast.success("Template saved");
    },
    onError: (err) =>
      toast.error(errorMessage(err, "Could not save template")),
  });

  return {
    data: query.data ?? DEFAULT_TEMPLATE_SETTINGS,
    isLoading: query.isLoading,
    error: query.error as WebsiteApiError | null,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
};

export const useWebsitePages = () => {
  const api = useWebsiteClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: WEBSITE_QUERY_KEYS.pages,
    queryFn: () => api.getPages(),
  });

  const mutation = useMutation({
    mutationFn: (body: UpdatePagesBody) =>
      api.patchPages({
        visibility: {
          ...DEFAULT_PAGES_SETTINGS.visibility,
          ...body.visibility,
        },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(WEBSITE_QUERY_KEYS.pages, data);
      toast.success("Pages updated");
    },
    onError: (err) =>
      toast.error(errorMessage(err, "Could not save pages")),
  });

  return {
    data: query.data ?? DEFAULT_PAGES_SETTINGS,
    isLoading: query.isLoading,
    error: query.error as WebsiteApiError | null,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
};
