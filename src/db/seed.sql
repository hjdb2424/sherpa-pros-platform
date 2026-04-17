-- =============================================================================
-- Sherpa Pros Platform — Development Seed Data
-- Run AFTER schema/migration has been applied
-- =============================================================================

-- =============================================================================
-- HUBS — Real New England coordinates
-- =============================================================================

INSERT INTO hubs (id, name, region, center, radius_km, dispatch_threshold_cents, is_active, config) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'Portsmouth Hub',
    'NH',
    ST_SetSRID(ST_MakePoint(-70.7626, 43.0718), 4326)::geography,
    40.00,
    5000,
    true,
    '{"timezone": "America/New_York", "emergency_dispatch": true}'
),
(
    'a1000000-0000-0000-0000-000000000002',
    'Manchester Hub',
    'NH',
    ST_SetSRID(ST_MakePoint(-71.4548, 42.9956), 4326)::geography,
    50.00,
    5000,
    true,
    '{"timezone": "America/New_York", "emergency_dispatch": true}'
),
(
    'a1000000-0000-0000-0000-000000000003',
    'Portland Hub',
    'ME',
    ST_SetSRID(ST_MakePoint(-70.2553, 43.6591), 4326)::geography,
    45.00,
    7500,
    true,
    '{"timezone": "America/New_York", "emergency_dispatch": false}'
);

-- =============================================================================
-- USERS — 5 Pros + 3 Clients
-- =============================================================================

-- Pro users
INSERT INTO users (id, clerk_id, email, phone, role) VALUES
('b1000000-0000-0000-0000-000000000001', 'clerk_pro_mike',   'mike.wilson@example.com',    '603-555-0101', 'pro'),
('b1000000-0000-0000-0000-000000000002', 'clerk_pro_sarah',  'sarah.chen@example.com',     '603-555-0102', 'pro'),
('b1000000-0000-0000-0000-000000000003', 'clerk_pro_carlos', 'carlos.rivera@example.com',  '207-555-0103', 'pro'),
('b1000000-0000-0000-0000-000000000004', 'clerk_pro_diana',  'diana.brooks@example.com',   '603-555-0104', 'pro'),
('b1000000-0000-0000-0000-000000000005', 'clerk_pro_james',  'james.murphy@example.com',   '207-555-0105', 'pro');

-- Client users
INSERT INTO users (id, clerk_id, email, phone, role) VALUES
('c1000000-0000-0000-0000-000000000001', 'clerk_client_tom',    'tom.anderson@example.com',    '603-555-0201', 'client'),
('c1000000-0000-0000-0000-000000000002', 'clerk_client_lisa',   'lisa.martinez@example.com',   '603-555-0202', 'client'),
('c1000000-0000-0000-0000-000000000003', 'clerk_client_rachel', 'rachel.kim@example.com',      '207-555-0203', 'client');

-- =============================================================================
-- PRO PROFILES
-- =============================================================================

