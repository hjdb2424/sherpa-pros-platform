export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  proName: string;
  lineItems: LineItem[];
  materialsSubtotal: number;
  laborSubtotal: number;
  serviceFeePct: number;
  serviceFeeCents: number;
  totalCents: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
}

// Mock invoice data keyed by job ID
const MOCK_INVOICES: Record<string, Invoice> = {
  'job-030': {
    id: 'inv-001',
    jobId: 'job-030',
    jobTitle: 'Window Trim Replacement — 8 Windows',
    clientName: 'Patricia G.',
    proName: 'Marcus Rivera',
    lineItems: [
      { description: 'PVC Window Trim (per window)', quantity: 8, unitPrice: 12500, total: 100000 },
      { description: 'Exterior Caulk', quantity: 4, unitPrice: 850, total: 3400 },
      { description: 'Paint (Exterior, 1 gal)', quantity: 2, unitPrice: 4500, total: 9000 },
      { description: 'Labor — Trim removal & installation', quantity: 16, unitPrice: 7500, total: 120000 },
      { description: 'Labor — Caulk & paint', quantity: 6, unitPrice: 7500, total: 45000 },
    ],
    materialsSubtotal: 112400,
    laborSubtotal: 165000,
    serviceFeePct: 5,
    serviceFeeCents: 13870,
    totalCents: 291270,
    status: 'paid',
    createdAt: '2026-03-13T18:00:00Z',
  },
  'job-031': {
    id: 'inv-002',
    jobId: 'job-031',
    jobTitle: 'Basement Waterproofing — Interior',
    clientName: 'Frank H.',
    proName: 'Marcus Rivera',
    lineItems: [
      { description: 'Perforated Drain Pipe (per LF)', quantity: 120, unitPrice: 350, total: 42000 },
      { description: 'Gravel (cu yd)', quantity: 3, unitPrice: 5500, total: 16500 },
      { description: 'Sump Pump + Basin', quantity: 1, unitPrice: 42000, total: 42000 },
      { description: 'Hydraulic Cement (50lb bag)', quantity: 4, unitPrice: 2800, total: 11200 },
      { description: 'Labor — Excavation & install', quantity: 24, unitPrice: 7500, total: 180000 },
      { description: 'Labor — Concrete patching', quantity: 8, unitPrice: 7500, total: 60000 },
    ],
    materialsSubtotal: 111700,
    laborSubtotal: 240000,
    serviceFeePct: 5,
    serviceFeeCents: 17585,
    totalCents: 369285,
    status: 'paid',
    createdAt: '2026-02-25T18:00:00Z',
  },
  'job-4': {
    id: 'inv-003',
    jobId: 'job-4',
    jobTitle: "Fix garage door — won't close fully",
    clientName: 'Phyrom',
    proName: 'James Wilson',
    lineItems: [
      { description: 'Safety sensor realignment', quantity: 1, unitPrice: 5000, total: 5000 },
      { description: 'Track adjustment & lubrication', quantity: 1, unitPrice: 3500, total: 3500 },
      { description: 'Labor — Diagnosis', quantity: 1, unitPrice: 5000, total: 5000 },
      { description: 'Labor — Repair & testing', quantity: 2, unitPrice: 7500, total: 15000 },
    ],
    materialsSubtotal: 8500,
    laborSubtotal: 20000,
    serviceFeePct: 5,
    serviceFeeCents: 1425,
    totalCents: 29925,
    status: 'paid',
    createdAt: '2026-04-02T16:00:00Z',
  },
  'job-5': {
    id: 'inv-004',
    jobId: 'job-5',
    jobTitle: 'Deck staining — 400 sq ft composite deck',
    clientName: 'Phyrom',
    proName: 'Tom Bradley',
    lineItems: [
      { description: 'Composite deck stain (gal)', quantity: 3, unitPrice: 5500, total: 16500 },
      { description: 'Deck cleaner concentrate', quantity: 2, unitPrice: 1800, total: 3600 },
      { description: 'Labor — Power wash & prep', quantity: 4, unitPrice: 7500, total: 30000 },
      { description: 'Labor — Staining & finish coat', quantity: 8, unitPrice: 7500, total: 60000 },
    ],
    materialsSubtotal: 20100,
    laborSubtotal: 90000,
    serviceFeePct: 5,
    serviceFeeCents: 5505,
    totalCents: 115605,
    status: 'sent',
    createdAt: '2026-03-18T16:00:00Z',
  },
  'job-6': {
    id: 'inv-005',
    jobId: 'job-6',
    jobTitle: 'Emergency: Burst pipe in basement',
    clientName: 'Phyrom',
    proName: 'Mike Rodriguez',
    lineItems: [
      { description: 'Emergency call-out', quantity: 1, unitPrice: 15000, total: 15000 },
      { description: 'Copper pipe & fittings', quantity: 1, unitPrice: 8500, total: 8500 },
      { description: 'SharkBite connectors', quantity: 2, unitPrice: 1200, total: 2400 },
      { description: 'Labor — Emergency shutoff & assessment', quantity: 2, unitPrice: 10000, total: 20000 },
      { description: 'Labor — Pipe repair', quantity: 4, unitPrice: 10000, total: 40000 },
      { description: 'Labor — Water cleanup & inspection', quantity: 3, unitPrice: 10000, total: 30000 },
    ],
    materialsSubtotal: 25900,
    laborSubtotal: 90000,
    serviceFeePct: 5,
    serviceFeeCents: 5795,
    totalCents: 121695,
    status: 'paid',
    createdAt: '2026-03-29T10:00:00Z',
  },
};

