import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build-time Clerk overrides. The Clerk SDK reads several env vars directly
  // (e.g. `props.proxyUrl || process.env.NEXT_PUBLIC_CLERK_PROXY_URL || ""`),
  // so empty/missing props can't override a Vercel env-var (both are falsy
  // under `||`). Set values explicitly here to win at build time.
  // - PROXY_URL "" → kill the same-origin proxy until we re-enable deliberately
  // - SIGN_IN_URL/SIGN_UP_URL → force Clerk's middleware and components to
  //   use the LOCAL /sign-in and /sign-up routes instead of bouncing users
  //   to the hosted Account Portal at accounts.thesherpapros.com (which was
  //   the redirect users were seeing on protected-route hits).
  // See docs/superpowers/handoff/2026-04-29-session-handoff.md.
  env: {
    NEXT_PUBLIC_CLERK_PROXY_URL: "",
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: "/sign-in",
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: "/sign-up",
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