INSERT INTO pros (id, user_id, display_name, bio, home_hub_id, travel_radius_km, onboarding_status, license_number, license_state, insurance_provider, insurance_expiry, insurance_verified, background_check_status, background_check_date, rating_score, visibility_score, badge_tier, location) VALUES
(
    'd1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Mike Wilson Plumbing',
    'Licensed master plumber with 15 years experience. Specializing in residential and light commercial plumbing throughout the Seacoast area.',
    'a1000000-0000-0000-0000-000000000001',
    35.00,
    'active',
    'PL-2024-4821',
    'NH',
    'Hartford Insurance',
    '2027-03-15',
    true,
    'passed',
    '2025-11-01',
    47,
    88,
    'gold',
    ST_SetSRID(ST_MakePoint(-70.7626, 43.0718), 4326)::geography
),
(
    'd1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000002',
    'Chen Electric',
    'Residential and commercial electrician. NEC certified. Solar panel installation specialist.',
    'a1000000-0000-0000-0000-000000000002',
    45.00,
    'active',
    'EL-2023-7733',
    'NH',
    'Liberty Mutual',
    '2027-06-30',
    true,
    'passed',
    '2025-09-15',
    44,
    82,
    'gold',
    ST_SetSRID(ST_MakePoint(-71.4548, 42.9956), 4326)::geography
),
(
    'd1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000003',
    'Rivera Carpentry',
    'Fine finish carpentry, custom cabinetry, and trim work. Building beautiful spaces for 10 years.',
    'a1000000-0000-0000-0000-000000000003',
    30.00,
    'active',
    'CB-2024-1199',
    'ME',
    'State Farm',
    '2027-01-20',
    true,
    'passed',
    '2025-10-05',
    49,
    91,
    'gold',
    ST_SetSRID(ST_MakePoint(-70.2553, 43.6591), 4326)::geography
),
(
    'd1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000004',
    'Brooks Painting Co',
    'Interior and exterior painting. Color consultation available. Eco-friendly paints.',
    'a1000000-0000-0000-0000-000000000001',
    40.00,
    'active',
    NULL,
    NULL,
    'Geico',
    '2027-04-10',
    true,
    'passed',
    '2026-01-12',
    42,
    75,
    'silver',
    ST_SetSRID(ST_MakePoint(-70.8101, 43.0348), 4326)::geography
),
(
    'd1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000005',
    'Murphy Handyman Services',
    'General handyman for all your home repair needs. No job too small.',
    'a1000000-0000-0000-0000-000000000003',
    25.00,
    'pending_verification',
    NULL,
    NULL,
    'Allstate',
    '2027-08-01',
    false,
    'pending',
    NULL,
    0,
    30,
    'bronze',
    ST_SetSRID(ST_MakePoint(-70.3203, 43.6797), 4326)::geography
);

-- =============================================================================
-- PRO TRADES
-- =============================================================================

INSERT INTO pro_trades (pro_id, trade_category, specialty, experience_years, is_primary) VALUES
('d1000000-0000-0000-0000-000000000001', 'plumbing',     'Residential plumbing',        15, true),
('d1000000-0000-0000-0000-000000000001', 'plumbing',     'Water heater installation',   12, false),
('d1000000-0000-0000-0000-000000000002', 'electrical',   'Residential wiring',          10, true),
('d1000000-0000-0000-0000-000000000002', 'electrical',   'Solar panel installation',     5, false),
('d1000000-0000-0000-0000-000000000003', 'carpentry',    'Finish carpentry',            10, true),
('d1000000-0000-0000-0000-000000000003', 'carpentry',    'Custom cabinetry',             8, false),
('d1000000-0000-0000-0000-000000000004', 'painting',     'Interior painting',            7, true),
('d1000000-0000-0000-0000-000000000004', 'painting',     'Exterior painting',            7, false),
('d1000000-0000-0000-0000-000000000005', 'general',      'General handyman',             4, true),
('d1000000-0000-0000-0000-000000000005', 'carpentry',    'Basic carpentry repairs',      3, false);

-- =============================================================================
-- PRO CERTIFICATIONS
-- =============================================================================

INSERT INTO pro_certifications (pro_id, cert_type, cert_number, issuer, issued_date, expiry_date, verified) VALUES
('d1000000-0000-0000-0000-000000000001', 'Master Plumber',          'MP-NH-4821',   'NH Board of Plumbers',   '2020-06-15', '2027-06-15', true),
('d1000000-0000-0000-0000-000000000002', 'Journeyman Electrician',  'JE-NH-7733',   'NH Electricians Board',  '2019-03-01', '2027-03-01', true),
('d1000000-0000-0000-0000-000000000002', 'NABCEP Solar PV',         'NABCEP-22190', 'NABCEP',                 '2022-08-10', '2028-08-10', true),
('d1000000-0000-0000-0000-000000000003', 'EPA Lead-Safe',           'RRP-ME-1199',  'EPA',                    '2023-01-20', '2028-01-20', true);

-- =============================================================================
-- HUB-PRO ASSIGNMENTS
-- =============================================================================

INSERT INTO hub_pros (hub_id, pro_id, is_home_hub) VALUES
('a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', true),
('a1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', false),
('a1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', true),
('a1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', true),
('a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000004', true),
('a1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000005', true);

