import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force-override NEXT_PUBLIC_CLERK_PROXY_URL to empty at build time.
  // Clerk's @clerk/nextjs SDK reads this env var directly via
  // `props.proxyUrl || process.env.NEXT_PUBLIC_CLERK_PROXY_URL || ""`,
  // so passing an empty `proxyUrl` prop on <ClerkProvider> can't override
  // a Vercel env-var (both are falsy under `||`). Neutralizing here kills
  // the same-origin proxy until we re-enable it deliberately — see
  // docs/superpowers/handoff/2026-04-29-session-handoff.md.
  env: {
    NEXT_PUBLIC_CLERK_PROXY_URL: "",
  },
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
