// ---------------------------------------------------------------------------
// Wisetack Financing Service
// Reads WISETACK_API_KEY from process.env (server-side only).
// If no key: returns mock financing result with realistic terms.
// If key set: calls Wisetack API (placeholder — requires partnership).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FinancingApplication {
  clientName: string;
  clientEmail: string;
  amountCents: number;
  jobDescription: string;
}

export interface FinancingResult {
  applicationId: string;
  status: 'approved' | 'pending' | 'declined' | 'mock';
  approvedAmountCents: number;
  apr: number;
  termMonths: number;
  monthlyPaymentCents: number;
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const WISETACK_BASE_URL = 'https://api.wisetack.com/v1';

export function isWisetackConfigured(): boolean {
  return !!process.env.WISETACK_API_KEY;
}

// ---------------------------------------------------------------------------
// Monthly payment calculation
// amountCents * (r * (1+r)^n) / ((1+r)^n - 1)
// where r = apr/100/12, n = termMonths
// ---------------------------------------------------------------------------

function calculateMonthlyPaymentCents(
  amountCents: number,
  apr: number,
  termMonths: number,
): number {
  if (apr === 0) {
    return Math.round(amountCents / termMonths);
  }
  const r = apr / 100 / 12;
  const factor = Math.pow(1 + r, termMonths);
  return Math.round((amountCents * (r * factor)) / (factor - 1));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateMockId(): string {
  return `wt_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Apply for financing
// ---------------------------------------------------------------------------

export async function applyForFinancing(
  application: FinancingApplication,
): Promise<FinancingResult> {
  if (!application.clientName || !application.clientEmail) {
    throw new Error('clientName and clientEmail are required');
  }
  if (application.amountCents <= 0) {
    throw new RangeError('amountCents must be positive');
  }

  const apiKey = process.env.WISETACK_API_KEY;

  // Mock mode — always approve with realistic terms
  if (!apiKey) {
    const apr = 9.99;
    const termMonths = 24;
    const monthlyPaymentCents = calculateMonthlyPaymentCents(
      application.amountCents,
      apr,
      termMonths,
    );

    return {
      applicationId: generateMockId(),
      status: 'mock',
      approvedAmountCents: application.amountCents,
      apr,
      termMonths,
      monthlyPaymentCents,
      isMock: true,
    };
  }

  // Real mode — call Wisetack API
  try {
    const response = await fetch(`${WISETACK_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        customer_name: application.clientName,
        customer_email: application.clientEmail,
        amount_cents: application.amountCents,
        description: application.jobDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(`Wisetack API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      applicationId: data.id,
      status: data.status as FinancingResult['status'],
      approvedAmountCents: data.approved_amount_cents ?? 0,
      apr: data.apr ?? 0,
      termMonths: data.term_months ?? 0,
      monthlyPaymentCents: data.monthly_payment_cents ?? 0,
      isMock: false,
    };
  } catch {
    return {
      applicationId: '',
      status: 'declined',
      approvedAmountCents: 0,
      apr: 0,
      termMonths: 0,
      monthlyPaymentCents: 0,
      isMock: false,
    };
  }
}

// Re-export the monthly payment calculation for use in UI
export { calculateMonthlyPaymentCents };
