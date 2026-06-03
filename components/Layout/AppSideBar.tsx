"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ArrowLeft,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Settings,
  UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Icons } from "../icons";
import BreadCrumbs from "../BreadCrumbs";
import { UserNav } from "./UserNav";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { getFirstLetter, navGroups, customerNavItems } from "@/constant/data";
import { useSession } from "next-auth/react";
import useSignout from "@/hooks/useSignout";
import { NavGroup, NavItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
// import Logo from "@/public/logo.png";
import Image from "next/image";
import siteData from "@/constant/site";

export default function AppSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session }: { data: any } = useSession();
  const fullName = `${session?.user?.first_name || ""} ${session?.user?.last_name || ""}`;
  const type = session?.user?.user_type
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { handleSignOut } = useSignout();
  const [focusedDropdown, setFocusedDropdown] = React.useState<{
    parentUrl: string;
  } | null>(null);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const roles = session?.user?.roles;
  const activeRoles = [] as string[];
  if (roles?.role_add_leads > 0) activeRoles.push("role_add_leads");

  const canViewItem = React.useCallback(
    (item: NavItem) => {
      if (
        session?.user?.user_type !== "ROOT" ||
        (typeof item?.pages === "string" && item?.pages === "*")
      ) {
        return true;
      }

      if (Array.isArray(item?.pages) && item.pages.length > 0) {
        return activeRoles.some((activeRole) => item?.pages.includes(activeRole));
      }

      return false;
    },
    [activeRoles, session?.user?.user_type]
  );

  const filteredNavGroups = React.useMemo<NavGroup[]>(() => {
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items
          .filter(canViewItem)
          .map((item) => ({
            ...item,
            items: item.items?.filter(canViewItem) ?? [],
          })),
      }))
      .filter((group) => group.items.length > 0);
  }, [canViewItem]);

  const focusedParentItem = React.useMemo(() => {
    if (!focusedDropdown) return null;

    return filteredNavGroups
      .flatMap((group) => group.items)
      .find((item) => item.url === focusedDropdown.parentUrl);
  }, [filteredNavGroups, focusedDropdown]);

  React.useEffect(() => {
    if (!focusedDropdown) return;
    if (!focusedParentItem || !focusedParentItem.items?.length) {
      setFocusedDropdown(null);
    }
  }, [focusedDropdown, focusedParentItem]);

  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider className="no-scrollbar">
      <Sidebar collapsible="icon" className="border-r border-border bg-sidebar-background">
        <SidebarHeader className="">
          <div className="flex gap-2 py-2 items-center text-sidebar-foreground justify-center">
            <div className="px-4 bg-card dark:bg-sidebar-accent inline-flex items-center justify-center rounded-md text-brand font-bold border border-border">
              CRMDUBAI
              {/* <Image src={Logo} alt={`${siteData.name} logo`} width={170} height={30} /> */}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden">
          {session?.user?.user_type !== "ROOT" &&
            (focusedParentItem?.items?.length ? (
              <SidebarGroup>
                {/* <SidebarGroupLabel>{focusedParentItem.title}</SidebarGroupLabel> */}
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Back to full menu"
                      onClick={() => setFocusedDropdown(null)}
                      className="bg-gray-200"
                    >
                      {/* <ArrowLeft /> */}
                      <i className="bi-chevron-left text-lg"></i>
                      {/* <span>Back</span> */}
                      <span className="w-full font-semibold">{focusedParentItem.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <div className="md:p-2">
                    {focusedParentItem.items.map((subItem, subIndex) => {
                      const Icon = subItem.icon ? Icons[subItem.icon] : Icons.logo;

                      return (
                        <SidebarMenuItem key={`focusedlinkitem__${subItem.url}_${subIndex}`}>
                          <SidebarMenuButton
                            asChild
                            tooltip={subItem.title}
                            isActive={pathname === subItem.url}
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && <Icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </div>
                </SidebarMenu>
              </SidebarGroup>
            ) : (
              filteredNavGroups.map((group, groupIndex) => (
                <SidebarGroup key={`navgroup__${groupIndex}`}>
                  {/* <SidebarGroupLabel>{group.label}</SidebarGroupLabel> */}
                  <SidebarMenu>
                    {group.items.map((item, i) => {
                      const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                      return item?.items && item?.items?.length > 0 ? (
                        <Collapsible
                          key={`linkitem__${groupIndex}_${i}`}
                          asChild
                          defaultOpen={item.isActive}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                tooltip={item.title}
                                isActive={pathname === item.url || pathname.includes(item.url)}
                              >
                                {item.icon && <Icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subItem, j) => (
                                  <SidebarMenuSubItem
                                    key={`innerlinkitem__${groupIndex}_${j}`}
                                  >
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={pathname === subItem.url}
                                    >
                                      <Link
                                        href={subItem.url}
                                        onClick={() =>
                                          setFocusedDropdown({
                                            parentUrl: item.url,
                                          })
                                        }
                                      >
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      ) : (
                        <SidebarMenuItem key={`oulinkitem__${groupIndex}_${i}`}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            isActive={pathname === item.url}
                          >
                            <Link href={item.url}>
                              <Icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroup>
              ))
            ))}
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border shadow">
          <SidebarMenu>
            <SidebarMenuItem>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-full shadow border">
                        <AvatarImage src={session?.user?.image || siteData.defaultUserImage} />
                        <AvatarFallback className="rounded-full">
                          {getFirstLetter(session?.user?.company?.name || fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold capitalize">
                          {session?.user?.company?.name}
                        </span>
                        <span className="truncate text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    {/* <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-full">
                          <AvatarImage src={session?.user?.image || siteData.defaultUserImage} />
                          <AvatarFallback className="rounded-full">
                            {getFirstLetter(fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {fullName}
                          </span>
                          <span className="truncate text-xs">
                            {session?.user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuGroup>
                      <Link href="/profile">
                        <DropdownMenuItem>
                          <UserRoundCog />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/update-password">
                        <DropdownMenuItem>
                          <Settings />
                          Update Password
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DialogTrigger className="w-full">
                      <DropdownMenuItem className="text-red-600 w-full">
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DialogContent
                  className="bg-card border-border"
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col">
                    <p>
                      Are you sure you want to log out? Any unsaved changes will
                      be lost.
                    </p>
                    <div className=" flex items-center justify-end gap-3 mt-[12px]">
                      <DialogTrigger asChild>
                        <Button variant={"outline"}>Cancel</Button>
                      </DialogTrigger>
                      <Button
                        onClick={handleSignOut}
                        variant={"destructive"}
                      >
                        Log Out
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="w-full overflow-hidden ">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
            <BreadCrumbs />
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeSwitcher />
            <UserNav handleSignOut={handleSignOut} />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
