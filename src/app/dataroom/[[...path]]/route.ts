import { type NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import { join, normalize, resolve as resolvePath, sep } from "node:path";
import { hasDataroomAccess } from "@/lib/auth/dataroom";

/**
 * Investor data room catch-all route.
 *
 * Serves files from `docs-pdf/` (the build output of `npm run docs:all`),
 * gated by Clerk auth + `publicMetadata.dataroom` flag.
 *
 * Path resolution:
 *   /dataroom            → docs-pdf/index.html
 *   /dataroom/           → docs-pdf/index.html
 *   /dataroom/foo.html   → docs-pdf/foo.html
 *   /dataroom/sub/       → docs-pdf/sub/index.html (if exists, else 404)
 *
 * Security:
 *   - Path traversal blocked (resolved path must start with DOCS_ROOT)
 *   - All responses Cache-Control: private, no-store (no CDN/proxy caching)
 *
 * Portability:
 *   - Reads from local filesystem only — no Vercel-specific APIs.
 *   - Works identically on DO Droplet / any Node host that has docs-pdf/ present.
 *   - Production deploy: ensure docs-pdf/ exists before `next build`.
 *     Either un-gitignore the folder, run `npm run docs:all` in build step, or
 *     mount via volume on DO.
 */

const DOCS_ROOT = resolvePath(process.cwd(), "docs-pdf");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function contentTypeFor(path: string): string {
  const lower = path.toLowerCase();
  const dotIdx = lower.lastIndexOf(".");
  if (dotIdx === -1) return "application/octet-stream";
  return MIME_TYPES[lower.slice(dotIdx)] ?? "application/octet-stream";
}

/**
 * Rewrite docs-pdf-internal relative paths so they work when served at
 * /dataroom/* over HTTP.
 *
 * The build pipeline emits HTML with `../public/...` references that assume
 * docs-pdf/ is the web root and public/ lives at the parent. Under HTTP the
 * resolved URL becomes `/public/...` which doesn't exist. Rewrite to absolute
 * `/...` so they hit Next.js's public/ folder served from the root.
 */
function rewriteHtml(html: string): string {
  return html
    .replaceAll('href="../public/', 'href="/')
    .replaceAll('src="../public/', 'src="/');
}

function unauthorizedRedirect(request: NextRequest): NextResponse {
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const allowed = await hasDataroomAccess();
  if (!allowed) return unauthorizedRedirect(request);

  const params = await context.params;
  const segments = params.path ?? [];
  const requestedPath =
    segments.length > 0 ? segments.join("/") : "index.html";

  const safeRelative = normalize(requestedPath);
  if (safeRelative.startsWith("..") || safeRelative.includes(`..${sep}`)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const fullPath = resolvePath(join(DOCS_ROOT, safeRelative));
  if (!fullPath.startsWith(DOCS_ROOT + sep) && fullPath !== DOCS_ROOT) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  let resolvedPath = fullPath;
  try {
    const fileStat = await stat(fullPath);
    if (fileStat.isDirectory()) {
      const indexPath = join(fullPath, "index.html");
      const indexStat = await stat(indexPath).catch(() => null);
      if (!indexStat?.isFile()) {
        return new NextResponse("Not found", { status: 404 });
      }
      resolvedPath = indexPath;
    } else if (!fileStat.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = contentTypeFor(resolvedPath);
  const body = await readFile(resolvedPath);
  const responseBody: BodyInit = contentType.startsWith("text/html")
    ? rewriteHtml(body.toString("utf-8"))
    : new Uint8Array(body);

  return new NextResponse(responseBody, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
