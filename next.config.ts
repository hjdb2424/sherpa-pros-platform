import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include docs-pdf/ in the serverless function bundle so the
  // /dataroom/* route handler can read files from it at runtime.
  // Files outside public/ aren't auto-traced by Vercel's File Tracing
  // unless explicitly included here. No-op on non-Vercel hosts (DO, etc).
  // Ship docs-pdf/ HTML files to the serverless function bundle so the
  // /dataroom route handler can read them at runtime. Try multiple keys
  // because Next.js's File Tracing matching for catch-all routes can be
  // finicky — better to over-include than miss files.
  outputFileTracingIncludes: {
    "/dataroom/**": ["./docs-pdf/**/*"],
    "/dataroom/[[...path]]": ["./docs-pdf/**/*"],
    "/dataroom": ["./docs-pdf/**/*"],
  },
};

export default nextConfig;
