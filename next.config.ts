import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include docs-pdf/ in the serverless function bundle so the
  // /dataroom/* route handler can read files from it at runtime.
  // Files outside public/ aren't auto-traced by Vercel's File Tracing
  // unless explicitly included here. No-op on non-Vercel hosts (DO, etc).
  // Ship docs-pdf/ files to the serverless function bundle so the
  // /dataroom route handler can read them at runtime. Use a broad "**"
  // pattern because Next.js's File Tracing key matching for optional
  // catch-all routes (`[[...path]]`) is unreliable — narrow keys like
  // "/dataroom/**" may not match the route's actual function name.
  outputFileTracingIncludes: {
    "**": [
      "./docs-pdf/**/*.html",
      "./docs-pdf/**/*.pdf",
      "./docs-pdf/**/*.pptx",
      "./docs-pdf/**/*.png",
      "./docs-pdf/**/*.jpg",
      "./docs-pdf/**/*.svg",
      "./docs-pdf/**/*.css",
    ],
  },
};

export default nextConfig;