-- =============================================================================
-- JOBS — 5 jobs in various states
-- =============================================================================

INSERT INTO jobs (id, client_user_id, title, description, category, urgency, budget_min_cents, budget_max_cents, location, address, hub_id, status, dispatch_type, permit_required) VALUES
(
    'e1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Kitchen faucet replacement and garbage disposal install',
    'Need to replace a leaking kitchen faucet and install a new garbage disposal. Current faucet is a Moen single-handle.',
    'plumbing',
    'standard',
    25000, 45000,
    ST_SetSRID(ST_MakePoint(-70.7580, 43.0650), 4326)::geography,
    '42 Market St, Portsmouth, NH 03801',
    'a1000000-0000-0000-0000-000000000001',
    'accepting_bids',
    'bid',
    false
),
(
    'e1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'Bathroom electrical upgrade — GFCI outlets',
    'Need to upgrade 3 bathroom outlets to GFCI. House built in 1985, may need rewiring from panel.',
    'electrical',
    'standard',
    30000, 60000,
    ST_SetSRID(ST_MakePoint(-70.7580, 43.0650), 4326)::geography,
    '42 Market St, Portsmouth, NH 03801',
    'a1000000-0000-0000-0000-000000000001',
    'assigned',
    'bid',
    true
),
(
    'e1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000002',
    'Interior painting — Living room and hallway',
    'Approximately 800 sq ft of wall space. Ceilings are 9 ft. Need patching on one wall. Prefer low-VOC paint.',
    'painting',
    'flexible',
    150000, 250000,
    ST_SetSRID(ST_MakePoint(-71.4630, 42.9900), 4326)::geography,
    '155 Elm St, Manchester, NH 03101',
    'a1000000-0000-0000-0000-000000000002',
    'in_progress',
    'bid',
    false
),
(
    'e1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000003',
    'Emergency burst pipe repair',
    'Pipe burst in basement. Water shut off but need immediate repair. Copper pipe in unfinished basement.',
    'plumbing',
    'emergency',
    40000, 120000,
    ST_SetSRID(ST_MakePoint(-70.2600, 43.6550), 4326)::geography,
    '78 Congress St, Portland, ME 04101',
    'a1000000-0000-0000-0000-000000000003',
    'completed',
    'auto',
    false
),
(
    'e1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000002',
    'Custom built-in bookshelves',
    'Looking for custom floor-to-ceiling built-in bookshelves for home office. Approximately 12 ft wide, 8 ft tall. Prefer maple or cherry.',
    'carpentry',
    'flexible',
    350000, 600000,
    ST_SetSRID(ST_MakePoint(-71.4630, 42.9900), 4326)::geography,
    '155 Elm St, Manchester, NH 03101',
    'a1000000-0000-0000-0000-000000000002',
    'posted',
    'bid',
    false
);

-- =============================================================================
-- JOB MILESTONES
-- =============================================================================

INSERT INTO job_milestones (id, job_id, title, amount_cents, sort_order, status) VALUES
('f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000003', 'Wall prep and patching',    50000, 1, 'completed'),
('f1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000003', 'First coat — walls',        60000, 2, 'in_progress'),
('f1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000003', 'Second coat and trim',      70000, 3, 'pending'),
('f1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000004', 'Emergency pipe repair',     85000, 1, 'released'),
('f1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000005', 'Design and material',      150000, 1, 'pending'),
('f1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000005', 'Build and install',        300000, 2, 'pending'),
('f1000000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000005', 'Finish and touch-up',      100000, 3, 'pending');

-- =============================================================================
-- BIDS
-- =============================================================================

