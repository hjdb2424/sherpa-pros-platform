// ---------------------------------------------------------------------------
// SerpApi — Home Depot Pricing Service
// Reads SERPAPI_API_KEY from process.env (server-side only).
// If no key: returns mock pricing data with realistic HD products.
// If key set: queries SerpApi with engine=home_depot.
// ---------------------------------------------------------------------------

export interface HDProduct {
  title: string;
  price: number;
  priceCents: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  storeName: string;
  storeDistance: string;
  thumbnailUrl: string;
  productUrl: string;
  hdSku: string;
}

export interface HDSearchResult {
  products: HDProduct[];
  searchQuery: string;
  zipCode: string;
  isMock: boolean;
}

// ---------------------------------------------------------------------------
// Mock product catalog — realistic HD products for common construction items
// ---------------------------------------------------------------------------

const MOCK_PRODUCTS: Record<string, HDProduct[]> = {
  faucet: [
    {
      title: 'Moen Adler Single-Handle Pull-Down Kitchen Faucet in Chrome',
      price: 189.0,
      priceCents: 18900,
      rating: 4.5,
      reviews: 2847,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/moen-adler/123456',
      hdSku: '305892741',
    },
    {
      title: 'Delta Lenta Single-Handle Pull-Down Kitchen Faucet in SpotShield Stainless',
      price: 229.0,
      priceCents: 22900,
      rating: 4.6,
      reviews: 1523,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/delta-lenta/234567',
      hdSku: '305892742',
    },
  ],
  'supply line': [
    {
      title: 'BrassCraft 3/8 in. Comp x 1/2 in. FIP x 20 in. Braided Stainless Steel Faucet Connector',
      price: 12.98,
      priceCents: 1298,
      rating: 4.7,
      reviews: 4321,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/brasscraft-supply/345678',
      hdSku: '305892743',
    },
  ],
  'pvc pipe': [
    {
      title: 'Charlotte Pipe 2 in. x 10 ft. PVC Schedule 40 DWV Pipe',
      price: 12.98,
      priceCents: 1298,
      rating: 4.8,
      reviews: 1892,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/charlotte-pvc/456789',
      hdSku: '305892744',
    },
  ],
  'copper fitting': [
    {
      title: 'Everbilt 1/2 in. Copper Pressure 90-Degree Cup x Cup Elbow Fitting',
      price: 1.98,
      priceCents: 198,
      rating: 4.6,
      reviews: 3456,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/everbilt-copper/567890',
      hdSku: '305892745',
    },
  ],
  wire: [
    {
      title: 'Southwire 250 ft. 12/2 Solid Romex SIMpull CU NM-B W/G Wire',
      price: 89.97,
      priceCents: 8997,
      rating: 4.8,
      reviews: 5678,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/southwire-romex/678901',
      hdSku: '305892746',
    },
  ],
  breaker: [
    {
      title: 'Square D Homeline 20 Amp Single-Pole AFCI Circuit Breaker',
      price: 45.98,
      priceCents: 4598,
      rating: 4.7,
      reviews: 2345,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/square-d-afci/789012',
      hdSku: '305892747',
    },
  ],
  panel: [
    {
      title: 'Square D Homeline 200 Amp 40-Space 80-Circuit Indoor Main Breaker Panel',
      price: 429.0,
      priceCents: 42900,
      rating: 4.6,
      reviews: 1876,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/square-d-panel/890123',
      hdSku: '305892748',
    },
  ],
  'ground rod': [
    {
      title: 'Superstrut 5/8 in. x 8 ft. Copper-Bonded Ground Rod',
      price: 18.98,
      priceCents: 1898,
      rating: 4.5,
      reviews: 987,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/superstrut-ground-rod/901234',
      hdSku: '305892749',
    },
  ],
  'cement board': [
    {
      title: 'USG Durock 1/2 in. x 3 ft. x 5 ft. Cement Board',
      price: 14.98,
      priceCents: 1498,
      rating: 4.7,
      reviews: 3210,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/usg-durock/012345',
      hdSku: '305892750',
    },
  ],
  tile: [
    {
      title: 'MSI Bianco Dolomite 12 in. x 24 in. Polished Porcelain Floor and Wall Tile',
      price: 3.99,
      priceCents: 399,
      rating: 4.4,
      reviews: 1567,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/msi-bianco/112345',
      hdSku: '305892751',
    },
  ],
  thinset: [
    {
      title: 'Mapei Kerabond 50 lb. Gray Premium Large Format Tile Mortar',
      price: 29.98,
      priceCents: 2998,
      rating: 4.6,
      reviews: 2134,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/mapei-kerabond/212345',
      hdSku: '305892752',
    },
  ],
  grout: [
    {
      title: 'Mapei Keracolor U 10 lb. Warm Gray Unsanded Grout',
      price: 18.98,
      priceCents: 1898,
      rating: 4.5,
      reviews: 1890,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/mapei-grout/312345',
      hdSku: '305892753',
    },
  ],
  'shower valve': [
    {
      title: 'Delta Monitor 14 Series Shower Valve Trim in Stainless',
      price: 129.0,
      priceCents: 12900,
      rating: 4.5,
      reviews: 1432,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/delta-monitor/412345',
      hdSku: '305892754',
    },
  ],
  putty: [
    {
      title: "Oatey Plumber's Putty 14 oz. Stain-Free",
      price: 5.48,
      priceCents: 548,
      rating: 4.7,
      reviews: 5432,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/oatey-putty/512345',
      hdSku: '305892755',
    },
  ],
  'teflon tape': [
    {
      title: 'Harvey 1/2 in. x 260 in. PTFE Thread Seal Tape',
      price: 1.98,
      priceCents: 198,
      rating: 4.8,
      reviews: 8976,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/harvey-ptfe/612345',
      hdSku: '305892756',
    },
  ],
  conduit: [
    {
      title: 'Carlon 2 in. x 10 ft. PVC Schedule 40 Conduit',
      price: 12.98,
      priceCents: 1298,
      rating: 4.6,
      reviews: 1234,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/carlon-conduit/712345',
      hdSku: '305892757',
    },
  ],
  cable: [
    {
      title: 'Southwire 4/0-4/0-2/0 Aluminum SEU Service Entrance Cable (Per Foot)',
      price: 6.98,
      priceCents: 698,
      rating: 4.5,
      reviews: 876,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/southwire-seu/812345',
      hdSku: '305892758',
    },
  ],
  membrane: [
    {
      title: 'Schluter Kerdi 108 sq. ft. Waterproofing Membrane Roll',
      price: 159.0,
      priceCents: 15900,
      rating: 4.8,
      reviews: 2345,
      inStock: true,
      storeName: 'Home Depot #3456',
      storeDistance: '3.2 mi',
      thumbnailUrl: '/placeholder-product.png',
      productUrl: 'https://www.homedepot.com/p/schluter-kerdi/912345',
      hdSku: '305892759',
    },
  ],
};

