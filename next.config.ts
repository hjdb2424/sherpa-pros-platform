import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Pin Turbopack's workspace root to this project. Without this, Turbopack's
// auto-inference walks up looking for a lockfile and can land on the user's
// home dir if a stray ~/package-lock.json exists — which then breaks
// node_modules resolution (e.g. "Can't resolve 'tailwindcss' in '/Users/poum'").
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // The Clerk SDK reads these env vars directly (`props.proxyUrl || process.env.NEXT_PUBLIC_CLERK_PROXY_URL || ""`),
  // so an empty prop can't override a Vercel env-var (both falsy under `||`).
  // Set values here to win at build time. Without explicit SIGN_IN_URL,
  // Clerk bounces protected-route hits to the hosted Account Portal at
  // accounts.thesherpapros.com. See docs/superpowers/handoff/2026-04-29-session-handoff.md.
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
