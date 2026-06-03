import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/company-setup/:path*",
    "/inventories/:path*",
    "/leads/:path*",
    "/profile",
    "/roles",
    "/dncr/:path*",
    "/team-members/:path*",
    "/signin",
    "/activity-logs",
    "/forgot-password",
    "/reset-password",
    "/property-listings/:path*",
    "/payment-collections/:path*",
    "/website/:path*",
  ],
};

export const publicRoutes = ["/signin", "/forgot-password", "/reset-password"];
export const protectedRoutes = [
  "/home",
  "/leads",
  "/profile",
  "/team-members",
  "/roles",
  "/listings",
  "/activity-logs",
  "/maintenance",
  "/company-setup",
  "/property-listings",
  "/payment-collections",
  "/website",
];
