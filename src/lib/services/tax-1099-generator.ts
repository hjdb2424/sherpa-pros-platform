/* ------------------------------------------------------------------ */
/* 1099-NEC Generator Service                                         */
/* ------------------------------------------------------------------ */

export interface Form1099NEC {
  taxYear: number;
  payerName: string;
  payerAddress: string;
  payerTin: string;
  recipientName: string;
  recipientAddress: string;
  recipientTin: string;
  nonemployeeCompensation: number; // Box 1 — integer cents
  federalTaxWithheld: number; // Box 4 (usually 0 for contractors)
  stateTaxWithheld: number; // Box 5
  statePayerNumber: string; // Box 6
  stateIncome: number; // Box 7 — integer cents
}

/** Mask a TIN for display: **-***1234 */
function maskTin(tin: string): string {
  const digits = tin.replace(/\D/g, '');
  if (digits.length < 4) return '***-**-****';
  return `***-**-${digits.slice(-4)}`;
}

/** Format integer cents to dollar string */
function fmtDollars(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString('en-US')}.${String(remainder).padStart(2, '0')}`;
}

/** Build a single 1099-NEC copy (A/B/C) as HTML */
function buildCopyHTML(form: Form1099NEC, copyLabel: string, copyDescription: string): string {
  return `
    <div style="page-break-after:always;border:2px solid #000;padding:24px;margin:0 auto 32px;max-width:720px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#000;background:#fff;">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:16px;">
        <div>
          <div style="font-size:10px;color:#c00;font-weight:bold;letter-spacing:1px;">CORRECTED (if checked) &#9744;</div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:18px;font-weight:bold;letter-spacing:2px;">1099-NEC</div>
          <div style="font-size:10px;margin-top:2px;">Nonemployee Compensation</div>
          <div style="font-size:9px;color:#666;">Department of the Treasury — Internal Revenue Service</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;font-weight:bold;">Tax Year ${form.taxYear}</div>
          <div style="font-size:9px;color:#666;">${copyLabel}</div>
          <div style="font-size:8px;color:#999;">${copyDescription}</div>
        </div>
      </div>

      <!-- Payer / Recipient grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #000;">
        <!-- Payer info -->
        <div style="border-right:1px solid #000;border-bottom:1px solid #000;padding:8px;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;margin-bottom:2px;">Payer's Name, Street, City, State, ZIP</div>
          <div style="font-weight:bold;">${form.payerName}</div>
          <div>${form.payerAddress}</div>
        </div>
        <!-- Payer TIN -->
        <div style="border-bottom:1px solid #000;padding:8px;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;margin-bottom:2px;">Payer's TIN</div>
          <div style="font-weight:bold;font-size:14px;">${maskTin(form.payerTin)}</div>
        </div>

        <!-- Recipient info -->
        <div style="border-right:1px solid #000;border-bottom:1px solid #000;padding:8px;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;margin-bottom:2px;">Recipient's Name, Street, City, State, ZIP</div>
          <div style="font-weight:bold;">${form.recipientName}</div>
          <div>${form.recipientAddress}</div>
        </div>
        <!-- Recipient TIN -->
        <div style="border-bottom:1px solid #000;padding:8px;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;margin-bottom:2px;">Recipient's TIN</div>
          <div style="font-weight:bold;font-size:14px;">${maskTin(form.recipientTin)}</div>
        </div>
      </div>

      <!-- Amount boxes -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid #000;border-top:none;margin-bottom:16px;">
        <!-- Box 1 -->
        <div style="border-right:1px solid #000;padding:8px;text-align:center;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;">1. Nonemployee Compensation</div>
          <div style="font-size:20px;font-weight:bold;margin-top:8px;">${fmtDollars(form.nonemployeeCompensation)}</div>
        </div>
        <!-- Box 4 -->
        <div style="border-right:1px solid #000;padding:8px;text-align:center;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;">4. Federal Tax Withheld</div>
          <div style="font-size:16px;font-weight:bold;margin-top:8px;">${fmtDollars(form.federalTaxWithheld)}</div>
        </div>
        <!-- Box 5 -->
        <div style="border-right:1px solid #000;padding:8px;text-align:center;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;">5. State Tax Withheld</div>
          <div style="font-size:16px;font-weight:bold;margin-top:8px;">${fmtDollars(form.stateTaxWithheld)}</div>
        </div>
        <!-- Box 6 & 7 -->
        <div style="padding:8px;text-align:center;">
          <div style="font-size:9px;color:#666;text-transform:uppercase;">6. State/Payer No.</div>
          <div style="font-size:11px;font-weight:bold;margin-top:4px;">${form.statePayerNumber || 'N/A'}</div>
          <div style="border-top:1px solid #ccc;margin-top:8px;padding-top:4px;">
            <div style="font-size:9px;color:#666;text-transform:uppercase;">7. State Income</div>
            <div style="font-size:11px;font-weight:bold;">${fmtDollars(form.stateIncome)}</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="font-size:8px;color:#999;text-align:center;">
        Form 1099-NEC (Rev. 1-2024) &bull; Cat. No. 72590N &bull; ${copyLabel} — ${copyDescription}
      </div>
    </div>
  `;
}

/**
 * Generate a complete 1099-NEC HTML document with all three copies
 * Copy A = IRS, Copy B = Recipient, Copy C = Payer
 */
export function generate1099HTML(form: Form1099NEC): string {
  const copies = [
    buildCopyHTML(form, 'Copy A', 'For Internal Revenue Service Center'),
    buildCopyHTML(form, 'Copy B', 'For Recipient'),
    buildCopyHTML(form, 'Copy C', 'For Payer'),
  ];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>1099-NEC — ${form.recipientName} — Tax Year ${form.taxYear}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f5f5f5; padding: 32px; }
        @media print {
          body { background: #fff; padding: 0; }
        }
      </style>
    </head>
    <body>
      ${copies.join('\n')}
    </body>
    </html>
  `;
}

