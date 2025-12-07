"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Button } from "../components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState<boolean>();

  const showHeader =
    pathname !== "/login" && !pathname.startsWith("/admin/dashboard");
  return showHeader ? (
    <header
      className={`flex justify-between lg:justify-normal items-center h-[10vh] opacity-90 lg:container left-1/2 px-4 transform -translate-x-1/2 fixed z-100 w-full ${
        pathname !== "/" && "bg-black backdrop-blur-xl"
      }`}
    >
      <div className=" w-2/3 lg:w-3/12 flex items-center">
        {/* <a
          href="/"
          className="text-xl mb-1 font-satoshi  opacity-90 text-white"
        >
          <Image
            src={"/logo.svg"}
            width={30}
            height={50}
            alt="logo"
            style={{ filter: "invert(1) brightness(2)" }}
          />
        </a> */}
        <a href="/" className="text-xl mb-1 font-satoshi text-white">
          umbrella records
        </a>
      </div>
      <nav className="lg:flex w-1/3 hidden  lg:w-6/12 items-center justify-center lg:text-lg space-x-3">
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
      <div className="w-1/3 hidden  lg:w-3/12 lg:flex items-center justify-end  ">
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
      <div className="flex lg:hidden ">
        <Button
          onClick={() => setIsMobile(true)}
          variant={"ghost"}
          aria-label="Open menu"
        >
          <Menu strokeWidth={1} className="scale-200" />
        </Button>
      </div>
      {/* Mobile Menu */}

      {isMobile && (
        <section
          className="fixed top-0 lg:hidden right-0 w-[60%] bg-black z-50"
          style={{
            height: "calc(100vh + env(safe-area-inset-bottom))",
          }}
        >
          <div
            className="flex justify-end h-[10vh] pr-4 items-center "
            aria-label="Close menu"
          >
            <Button variant={"ghost"} onClick={() => setIsMobile(false)}>
              <X strokeWidth={1} className="scale-200" />
            </Button>
          </div>
          <nav className="flex flex-col items-center justify-center h-[90vh] space-y-4">
            <a
              href="/"
              className={`hover:opacity-70  transition font-satoshi text-2xl text-white`}
            >
              home
            </a>
            <a
              href="/beats"
              className={`hover:opacity-70 transition font-satoshi text-2xl text-white`}
            >
              beats
            </a>
          </nav>
        </section>
      )}
    </header>
  ) : null;
}
