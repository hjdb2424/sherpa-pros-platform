// ---------------------------------------------------------------------------
// Tremendous Rewards Service — Gift cards, prepaid cards, PayPal, bank transfers
// Reads TREMENDOUS_API_KEY + TREMENDOUS_ENVIRONMENT from process.env (server-side).
// If no key: returns mock data with realistic structure.
// If key set: makes real Tremendous API calls.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TremendousProduct {
  id: string;
  name: string;
  category: 'gift_card' | 'prepaid_card' | 'bank_transfer' | 'merchant_card';
  min_value: number;
  max_value: number;
  currency_codes?: string[];
  image_url?: string;
}

export interface TremendousRecipient {
  name: string;
  email: string;
}

export interface TremendousOrder {
  id: string;
  status: 'EXECUTED' | 'PENDING' | 'FAILED' | 'DELIVERED' | 'CANCELED';
  recipient: TremendousRecipient;
  amount: number;
  product: string;
  created_at?: string;
  delivered_at?: string;
  isMock?: boolean;
}

export interface TremendousWebhookEvent {
  id: string;
  event: string;
  payload: {
    order?: {
      id: string;
      status: string;
    };
    [key: string]: unknown;
  };
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

function getBaseUrl(): string {
  const env = process.env.TREMENDOUS_ENVIRONMENT ?? 'sandbox';
  return env === 'production'
    ? 'https://www.tremendous.com/api/v2'
    : 'https://testflight.tremendous.com/api/v2';
}

function getApiKey(): string | null {
  return process.env.TREMENDOUS_API_KEY ?? null;
}

export function isTremendousConfigured(): boolean {
  return !!getApiKey();
}

export function getTremendousEnvironment(): 'sandbox' | 'production' {
  return (process.env.TREMENDOUS_ENVIRONMENT ?? 'sandbox') as 'sandbox' | 'production';
}

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function tremendousRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('TREMENDOUS_API_KEY is not configured');

  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => 'Unknown error');
    throw new Error(`Tremendous API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_PRODUCTS: TremendousProduct[] = [
  { id: 'OKMHMENTJKQA', name: 'Amazon', category: 'gift_card', min_value: 5, max_value: 500 },
  { id: 'PKMHMENTJKQA', name: 'Home Depot', category: 'gift_card', min_value: 10, max_value: 500 },
  { id: 'QKMHMENTJKQA', name: 'Lowes', category: 'gift_card', min_value: 10, max_value: 500 },
  { id: 'RKMHMENTJKQA', name: 'Starbucks', category: 'gift_card', min_value: 5, max_value: 100 },
  { id: 'VISA_PREPAID', name: 'Visa Prepaid Card', category: 'prepaid_card', min_value: 10, max_value: 1000 },
  { id: 'PAYPAL', name: 'PayPal', category: 'bank_transfer', min_value: 1, max_value: 5000 },
];

function generateMockOrderId(): string {
  return `mock_order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * List available reward products (gift cards, prepaid, etc.).
 * Returns mock data when TREMENDOUS_API_KEY is not set.
 */
export async function listProducts(): Promise<TremendousProduct[]> {
  if (!isTremendousConfigured()) {
    return MOCK_PRODUCTS;
  }

  try {
    const data = await tremendousRequest<{ products: Array<{
      id: string;
      name: string;
      category: string;
      skus: Array<{ min: number; max: number; currency_codes: string[] }>;
      images: Array<{ src: string }>;
    }> }>('/products');

    return data.products.map((p) => ({
      id: p.id,
      name: p.name,
      category: (p.category ?? 'gift_card') as TremendousProduct['category'],
      min_value: p.skus?.[0]?.min ?? 5,
      max_value: p.skus?.[0]?.max ?? 500,
      currency_codes: p.skus?.[0]?.currency_codes,
      image_url: p.images?.[0]?.src,
    }));
  } catch (error) {
    console.error('[Tremendous] Failed to list products:', error);
    throw error;
  }
}

/**
 * Create a reward order — send a reward to a pro.
 * Returns mock data when TREMENDOUS_API_KEY is not set.
 */
export async function createReward(params: {
  recipientName: string;
  recipientEmail: string;
  amount: number; // in dollars
  productId?: string;
  message?: string;
  campaignId?: string;
}): Promise<TremendousOrder> {
  if (!isTremendousConfigured()) {
    // Find product name from mock data
    const product = MOCK_PRODUCTS.find((p) => p.id === params.productId);
    return {
      id: generateMockOrderId(),
      status: 'EXECUTED',
      recipient: { name: params.recipientName, email: params.recipientEmail },
      amount: params.amount,
      product: product?.name ?? 'Gift Card',
      created_at: new Date().toISOString(),
      isMock: true,
    };
  }

  try {
    const body: Record<string, unknown> = {
      payment: {
        funding_source_id: 'BALANCE', // use Tremendous account balance
      },
      rewards: [
        {
          value: {
            denomination: params.amount,
            currency_code: 'USD',
          },
          delivery: {
            method: 'EMAIL',
          },
          recipient: {
            name: params.recipientName,
            email: params.recipientEmail,
          },
          products: params.productId ? [params.productId] : undefined,
          ...(params.campaignId ? { campaign_id: params.campaignId } : {}),
        },
      ],
    };

    const data = await tremendousRequest<{
      order: {
        id: string;
        status: string;
        rewards: Array<{
          recipient: { name: string; email: string };
          value: { denomination: number };
          delivery: { status: string };
          product: { name: string };
        }>;
        created_at: string;
      };
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const reward = data.order.rewards[0];
    return {
      id: data.order.id,
      status: data.order.status as TremendousOrder['status'],
      recipient: {
        name: reward?.recipient?.name ?? params.recipientName,
        email: reward?.recipient?.email ?? params.recipientEmail,
      },
      amount: reward?.value?.denomination ?? params.amount,
      product: reward?.product?.name ?? 'Reward',
      created_at: data.order.created_at,
    };
  } catch (error) {
    console.error('[Tremendous] Failed to create reward:', error);
    throw error;
  }
}

/**
 * Get order status by ID.
 * Returns mock data when TREMENDOUS_API_KEY is not set.
 */
export async function getOrder(orderId: string): Promise<TremendousOrder> {
  if (!isTremendousConfigured()) {
    return {
      id: orderId,
      status: 'DELIVERED',
      recipient: { name: 'Demo Pro', email: 'demo@thesherpapros.com' },
      amount: 25,
      product: 'Home Depot',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      delivered_at: new Date().toISOString(),
      isMock: true,
    };
  }

  try {
    const data = await tremendousRequest<{
      order: {
        id: string;
        status: string;
        rewards: Array<{
          recipient: { name: string; email: string };
          value: { denomination: number };
          product: { name: string };
          delivery: { status: string };
        }>;
        created_at: string;
      };
    }>(`/orders/${orderId}`);

    const reward = data.order.rewards[0];
    return {
      id: data.order.id,
      status: data.order.status as TremendousOrder['status'],
      recipient: {
        name: reward?.recipient?.name ?? '',
        email: reward?.recipient?.email ?? '',
      },
      amount: reward?.value?.denomination ?? 0,
      product: reward?.product?.name ?? 'Reward',
      created_at: data.order.created_at,
    };
  } catch (error) {
    console.error('[Tremendous] Failed to get order:', error);
    throw error;
  }
}

/**
 * List recent orders (for admin view).
 * Returns mock data when TREMENDOUS_API_KEY is not set.
 */
export async function listOrders(limit: number = 10): Promise<TremendousOrder[]> {
  if (!isTremendousConfigured()) {
    const now = Date.now();
    return [
      {
        id: 'mock_order_recent_001',
        status: 'DELIVERED',
        recipient: { name: 'Marcus Rivera', email: 'marcus@example.com' },
        amount: 25,
        product: 'Home Depot',
        created_at: new Date(now - 2 * 86400000).toISOString(),
        delivered_at: new Date(now - 2 * 86400000 + 3600000).toISOString(),
        isMock: true,
      },
      {
        id: 'mock_order_recent_002',
        status: 'DELIVERED',
        recipient: { name: 'Sarah Chen', email: 'sarah@example.com' },
        amount: 50,
        product: 'Amazon',
        created_at: new Date(now - 5 * 86400000).toISOString(),
        delivered_at: new Date(now - 5 * 86400000 + 7200000).toISOString(),
        isMock: true,
      },
      {
        id: 'mock_order_recent_003',
        status: 'EXECUTED',
        recipient: { name: 'James Thompson', email: 'james@example.com' },
        amount: 100,
        product: 'Visa Prepaid Card',
        created_at: new Date(now - 7 * 86400000).toISOString(),
        isMock: true,
      },
    ];
  }

  try {
    const data = await tremendousRequest<{
      orders: Array<{
        id: string;
        status: string;
        rewards: Array<{
          recipient: { name: string; email: string };
          value: { denomination: number };
          product: { name: string };
          delivery: { status: string };
        }>;
        created_at: string;
      }>;
    }>(`/orders?limit=${limit}`);

    return data.orders.map((order) => {
      const reward = order.rewards[0];
      return {
        id: order.id,
        status: order.status as TremendousOrder['status'],
        recipient: {
          name: reward?.recipient?.name ?? '',
          email: reward?.recipient?.email ?? '',
        },
        amount: reward?.value?.denomination ?? 0,
        product: reward?.product?.name ?? 'Reward',
        created_at: order.created_at,
      };
    });
  } catch (error) {
    console.error('[Tremendous] Failed to list orders:', error);
    throw error;
  }
}
