-- Import only the data (tables should already exist from drizzle push)
-- This skips table creation and just inserts data

-- Clear existing data first (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE service_locations CASCADE;
-- TRUNCATE TABLE users CASCADE;
-- TRUNCATE TABLE waitlist_submissions CASCADE;

-- Import service_locations (CRITICAL for zip validation)
INSERT INTO service_locations (id, city, state, zip_codes, launch_date, is_active) VALUES
('e0b01262-acff-4d84-aff8-3235d86e2fe9', 'Yulee', 'FL', '{32097}', NULL, 'false'),
('d4f4cc1e-291d-4ed6-ada6-66827069f701', 'Jacksonville', 'FL', '{32256,32257,32258}', NULL, 'true'),
('3fd70238-978b-414e-ac21-0b963596dc89', 'Miami', 'FL', '{33101,33102}', NULL, 'true'),
('7edb8676-3543-4928-a3e7-7a5b170ba597', 'Oceanway', 'Fl', '{32218,32226}', NULL, 'true'),
('a9ae8bc3-e8b9-49fd-8908-ac8770da5dec', 'Fernandina', 'Fl', '{32097}', NULL, 'true')
ON CONFLICT (id) DO NOTHING;

-- Import admin user (username: admin, password: admin123)
INSERT INTO users (id, username, password) VALUES
('c1d268ed-b475-4033-96cb-00c68a3a7da9', 'admin', '$2b$12$EYXg/SakS2RK.a0/RHlw9.gesbCB5PpYX.R5uvV/khhz7toOSHxt2')
ON CONFLICT (id) DO NOTHING;

-- Import a few waitlist submissions
INSERT INTO waitlist_submissions (id, name, email, address, zip_code, phone, number_of_dogs, submitted_at, referral_source, urgency, status, can_text, last_cleanup, preferred_plan) VALUES
('da671528-030f-47c9-8a8a-acba1a57fb8e', 'Ryan Kellum', 'kellum.ryan@gmail.com', 'Zip: 32218', '32218', '9045029405', '2', '2025-08-25 13:21:55.95564+00', 'facebook', 'asap', 'active', true, 'unknown', 'unknown'),
('f4d41526-ba7b-4861-ab2d-924e6e1e4056', 'S''mantha Kellum', 'samizabs@gmail.com', 'Zip: 32218', '32218', '9046166432', '4', '2025-08-25 14:04:20.939411+00', 'friend_family', 'asap', 'active', true, 'unknown', 'unknown')
ON CONFLICT (id) DO NOTHING;
