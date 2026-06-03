import { headers } from "next/headers";
import {
  fetchPublicWebsite,
  fetchPublishedListings,
  normalizeHostForApi,
} from "@/lib/publicWebsite.server";
import { SitePageShell } from "../_components/SitePageShell";
import SearchPageWrap from "./SearchPageWrap";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Featured Listings",
  description: "Explore our featured listings.",
};

export default async function SiteSearchPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    dealType?: string;
    locationId?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    bedroom?: string;
    bathroom?: string;
    search?: string;
    projectId?: string;
  };
}) {
  const result = await fetchPublicWebsite();
  if (!result.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Not Found</h1>
          <p className="mt-2 text-gray-600">We could not load the site settings.</p>
        </div>
      </div>
    );
  }

  const data = result.data;

  // Resolve tenant host for listings fetch
  const rawHost = headers().get("x-forwarded-host") || headers().get("host");
  const tenantHost = rawHost ? normalizeHostForApi(rawHost) : null;
  const listingsResult = tenantHost
    ? await fetchPublishedListings(tenantHost, searchParams)
    : { listings: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };

  return (
    <SitePageShell>
      <SearchPageWrap
        listings={listingsResult.listings}
        meta={listingsResult.meta}
        general={data.general}
      />
    </SitePageShell>
  );
}
