import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { ReactQueryProvider } from "./providers";
import { AuthProvider } from "@/components/context/auth-provider";

const satoshi = localFont({
  src: "./Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | Umrella Records",
    default: "Umbrella Records",
  },
  description: "Website for recording studio and beat store Umbrella Records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark">
      <body className={` ${satoshi.variable}  antialiased`}>
        <AuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