export function generateInvoice(jobId: string): Invoice {
  if (MOCK_INVOICES[jobId]) {
    return MOCK_INVOICES[jobId];
  }

  // Generate a generic invoice for unknown job IDs
  return {
    id: `inv-${jobId}`,
    jobId,
    jobTitle: 'Job #' + jobId,
    clientName: 'Client',
    proName: 'Pro',
    lineItems: [
      { description: 'General labor', quantity: 8, unitPrice: 7500, total: 60000 },
      { description: 'Materials', quantity: 1, unitPrice: 25000, total: 25000 },
    ],
    materialsSubtotal: 25000,
    laborSubtotal: 60000,
    serviceFeePct: 5,
    serviceFeeCents: 4250,
    totalCents: 89250,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
}

export function getInvoiceById(id: string): Invoice | undefined {
  return Object.values(MOCK_INVOICES).find((inv) => inv.id === id);
}

export function getInvoiceByJobId(jobId: string): Invoice | undefined {
  return MOCK_INVOICES[jobId];
}

function formatCentsToUsd(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatInvoiceHTML(invoice: Invoice): string {
  const lineItemsRows = invoice.lineItems
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#3f3f46;">${item.description}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#3f3f46;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#3f3f46;text-align:right;">${formatCentsToUsd(item.unitPrice)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e4e4e7;font-size:14px;color:#18181b;text-align:right;font-weight:500;">${formatCentsToUsd(item.total)}</td>
      </tr>`,
    )
    .join('');

  const createdDate = new Date(invoice.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusColor =
    invoice.status === 'paid'
      ? '#10b981'
      : invoice.status === 'sent'
        ? '#f59e0b'
        : '#71717a';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${invoice.id}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; margin: 0; padding: 40px; color: #18181b; }
  </style>
</head>
<body>
  <div style="max-width:800px;margin:0 auto;">
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;">
      <div>
        <h1 style="margin:0;font-size:28px;font-weight:700;">
          <span style="color:#18181b;">SHERPA</span><span style="color:#ff4500;">PROS</span>
        </h1>
        <p style="margin:4px 0 0;font-size:13px;color:#71717a;">Construction Marketplace</p>
      </div>
      <div style="text-align:right;">
        <p style="margin:0;font-size:24px;font-weight:700;color:#18181b;">INVOICE</p>
        <p style="margin:4px 0 0;font-size:13px;color:#71717a;">${invoice.id.toUpperCase()}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#71717a;">${createdDate}</p>
        <span style="display:inline-block;margin-top:8px;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:600;color:white;background:${statusColor};text-transform:uppercase;">
          ${invoice.status}
        </span>
      </div>
    </div>

    <!-- Parties -->
    <div style="display:flex;gap:40px;margin-bottom:32px;">
      <div style="flex:1;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;">From</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${invoice.proName}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#71717a;">Licensed Pro via Sherpa Pros</p>
      </div>
      <div style="flex:1;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;">Bill To</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#18181b;">${invoice.clientName}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#71717a;">Job: ${invoice.jobTitle}</p>
      </div>
    </div>

    <!-- Line Items Table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e4e4e7;">Description</th>
          <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e4e4e7;">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e4e4e7;">Unit Price</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #e4e4e7;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemsRows}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="display:flex;justify-content:flex-end;">
      <div style="width:280px;">
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;">
          <span style="color:#71717a;">Materials Subtotal</span>
          <span style="color:#18181b;font-weight:500;">${formatCentsToUsd(invoice.materialsSubtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;">
          <span style="color:#71717a;">Labor Subtotal</span>
          <span style="color:#18181b;font-weight:500;">${formatCentsToUsd(invoice.laborSubtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;">
          <span style="color:#71717a;">Service Fee (${invoice.serviceFeePct}%)</span>
          <span style="color:#18181b;font-weight:500;">${formatCentsToUsd(invoice.serviceFeeCents)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:2px solid #18181b;font-size:18px;font-weight:700;">
          <span style="color:#18181b;">Total</span>
          <span style="color:#18181b;">${formatCentsToUsd(invoice.totalCents)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #e4e4e7;text-align:center;">
      <p style="margin:0;font-size:12px;color:#a1a1aa;">
        Payment processed securely via Sherpa Pros Escrow
      </p>
      <p style="margin:4px 0 0;font-size:12px;color:#a1a1aa;">
        Questions? Contact support@thesherpapros.com
      </p>
    </div>
  </div>
</body>
</html>`;
}
