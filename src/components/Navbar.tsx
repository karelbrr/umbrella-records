"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocalTime from "./local-time";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

function Navbar() {
  const pathname = usePathname();

  const showHeader =
    pathname !== "/login" && !pathname.startsWith("/admin/dashboard");
  return showHeader ? (
    <header
      className={`flex h-[10vh] opacity-90 container left-1/2 px-4 transform -translate-x-1/2 fixed z-100 ${
        pathname !== "/" && "bg-black backdrop-blur-xl"
      } w-full`}
    >
      <div className=" w-1/3 lg:w-3/12 flex items-center">
        <h1 className="lg:text-lg font-satoshi   text-white">
          umbrella records
        </h1>
      </div>
      <nav className="flex w-1/3 lg:w-6/12 items-center justify-center lg:text-lg space-x-3">
        <div className="">
          <a
            href="/"
            className={`hover:opacity-70  transition font-satoshi   text-white`}
          >
            home
          </a>
          <a
            href="/beats"
            className={`hover:opacity-70 transition ml-2 font-satoshi text-white`}
          >
            beats
          </a>
        </div>
      </nav>
      <div className="w-1/3 lg:w-3/12 flex items-center justify-end  ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              className="hover:curosr-pointer lg:text-lg font-satoshi font-normal"
            >
              socials <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-1000 !bg-none">
            <DropdownMenuItem>Instagram</DropdownMenuItem>
            <DropdownMenuItem>TikTok</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  ) : null;
}

export default Navbar;
