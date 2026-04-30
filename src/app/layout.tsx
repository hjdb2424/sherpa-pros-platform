import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import RoleSwitcherMount from "@/components/admin/RoleSwitcherMount";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sherpa Pros",
    template: "%s | Sherpa Pros",
  },
  description:
    "Construction marketplace connecting contractors, handymen, and clients. Find trusted pros or get hired instantly.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sherpa Pros",
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-amber-500 focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#1a1a2e] focus:shadow-lg"
          >
            Skip to main content
          </a>
          <I18nProvider>
            <main id="main-content">{children}</main>
            <RoleSwitcherMount />
          </I18nProvider>
        </body>
    </html>
  );
}
