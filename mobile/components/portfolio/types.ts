export interface PortfolioItem {
  id: string;
  imageUri: string;
  title: string;
  category: 'kitchen' | 'bathroom' | 'deck' | 'electrical' | 'plumbing' | 'exterior';
  beforeUri?: string;
  likes: number;
  date: string;
}

export const PORTFOLIO_CATEGORIES = [
  { key: 'kitchen', label: 'Kitchens', icon: 'restaurant-outline' as const },
  { key: 'bathroom', label: 'Bathrooms', icon: 'water-outline' as const },
  { key: 'deck', label: 'Decks', icon: 'home-outline' as const },
  { key: 'electrical', label: 'Electrical', icon: 'flash-outline' as const },
  { key: 'plumbing', label: 'Plumbing', icon: 'construct-outline' as const },
  { key: 'exterior', label: 'Exterior', icon: 'business-outline' as const },
] as const;

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: 'p1', imageUri: 'https://picsum.photos/400/400?random=10', title: 'Modern Kitchen Remodel', category: 'kitchen', likes: 24, date: 'Apr 15' },
  { id: 'p2', imageUri: 'https://picsum.photos/400/400?random=11', title: 'Bathroom Tile Work', category: 'bathroom', beforeUri: 'https://picsum.photos/400/400?random=20', likes: 18, date: 'Apr 12' },
  { id: 'p3', imageUri: 'https://picsum.photos/400/400?random=12', title: 'Cedar Deck Build', category: 'deck', likes: 31, date: 'Apr 8' },
  { id: 'p4', imageUri: 'https://picsum.photos/400/400?random=13', title: 'Panel Upgrade', category: 'electrical', likes: 12, date: 'Apr 5' },
  { id: 'p5', imageUri: 'https://picsum.photos/400/400?random=14', title: 'Water Heater Install', category: 'plumbing', beforeUri: 'https://picsum.photos/400/400?random=21', likes: 15, date: 'Apr 2' },
  { id: 'p6', imageUri: 'https://picsum.photos/400/400?random=15', title: 'Exterior Paint Job', category: 'exterior', likes: 27, date: 'Mar 28' },
  { id: 'p7', imageUri: 'https://picsum.photos/400/400?random=16', title: 'Custom Vanity Install', category: 'bathroom', likes: 22, date: 'Mar 25' },
  { id: 'p8', imageUri: 'https://picsum.photos/400/400?random=17', title: 'Recessed Lighting', category: 'electrical', likes: 9, date: 'Mar 20' },
  { id: 'p9', imageUri: 'https://picsum.photos/400/400?random=18', title: 'Deck Staining', category: 'deck', beforeUri: 'https://picsum.photos/400/400?random=22', likes: 19, date: 'Mar 15' },
  { id: 'p10', imageUri: 'https://picsum.photos/400/400?random=19', title: 'Kitchen Backsplash', category: 'kitchen', likes: 33, date: 'Mar 10' },
];
