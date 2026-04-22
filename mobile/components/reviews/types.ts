export interface Review {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  rating: number;
  text: string;
  date: string;
  projectType: string;
  verified: boolean;
  photos?: string[];
  helpfulCount: number;
  wouldHireAgain: boolean;
  proResponse?: { text: string; date: string };
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    reviewerName: 'Tom Anderson',
    reviewerInitials: 'TA',
    rating: 5,
    text: 'Mike was incredible. Fixed our burst pipe at 2am and cleaned up everything. Professional, fast, and fair pricing. Could not recommend more highly.',
    date: '2 weeks ago',
    projectType: 'Plumbing',
    verified: true,
    photos: ['https://picsum.photos/200/200?random=80'],
    helpfulCount: 12,
    wouldHireAgain: true,
    proResponse: {
      text: 'Thank you Tom! Happy we could help in the emergency. Anytime you need us, we are here.',
      date: '2 weeks ago',
    },
  },
  {
    id: 'r2',
    reviewerName: 'Lisa Martinez',
    reviewerInitials: 'LM',
    rating: 5,
    text: 'Best plumber we have ever hired. Explained everything clearly, showed up on time, and the work is flawless.',
    date: '1 month ago',
    projectType: 'Plumbing',
    verified: true,
    helpfulCount: 8,
    wouldHireAgain: true,
  },
  {
    id: 'r3',
    reviewerName: 'Rachel Kim',
    reviewerInitials: 'RK',
    rating: 4,
    text: 'Good work overall. The faucet installation looks great. Only minor issue was running about 30 minutes late, but he called ahead to let us know.',
    date: '1 month ago',
    projectType: 'Plumbing',
    verified: true,
    helpfulCount: 3,
    wouldHireAgain: true,
  },
  {
    id: 'r4',
    reviewerName: 'James Davidson',
    reviewerInitials: 'JD',
    rating: 5,
    text: 'Third time hiring Mike. Consistent quality every time. This time was a water heater replacement - done in half a day with zero mess.',
    date: '2 months ago',
    projectType: 'Plumbing',
    verified: true,
    photos: [
      'https://picsum.photos/200/200?random=81',
      'https://picsum.photos/200/200?random=82',
    ],
    helpfulCount: 15,
    wouldHireAgain: true,
    proResponse: {
      text: 'Always great working with you James. The new tankless should save you a lot on energy bills!',
      date: '2 months ago',
    },
  },
  {
    id: 'r5',
    reviewerName: 'Sarah Mitchell',
    reviewerInitials: 'SM',
    rating: 3,
    text: 'Work was fine but took longer than quoted and the final price was $200 more than the estimate. Communication could be better.',
    date: '3 months ago',
    projectType: 'Plumbing',
    verified: true,
    helpfulCount: 6,
    wouldHireAgain: false,
    proResponse: {
      text: 'Sarah, I apologize for the delay and cost difference. The additional work was due to unexpected pipe corrosion that we discussed on site. I should have provided a revised written estimate before proceeding. I will do better on communication next time.',
      date: '3 months ago',
    },
  },
  {
    id: 'r6',
    reviewerName: 'David Chen',
    reviewerInitials: 'DC',
    rating: 5,
    text: 'Emergency call on a Sunday. Mike answered immediately and was at our house in 45 minutes. Stopped the leak, replaced the valve, done. Hero.',
    date: '3 months ago',
    projectType: 'Emergency',
    verified: true,
    helpfulCount: 22,
    wouldHireAgain: true,
  },
  {
    id: 'r7',
    reviewerName: 'Emily Watson',
    reviewerInitials: 'EW',
    rating: 4,
    text: 'Installed a new bathroom faucet and fixed a running toilet. Clean work, reasonable price. Would use again.',
    date: '4 months ago',
    projectType: 'Plumbing',
    verified: true,
    helpfulCount: 2,
    wouldHireAgain: true,
  },
  {
    id: 'r8',
    reviewerName: 'Mark Thompson',
    reviewerInitials: 'MT',
    rating: 5,
    text: 'Mike handled our whole-house repipe. Massive job, done on time and on budget. His team was respectful of our home and cleaned up every day before leaving. Top notch.',
    date: '5 months ago',
    projectType: 'Plumbing',
    verified: true,
    photos: [
      'https://picsum.photos/200/200?random=83',
      'https://picsum.photos/200/200?random=84',
      'https://picsum.photos/200/200?random=85',
    ],
    helpfulCount: 18,
    wouldHireAgain: true,
  },
];

export const MOCK_STATS = {
  averageRating: 4.6,
  totalReviews: 142,
  distribution: [89, 35, 12, 4, 2],
  responseRate: 94,
  wouldHireAgainPct: 96,
};
