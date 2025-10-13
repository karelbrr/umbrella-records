"use client";

import LocalTime from "./LocalTime";
import { usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();
  return (
    <header
      className={`flex h-[10vh] opacity-90 container left-1/2 px-4 transform -translate-x-1/2 fixed z-1000 ${
        pathname !== "/" && "bg-black backdrop-blur-xl"
      } w-full`}
    >
      <div className="w-2/12 flex items-center">
        <LocalTime />
      </div>
      <nav className="flex w-8/12 items-center justify-center text-lg space-x-3">
        <div className="">
          <a
            href="/"
            className={`hover:opacity-70  transition font-satoshi font-medium  text-white`}
          >
            home
          </a>
          <a
            href="/beats"
            className={`hover:opacity-70 transition ml-2 font-medium  font-satoshi text-white`}
          >
            beats/tracks
          </a>
        </div>
      </nav>
      <div className="w-2/12 flex items-center justify-end  ">
        <p
          className={`hover:opacity-70 transition ml-2 text-lg font-medium  font-satoshi  text-white`}
        >
          socials
        </p>
      </div>
    </header>
  );
}

export default Navbar;