/**
 * Generate printable 1099-NEC HTML with print-optimized CSS
 */
export function generate1099PDF(form: Form1099NEC): string {
  const copies = [
    buildCopyHTML(form, 'Copy A', 'For Internal Revenue Service Center'),
    buildCopyHTML(form, 'Copy B', 'For Recipient'),
    buildCopyHTML(form, 'Copy C', 'For Payer'),
  ];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <title>1099-NEC — ${form.recipientName} — ${form.taxYear}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; padding: 0; }
        @media print {
          body { padding: 0; }
          div[style*="page-break-after"] { page-break-after: always; }
        }
        @page {
          size: letter;
          margin: 0.5in;
        }
      </style>
    </head>
    <body>
      ${copies.join('\n')}
    </body>
    </html>
  `;
}

/* ------------------------------------------------------------------ */
/* Mock data for demonstration                                        */
/* ------------------------------------------------------------------ */

interface PayeeRecord {
  recipientName: string;
  recipientAddress: string;
  recipientTin: string;
  totalPaidCents: number;
}

const THRESHOLD_CENTS = 60000; // $600

/** Mock payee data */
function getMockPayees(): PayeeRecord[] {
  return [
    { recipientName: 'Mike Rodriguez Plumbing LLC', recipientAddress: '45 Oak St, Manchester, NH 03101', recipientTin: '12-3456789', totalPaidCents: 1_280_000 },
    { recipientName: 'Sarah Chen Electric', recipientAddress: '120 Elm Ave, Concord, NH 03301', recipientTin: '23-4567890', totalPaidCents: 890_000 },
    { recipientName: 'Carlos Rivera General Contracting', recipientAddress: '78 Pine Rd, Nashua, NH 03060', recipientTin: '34-5678901', totalPaidCents: 2_100_000 },
    { recipientName: 'Diana Brooks Painting', recipientAddress: '33 Birch Ln, Dover, NH 03820', recipientTin: '45-6789012', totalPaidCents: 45_000 },
    { recipientName: 'James Wilson HVAC Services', recipientAddress: '210 Maple Dr, Portsmouth, NH 03801', recipientTin: '56-7890123', totalPaidCents: 3_400_000 },
    { recipientName: 'Tom Parker Landscaping', recipientAddress: '15 Cedar Way, Keene, NH 03431', recipientTin: '67-8901234', totalPaidCents: 72_000 },
    { recipientName: 'Nancy Cooper Cleaning', recipientAddress: '88 Walnut Ct, Laconia, NH 03246', recipientTin: '78-9012345', totalPaidCents: 35_000 },
  ];
}

/** Mock payer info */
function getMockPayerInfo(): { name: string; address: string; tin: string; statePayerNumber: string } {
  return {
    name: 'Sherpa Property Management LLC',
    address: '100 Main St, Suite 200, Manchester, NH 03101',
    tin: '99-8765432',
    statePayerNumber: 'NH-12345',
  };
}

/**
 * Generate 1099-NEC forms for all payees over the $600 threshold
 * In production this would query real payment data; here we use mock data.
 */
export function generateAll1099s(
  _payerUserId: string,
  taxYear: number,
): Form1099NEC[] {
  const payees = getMockPayees();
  const payer = getMockPayerInfo();

  return payees
    .filter((p) => p.totalPaidCents >= THRESHOLD_CENTS)
    .map((p) => ({
      taxYear,
      payerName: payer.name,
      payerAddress: payer.address,
      payerTin: payer.tin,
      recipientName: p.recipientName,
      recipientAddress: p.recipientAddress,
      recipientTin: p.recipientTin,
      nonemployeeCompensation: p.totalPaidCents,
      federalTaxWithheld: 0,
      stateTaxWithheld: 0,
      statePayerNumber: payer.statePayerNumber,
      stateIncome: p.totalPaidCents,
    }));
}
