"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import siteData from "@/constant/site";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import Container from "./Container";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/products",
    label: "Products",
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
  {
    href: "/resources",
    label: "Resources",
  },
  {
    href: "/search",
    label: "PropertyXg",
  },
];

const Navbar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Handle home route
    if (href === "/") return pathname === href;

    // Handle Buy and Rent routes with query parameters
    if (href.includes("?ad_type=")) {
      const adType = href.split("ad_type=")[1];
      return (
        pathname.startsWith("/listings") &&
        new URLSearchParams(window.location.search).get("ad_type") === adType
      );
    }

    // Handle other routes
    return pathname.startsWith(href);
  };

  const renderNavLink = (route: RouteProps, i: number, isMobile?: boolean) => (
    <Link
      rel="noreferrer noopener"
      href={route.href}
      key={i}
      className={`font-medium ${isActive(route.href) ? "text-brand" : "opacity-80"}`}
    >
      {route.label}
    </Link>
  );

  return (
    <>
      <div className="bg-white">
        <Container className="grid grid-cols-2 max-sm:hidden">
          <div className="text-xs flex h-10 items-center gap-x-6">
            <Link href="/signin" className="font-semibold flex gap-1">English <i className="bi-chevron-down"></i></Link>
            <Link href="" className="font-semibold flex gap-1"><i className="bi-chat"></i> Customer Support</Link>
          </div>
          <div className="text-xs flex justify-end h-10 items-center gap-x-6">
            <Link href="/signin" className="font-semibold flex gap-1"><i className="bi-lock"></i> CRM Log In</Link>
          </div>
        </Container>
      </div>
      <header className={`top-0 w-full z-[999] bg-white/90 ${className || ""}`}>
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="h-14 md:h-16 w-screen">
            <Container className="flex justify-between items-center">
              <NavigationMenuItem className="flex">
                <Link
                  rel="noreferrer noopener"
                  href="/"
                  className="text-brand"
                >
                  <Logo />
                </Link>
              </NavigationMenuItem>

              {/* desktop */}
              <nav className="hidden lg:flex gap-10">
                {routeList.map((route, i) => renderNavLink(route, i))}
              </nav>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-2 items-center">
                  <div>
                    <Link
                      href={`/signup`}
                      className={cn(buttonVariants({ variant: "brand", size: "sm" }), "border border-brand shadow-sm")}
                    >
                      Get Started Free
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={`/signin`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border border-gray-400 shadow-sm")}
                    >
                      Book a Demo
                    </Link>
                  </div>
                </div>
                {/* mobile */}
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger>
                      <Menu size={24} />
                    </SheetTrigger>
                    <SheetContent className="z-[99999]">
                      <nav className="flex flex-col gap-4">
                        {routeList.map((route, i) => renderNavLink(route, i))}
                      </nav>
                      <Link
                        rel="noreferrer noopener"
                        href=""
                        target="_blank"
                        className={`border w-full mt-5 ${buttonVariants({
                          variant: "outline",
                        })}`}
                      >
                        Log In
                      </Link>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </Container>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </>
  );
};

export default Navbar;
