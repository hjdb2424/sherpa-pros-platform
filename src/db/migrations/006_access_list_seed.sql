-- Seed: populate access_list from the original hardcoded list (24 entries)

INSERT INTO access_list (email, name, default_role, status, invited_by, notes) VALUES
  -- Founders / Team
  ('poum@hjd.builders', 'Phyrom', NULL, 'active', NULL, 'Founder'),

  -- PM Beta Testers
  ('lisa.park@test.com', 'Lisa Park', 'pm', 'active', 'poum@hjd.builders', 'PM beta tester'),
  ('david.chen@test.com', 'David Chen', 'pm', 'active', 'poum@hjd.builders', 'PM beta tester'),
  ('rachel.torres@test.com', 'Rachel Torres', 'pm', 'active', 'poum@hjd.builders', 'PM beta tester'),

  -- Pro Beta Testers
  ('mike.rodriguez@test.com', 'Mike Rodriguez', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('james.wilson@test.com', 'James Wilson', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('sarah.chen@test.com', 'Sarah Chen', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('carlos.rivera@test.com', 'Carlos Rivera', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('diana.brooks@test.com', 'Diana Brooks', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('tom.sullivan@test.com', 'Tom Sullivan', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('maria.santos@test.com', 'Maria Santos', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('kevin.obrien@test.com', 'Kevin O''Brien', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('andre.mitchell@test.com', 'Andre Mitchell', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),
  ('jenny.kim@test.com', 'Jenny Kim', 'pro', 'active', 'poum@hjd.builders', 'Pro beta tester'),

  -- Client Beta Testers
  ('jamie.davis@test.com', 'Jamie Davis', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('alex.rivera@test.com', 'Alex Rivera', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('morgan.lee@test.com', 'Morgan Lee', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('sam.patel@test.com', 'Sam Patel', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('chris.thompson@test.com', 'Chris Thompson', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('taylor.kim@test.com', 'Taylor Kim', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('jordan.williams@test.com', 'Jordan Williams', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('casey.martin@test.com', 'Casey Martin', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('riley.anderson@test.com', 'Riley Anderson', 'client', 'active', 'poum@hjd.builders', 'Client beta tester'),
  ('avery.brown@test.com', 'Avery Brown', 'client', 'active', 'poum@hjd.builders', 'Client beta tester')
ON CONFLICT (email) DO NOTHING;
