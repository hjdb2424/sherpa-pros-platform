/**
 * Sherpa Pros Platform — Mock Chat Data
 *
 * Realistic conversation data for development without a database or Twilio.
 * 7 conversations spanning Pro/Client/PM interactions with varied states.
 */

// ---------------------------------------------------------------------------
// Types (extended for mock data richness)
// ---------------------------------------------------------------------------

export type DeliveryMethod = 'app' | 'sms' | 'both';

export interface MockParticipant {
  id: string;
  name: string;
  initials: string;
  role: 'pro' | 'client' | 'pm';
  phone?: string;
  isOnline: boolean;
  avatarColor: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'pro' | 'client' | 'pm';
  text: string;
  timestamp: string;
  readBy: string[];
  deliveryMethod: DeliveryMethod;
  attachments?: { type: 'photo'; url: string; caption?: string }[];
}

export interface MockConversation {
  id: string;
  participants: MockParticipant[];
  jobId: string;
  jobTitle: string;
  status: 'active' | 'closed' | 'archived';
  createdAt: string;
  messages: MockMessage[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60_000).toISOString();
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86_400_000).toISOString();
}

// ---------------------------------------------------------------------------
// Participants
// ---------------------------------------------------------------------------

export const MOCK_PARTICIPANTS: Record<string, MockParticipant> = {
  'pro-mike': {
    id: 'pro-mike',
    name: 'Mike Thompson',
    initials: 'MT',
    role: 'pro',
    phone: '+16035551001',
    isOnline: true,
    avatarColor: '#6366f1',
  },
  'pro-sarah': {
    id: 'pro-sarah',
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'pro',
    phone: '+16035551002',
    isOnline: false,
    avatarColor: '#10b981',
  },
  'pro-carlos': {
    id: 'pro-carlos',
    name: 'Carlos Rodriguez',
    initials: 'CR',
    role: 'pro',
    phone: '+16035551003',
    isOnline: true,
    avatarColor: '#f59e0b',
  },
  'pro-james': {
    id: 'pro-james',
    name: 'James Wilson',
    initials: 'JW',
    role: 'pro',
    phone: '+16035551004',
    isOnline: false,
    avatarColor: '#8b5cf6',
  },
  'client-john': {
    id: 'client-john',
    name: 'John Davidson',
    initials: 'JD',
    role: 'client',
    phone: '+16035552001',
    isOnline: true,
    avatarColor: '#0ea5e9',
  },
  'client-maria': {
    id: 'client-maria',
    name: 'Maria Santos',
    initials: 'MS',
    role: 'client',
    phone: '+16035552002',
    isOnline: false,
    avatarColor: '#ec4899',
  },
  'client-robert': {
    id: 'client-robert',
    name: 'Robert Kim',
    initials: 'RK',
    role: 'client',
    phone: '+16035552003',
    isOnline: true,
    avatarColor: '#f97316',
  },
  'pm-lisa': {
    id: 'pm-lisa',
    name: 'Lisa Park',
    initials: 'LP',
    role: 'pm',
    phone: '+16035553001',
    isOnline: true,
    avatarColor: '#14b8a6',
  },
  'tenant-dave': {
    id: 'tenant-dave',
    name: 'Dave Martinez',
    initials: 'DM',
    role: 'client',
    phone: '+16035552004',
    isOnline: false,
    avatarColor: '#64748b',
  },
};

const P = MOCK_PARTICIPANTS;

// ---------------------------------------------------------------------------
// Conversation 1: Pro <-> Client — Plumbing job (scheduling + completion)
// ---------------------------------------------------------------------------

