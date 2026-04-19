// ---------------------------------------------------------------------------
// QuickBooks Online service — server-side only
// Mock mode when QBO_CLIENT_ID / QBO_CLIENT_SECRET not set.
// ---------------------------------------------------------------------------

export interface QBOConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
}

export interface QBOTokens {
  accessToken: string;
  refreshToken: string;
  realmId: string;
  expiresAt: string;
}

export interface QBOInvoice {
  id: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  lineItems: { description: string; amount: number }[];
}

export interface QBOExpense {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const QBO_BASE_URL = 'https://sandbox-quickbooks.api.intuit.com';
const QBO_PROD_URL = 'https://quickbooks.api.intuit.com';

export function isQBOConfigured(): boolean {
  return !!(process.env.QBO_CLIENT_ID && process.env.QBO_CLIENT_SECRET);
}

function getBaseUrl(): string {
  return process.env.QBO_ENVIRONMENT === 'production' ? QBO_PROD_URL : QBO_BASE_URL;
}

function getConfig(): QBOConfig {
  return {
    clientId: process.env.QBO_CLIENT_ID ?? '',
    clientSecret: process.env.QBO_CLIENT_SECRET ?? '',
    redirectUri:
      process.env.QBO_REDIRECT_URI ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/api/qbo/callback`,
    environment: (process.env.QBO_ENVIRONMENT as 'sandbox' | 'production') ?? 'sandbox',
  };
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_TOKENS: QBOTokens = {
  accessToken: 'mock_qbo_access_token',
  refreshToken: 'mock_qbo_refresh_token',
  realmId: 'mock_realm_123456',
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
};

const MOCK_INVOICES: QBOInvoice[] = [
  {
    id: 'INV-1001',
    customerName: 'Martha Williams',
    amount: 285000,
    status: 'sent',
    dueDate: '2026-04-30',
    lineItems: [
      { description: 'Kitchen Faucet Replacement - Labor', amount: 185000 },
      { description: 'Kitchen Faucet Replacement - Materials', amount: 100000 },
    ],
  },
  {
    id: 'INV-1002',
    customerName: 'Tom Chen',
    amount: 475000,
    status: 'paid',
    dueDate: '2026-04-15',
    lineItems: [
      { description: 'Bathroom Remodel Phase 1 - Demo', amount: 150000 },
      { description: 'Bathroom Remodel Phase 1 - Plumbing', amount: 225000 },
      { description: 'Bathroom Remodel Phase 1 - Materials', amount: 100000 },
    ],
  },
  {
    id: 'INV-1003',
    customerName: 'Rachel Park',
    amount: 125000,
    status: 'overdue',
    dueDate: '2026-04-01',
    lineItems: [
      { description: 'HVAC Filter Replacement + Inspection', amount: 125000 },
    ],
  },
  {
    id: 'INV-1004',
    customerName: 'James Liu',
    amount: 950000,
    status: 'draft',
    dueDate: '2026-05-15',
    lineItems: [
      { description: 'Deck Construction - Cedar Materials', amount: 450000 },
      { description: 'Deck Construction - Labor', amount: 500000 },
    ],
  },
];

const MOCK_EXPENSES: QBOExpense[] = [
  {
    id: 'EXP-2001',
    vendor: 'Home Depot',
    amount: 87500,
    category: 'Materials',
    date: '2026-04-10',
    description: 'Plumbing supplies for Williams job',
  },
  {
    id: 'EXP-2002',
    vendor: 'Lowes',
    amount: 43200,
    category: 'Materials',
    date: '2026-04-08',
    description: 'Electrical wiring and fixtures',
  },
  {
    id: 'EXP-2003',
    vendor: 'Shell Gas Station',
    amount: 6500,
    category: 'Fuel',
    date: '2026-04-12',
    description: 'Work truck fuel',
  },
  {
    id: 'EXP-2004',
    vendor: 'Home Depot',
    amount: 215000,
    category: 'Materials',
    date: '2026-04-05',
    description: 'Cedar lumber for deck construction',
  },
];

// ---------------------------------------------------------------------------
// OAuth
// ---------------------------------------------------------------------------

export function getQBOAuthUrl(): string {
  if (!isQBOConfigured()) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';
    return `${base}/api/qbo/callback?code=mock_qbo_code&realmId=mock_realm_123456&state=mock`;
  }

  const config = getConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'com.intuit.quickbooks.accounting',
    state: crypto.randomUUID(),
  });

  return `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;
}

export async function exchangeQBOCode(code: string): Promise<QBOTokens> {
  if (!isQBOConfigured() || code === 'mock_qbo_code') {
    return MOCK_TOKENS;
  }

  const config = getConfig();
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const res = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    throw new Error(`QBO token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    realmId: data.realmId ?? '',
    expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
  };
}

export async function refreshQBOToken(refreshToken: string): Promise<QBOTokens> {
  if (!isQBOConfigured() || refreshToken === 'mock_qbo_refresh_token') {
    return MOCK_TOKENS;
  }

  const config = getConfig();
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const res = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    throw new Error(`QBO token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    realmId: '',
    expiresAt: new Date(Date.now() + data.expires_in * 1000).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export async function getInvoices(tokens: QBOTokens): Promise<QBOInvoice[]> {
  if (!isQBOConfigured() || tokens.accessToken === 'mock_qbo_access_token') {
    return MOCK_INVOICES;
  }

  const url = `${getBaseUrl()}/v3/company/${tokens.realmId}/query?query=${encodeURIComponent('SELECT * FROM Invoice ORDER BY TxnDate DESC MAXRESULTS 50')}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`QBO get invoices failed: ${res.status}`);
  }

  const data = await res.json();
  const invoices = data.QueryResponse?.Invoice ?? [];

  return invoices.map((inv: Record<string, unknown>) => ({
    id: String(inv.Id ?? ''),
    customerName: (inv.CustomerRef as Record<string, unknown>)?.name ?? 'Unknown',
    amount: Math.round(Number(inv.TotalAmt ?? 0) * 100),
    status: mapQBOInvoiceStatus(inv),
    dueDate: String(inv.DueDate ?? ''),
    lineItems: ((inv.Line as Array<Record<string, unknown>>) ?? [])
      .filter((l) => l.DetailType === 'SalesItemLineDetail')
      .map((l) => ({
        description: String(l.Description ?? ''),
        amount: Math.round(Number(l.Amount ?? 0) * 100),
      })),
  }));
}

function mapQBOInvoiceStatus(inv: Record<string, unknown>): QBOInvoice['status'] {
  const balance = Number(inv.Balance ?? 0);
  if (balance === 0) return 'paid';
  const due = new Date(String(inv.DueDate ?? ''));
  if (due < new Date()) return 'overdue';
  if (inv.EmailStatus === 'EmailSent') return 'sent';
  return 'draft';
}

export async function createInvoice(
  tokens: QBOTokens,
  invoice: Partial<QBOInvoice>,
): Promise<QBOInvoice> {
  if (!isQBOConfigured() || tokens.accessToken === 'mock_qbo_access_token') {
    const mockInv: QBOInvoice = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      customerName: invoice.customerName ?? 'New Client',
      amount: invoice.amount ?? 0,
      status: 'draft',
      dueDate: invoice.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      lineItems: invoice.lineItems ?? [],
    };
    return mockInv;
  }

  const url = `${getBaseUrl()}/v3/company/${tokens.realmId}/invoice`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      CustomerRef: { value: '1' },
      Line: (invoice.lineItems ?? []).map((li) => ({
        Amount: li.amount / 100,
        DetailType: 'SalesItemLineDetail',
        Description: li.description,
        SalesItemLineDetail: { ItemRef: { value: '1' } },
      })),
      DueDate: invoice.dueDate,
    }),
  });

  if (!res.ok) {
    throw new Error(`QBO create invoice failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    id: data.Invoice.Id,
    customerName: invoice.customerName ?? '',
    amount: Math.round(data.Invoice.TotalAmt * 100),
    status: 'draft',
    dueDate: data.Invoice.DueDate,
    lineItems: invoice.lineItems ?? [],
  };
}

export async function syncJobToInvoice(
  tokens: QBOTokens,
  jobId: string,
): Promise<QBOInvoice> {
  // In production, fetch job details from DB and create a real invoice
  return createInvoice(tokens, {
    customerName: `Client for Job ${jobId}`,
    amount: 250000,
    lineItems: [
      { description: `Service for Job #${jobId}`, amount: 250000 },
    ],
  });
}

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------

export async function getExpenses(tokens: QBOTokens): Promise<QBOExpense[]> {
  if (!isQBOConfigured() || tokens.accessToken === 'mock_qbo_access_token') {
    return MOCK_EXPENSES;
  }

  const url = `${getBaseUrl()}/v3/company/${tokens.realmId}/query?query=${encodeURIComponent('SELECT * FROM Purchase ORDER BY TxnDate DESC MAXRESULTS 50')}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`QBO get expenses failed: ${res.status}`);
  }

  const data = await res.json();
  const purchases = data.QueryResponse?.Purchase ?? [];

  return purchases.map((p: Record<string, unknown>) => ({
    id: String(p.Id ?? ''),
    vendor: (p.EntityRef as Record<string, unknown>)?.name ?? 'Unknown',
    amount: Math.round(Number(p.TotalAmt ?? 0) * 100),
    category: 'Materials',
    date: String(p.TxnDate ?? ''),
    description: String(p.PrivateNote ?? ''),
  }));
}

export async function createExpense(
  tokens: QBOTokens,
  expense: Partial<QBOExpense>,
): Promise<QBOExpense> {
  if (!isQBOConfigured() || tokens.accessToken === 'mock_qbo_access_token') {
    return {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      vendor: expense.vendor ?? 'Unknown Vendor',
      amount: expense.amount ?? 0,
      category: expense.category ?? 'Materials',
      date: expense.date ?? new Date().toISOString().slice(0, 10),
      description: expense.description ?? '',
    };
  }

  const url = `${getBaseUrl()}/v3/company/${tokens.realmId}/purchase`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      PaymentType: 'Cash',
      TotalAmt: (expense.amount ?? 0) / 100,
      PrivateNote: expense.description,
      Line: [
        {
          Amount: (expense.amount ?? 0) / 100,
          DetailType: 'AccountBasedExpenseLineDetail',
          AccountBasedExpenseLineDetail: { AccountRef: { value: '1' } },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`QBO create expense failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    id: data.Purchase.Id,
    vendor: expense.vendor ?? '',
    amount: Math.round(data.Purchase.TotalAmt * 100),
    category: expense.category ?? 'Materials',
    date: data.Purchase.TxnDate,
    description: expense.description ?? '',
  };
}

export async function syncMaterialsToExpense(
  tokens: QBOTokens,
  materialsListId: string,
): Promise<QBOExpense> {
  return createExpense(tokens, {
    vendor: 'Home Depot',
    amount: 87500,
    category: 'Materials',
    description: `Materials for list #${materialsListId}`,
  });
}
