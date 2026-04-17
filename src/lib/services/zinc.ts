// ---------------------------------------------------------------------------
// Zinc API — Home Depot Order Service
// Reads ZINC_API_KEY from process.env (server-side only).
// If no key: returns mock order confirmation.
// If key set: places order via Zinc API.
// ---------------------------------------------------------------------------

export type DeliveryTier = 'bopis' | 'hd_delivery' | 'gig' | 'pro_choice';

export interface OrderItem {
  hdSku: string;
  quantity: number;
  name: string;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderRequest {
  items: OrderItem[];
  deliveryTier: DeliveryTier;
  storeId?: string;
  deliveryAddress?: OrderAddress;
  clientName: string;
}

export interface OrderResult {
  orderId: string;
  status: 'placed' | 'confirmed' | 'failed';
  estimatedReady: string; // ISO datetime
  trackingUrl?: string;
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Config check
// ---------------------------------------------------------------------------

export function isZincConfigured(): boolean {
  return !!process.env.ZINC_API_KEY;
}

// ---------------------------------------------------------------------------
// Mock order generation
// ---------------------------------------------------------------------------

function generateMockOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'HD-';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function getMockEstimatedReady(tier: DeliveryTier): string {
  const now = new Date();
  switch (tier) {
    case 'bopis':
      // Ready in 30 minutes
      now.setMinutes(now.getMinutes() + 30);
      break;
    case 'hd_delivery':
      // 2 business days
      now.setDate(now.getDate() + 2);
      break;
    case 'gig':
      // 90 minutes
      now.setMinutes(now.getMinutes() + 90);
      break;
    case 'pro_choice':
      // 1 business day
      now.setDate(now.getDate() + 1);
      break;
  }
  return now.toISOString();
}

function createMockOrder(request: OrderRequest): OrderResult {
  return {
    orderId: generateMockOrderId(),
    status: 'confirmed',
    estimatedReady: getMockEstimatedReady(request.deliveryTier),
    trackingUrl:
      request.deliveryTier === 'hd_delivery' || request.deliveryTier === 'gig'
        ? `https://track.example.com/${generateMockOrderId()}`
        : undefined,
    isMock: true,
  };
}

// ---------------------------------------------------------------------------
// Zinc API types (subset)
// ---------------------------------------------------------------------------

interface ZincProduct {
  product_id: string;
  quantity: number;
}

interface ZincAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
}

interface ZincOrderRequest {
  retailer: string;
  products: ZincProduct[];
  shipping_address?: ZincAddress;
  is_gift: boolean;
  shipping_method?: string;
}

interface ZincOrderResponse {
  request_id?: string;
  error?: { message?: string; code?: string };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function placeHomeDepotOrder(
  request: OrderRequest,
): Promise<OrderResult> {
  if (!isZincConfigured()) {
    return createMockOrder(request);
  }

  const apiKey = process.env.ZINC_API_KEY!;

  // Build Zinc-formatted request
  const zincProducts: ZincProduct[] = request.items.map((item) => ({
    product_id: item.hdSku,
    quantity: item.quantity,
  }));

  const zincBody: ZincOrderRequest = {
    retailer: 'homedepot',
    products: zincProducts,
    is_gift: false,
  };

  // Add shipping address for delivery tiers
  if (
    request.deliveryAddress &&
    (request.deliveryTier === 'hd_delivery' || request.deliveryTier === 'gig')
  ) {
    const nameParts = request.clientName.split(' ');
    zincBody.shipping_address = {
      first_name: nameParts[0] ?? request.clientName,
      last_name: nameParts.slice(1).join(' ') || request.clientName,
      address_line1: request.deliveryAddress.street,
      zip_code: request.deliveryAddress.zip,
      city: request.deliveryAddress.city,
      state: request.deliveryAddress.state,
      country: 'US',
    };
    zincBody.shipping_method = request.deliveryTier === 'gig' ? 'fastest' : 'free';
  }

  // For BOPIS, set shipping method to store pickup
  if (request.deliveryTier === 'bopis') {
    zincBody.shipping_method = 'store_pickup';
  }

  try {
    const res = await fetch('https://api.zinc.io/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${apiKey}:`)}`,
      },
      body: JSON.stringify(zincBody),
    });

    if (!res.ok) {
      console.error(`Zinc API error ${res.status}: ${res.statusText}`);
      return {
        orderId: '',
        status: 'failed',
        estimatedReady: new Date().toISOString(),
        isMock: false,
      };
    }

    const data: ZincOrderResponse = await res.json();

    if (data.error) {
      console.error(`Zinc order error: ${data.error.message}`);
      return {
        orderId: '',
        status: 'failed',
        estimatedReady: new Date().toISOString(),
        isMock: false,
      };
    }

    return {
      orderId: data.request_id ?? '',
      status: 'placed',
      estimatedReady: getMockEstimatedReady(request.deliveryTier),
      trackingUrl: data.request_id
        ? `https://api.zinc.io/v1/orders/${data.request_id}`
        : undefined,
      isMock: false,
    };
  } catch (err) {
    console.error('Zinc API request failed:', err);
    return {
      orderId: '',
      status: 'failed',
      estimatedReady: new Date().toISOString(),
      isMock: false,
    };
  }
}
