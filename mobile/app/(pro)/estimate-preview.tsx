import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import EstimateDocument from '@/components/quotes/EstimateDocument';
import type { QuoteData } from '@/components/quotes/EstimateDocument';

// ---------------------------------------------------------------------------
// Mock data — bathroom remodel quote
// ---------------------------------------------------------------------------

const MOCK_QUOTE: QuoteData = {
  quoteNumber: '#QT-2026-001',
  date: 'April 21, 2026',
  validUntil: 'May 21, 2026',
  proName: 'Carlos Rivera',
  proTrade: 'General Contractor',
  proPhone: '(603) 555-0142',
  proEmail: 'carlos@riverabuilds.com',
  proLicense: 'GC-2024-1847',
  clientName: 'John Davidson',
  clientAddress: '42 Maple St, Portsmouth, NH 03801',
  jobTitle: 'Bathroom Remodel \u2014 Phase 1',
  lineItems: [
    // Labor
    { category: 'Labor', description: 'Demolition & removal', qty: 8, unit: 'hrs', unitPrice: 9750, total: 78000 },
    { category: 'Labor', description: 'Rough plumbing', qty: 12, unit: 'hrs', unitPrice: 9750, total: 117000 },
    { category: 'Labor', description: 'Tile installation', qty: 16, unit: 'hrs', unitPrice: 9750, total: 156000 },
    { category: 'Labor', description: 'Fixture install & finish', qty: 6, unit: 'hrs', unitPrice: 9750, total: 58500 },
    // Materials
    { category: 'Materials', description: 'Cement board (3x5)', qty: 4, unit: 'sheets', unitPrice: 6240, total: 24960 },
    { category: 'Materials', description: 'Waterproof membrane', qty: 1, unit: 'roll', unitPrice: 10680, total: 10680 },
    { category: 'Materials', description: 'Subway tile (white 3x6)', qty: 80, unit: 'sqft', unitPrice: 480, total: 38400 },
    { category: 'Materials', description: 'Matte black shower valve', qty: 1, unit: 'each', unitPrice: 22680, total: 22680 },
    // Equipment
    { category: 'Equipment', description: 'Dumpster rental (demo debris)', qty: 1, unit: 'each', unitPrice: 38500, total: 38500 },
    // Permits
    { category: 'Permits', description: 'Plumbing permit', qty: 1, unit: 'each', unitPrice: 15000, total: 15000 },
  ],
  laborSubtotal: 409500,
  materialsSubtotal: 96720,
  otherSubtotal: 53500,
  subtotal: 559720,
  taxPct: 0,
  taxAmount: 0,
  discountPct: 0,
  discountAmount: 0,
  grandTotal: 559720,
  scopeOfWork:
    'Full bathroom remodel including demolition of existing tile and fixtures, rough plumbing updates, cement board installation, waterproof membrane application, subway tile installation on walls and floor, matte black fixture installation, and final cleanup. All work performed to current building code standards.',
  timeline: '5-7 business days',
  paymentTerms: '50% deposit upon acceptance, 50% upon completion',
  notes: 'Price includes all labor, materials, and debris removal. Client to select grout color before start date.',
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function EstimatePreviewScreen() {
  const router = useRouter();

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  return (
    <EstimateDocument
      quote={MOCK_QUOTE}
      onClose={handleClose}
    />
  );
}
