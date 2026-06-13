import type { Metadata } from "next";
import {
  DM_Serif_Display,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { BRAND_ASSETS } from "@/lib/brand";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/company";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-brand-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-brand-mono",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: `BeOne Analytics — ${PLATFORM_NAME}`,
  description: `Social media analytics and reporting for BeOne by ${PLATFORM_NAME}`,
  icons: {
    icon: BRAND_ASSETS.favicon,
    apple: BRAND_ASSETS.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-paper font-sans text-brand-ink">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
