import { type NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import { join, normalize, resolve as resolvePath, sep } from "node:path";
import { getDataroomAccessState } from "@/lib/auth/dataroom";

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

function signInRedirect(request: NextRequest): NextResponse {
  const signInUrl = new URL("/sign-in", request.url);
  // Clerk's standard query param is `redirect_url`; setting `redirect` too
  // for compatibility with the existing proxy.ts convention.
  signInUrl.searchParams.set("redirect_url", request.nextUrl.pathname);
  signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

const FORBIDDEN_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Access required · Sherpa Pros</title>
<link rel="icon" href="/favicon.ico">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Manrope', sans-serif; background: #FBF7EE; color: #1a1a2e; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .card { max-width: 480px; background: white; border: 1px solid #E8E0CC; border-radius: 16px; padding: 48px 40px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .logo { width: 200px; height: auto; margin: 0 auto 32px; display: block; }
  h1 { font-size: 22px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.01em; }
  p { font-size: 15px; line-height: 1.55; color: #4a4a55; margin: 0 0 16px; }
  .accent { color: #00a9e0; text-decoration: none; font-weight: 600; }
  .accent:hover { text-decoration: underline; }
  .footer { font-size: 12px; color: #94a3b8; margin-top: 32px; }
  .home-link { display: inline-block; margin-top: 24px; padding: 10px 20px; background: #00a9e0; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
  .home-link:hover { background: #0090c0; }
</style>
</head>
<body>
  <div class="card">
    <img class="logo" src="/brand/sherpa-pros-wordmark.png" alt="Sherpa Pros">
    <h1>Investor data room — access required</h1>
    <p>You're signed in, but your account doesn't yet have data room access.</p>
    <p>Email <a class="accent" href="mailto:poum@hjd.builders?subject=Data%20room%20access%20request">poum@hjd.builders</a> with the email on this account and we'll grant access.</p>
    <a class="home-link" href="/">Back to thesherpapros.com</a>
    <div class="footer">Account access is granted manually for verified investors.</div>
  </div>
</body>
</html>`;

function forbiddenResponse(): NextResponse {
  return new NextResponse(FORBIDDEN_HTML, {
    status: 403,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const accessState = await getDataroomAccessState();
  if (accessState === "not_signed_in") return signInRedirect(request);
  if (accessState === "signed_in_no_access") return forbiddenResponse();

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

  // Force inline preview for browser-previewable types (HTML, PDF, images).
  // Default would let the browser decide, which on some setups defaults to
  // download for PDFs.
  // PPTX/DOCX are not previewable in-browser → explicit attachment so the
  // download dialog gets a sensible filename.
  const inlineTypes = [
    "text/html",
    "application/pdf",
    "image/",
    "application/json",
    "application/javascript",
    "text/css",
    "font/",
  ];
  const isInline = inlineTypes.some((t) => contentType.startsWith(t));
  const filename = resolvedPath.split(sep).pop() ?? "file";
  const disposition = isInline
    ? `inline; filename="${filename}"`
    : `attachment; filename="${filename}"`;

  return new NextResponse(responseBody, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
