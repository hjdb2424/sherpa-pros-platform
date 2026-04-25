import { NextResponse } from 'next/server';
import {
  scan,
  validateFile,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  type ScanType,
} from '@/lib/services/ocr-service';

const VALID_TYPES: ScanType[] = ['receipt', 'document', 'photo'];

/**
 * POST /api/ocr — Scan a file and extract structured data.
 *
 * Accepts FormData with:
 *   - file: the image/PDF to scan
 *   - type (optional): "receipt" | "document" | "photo" (defaults to "receipt")
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get('type') ?? 'receipt';
    const scanType: ScanType = VALID_TYPES.includes(typeParam as ScanType)
      ? (typeParam as ScanType)
      : 'receipt';

    // Parse FormData
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: 'Invalid form data. Send a multipart/form-data request with a "file" field.' },
        { status: 400 },
      );
    }

    const file = formData.get('file');

    // Also check for type override in form body
    const bodyType = formData.get('type');
    const finalType: ScanType =
      bodyType && VALID_TYPES.includes(bodyType as string as ScanType)
        ? (bodyType as string as ScanType)
        : scanType;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Missing "file" field. Upload an image (JPG, PNG, HEIC) or PDF.' },
        { status: 400 },
      );
    }

    // Validate file type and size
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Run OCR
    const result = await scan(file, finalType);

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        fileName: file.name,
        fileSize: file.size,
        scanType: finalType,
        mock: !process.env.GOOGLE_CLOUD_VISION_API_KEY,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[OCR API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process scan. Please try again.' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/ocr — Return supported file types and limits.
 */
export async function GET() {
  return NextResponse.json({
    supportedTypes: ALLOWED_FILE_TYPES,
    maxFileSizeBytes: MAX_FILE_SIZE,
    scanModes: VALID_TYPES,
    mock: !process.env.GOOGLE_CLOUD_VISION_API_KEY,
  });
}
