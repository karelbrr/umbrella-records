"use client";
import Link from "next/link";
import { Twitter, Instagram, Mail, Mic } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const showHeader =
    pathname !== "/login" && !pathname.startsWith("/admin/dashboard");

  return showHeader ? (
    <footer className="bg-black border-t flex justify-center">
      <div className="container px-4 py-16 md:py-20 font-satoshi">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12">
          {/* Studio Info */}
          <div className="space-y-4">
            {/* <a
              href="/"
              className="text-xl mb-1 font-satoshi  opacity-90 text-white"
            >
              <Image
                src={"/logo2.svg"}
                width={60}
                height={50}
                alt="Umbrella records logo"
                style={{ filter: "invert(1) brightness(2)" }}
              />
            </a> */}
            <h3 className="text-white  text-lg tracking-wide">
              umbrela records
            </h3>
            <p className="text-muted-foreground  text-sm leading-relaxed">
              A records dedicated to audio excellence and creative
              collaboration.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white  text-lg tracking-wide">links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#hero"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  hero
                </a>
              </li>
              <li>
                <a
                  href="#quote"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  quote
                </a>
              </li>
              <li>
                <a
                  href="#latest-beats"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  latest beats
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white  text-lg tracking-wide">contact</h3>
            <div className="space-y-2 text-sm">
              <p className=" text-muted-foreground">help@umbrellarecords.cz</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground  tracking-wide">
            © {currentYear} umbrella records. all rights reserved - beta v2.1.0
          </p>
          <p className="text-xs text-muted-foreground  tracking-wide">
            designed with precission by KB7
          </p>
        </div>
      </div>
    </footer>
  ) : (
    ""
  );
}
