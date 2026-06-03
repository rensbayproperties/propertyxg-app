"use client";

import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import siteData from "@/constant/site";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import ReusableDropdown from "./reusableDropdown";

type NavbarProps = {
  variant?: "default" | "dashboard" | "support" | "supportHome"; // 👈 possible variants
};

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/features",
    label: "Features",
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
  {
    href: "/company",
    label: "Company",
  },
  {
    href: "/support",
    label: "Support",
  },
];

export default function ReusableNavbar({ variant = "default" }: NavbarProps) {
  const pathname = usePathname();
  const [search, showSearch] = useState(false);
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
      className={`font-medium ${isActive(route.href) ? "text-brand" : ""}`}
    >
      {route.label}
    </Link>
  );

  if (variant === "support") {
    return (
      <header className="sticky top-0 w-full z-[999] bg-[#0166ff] border-b">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="h-14 px-2 lg:px-20 w-screen flex justify-between ">
            <NavigationMenuItem className="flex items-center gap-3">
              <Link
                rel="noreferrer noopener"
                href="/"
                className="font-bold text-xl flex text-brand"
              >
                <Logo variant="white" />
              </Link>
              <p className="text-[17px] text-white"> | help center</p>
            </NavigationMenuItem>

            {/* desktop */}
            <nav className="hidden lg:flex gap-10"></nav>
            <div className="flex items-center gap-4">
              <div className="px-2 hidden md:flex gap-2 items-center">
                {search ? (
                  <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm w-full max-w-3xl">
                    <Search className="text-gray-400 mr-2" size={18} />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-[180px] outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                ) : (
                  <Search
                    className="text-white mr-2"
                    size={20}
                    onClick={() => {
                      showSearch(true);
                    }}
                  />
                )}

                <ReusableDropdown />
                <div>
                  <Link
                    href={`/signup`}
                    className={cn(buttonVariants({ variant: "light" }), "")}
                  >
                    Sign in
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
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    );
  }

  if (variant === "supportHome") {
    return (
      <header className="sticky top-0 w-full z-[999] bg-[#0166ff] border-b h-[300px]">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="h-14 px-2 lg:px-20 w-screen flex justify-between ">
            <NavigationMenuItem className="flex items-center gap-3">
              <Link
                rel="noreferrer noopener"
                href="/"
                className="font-bold text-xl flex text-brand"
              >
                <Logo variant="white" />
              </Link>
              <p className="text-[14px] text-white"> | help center</p>
            </NavigationMenuItem>

            {/* desktop */}

            <div className="flex items-center gap-4">
              <div className="px-2 hidden md:flex gap-4 items-center">
                <ReusableDropdown />
                <div>
                  <Link
                    href={`/signup`}
                    className={cn(buttonVariants({ variant: "light" }), "")}
                  >
                    Sign in
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
          </NavigationMenuList>
        </NavigationMenu>
        <div className="w-full flex items-center justify-center mt-4">
          <div className="w-[45%] h-[200px] flex flex-col justify-evenly items-center">
            <p className="text-[35px] font-bold text-white">
              How can we help you?
            </p>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm w-full max-w-3xl">
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
}
