// ---------------------------------------------------------------------------
// Quote Builder Service — Pure Functions, Integer Cents
// ---------------------------------------------------------------------------

export interface QuoteLineItem {
  id: string;
  category: 'labor' | 'materials' | 'equipment' | 'permit' | 'disposal' | 'other';
  description: string;
  quantity: number;
  unit: string;
  unitCostCents: number;
  markupPct: number;
  totalCents: number;
  wisemanSuggested: boolean;
  proAdjusted: boolean;
  notes?: string;
}

export interface Quote {
  id: string;
  jobId: string;
  proId: string;
  clientName: string;
  jobTitle: string;
  jobDescription: string;
  lineItems: QuoteLineItem[];
  laborSubtotalCents: number;
  materialsSubtotalCents: number;
  otherSubtotalCents: number;
  subtotalCents: number;
  taxPct: number;
  taxCents: number;
  discountPct: number;
  discountCents: number;
  totalCents: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  scopeOfWork: string;
  timeline: string;
  paymentTerms: string;
  createdAt: string;
  sentAt?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function lineTotal(qty: number, unitCostCents: number, markupPct: number): number {
  return Math.round(qty * unitCostCents * (1 + markupPct / 100));
}

let counter = 1;
function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${counter++}`;
}

// ---------------------------------------------------------------------------
// Calculate totals from line items
// ---------------------------------------------------------------------------

export function calculateQuoteTotals(
  lineItems: QuoteLineItem[],
  taxPct: number,
  discountPct: number,
): { laborSubtotalCents: number; materialsSubtotalCents: number; otherSubtotalCents: number; subtotalCents: number; taxCents: number; discountCents: number; totalCents: number } {
  let laborSubtotalCents = 0;
  let materialsSubtotalCents = 0;
  let otherSubtotalCents = 0;

  for (const item of lineItems) {
    const t = lineTotal(item.quantity, item.unitCostCents, item.markupPct);
    if (item.category === 'labor') laborSubtotalCents += t;
    else if (item.category === 'materials') materialsSubtotalCents += t;
    else otherSubtotalCents += t;
  }

  const subtotalCents = laborSubtotalCents + materialsSubtotalCents + otherSubtotalCents;
  const discountCents = Math.round((subtotalCents * discountPct) / 100);
  const afterDiscount = subtotalCents - discountCents;
  const taxCents = Math.round((afterDiscount * taxPct) / 100);
  const totalCents = afterDiscount + taxCents;

  return { laborSubtotalCents, materialsSubtotalCents, otherSubtotalCents, subtotalCents, taxCents, discountCents, totalCents };
}

// ---------------------------------------------------------------------------
// Recalculate line item total (used after edits)
// ---------------------------------------------------------------------------

export function recalcLineItem(item: QuoteLineItem): QuoteLineItem {
  return { ...item, totalCents: lineTotal(item.quantity, item.unitCostCents, item.markupPct) };
}

// ---------------------------------------------------------------------------
// Generate a Quote from a Job (mock — bathroom remodel)
// ---------------------------------------------------------------------------

export function generateQuoteFromJob(jobId: string): Quote {
  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setDate(validUntil.getDate() + 30);

  const laborItems: QuoteLineItem[] = [
    {
      id: nextId('li'),
      category: 'labor',
      description: 'Demolition — remove existing fixtures, tile, vanity',
      quantity: 8,
      unit: 'hr',
      unitCostCents: 7500,
      markupPct: 30,
      totalCents: 0,
      wisemanSuggested: true,
      proAdjusted: false,
    },
    {
      id: nextId('li'),
      category: 'labor',
      description: 'Plumbing rough-in — relocate supply/drain lines',
      quantity: 10,
      unit: 'hr',
      unitCostCents: 7500,
      markupPct: 30,
      totalCents: 0,
      wisemanSuggested: true,
      proAdjusted: false,
    },
    {
      id: nextId('li'),
      category: 'labor',
      description: 'Tile installation — floor and shower surround',
      quantity: 12,
      unit: 'hr',
      unitCostCents: 7500,
      markupPct: 30,
      totalCents: 0,
      wisemanSuggested: true,
      proAdjusted: false,
    },
    {
      id: nextId('li'),
      category: 'labor',
      description: 'Fixture installation — vanity, toilet, shower valve',
      quantity: 10,
      unit: 'hr',
      unitCostCents: 7500,
      markupPct: 30,
      totalCents: 0,
      wisemanSuggested: true,
      proAdjusted: false,
    },
  ];

  const materialItems: QuoteLineItem[] = [
    { id: nextId('li'), category: 'materials', description: 'Porcelain floor tile (12x24) — 60 sq ft', quantity: 60, unit: 'sqft', unitCostCents: 450, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'materials', description: 'Subway wall tile (3x6) — 80 sq ft', quantity: 80, unit: 'sqft', unitCostCents: 350, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'materials', description: 'Thinset mortar (50 lb bag)', quantity: 3, unit: 'bag', unitCostCents: 2499, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'materials', description: 'Grout — unsanded (25 lb)', quantity: 2, unit: 'bag', unitCostCents: 1899, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'materials', description: 'Vanity w/ top — 36" white shaker', quantity: 1, unit: 'ea', unitCostCents: 54900, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'materials', description: 'Toilet — Kohler Highline comfort height', quantity: 1, unit: 'ea', unitCostCents: 34900, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'materials', description: 'Shower valve trim kit — Moen Align', quantity: 1, unit: 'ea', unitCostCents: 18900, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'materials', description: 'Cement backer board (3x5 sheets)', quantity: 6, unit: 'sheet', unitCostCents: 1299, markupPct: 20, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
  ];

  const otherItems: QuoteLineItem[] = [
    { id: nextId('li'), category: 'permit', description: 'Plumbing permit — City of Portsmouth', quantity: 1, unit: 'ea', unitCostCents: 15000, markupPct: 0, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
    { id: nextId('li'), category: 'disposal', description: 'Dumpster rental — 10 yd construction debris', quantity: 1, unit: 'ea', unitCostCents: 20000, markupPct: 10, totalCents: 0, wisemanSuggested: true, proAdjusted: false },
  ];

  // Recalculate totals for each line
  const allItems = [...laborItems, ...materialItems, ...otherItems].map(recalcLineItem);

  const totals = calculateQuoteTotals(allItems, 0, 0);

  return {
    id: nextId('q'),
    jobId,
    proId: 'pro-mike-johnson',
    clientName: 'Sarah Chen',
    jobTitle: 'Bathroom Remodel — Full Gut',
    jobDescription: 'Complete bathroom renovation including new tile, vanity, toilet, and shower fixtures. Demo existing finishes down to studs.',
    lineItems: allItems,
    ...totals,
    taxPct: 0,
    discountPct: 0,
    validUntil: validUntil.toISOString(),
    status: 'draft',
    scopeOfWork:
      'Complete bathroom renovation: demolish existing fixtures and finishes, re-route plumbing supply and drain lines per code, install cement backer board, tile floor and shower surround, install new vanity with top, toilet, and shower valve trim. All work to meet NH plumbing code requirements. Includes debris removal and permit acquisition.',
    timeline: '5-7 business days',
    paymentTerms: '50% deposit, 50% on completion',
    createdAt: now.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// In-memory quote store (mock DB)
// ---------------------------------------------------------------------------

const quoteStore = new Map<string, Quote>();

export function getQuote(id: string): Quote | undefined {
  return quoteStore.get(id);
}

export function listQuotes(filters?: { proId?: string; jobId?: string; status?: string }): Quote[] {
  let results = Array.from(quoteStore.values());
  if (filters?.proId) results = results.filter((q) => q.proId === filters.proId);
  if (filters?.jobId) results = results.filter((q) => q.jobId === filters.jobId);
  if (filters?.status) results = results.filter((q) => q.status === filters.status);
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveQuote(quote: Quote): Quote {
  quoteStore.set(quote.id, quote);
  return quote;
}

// ---------------------------------------------------------------------------
// Format as printable HTML
// ---------------------------------------------------------------------------

function fmtCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatQuoteHTML(quote: Quote): string {
  const categories: Record<string, QuoteLineItem[]> = {};
  for (const item of quote.lineItems) {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  }

  const categoryLabels: Record<string, string> = {
    labor: 'Labor',
    materials: 'Materials',
    equipment: 'Equipment',
    permit: 'Permits & Fees',
    disposal: 'Disposal',
    other: 'Other',
  };

  const rows = Object.entries(categories)
    .map(([cat, items]) => {
      const catLabel = categoryLabels[cat] ?? cat;
      const header = `<tr style="background:#f0f9ff;"><td colspan="5" style="padding:10px 12px;font-weight:700;font-size:13px;color:#0284c7;border-bottom:1px solid #e2e8f0;">${catLabel}</td></tr>`;
      const itemRows = items
        .map(
          (it) =>
            `<tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:8px 12px;font-size:13px;color:#334155;">${it.description}</td>
              <td style="padding:8px 12px;text-align:center;font-size:13px;color:#64748b;">${it.quantity} ${it.unit}</td>
              <td style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b;">${fmtCents(it.unitCostCents)}</td>
              <td style="padding:8px 12px;text-align:center;font-size:13px;color:#64748b;">${it.markupPct > 0 ? it.markupPct + '%' : '—'}</td>
              <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:600;color:#1e293b;">${fmtCents(it.totalCents)}</td>
            </tr>`,
        )
        .join('');
      return header + itemRows;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quote ${quote.id}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f8fafc; color:#1e293b; }
    .page { max-width:800px; margin:24px auto; background:#fff; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.08); overflow:hidden; }
    .header { background:linear-gradient(135deg,#00a9e0,#0284c7); color:#fff; padding:32px; }
    .header h1 { font-size:28px; font-weight:800; letter-spacing:-0.5px; }
    .header p { margin-top:4px; opacity:0.85; font-size:14px; }
    .meta { display:flex; gap:32px; padding:24px 32px; border-bottom:1px solid #e2e8f0; }
    .meta-col h3 { font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; margin-bottom:4px; }
    .meta-col p { font-size:14px; color:#334155; }
    table { width:100%; border-collapse:collapse; }
    th { text-align:left; padding:10px 12px; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; border-bottom:2px solid #e2e8f0; }
    th:nth-child(3), th:nth-child(5) { text-align:right; }
    th:nth-child(2), th:nth-child(4) { text-align:center; }
    .totals { padding:24px 32px; }
    .totals-row { display:flex; justify-content:space-between; padding:6px 0; font-size:14px; color:#64748b; }
    .totals-row.grand { font-size:20px; font-weight:800; color:#1e293b; padding:12px 0; border-top:2px solid #00a9e0; margin-top:8px; }
    .section { padding:24px 32px; border-top:1px solid #e2e8f0; }
    .section h2 { font-size:15px; font-weight:700; color:#1e293b; margin-bottom:8px; }
    .section p { font-size:14px; color:#475569; line-height:1.6; }
    .sig { padding:32px; border-top:1px solid #e2e8f0; display:flex; gap:48px; }
    .sig-line { flex:1; }
    .sig-line .line { border-top:1px solid #cbd5e1; margin-top:48px; padding-top:8px; font-size:12px; color:#94a3b8; }
    @media print { body { background:#fff; } .page { box-shadow:none; margin:0; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>ESTIMATE</h1>
      <p>Quote #${quote.id}</p>
    </div>

    <div class="meta">
      <div class="meta-col">
        <h3>Prepared For</h3>
        <p><strong>${quote.clientName}</strong></p>
        <p>${quote.jobTitle}</p>
      </div>
      <div class="meta-col">
        <h3>Date</h3>
        <p>${new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
      <div class="meta-col">
        <h3>Valid Until</h3>
        <p>${new Date(quote.validUntil).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Markup</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row"><span>Labor</span><span>${fmtCents(quote.laborSubtotalCents)}</span></div>
      <div class="totals-row"><span>Materials</span><span>${fmtCents(quote.materialsSubtotalCents)}</span></div>
      <div class="totals-row"><span>Other</span><span>${fmtCents(quote.otherSubtotalCents)}</span></div>
      <div class="totals-row"><span>Subtotal</span><span>${fmtCents(quote.subtotalCents)}</span></div>
      ${quote.discountPct > 0 ? `<div class="totals-row"><span>Discount (${quote.discountPct}%)</span><span>-${fmtCents(quote.discountCents)}</span></div>` : ''}
      ${quote.taxPct > 0 ? `<div class="totals-row"><span>Tax (${quote.taxPct}%)</span><span>${fmtCents(quote.taxCents)}</span></div>` : ''}
      <div class="totals-row grand"><span>Grand Total</span><span>${fmtCents(quote.totalCents)}</span></div>
    </div>

    <div class="section">
      <h2>Scope of Work</h2>
      <p>${quote.scopeOfWork}</p>
    </div>

    <div class="section">
      <h2>Timeline</h2>
      <p>${quote.timeline}</p>
    </div>

    <div class="section">
      <h2>Payment Terms</h2>
      <p>${quote.paymentTerms}</p>
    </div>

    <div class="sig">
      <div class="sig-line">
        <div class="line">Client Signature / Date</div>
      </div>
      <div class="sig-line">
        <div class="line">Contractor Signature / Date</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
