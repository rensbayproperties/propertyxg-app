import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import type {
  WebsitePageKey,
  WebsiteSectionId,
} from "@/hooks/useWebsiteSettings";
// import { WebsiteTemplate } from ;
import {
  fetchPublicWebsite,
  fetchPublishedListings,
  normalizeHostForApi,
  type PublicWebsiteFetchFailure,
} from "@/lib/publicWebsite.server";
import { WebsiteTemplate } from "@/components/website/WebsiteTemplate";

export const dynamic = "force-dynamic";

interface SitePageShellProps {
  pageKey?: WebsitePageKey;
  onlySection?: WebsiteSectionId;
  children?: React.ReactNode;
}

const failureCopy: Record<
  PublicWebsiteFetchFailure,
  { title: string; description: string }
> = {
  missing_api_url: {
    title: "Site not configured",
    description:
      "The public site cannot reach the API. Set NEXT_PUBLIC_API_URL (or NEXT_PUBLIC_BACKEND_API) on the frontend deployment.",
  },
  missing_host: {
    title: "Site not found",
    description: "No host header was received for this request.",
  },
  unresolvable_host: {
    title: "Site not found",
    description:
      "Open your site on your tenant subdomain or verified custom domain, not the main CRM app URL or plain localhost.",
  },
  not_found: {
    title: "Site not found",
    description:
      "No website is registered for this address. Check the subdomain in Website → Domains, or verify your custom domain is verified.",
  },
  network_error: {
    title: "Could not load site",
    description:
      "The server could not reach the API. Check that the API URL is correct and reachable from your hosting environment.",
  },
  invalid_json: {
    title: "Could not load site",
    description: "The API returned an unexpected response.",
  },
  api_error: {
    title: "Could not load site",
    description: "The API returned an error while loading this site.",
  },
};

const NotFound = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="min-h-screen bg-white">
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      <Link
        href="/site"
        className="mt-6 inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted"
      >
        Back to home
      </Link>
    </div>
  </div>
);

export const SitePageShell = async ({
  pageKey,
  onlySection,
  children,
}: SitePageShellProps) => {
  const result = await fetchPublicWebsite();

  if (!result.ok) {
    const copy = failureCopy[result.reason];
    const description = result.detail
      ? `${copy.description} (${result.detail})`
      : copy.description;
    return <NotFound title={copy.title} description={description} />;
  }

  const data = result.data;

  if (pageKey && !data.pages.visibility[pageKey]) {
    return (
      <NotFound
        title="Page not available"
        description="The owner of this site has hidden this page."
      />
    );
  }

  // Resolve tenant host for listings fetch
  const rawHost =
    headers().get("x-forwarded-host") || headers().get("host");
  const tenantHost = rawHost ? normalizeHostForApi(rawHost) : null;
  const listingsResult = tenantHost
    ? await fetchPublishedListings(tenantHost, { limit: 100 })
    : { listings: [] };
  const listings = listingsResult.listings;

  return (
    <WebsiteTemplate
      template={data.template.selectedTemplate}
      sections={data.template.sections}
      general={data.general}
      onlySection={onlySection}
      listings={listings}
    >
      {children}
    </WebsiteTemplate>
  );
};