INSERT INTO bids (id, job_id, pro_id, amount_cents, message, estimated_duration_days, wiseman_deviation_pct, status) VALUES
(
    'e1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000001',
    35000,
    'I can handle both the faucet and disposal. I carry Moen parts on my truck. Available this week.',
    1,
    -2.50,
    'pending'
),
(
    'e1000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000002',
    'd1000000-0000-0000-0000-000000000002',
    45000,
    'GFCI upgrade is straightforward. I will inspect the panel first and quote any additional wiring needed.',
    2,
    5.00,
    'accepted'
),
(
    'e1000000-0000-0000-0000-000000000003',
    'e1000000-0000-0000-0000-000000000003',
    'd1000000-0000-0000-0000-000000000004',
    180000,
    'I specialize in interior painting. Price includes premium low-VOC Benjamin Moore paint, 2 coats walls, 1 coat trim.',
    4,
    -1.00,
    'accepted'
),
(
    'e1000000-0000-0000-0000-000000000004',
    'e1000000-0000-0000-0000-000000000004',
    'd1000000-0000-0000-0000-000000000001',
    85000,
    'Emergency dispatch — on my way. Copper repair with SharkBite for immediate fix, then proper solder joint.',
    1,
    0.00,
    'accepted'
);

-- =============================================================================
-- RATINGS — For the completed job
-- =============================================================================

INSERT INTO ratings (id, job_id, from_user_id, to_user_id, overall_score, quality, communication, timeliness, value, review_text) VALUES
(
    'f1000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    5, 5, 5, 5, 4,
    'Mike arrived within 45 minutes of the emergency dispatch. Fixed the burst pipe quickly and cleaned up everything. Highly recommend.'
),
(
    'f1000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000003',
    5, 5, 5, 5, 5,
    'Rachel had the water shut off before I arrived and clearly explained the situation. Great client to work with.'
);

-- =============================================================================
-- RATING RESPONSES
-- =============================================================================

INSERT INTO rating_responses (rating_id, responder_id, body) VALUES
(
    'f1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Thank you Rachel! Glad I could get there quickly. Those old copper joints can go at the worst times.'
);

-- =============================================================================
-- PAYMENTS — For the completed emergency job
-- =============================================================================

INSERT INTO payments (id, job_id, milestone_id, payer_user_id, payee_user_id, amount_cents, commission_cents, service_fee_cents, stripe_payment_intent_id, status, held_at, released_at) VALUES
(
    'f2000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000004',
    'f1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    85000,
    8500,
    2550,
    'pi_test_emergency_pipe_001',
    'released',
    '2026-04-08 14:30:00+00',
    '2026-04-10 10:00:00+00'
);

-- =============================================================================
-- CONVERSATIONS
-- =============================================================================

INSERT INTO conversations (id, job_id, pro_user_id, client_user_id, twilio_conversation_sid, status) VALUES
(
    'f3000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'CH_seed_conversation_001',
    'active'
),
(
    'f3000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000002',
    'CH_seed_conversation_002',
    'active'
);

-- =============================================================================
-- MESSAGES
-- =============================================================================

INSERT INTO messages (conversation_id, sender_user_id, body) VALUES
('f3000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Hi Mike, the faucet is a Moen Align single-handle. Disposal is a Badger 5. Let me know if you need any other details.'),
('f3000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Thanks Tom. I have Moen parts on the truck. For the disposal, does your sink have a switch already or do we need to add one?'),
('f3000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'There is an existing switch on the wall next to the sink.'),
('f3000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 'Hi Lisa, I stopped by to look at the walls. The patch area on the east wall is about 2 sq ft. Should be a clean fix.'),
('f3000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Great, thanks Diana. The color we picked is Benjamin Moore Simply White OC-117 for walls.');

-- =============================================================================
-- JOB CHECKLISTS
-- =============================================================================

INSERT INTO job_checklists (job_id, type, items, required) VALUES
(
    'e1000000-0000-0000-0000-000000000003',
    'onboarding',
    '[
        {"label": "Drop cloths placed on all floors", "checked": true},
        {"label": "Furniture moved or covered", "checked": true},
        {"label": "Outlet and switch plates removed", "checked": true},
        {"label": "Painter tape applied to trim", "checked": false}
    ]',
    true
),
(
    'e1000000-0000-0000-0000-000000000004',
    'offboarding',
    '[
        {"label": "Area cleaned and dried", "checked": true},
        {"label": "Water supply restored and tested", "checked": true},
        {"label": "Client walkthrough completed", "checked": true},
        {"label": "Before/after photos uploaded", "checked": true}
    ]',
    true
);
