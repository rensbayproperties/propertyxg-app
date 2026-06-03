import { headers } from "next/headers";
import {
  fetchPublicWebsite,
  fetchPublishedListings,
  fetchPublicListingDetail,
  normalizeHostForApi,
} from "@/lib/publicWebsite.server";
import { SitePageShell } from "../../_components/SitePageShell";
import ListingDetailPageWrap from "./ListingDetailPageWrap";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const result = await fetchPublicWebsite();
  if (!result.ok) return { title: "Listing Details" };

  const rawHost = headers().get("x-forwarded-host") || headers().get("host");
  const tenantHost = rawHost ? normalizeHostForApi(rawHost) : null;
  const listing = tenantHost ? await fetchPublicListingDetail(params.id, tenantHost) : null;

  return {
    title: listing?.title || "Listing Details",
    description: listing?.description || "View details of this listing.",
  };
}

export default async function SiteListingDetailPage({
  params,
}: {
  params: { id: string };
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

  // Fetch listing detail and all listings for recommendations in parallel
  const [listing, listingsData] = tenantHost
    ? await Promise.all([
        fetchPublicListingDetail(params.id, tenantHost),
        fetchPublishedListings(tenantHost, { limit: 12 }),
      ])
    : [null, { listings: [] }];
  const listings = listingsData.listings;

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-white font-sans">
        <div>
          <p className="text-sm font-bold text-red-600 uppercase tracking-widest">
            404
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Listing Not Found</h1>
          <p className="mt-2 text-gray-600">
            The property listing you are trying to view does not exist or has been unpublished.
          </p>
          <a
            href="/site/search"
            className="mt-6 inline-flex rounded-xl bg-brand text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand/90 transition no-underline"
          >
            Back to listings
          </a>
        </div>
      </div>
    );
  }

  return (
    <SitePageShell>
      <ListingDetailPageWrap listing={listing} general={data.general} listings={listings} />
    </SitePageShell>
  );
}
