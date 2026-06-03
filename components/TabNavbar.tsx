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

interface RouteProps {
  href: string;
  label: string;
}

const TabNavbar = ({ routeList }: { routeList: RouteProps[] }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Handle other routes
    return pathname === href;
    // return pathname.startsWith(href);
    // return pathname.startsWith(href);
  };

  const renderNavLink = (route: RouteProps, i: number, isMobile?: boolean) => (
    <Link
      rel="noreferrer noopener"
      href={route.href}
      key={i}
      className={`font-medium py-3 relative ${isActive(route.href)
        ? "text-brand opacity-100 after:absolute after:w-full after:bottom-0 after:left-0 after:bg-brand after:h-0.5"
        : "opacity-60"
        } whitespace-nowrap`}
    >
      {route.label}
    </Link>
  );

  return (
    <header className="sticky top-0 md:top-0 w-full z-[99] border-b text-sm">
      <NavigationMenu>
        <NavigationMenuList className="px-2 lg:px-6 justify-start">
          <nav className="flex gap-6 !flex-nowrap overflow-x-scroll">
            {routeList.map((route, i) => renderNavLink(route, i))}
          </nav>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default TabNavbar;
