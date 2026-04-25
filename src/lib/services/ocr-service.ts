/**
 * OCR Service
 *
 * Extracts structured data from receipts, documents, and project photos.
 * Beta mode: returns realistic mock data. Production: Google Cloud Vision API
 * or Tesseract.js integration.
 *
 * All monetary values in integer cents.
 */

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface OCRLineItem {
  description: string;
  quantity: number;
  amount: number; // cents
}

export interface ReceiptResult {
  type: 'receipt';
  vendor: string;
  date: string; // ISO date
  total: number; // cents
  tax: number; // cents
  items: OCRLineItem[];
  paymentMethod: string;
  confidence: number;
}

export interface InsuranceCoverage {
  generalLiability: number; // cents
  aggregate: number; // cents
}

export interface InsuranceCertResult {
  type: 'insurance_certificate';
  insurer: string;
  policyNumber: string;
  holder: string;
  coverage: InsuranceCoverage;
  effective: string; // ISO date
  expiration: string; // ISO date
  confidence: number;
}

export interface LicenseResult {
  type: 'license';
  licenseNumber: string;
  holder: string;
  issuer: string;
  trade: string;
  issued: string; // ISO date
  expiration: string; // ISO date
  confidence: number;
}

export interface InvoiceResult {
  type: 'invoice';
  vendor: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  total: number; // cents
  items: OCRLineItem[];
  confidence: number;
}

export interface EstimateResult {
  type: 'estimate';
  vendor: string;
  estimateNumber: string;
  date: string;
  total: number; // cents
  items: OCRLineItem[];
  validUntil: string;
  confidence: number;
}

export interface ContractResult {
  type: 'contract';
  parties: string[];
  date: string;
  scope: string;
  totalValue: number; // cents
  confidence: number;
}

export interface PhotoResult {
  type: 'photo';
  description: string;
  materialsDetected: string[];
  conditionAssessment: string;
  workPhase: string;
  confidence: number;
}

export type DocumentResult =
  | InsuranceCertResult
  | LicenseResult
  | InvoiceResult
  | EstimateResult
  | ContractResult;

export type OCRResult = ReceiptResult | DocumentResult | PhotoResult;

export type ScanType = 'receipt' | 'document' | 'photo';

// ---------------------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------------------

const MOCK_RECEIPT: ReceiptResult = {
  type: 'receipt',
  vendor: 'Home Depot',
  date: '2026-04-20',
  total: 28743,
  tax: 1842,
  items: [
    { description: '1/2" PEX Tubing 100ft', quantity: 2, amount: 8997 },
    { description: 'SharkBite Fittings Pack', quantity: 1, amount: 4599 },
    { description: 'PVC Cement 16oz', quantity: 3, amount: 2697 },
  ],
  paymentMethod: 'Visa ending 4242',
  confidence: 0.94,
};

const MOCK_INSURANCE_CERT: InsuranceCertResult = {
  type: 'insurance_certificate',
  insurer: 'Hartford Insurance',
  policyNumber: 'GL-2026-48291',
  holder: 'Mike Rodriguez DBA Rodriguez Plumbing',
  coverage: { generalLiability: 1000000, aggregate: 2000000 },
  effective: '2026-01-01',
  expiration: '2027-01-01',
  confidence: 0.91,
};

const MOCK_LICENSE: LicenseResult = {
  type: 'license',
  licenseNumber: 'PL-2026-11482',
  holder: 'Mike Rodriguez',
  issuer: 'New Hampshire Plumbing Board',
  trade: 'Master Plumber',
  issued: '2024-06-15',
  expiration: '2026-06-15',
  confidence: 0.89,
};

const MOCK_INVOICE: InvoiceResult = {
  type: 'invoice',
  vendor: 'Northeast Supply Co.',
  invoiceNumber: 'INV-2026-0847',
  date: '2026-04-18',
  dueDate: '2026-05-18',
  total: 345600,
  items: [
    { description: '3/4" Copper Pipe 10ft', quantity: 20, amount: 189000 },
    { description: 'Copper Elbows 3/4"', quantity: 40, amount: 56000 },
    { description: 'Solder Wire 1lb', quantity: 5, amount: 12500 },
    { description: 'Flux Paste 8oz', quantity: 5, amount: 3750 },
  ],
  confidence: 0.92,
};

