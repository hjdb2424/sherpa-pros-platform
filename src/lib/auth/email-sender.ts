/**
 * Email OTP — branded delivery wrapper around Resend.
 *
 * Used by POST /api/auth/email/request-code to deliver a 6-digit one-time
 * code. Mirrors the existing Resend pattern at
 * src/app/api/admin/send-invite/route.ts:26-44.
 *
 * Behavior:
 *  - When RESEND_API_KEY is set, sends a branded HTML email and returns
 *    `{ ok: true }` on 2xx, `{ ok: false }` otherwise.
 *  - When RESEND_API_KEY is absent (typical local dev), logs the code to the
 *    server console and returns `{ ok: true }` so the dev flow still works.
 *  - Never throws — failures are caught and logged so the calling route can
 *    fail-soft (returning 200 ok regardless, per spec).
 */

// Match the existing send-invite from-address — confirmed working in
// production Resend setup. Using a different alias (e.g. noreply@) requires
// that alias to be domain-verified in Resend; otherwise sends silently fail.
const FROM_ADDRESS = 'Sherpa Pros <invite@thesherpapros.com>';
const SUBJECT = 'Your Sherpa Pros sign-in code';

export interface SendOtpEmailInput {
  to: string;
  code: string;
  /** Optional first name for personalization. */
  name?: string;
}

export interface SendOtpEmailResult {
  ok: boolean;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml({ code, name }: { code: string; name?: string }): string {
  const greeting = name ? `Hi ${escapeHtml(name)},` : 'Hi,';
  // Insert thin spaces between every digit so the code reads as 3+3 in most
  // mail clients without breaking copy/paste (only digits are copied).
  const displayCode = escapeHtml(code);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a2e;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
            <tr>
              <td style="padding:32px 32px 0;">
                <div style="font-size:14px;font-weight:600;letter-spacing:0.04em;color:#f59e0b;text-transform:uppercase;">Sherpa Pros</div>
                <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#1a1a2e;">Your sign-in code</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0;font-size:16px;line-height:1.55;color:#334155;">
                ${greeting}<br><br>
                Use the code below to finish signing in. It expires in 10 minutes.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 32px;">
                <div style="display:inline-block;padding:18px 28px;background:#0f172a;color:#ffffff;font-family:'SF Mono',Menlo,Monaco,Consolas,monospace;font-size:32px;letter-spacing:0.4em;font-weight:600;border-radius:12px;">
                  ${displayCode}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;font-size:13px;line-height:1.55;color:#64748b;">
                Didn't request this? You can safely ignore this email — your account stays locked without the code.
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 24px;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.5;color:#94a3b8;">
                Sherpa Pros · construction marketplace<br>
                You're receiving this because someone entered this address on the Sherpa Pros sign-in screen.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendOtpEmail(
  input: SendOtpEmailInput
): Promise<SendOtpEmailResult> {
  const { to, code, name } = input;

  if (!process.env.RESEND_API_KEY) {
    // Local dev fallback: log the code to the server console so the flow
    // still works without configuring email. Never log codes when an API
    // key is present.
    console.log(`[email-otp][dev] code for ${to}: ${code}`);
    return { ok: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        subject: SUBJECT,
        html: buildHtml({ code, name }),
      }),
    });

    if (!res.ok) {
      console.error('[email-otp] Resend error:', res.status, await res.text());
      return { ok: false };
    }

    return { ok: true };
  } catch (err) {
    console.error('[email-otp] Resend fetch threw:', err);
    return { ok: false };
  }
}
