import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Conditionally import ClerkProvider — skip when Clerk keys aren't configured
const clerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

let ClerkProvider: React.ComponentType<{ children: React.ReactNode }> | null =
  null;
if (clerkConfigured) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ClerkProvider = require("@clerk/nextjs").ClerkProvider;
}

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
          {ClerkProvider ? (
            <ClerkProvider>{children}</ClerkProvider>
          ) : (
            children
          )}
        </body>
    </html>
  );
}