const MOCK_PHOTO: PhotoResult = {
  type: 'photo',
  description:
    'Bathroom rough-in plumbing installation. PEX water supply lines visible with copper stub-outs at fixture locations. Drain-waste-vent (DWV) system in PVC.',
  materialsDetected: [
    'PEX tubing (red/blue)',
    'Copper stub-outs',
    'PVC drain pipe',
    'SharkBite fittings',
    'Pipe hangers',
    'Fire caulk',
  ],
  conditionAssessment:
    'Work appears to meet code standards. Proper slope visible on drain lines. Support spacing looks adequate. Ready for rough-in inspection.',
  workPhase: 'Rough-in plumbing',
  confidence: 0.87,
};

const MOCK_DOCUMENTS: DocumentResult[] = [
  MOCK_INSURANCE_CERT,
  MOCK_LICENSE,
  MOCK_INVOICE,
];

// ---------------------------------------------------------------------------
// SERVICE
// ---------------------------------------------------------------------------

function isMockMode(): boolean {
  // In production, check for Google Cloud Vision API key
  // For beta: always mock
  return !process.env.GOOGLE_CLOUD_VISION_API_KEY;
}

/**
 * Scan a receipt image and extract structured data.
 */
export async function scanReceipt(
  _file: File | Blob,
): Promise<ReceiptResult> {
  if (isMockMode()) {
    // Simulate network delay
    await delay(800 + Math.random() * 400);
    return {
      ...MOCK_RECEIPT,
      confidence: 0.9 + Math.random() * 0.08,
    };
  }

  // Production: Google Cloud Vision API integration
  // const base64 = await fileToBase64(_file);
  // const response = await callVisionAPI(base64, 'DOCUMENT_TEXT_DETECTION');
  // return parseReceiptFromVision(response);
  return MOCK_RECEIPT;
}

/**
 * Scan a document (invoice, license, insurance cert, etc.)
 * and extract structured data.
 */
export async function scanDocument(
  _file: File | Blob,
): Promise<DocumentResult> {
  if (isMockMode()) {
    await delay(1000 + Math.random() * 500);
    // Randomly pick a document type for mock
    const idx = Math.floor(Math.random() * MOCK_DOCUMENTS.length);
    return {
      ...MOCK_DOCUMENTS[idx],
      confidence: 0.88 + Math.random() * 0.1,
    };
  }

  return MOCK_INSURANCE_CERT;
}

/**
 * Analyze a project photo for materials, condition, and work phase.
 */
export async function analyzePhoto(
  _file: File | Blob,
): Promise<PhotoResult> {
  if (isMockMode()) {
    await delay(1200 + Math.random() * 600);
    return {
      ...MOCK_PHOTO,
      confidence: 0.84 + Math.random() * 0.1,
    };
  }

  return MOCK_PHOTO;
}

/**
 * Generic scan dispatcher based on type hint.
 */
export async function scan(
  file: File | Blob,
  type: ScanType,
): Promise<OCRResult> {
  switch (type) {
    case 'receipt':
      return scanReceipt(file);
    case 'document':
      return scanDocument(file);
    case 'photo':
      return analyzePhoto(file);
    default:
      return scanReceipt(file);
  }
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a document (license/insurance) is expiring within N days.
 */
export function isExpiringSoon(
  expirationDate: string,
  withinDays = 30,
): boolean {
  const exp = new Date(expirationDate);
  const now = new Date();
  const diffMs = exp.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= withinDays;
}

/**
 * Check if a document is already expired.
 */
export function isExpired(expirationDate: string): boolean {
  return new Date(expirationDate) < new Date();
}

/**
 * Format cents to dollar string.
 */
export function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const sign = cents < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(remainder).padStart(2, '0')}`;
}

/** Allowed file types for upload */
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'application/pdf',
];

/** Max file size: 10MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validate an uploaded file.
 */
export function validateFile(
  file: File,
): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Accepted: JPG, PNG, PDF, HEIC.`,
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 10MB.`,
    };
  }
  return { valid: true };
}
