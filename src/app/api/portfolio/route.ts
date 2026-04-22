import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';

interface PortfolioItem {
  id: string;
  proId: string;
  imageUrl: string;
  title: string;
  description: string;
}

const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'photo-1',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=101',
    title: 'Custom Deck Build -- Concord, NH',
    description: '800 sq ft composite deck with built-in planters and lighting',
  },
  {
    id: 'photo-2',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=102',
    title: 'Kitchen Remodel -- Manchester, NH',
    description: 'Full gut renovation with custom cabinetry and island',
  },
  {
    id: 'photo-3',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=103',
    title: 'Bathroom Renovation -- Nashua, NH',
    description: 'Primary bath with walk-in tile shower and heated floors',
  },
  {
    id: 'photo-4',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=104',
    title: 'Basement Finish -- Bedford, NH',
    description: 'Full basement finish with rec room, bathroom, and wet bar',
  },
  {
    id: 'photo-5',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=105',
    title: 'Crown Molding Install -- Derry, NH',
    description: 'Whole-house crown molding with custom corner details',
  },
  {
    id: 'photo-6',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=106',
    title: 'Fence Build -- Merrimack, NH',
    description: '200 linear ft cedar privacy fence with custom gate',
  },
  {
    id: 'photo-7',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=107',
    title: 'Window Trim Replacement -- Hooksett, NH',
    description: 'PVC exterior window trim on 8 windows with caulk and paint',
  },
  {
    id: 'photo-8',
    proId: 'b1000000-0000-0000-0000-000000000001',
    imageUrl: 'https://picsum.photos/400/300?random=108',
    title: 'Waterproofing -- Goffstown, NH',
    description: 'Interior French drain and sump pump installation',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proId = searchParams.get('proId');
  const session = getSessionFromRequest(request);

  let items = MOCK_PORTFOLIO;

  // Scope by proId if provided
  if (proId) {
    items = items.filter((item) => item.proId === proId);
  } else if (session.role === 'pro') {
    // Pro viewing their own portfolio — scope to session userId
    items = items.filter((item) => item.proId === session.userId);
  }
  // Client/PM can browse any pro's portfolio (marketplace)

  return NextResponse.json({
    items,
    session: { userId: session.userId, role: session.role },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const session = getSessionFromRequest(request);

  const newItem: PortfolioItem = {
    id: body.id ?? `photo-${Date.now()}`,
    proId: session.userId,
    imageUrl: body.imageUrl ?? 'https://picsum.photos/400/300?random=999',
    title: body.title ?? 'New Photo',
    description: body.description ?? '',
  };

  return NextResponse.json({ success: true, item: newItem }, { status: 201 });
}
