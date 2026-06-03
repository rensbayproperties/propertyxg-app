"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFirstLetter } from "@/constant/data";
import { ChevronDown, LogOut, Settings, UserRoundCog } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import siteData from "@/constant/site";

export function UserNav({ handleSignOut }: { handleSignOut: () => void }) {
  const { data: session }: { data: any } = useSession();
  const fullName = `${session?.user?.first_name!} ${session?.user?.last_name!}`;
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-[2px] items-center cursor-pointer">
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || siteData.defaultUserImage} />
                <AvatarFallback>{getFirstLetter(fullName)}</AvatarFallback>
              </Avatar>
            </Button>
            <ChevronDown className="w-[16px] h-[16px] text-brand" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{fullName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
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
        className="sm:max-w-[425px] bg-card border-border"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <p>
            {" "}
            Are you sure you want to log out? Any unsaved changes will be lost.
          </p>
          <div className=" flex items-center justify-end gap-3 mt-[12px]">
            <DialogTrigger asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogTrigger>
            <Button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-600"
            >
              Log Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