/** Default mock product for queries with no matching keyword */
const DEFAULT_MOCK: HDProduct = {
  title: 'General Construction Supply Item',
  price: 24.98,
  priceCents: 2498,
  rating: 4.3,
  reviews: 456,
  inStock: true,
  storeName: 'Home Depot #3456',
  storeDistance: '3.2 mi',
  thumbnailUrl: '/placeholder-product.png',
  productUrl: 'https://www.homedepot.com/p/general-item/999999',
  hdSku: '305899999',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isSerpApiConfigured(): boolean {
  return !!process.env.SERPAPI_API_KEY;
}

function findMockProducts(query: string): HDProduct[] {
  const q = query.toLowerCase();
  for (const [keyword, products] of Object.entries(MOCK_PRODUCTS)) {
    if (q.includes(keyword)) {
      return products;
    }
  }
  // Generate a plausible mock from the query itself
  return [
    {
      ...DEFAULT_MOCK,
      title: `${query} — Home Depot`,
      hdSku: `30589${Math.floor(1000 + Math.random() * 9000)}`,
    },
  ];
}

// ---------------------------------------------------------------------------
// SerpApi response types (subset we care about)
// ---------------------------------------------------------------------------

interface SerpApiProduct {
  title?: string;
  price?: number;
  extracted_price?: number;
  rating?: number;
  reviews?: number;
  in_stock?: boolean;
  delivery?: { status?: string };
  store_name?: string;
  store_distance?: string;
  thumbnail?: string;
  link?: string;
  product_id?: string;
  serpapi_product_api?: string;
}

interface SerpApiResponse {
  products?: SerpApiProduct[];
  error?: string;
}

function mapSerpApiProduct(p: SerpApiProduct, zipCode: string): HDProduct {
  const price = p.extracted_price ?? p.price ?? 0;
  return {
    title: p.title ?? 'Unknown Product',
    price,
    priceCents: Math.round(price * 100),
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    inStock: p.in_stock !== false,
    storeName: p.store_name ?? `Home Depot near ${zipCode}`,
    storeDistance: p.store_distance ?? '',
    thumbnailUrl: p.thumbnail ?? '/placeholder-product.png',
    productUrl: p.link ?? 'https://www.homedepot.com',
    hdSku: p.product_id ?? '',
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function searchHomeDepot(
  query: string,
  zipCode: string,
): Promise<HDSearchResult> {
  if (!isSerpApiConfigured()) {
    return {
      products: findMockProducts(query),
      searchQuery: query,
      zipCode,
      isMock: true,
    };
  }

  const apiKey = process.env.SERPAPI_API_KEY!;
  const params = new URLSearchParams({
    engine: 'home_depot',
    q: query,
    delivery_zip: zipCode,
    api_key: apiKey,
  });

  const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`);

  if (!res.ok) {
    console.error(`SerpApi error ${res.status}: ${res.statusText}`);
    // Graceful degradation to mock
    return {
      products: findMockProducts(query),
      searchQuery: query,
      zipCode,
      isMock: true,
    };
  }

  const data: SerpApiResponse = await res.json();

  if (data.error || !data.products?.length) {
    return {
      products: findMockProducts(query),
      searchQuery: query,
      zipCode,
      isMock: true,
    };
  }

  return {
    products: data.products.map((p) => mapSerpApiProduct(p, zipCode)),
    searchQuery: query,
    zipCode,
    isMock: false,
  };
}

export async function priceCheckMaterials(
  materials: { name: string; spec: string }[],
  zipCode: string,
): Promise<Map<string, HDProduct>> {
  const results = new Map<string, HDProduct>();

  // Process in batches of 5 to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < materials.length; i += batchSize) {
    const batch = materials.slice(i, i + batchSize);
    const promises = batch.map(async (mat) => {
      const searchQuery = `${mat.name} ${mat.spec}`.trim();
      const result = await searchHomeDepot(searchQuery, zipCode);
      if (result.products.length > 0) {
        results.set(mat.name, result.products[0]);
      }
    });
    await Promise.all(promises);
  }

  return results;
}
