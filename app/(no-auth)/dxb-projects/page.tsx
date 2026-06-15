import {
  fetchPublicWebsite,
  fetchPublicDxbProjects,
  fetchPublicDxbProjectsFilters,
} from "@/lib/publicWebsite.server";
import { SitePageShell } from "../_components/SitePageShell";
import DxbProjectsPageWrap from "./DxbProjectsPageWrap";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dubai DXB Projects",
  description: "Explore premium off-plan and completed real estate projects in Dubai.",
};

export default async function PublicDxbProjectsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    project_status?: string;
    locationId?: string;
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

  // Fetch projects and areas/developers list
  const projectsResult = await fetchPublicDxbProjects(searchParams);
  const filtersResult = await fetchPublicDxbProjectsFilters();

  return (
    <SitePageShell pageKey="dxb-projects">
      <DxbProjectsPageWrap
        projects={projectsResult.data}
        meta={{
          total: projectsResult.total,
          page: projectsResult.page,
          limit: projectsResult.limit,
          totalPages: projectsResult.totalPages,
        }}
        general={data.general}
        areas={filtersResult.areas || []}
      />
    </SitePageShell>
  );
}