const conv1Messages: MockMessage[] = [
  {
    id: 'msg-1-01',
    conversationId: 'conv-1',
    senderId: 'client-john',
    senderName: 'John Davidson',
    senderRole: 'client',
    text: 'Hi! I saw your profile and great reviews. Are you available for a kitchen faucet replacement this week?',
    timestamp: daysAgo(2),
    readBy: ['client-john', 'pro-mike'],
    deliveryMethod: 'both',
  },
  {
    id: 'msg-1-02',
    conversationId: 'conv-1',
    senderId: 'pro-mike',
    senderName: 'Mike Thompson',
    senderRole: 'pro',
    text: 'Hey John! Yes I am. What kind of faucet are you looking at? Do you have one already or need me to source it?',
    timestamp: daysAgo(2),
    readBy: ['client-john', 'pro-mike'],
    deliveryMethod: 'both',
  },
  {
    id: 'msg-1-03',
    conversationId: 'conv-1',
    senderId: 'client-john',
    senderName: 'John Davidson',
    senderRole: 'client',
    text: 'I already bought a Moen pull-down from Home Depot. Just need the install.',
    timestamp: daysAgo(2),
    readBy: ['client-john', 'pro-mike'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-1-04',
    conversationId: 'conv-1',
    senderId: 'pro-mike',
    senderName: 'Mike Thompson',
    senderRole: 'pro',
    text: 'Perfect, that makes it straightforward. I can come by Thursday around 2pm. Usually takes about an hour. $150 for the install.',
    timestamp: daysAgo(1),
    readBy: ['client-john', 'pro-mike'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-1-05',
    conversationId: 'conv-1',
    senderId: 'client-john',
    senderName: 'John Davidson',
    senderRole: 'client',
    text: 'Thursday at 2 works! Do I need to turn off the water beforehand?',
    timestamp: daysAgo(1),
    readBy: ['client-john', 'pro-mike'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-1-06',
    conversationId: 'conv-1',
    senderId: 'pro-mike',
    senderName: 'Mike Thompson',
    senderRole: 'pro',
    text: "Nope, I'll handle everything. Just make sure the area under the sink is clear. See you Thursday!",
    timestamp: hoursAgo(5),
    readBy: ['client-john', 'pro-mike'],
    deliveryMethod: 'both',
  },
  {
    id: 'msg-1-07',
    conversationId: 'conv-1',
    senderId: 'pro-mike',
    senderName: 'Mike Thompson',
    senderRole: 'pro',
    text: "All done! Faucet is installed and working great. No leaks. I'll mark the job as complete.",
    timestamp: minutesAgo(30),
    readBy: ['pro-mike'],
    deliveryMethod: 'app',
    attachments: [
      {
        type: 'photo',
        url: '/placeholder-faucet-complete.jpg',
        caption: 'Finished installation',
      },
    ],
  },
  {
    id: 'msg-1-08',
    conversationId: 'conv-1',
    senderId: 'client-john',
    senderName: 'John Davidson',
    senderRole: 'client',
    text: 'Looks amazing! Thank you so much. Left you a 5-star review.',
    timestamp: minutesAgo(5),
    readBy: ['client-john'],
    deliveryMethod: 'app',
  },
];

// ---------------------------------------------------------------------------
// Conversation 2: PM <-> Pro — Work order assignment + status
// ---------------------------------------------------------------------------

const conv2Messages: MockMessage[] = [
  {
    id: 'msg-2-01',
    conversationId: 'conv-2',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: 'Hi Sarah, I have a work order for unit 4B at Maple Ridge. Tenant reported a leaking bathroom faucet. Can you take this on?',
    timestamp: daysAgo(1),
    readBy: ['pm-lisa', 'pro-sarah'],
    deliveryMethod: 'both',
  },
  {
    id: 'msg-2-02',
    conversationId: 'conv-2',
    senderId: 'pro-sarah',
    senderName: 'Sarah Chen',
    senderRole: 'pro',
    text: "Sure Lisa, I can fit it in tomorrow morning. What's the access situation? Key lockbox or need the tenant there?",
    timestamp: daysAgo(1),
    readBy: ['pm-lisa', 'pro-sarah'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-2-03',
    conversationId: 'conv-2',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: 'Lockbox code is 4821. Tenant works from home so they should be there too. Let me know when you finish so I can update the system.',
    timestamp: hoursAgo(20),
    readBy: ['pm-lisa', 'pro-sarah'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-2-04',
    conversationId: 'conv-2',
    senderId: 'pro-sarah',
    senderName: 'Sarah Chen',
    senderRole: 'pro',
    text: "Done! It was a worn washer on the hot side. Replaced both washers and the valve seats while I was in there. 45 min total.",
    timestamp: hoursAgo(3),
    readBy: ['pm-lisa', 'pro-sarah'],
    deliveryMethod: 'both',
    attachments: [
      {
        type: 'photo',
        url: '/placeholder-faucet-repair.jpg',
        caption: 'Before and after',
      },
    ],
  },
  {
    id: 'msg-2-05',
    conversationId: 'conv-2',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: "Great work. I'll approve the invoice. Same rate as usual?",
    timestamp: hoursAgo(2),
    readBy: ['pm-lisa'],
    deliveryMethod: 'app',
  },
];

// ---------------------------------------------------------------------------
// Conversation 3: Client <-> Pro — Quote negotiation
// ---------------------------------------------------------------------------

const conv3Messages: MockMessage[] = [
  {
    id: 'msg-3-01',
    conversationId: 'conv-3',
    senderId: 'client-robert',
    senderName: 'Robert Kim',
    senderRole: 'client',
    text: 'Hi Carlos, I got your bid for the deck staining. $2,800 seems a bit high for a 400 sqft deck. My neighbor paid about $2,000 last year.',
    timestamp: daysAgo(3),
    readBy: ['client-robert', 'pro-carlos'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-3-02',
    conversationId: 'conv-3',
    senderId: 'pro-carlos',
    senderName: 'Carlos Rodriguez',
    senderRole: 'pro',
    text: 'Hey Robert, fair question. My quote includes power washing, sanding, and TWO coats of Benjamin Moore Arborcoat which is a premium stain. A lot of the cheaper bids use one coat of a lower-grade stain.',
    timestamp: daysAgo(3),
    readBy: ['client-robert', 'pro-carlos'],
    deliveryMethod: 'both',
  },
  {
    id: 'msg-3-03',
    conversationId: 'conv-3',
    senderId: 'client-robert',
    senderName: 'Robert Kim',
    senderRole: 'client',
    text: 'That makes sense. Could you do $2,500 if I supply the stain myself? I get a contractor discount at the local paint store.',
    timestamp: daysAgo(2),
    readBy: ['client-robert', 'pro-carlos'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-3-04',
    conversationId: 'conv-3',
    senderId: 'pro-carlos',
    senderName: 'Carlos Rodriguez',
    senderRole: 'pro',
    text: "I can do $2,400 labor-only if you supply the Arborcoat. You'll need about 3 gallons for two coats on 400 sqft. Deal?",
    timestamp: daysAgo(2),
    readBy: ['client-robert', 'pro-carlos'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-3-05',
    conversationId: 'conv-3',
    senderId: 'client-robert',
    senderName: 'Robert Kim',
    senderRole: 'client',
    text: "Deal! When can you start? I'd love to get this done before the holiday weekend.",
    timestamp: daysAgo(1),
    readBy: ['client-robert', 'pro-carlos'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-3-06',
    conversationId: 'conv-3',
    senderId: 'pro-carlos',
    senderName: 'Carlos Rodriguez',
    senderRole: 'pro',
    text: 'I can start Wednesday if the weather holds. Need two dry days back-to-back for the coats. Accepting your job now.',
    timestamp: hoursAgo(8),
    readBy: ['pro-carlos'],
    deliveryMethod: 'both',
  },
];

// ---------------------------------------------------------------------------
// Conversation 4: PM <-> Tenant — Maintenance request
// ---------------------------------------------------------------------------

const conv4Messages: MockMessage[] = [
  {
    id: 'msg-4-01',
    conversationId: 'conv-4',
    senderId: 'tenant-dave',
    senderName: 'Dave Martinez',
    senderRole: 'client',
    text: 'Hi, the garbage disposal in unit 3A stopped working this morning. It just hums but nothing spins.',
    timestamp: hoursAgo(6),
    readBy: ['tenant-dave', 'pm-lisa'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-4-02',
    conversationId: 'conv-4',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: "Hi Dave, thanks for letting us know. Sounds like it might be jammed. Have you tried the reset button on the bottom of the unit? It's a small red button.",
    timestamp: hoursAgo(5),
    readBy: ['tenant-dave', 'pm-lisa'],
    deliveryMethod: 'both',
  },
  {
    id: 'msg-4-03',
    conversationId: 'conv-4',
    senderId: 'tenant-dave',
    senderName: 'Dave Martinez',
    senderRole: 'client',
    text: "Yes, I tried that already. Still just hums. There might be something stuck in there but I don't want to put my hand in.",
    timestamp: hoursAgo(5),
    readBy: ['tenant-dave', 'pm-lisa'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-4-04',
    conversationId: 'conv-4',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: "Good call, don't reach in. I'm creating a work order now. Our plumber Mike can be there tomorrow between 9-11am. Does that work for your schedule?",
    timestamp: hoursAgo(4),
    readBy: ['tenant-dave', 'pm-lisa'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-4-05',
    conversationId: 'conv-4',
    senderId: 'tenant-dave',
    senderName: 'Dave Martinez',
    senderRole: 'client',
    text: "Tomorrow morning works. I'll be home until noon.",
    timestamp: hoursAgo(4),
    readBy: ['tenant-dave', 'pm-lisa'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-4-06',
    conversationId: 'conv-4',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: "You're all set. Mike Thompson will be there tomorrow morning. He'll knock and identify himself. Is there anything else you need?",
    timestamp: hoursAgo(3),
    readBy: ['pm-lisa'],
    deliveryMethod: 'both',
  },
];

// ---------------------------------------------------------------------------
// Conversation 5: Client <-> Pro — HVAC maintenance (completed, closed)
// ---------------------------------------------------------------------------

const conv5Messages: MockMessage[] = [
  {
    id: 'msg-5-01',
    conversationId: 'conv-5',
    senderId: 'client-maria',
    senderName: 'Maria Santos',
    senderRole: 'client',
    text: "James, my AC isn't cooling well. It runs but the air isn't cold. Can you check it?",
    timestamp: daysAgo(5),
    readBy: ['client-maria', 'pro-james'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-5-02',
    conversationId: 'conv-5',
    senderId: 'pro-james',
    senderName: 'James Wilson',
    senderRole: 'pro',
    text: "Hi Maria, that could be low refrigerant or a dirty filter. When was the last time you changed the filter?",
    timestamp: daysAgo(5),
    readBy: ['client-maria', 'pro-james'],
    deliveryMethod: 'both',
  },
  {
    id: 'msg-5-03',
    conversationId: 'conv-5',
    senderId: 'client-maria',
    senderName: 'Maria Santos',
    senderRole: 'client',
    text: "Honestly? I'm not sure, maybe 6 months ago?",
    timestamp: daysAgo(4),
    readBy: ['client-maria', 'pro-james'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-5-04',
    conversationId: 'conv-5',
    senderId: 'pro-james',
    senderName: 'James Wilson',
    senderRole: 'pro',
    text: 'That could definitely be the issue. Filters should be changed every 1-3 months. I can do a full tune-up including filter, coil cleaning, and refrigerant check for $189.',
    timestamp: daysAgo(4),
    readBy: ['client-maria', 'pro-james'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-5-05',
    conversationId: 'conv-5',
    senderId: 'client-maria',
    senderName: 'Maria Santos',
    senderRole: 'client',
    text: 'Yes please! When can you come?',
    timestamp: daysAgo(4),
    readBy: ['client-maria', 'pro-james'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-5-06',
    conversationId: 'conv-5',
    senderId: 'pro-james',
    senderName: 'James Wilson',
    senderRole: 'pro',
    text: "All done! Filter was completely clogged. Replaced it, cleaned the evaporator coil, and topped off the refrigerant. You should notice a big difference. I'd recommend setting a reminder to change the filter every 2 months.",
    timestamp: daysAgo(3),
    readBy: ['client-maria', 'pro-james'],
    deliveryMethod: 'both',
    attachments: [
      {
        type: 'photo',
        url: '/placeholder-hvac-filter.jpg',
        caption: 'Old filter vs new',
      },
    ],
  },
  {
    id: 'msg-5-07',
    conversationId: 'conv-5',
    senderId: 'client-maria',
    senderName: 'Maria Santos',
    senderRole: 'client',
    text: 'WOW the difference is night and day! Ice cold now. Thank you James!',
    timestamp: daysAgo(3),
    readBy: ['client-maria', 'pro-james'],
    deliveryMethod: 'app',
  },
];

// ---------------------------------------------------------------------------
// Conversation 6: Pro <-> Client — Electrical (in progress)
// ---------------------------------------------------------------------------

const conv6Messages: MockMessage[] = [
  {
    id: 'msg-6-01',
    conversationId: 'conv-6',
    senderId: 'pro-carlos',
    senderName: 'Carlos Rodriguez',
    senderRole: 'pro',
    text: "Hi John, I accepted your electrical panel upgrade job. I'll need to pull a permit first. Should take 2-3 days for that.",
    timestamp: daysAgo(1),
    readBy: ['client-john', 'pro-carlos'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-6-02',
    conversationId: 'conv-6',
    senderId: 'client-john',
    senderName: 'John Davidson',
    senderRole: 'client',
    text: 'No problem. Is there anything I need to do on my end?',
    timestamp: daysAgo(1),
    readBy: ['client-john', 'pro-carlos'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-6-03',
    conversationId: 'conv-6',
    senderId: 'pro-carlos',
    senderName: 'Carlos Rodriguez',
    senderRole: 'pro',
    text: "You'll need to be home for the inspection afterward. I'll give you a heads up once I get the permit and we can schedule the work day.",
    timestamp: hoursAgo(12),
    readBy: ['pro-carlos'],
    deliveryMethod: 'both',
  },
];

// ---------------------------------------------------------------------------
// Conversation 7: PM <-> Pro — Invoice dispute (multi-message)
// ---------------------------------------------------------------------------

const conv7Messages: MockMessage[] = [
  {
    id: 'msg-7-01',
    conversationId: 'conv-7',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: 'Mike, I have a question about invoice #1247. The line item for "emergency surcharge" wasn\'t in the original work order scope.',
    timestamp: hoursAgo(2),
    readBy: ['pm-lisa', 'pro-mike'],
    deliveryMethod: 'app',
  },
  {
    id: 'msg-7-02',
    conversationId: 'conv-7',
    senderId: 'pro-mike',
    senderName: 'Mike Thompson',
    senderRole: 'pro',
    text: "Right, but when I got on site I found a burst pipe behind the wall that was causing water damage. I had to address it immediately to prevent further damage to the unit below.",
    timestamp: hoursAgo(1),
    readBy: ['pm-lisa', 'pro-mike'],
    deliveryMethod: 'sms',
  },
  {
    id: 'msg-7-03',
    conversationId: 'conv-7',
    senderId: 'pm-lisa',
    senderName: 'Lisa Park',
    senderRole: 'pm',
    text: 'I understand the urgency. For future reference, please call me before adding scope so I can approve it in real-time. Can you send photos of the burst pipe for our records?',
    timestamp: minutesAgo(45),
    readBy: ['pm-lisa'],
    deliveryMethod: 'app',
  },
];

// ---------------------------------------------------------------------------
// All Conversations
// ---------------------------------------------------------------------------

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'conv-1',
    participants: [P['pro-mike'], P['client-john']],
    jobId: 'job-faucet-install',
    jobTitle: 'Kitchen Faucet Replacement',
    status: 'active',
    createdAt: daysAgo(2),
    messages: conv1Messages,
  },
  {
    id: 'conv-2',
    participants: [P['pm-lisa'], P['pro-sarah']],
    jobId: 'wo-maple-ridge-4b',
    jobTitle: 'WO: Leaking Faucet — 4B Maple Ridge',
    status: 'active',
    createdAt: daysAgo(1),
    messages: conv2Messages,
  },
  {
    id: 'conv-3',
    participants: [P['client-robert'], P['pro-carlos']],
    jobId: 'job-deck-staining',
    jobTitle: 'Deck Staining — 400 sqft',
    status: 'active',
    createdAt: daysAgo(3),
    messages: conv3Messages,
  },
  {
    id: 'conv-4',
    participants: [P['pm-lisa'], P['tenant-dave']],
    jobId: 'wo-garbage-disposal-3a',
    jobTitle: 'Maintenance: Garbage Disposal — 3A',
    status: 'active',
    createdAt: hoursAgo(6),
    messages: conv4Messages,
  },
  {
    id: 'conv-5',
    participants: [P['client-maria'], P['pro-james']],
    jobId: 'job-hvac-tuneup',
    jobTitle: 'HVAC Tune-Up & Filter',
    status: 'closed',
    createdAt: daysAgo(5),
    messages: conv5Messages,
  },
  {
    id: 'conv-6',
    participants: [P['pro-carlos'], P['client-john']],
    jobId: 'job-panel-upgrade',
    jobTitle: 'Electrical Panel Upgrade',
    status: 'active',
    createdAt: daysAgo(1),
    messages: conv6Messages,
  },
  {
    id: 'conv-7',
    participants: [P['pm-lisa'], P['pro-mike']],
    jobId: 'wo-invoice-1247',
    jobTitle: 'Invoice Discussion #1247',
    status: 'active',
    createdAt: hoursAgo(2),
    messages: conv7Messages,
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/**
 * Get conversations for a user by their participant ID.
 */
export function getConversationsForUser(userId: string): MockConversation[] {
  return MOCK_CONVERSATIONS.filter((c) =>
    c.participants.some((p) => p.id === userId),
  ).sort(
    (a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.timestamp ?? a.createdAt;
      const bLast = b.messages[b.messages.length - 1]?.timestamp ?? b.createdAt;
      return new Date(bLast).getTime() - new Date(aLast).getTime();
    },
  );
}

/**
 * Get the other participant in a conversation (relative to userId).
 */
export function getOtherParticipant(
  conversation: MockConversation,
  userId: string,
): MockParticipant | undefined {
  return conversation.participants.find((p) => p.id !== userId);
}

/**
 * Count unread messages for a user in a conversation.
 */
export function getUnreadCount(
  conversation: MockConversation,
  userId: string,
): number {
  return conversation.messages.filter(
    (m) => m.senderId !== userId && !m.readBy.includes(userId),
  ).length;
}

/**
 * Get the last message in a conversation.
 */
export function getLastMessage(
  conversation: MockConversation,
): MockMessage | undefined {
  return conversation.messages[conversation.messages.length - 1];
}
