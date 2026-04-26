import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include docs-pdf/ in the serverless function bundle so the
  // /dataroom/* route handler can read files from it at runtime.
  // Files outside public/ aren't auto-traced by Vercel's File Tracing
  // unless explicitly included here. No-op on non-Vercel hosts (DO, etc).
  outputFileTracingIncludes: {
    "/dataroom/**": ["./docs-pdf/**/*"],
  },
};

export default nextConfig;
