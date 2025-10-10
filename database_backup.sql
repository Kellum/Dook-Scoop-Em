--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (165f042)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: charges; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.charges (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    customer_id character varying NOT NULL,
    stripe_invoice_id text,
    type text NOT NULL,
    amount_cents integer NOT NULL,
    status text NOT NULL,
    description text,
    created_at text DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: customers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.customers (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    clerk_user_id text NOT NULL,
    stripe_customer_id text,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    address text,
    city text,
    state text,
    zip_code text,
    gate_code text,
    dog_names text[],
    notification_preference text DEFAULT 'email'::text,
    notes text,
    role text DEFAULT 'customer'::text,
    created_at text DEFAULT CURRENT_TIMESTAMP,
    updated_at text DEFAULT CURRENT_TIMESTAMP,
    gated_community text,
    gate_location text,
    number_of_dogs integer DEFAULT 1
);


--
-- Name: media_assets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.media_assets (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    filename text NOT NULL,
    original_name text NOT NULL,
    mime_type text NOT NULL,
    size integer NOT NULL,
    url text NOT NULL,
    alt_text text,
    caption text,
    uploaded_at text DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: onboarding_submissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.onboarding_submissions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    home_address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text NOT NULL,
    home_phone text,
    cell_phone text NOT NULL,
    number_of_dogs integer NOT NULL,
    service_frequency text NOT NULL,
    initial_cleanup_required boolean DEFAULT true,
    notification_type text DEFAULT 'completed,on_the_way'::text,
    notification_channel text DEFAULT 'sms'::text,
    how_heard_about_us text,
    additional_comments text,
    sweepandgo_response text,
    sweepandgo_client_id text,
    status text DEFAULT 'pending'::text,
    error_message text,
    submitted_at text DEFAULT CURRENT_TIMESTAMP,
    updated_at text DEFAULT CURRENT_TIMESTAMP,
    last_cleaned_timeframe text DEFAULT 'one_month'::text NOT NULL,
    cleanup_notification_type text DEFAULT 'completed,on_the_way'::text,
    cleanup_notification_channel text DEFAULT 'sms'::text,
    gated_community text,
    gate_location text,
    dog_names text[]
);


--
-- Name: page_content; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.page_content (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    page_id character varying NOT NULL,
    element_id text NOT NULL,
    content_type text NOT NULL,
    content text NOT NULL,
    metadata text,
    updated_at text DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: pages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.pages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    status text DEFAULT 'published'::text,
    created_at text DEFAULT CURRENT_TIMESTAMP,
    updated_at text DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: quote_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.quote_requests (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    zip_code text NOT NULL,
    number_of_dogs integer NOT NULL,
    service_frequency text NOT NULL,
    urgency text NOT NULL,
    preferred_contact_method text DEFAULT 'email'::text,
    message text,
    sweepandgo_email_exists boolean DEFAULT false,
    sweepandgo_pricing text,
    status text DEFAULT 'new'::text,
    estimated_price numeric(10,2),
    notes text,
    submitted_at text DEFAULT CURRENT_TIMESTAMP,
    updated_at text DEFAULT CURRENT_TIMESTAMP,
    contacted_at text,
    quoted_at text
);


--
-- Name: seo_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.seo_settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    page_id character varying NOT NULL,
    meta_title text,
    meta_description text,
    og_title text,
    og_description text,
    og_image text,
    twitter_title text,
    twitter_description text,
    twitter_image text,
    structured_data text,
    custom_meta text,
    updated_at text DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: service_locations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.service_locations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip_codes text[] NOT NULL,
    launch_date text,
    is_active text DEFAULT 'false'::text
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    customer_id character varying NOT NULL,
    stripe_subscription_id text,
    plan text NOT NULL,
    dog_count integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    current_period_start text,
    current_period_end text,
    cancel_at_period_end boolean DEFAULT false,
    created_at text DEFAULT CURRENT_TIMESTAMP,
    updated_at text DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


--
-- Name: visits; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.visits (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    subscription_id character varying NOT NULL,
    customer_id character varying NOT NULL,
    scheduled_for text NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tech_notes text,
    completed_at text,
    created_at text DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: waitlist_submissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE IF NOT EXISTS public.waitlist_submissions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    address text NOT NULL,
    zip_code text NOT NULL,
    phone text NOT NULL,
    number_of_dogs text NOT NULL,
    submitted_at text DEFAULT CURRENT_TIMESTAMP,
    referral_source text NOT NULL,
    urgency text NOT NULL,
    status text DEFAULT 'active'::text,
    can_text boolean DEFAULT false NOT NULL,
    last_cleanup text DEFAULT 'unknown'::text,
    preferred_plan text DEFAULT 'unknown'::text
);


--
-- Data for Name: charges; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.charges (id, customer_id, stripe_invoice_id, type, amount_cents, status, description, created_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (id, clerk_user_id, stripe_customer_id, email, first_name, last_name, phone, address, city, state, zip_code, gate_code, dog_names, notification_preference, notes, role, created_at, updated_at, gated_community, gate_location, number_of_dogs) FROM stdin;
bc0097d7-05f8-4f06-8861-565c2620d396	test-supabase-id-123	test-stripe-cus-123	test@example.com	Test	User	904-555-0100	123 Test St	Jacksonville	FL	32218	\N	\N	email	\N	customer	2025-10-03 16:54:39.002751+00	2025-10-03 16:54:39.002751+00	\N	\N	1
d91a7313-20b9-4a2d-9c86-ad77d3c6fb53	6930ce8b-87c7-4e03-8c53-61c02ceb278e	cus_TAXEx6fIysnYOi	skatehead@skaterboi.com								\N	\N	email	\N	customer	2025-10-03 17:25:27.010519+00	2025-10-03 17:25:27.010519+00	\N	\N	1
c5a46cb0-0fb9-4753-b660-5ce14c37caa9	a0693789-b6bc-47ca-8c54-add583043baa	cus_TAX5lrpNhHyzRa	testerboisy@testerboi.com								\N	\N	email	\N	customer	2025-10-03 17:25:27.292394+00	2025-10-03 17:25:27.292394+00	\N	\N	1
084b2676-4a9d-49fb-8ce0-1012200e2d83	f9a50bbd-ec5f-44ae-bb2e-10c8dd2cb6c6	cus_TAWnqxGwDJAdC8	testerbois@testerboi.com								\N	\N	email	\N	customer	2025-10-03 17:25:27.524425+00	2025-10-03 17:25:27.524425+00	\N	\N	1
40f51f25-c926-4c4e-9d22-a082748857d7	32ed0ab8-fd9a-4c3f-a1a4-5503a368abca	cus_TAY9r05rUc9daT	jeb+kellum.ryan@gmail.com								\N	\N	email	\N	customer	2025-10-03 17:47:08.371941+00	2025-10-03 17:47:08.371941+00	\N	\N	1
10105159-3eb1-495c-bdeb-ec69960e8ec4	353935ae-3317-44ff-89be-2640cafcd38c	cus_TAZHpKEzj1KCHh	dud+kellum.ryan@gmail.com	Ryan	Kellum	9045029405	3432 Brahma Bull Circle North	Jacksonville	FL	32218		\N	email	\N	customer	2025-10-03 18:56:22.495741+00	2025-10-03 18:56:22.495741+00	false		1
43a93aa9-0997-49e9-8104-78ef88184f08	15618f5d-c051-4a70-a7d5-e040fcc825d2	cus_TAYvzfyKrgmzuU	fudger+kellum.ryan@gmail.com	rommy	fudger	9045555555	123 hhhhhhh	jacksonville	FL	32218		\N	email	\N	customer	2025-10-03 19:35:26.294979+00	2025-10-03 19:35:26.294979+00	false		1
81d8f60b-4dce-4d5f-b819-d40c5ebe66cf	8ab31e79-01bb-4f54-b2f2-54aee0915dbf	cus_TAZDT4YHMNMH9W	trip+kellum.ryan@gmail.com	Ryan	Kellum	9045029405	3432 Brahma Bull Circle North	Jacksonville	FL	32218		\N	email	\N	customer	2025-10-03 19:52:19.940273+00	2025-10-03 19:52:19.940273+00	false		1
\.


--
-- Data for Name: media_assets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.media_assets (id, filename, original_name, mime_type, size, url, alt_text, caption, uploaded_at) FROM stdin;
\.


--
-- Data for Name: onboarding_submissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.onboarding_submissions (id, first_name, last_name, email, home_address, city, state, zip_code, home_phone, cell_phone, number_of_dogs, service_frequency, initial_cleanup_required, notification_type, notification_channel, how_heard_about_us, additional_comments, sweepandgo_response, sweepandgo_client_id, status, error_message, submitted_at, updated_at, last_cleaned_timeframe, cleanup_notification_type, cleanup_notification_channel, gated_community, gate_location, dog_names) FROM stdin;
0a0450b6-4472-42f4-afbe-867fea3bfc0e	Ryan	Kellum	ry@kellumfoto.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The zip code field must be a string. (and 1 more error)","errors":{"zip_code":["The zip code field must be a string."],"initial_cleanup_required":["The selected initial cleanup required is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-04 11:53:38.137784+00	2025-09-04T11:53:38.324Z	one_month	completed,on_the_way	sms	\N	\N	\N
307f3d98-4ce3-45c5-974c-fbc1bc67ce26	Ryan	Kellum	ry@kellumfoto.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The selected initial cleanup required is invalid.","errors":{"initial_cleanup_required":["The selected initial cleanup required is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-04 12:00:03.495061+00	2025-09-04T12:00:03.726Z	one_month	completed,on_the_way	sms	\N	\N	\N
60bfc510-c3fb-4ba3-a683-0402507f69c3	Ryan	Kellum	jaxblockpartyco@gmail.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The selected initial cleanup required is invalid.","errors":{"initial_cleanup_required":["The selected initial cleanup required is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-09 11:24:00.679277+00	2025-09-09T11:24:00.968Z	one_month	completed,on_the_way	sms	nope	left	{duke,bob}
35572437-a9ff-4e8b-abcb-dab6ca7d2566	Ryan	Kellum	jaxblockpartyco@gmail.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The selected initial cleanup required is invalid.","errors":{"initial_cleanup_required":["The selected initial cleanup required is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-09 11:37:37.672467+00	2025-09-09T11:37:37.920Z	one_month	completed,on_the_way	sms	eeeeee	left	{bob}
686c641e-5154-4dca-bbf9-d2a31dcd845d	Ryan	Kellum	jaxblockpartyco@gmail.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The selected initial cleanup required is invalid.","errors":{"initial_cleanup_required":["The selected initial cleanup required is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-09 11:42:02.068917+00	2025-09-09T11:42:02.489Z	one_month	completed,on_the_way	sms	nope	left	{bob}
c0204b6a-9701-4951-9096-2086aa0bfc29	Ryan	Kellum	jaxblockpartyco@gmail.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The selected initial cleanup required is invalid.","errors":{"initial_cleanup_required":["The selected initial cleanup required is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-09 11:45:41.801495+00	2025-09-09T11:45:42.086Z	one_month	completed,on_the_way	sms	nope	right	{bob}
44d63edd-17a1-4476-96bc-6b917298e7c6	bill	tester	jaxblockpartyco@gmail.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The selected initial cleanup required is invalid.","errors":{"initial_cleanup_required":["The selected initial cleanup required is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-09 11:50:54.009948+00	2025-09-09T11:50:54.300Z	one_month	completed,on_the_way	sms	nope	left	{bob}
fe75e407-5efc-4fb2-b277-9a834c41f803	fred	Kellum	jaxblockpartyco@gmail.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"success":"success"}	\N	completed	\N	2025-09-09 11:54:38.975319+00	2025-09-09T11:54:41.558Z	one_month	completed,on_the_way	sms	nope	alley	{bob}
23c3dc1d-10ba-492d-a849-6ea3a73b5f1b	Ryan	Kellum	ry@islandglassandmirror.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"success":"success"}	\N	completed	\N	2025-09-09 12:06:21.18849+00	2025-09-09T12:06:23.699Z	one_month	completed,on_the_way	sms	nope	left	{}
2124fae7-9eda-4e23-8683-c79f89d27670	Ryan	Kellum	bob@bobbyiest.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"success":"success"}	\N	completed	\N	2025-09-09 12:12:55.396856+00	2025-09-09T12:12:57.930Z	one_month	completed,on_the_way	sms	qqwer	left	{}
22089c06-f669-49d6-a54f-84d28ea2cfa7	brian	Kellum	dude@dookscoop.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"success":"success"}	\N	completed	\N	2025-09-09 12:17:29.469402+00	2025-09-09T12:17:31.998Z	one_month	completed,on_the_way	sms	nope	left	{}
e25fcc89-55ae-4b84-aee0-0a0a787a0363	billy	badass	duder@dookscoopem.com	3432 Brahma Bull Circle North	Jacksonville	FL	32226	9045029405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"success":"success"}	\N	completed	\N	2025-09-09 12:22:33.896788+00	2025-09-09T12:22:36.562Z	one_month	completed,on_the_way	sms	nope	right	{}
2e660d58-1f09-4685-b67c-fdf11840b5b3	Ashley	Thomas	tester@testerboi.com	3432 Brahma Bull Circle North	Jacksonville Beach	FL	32218		9045029405	1	once_a_week	f	completed,on_the_way	sms			{"success":"success","client_id":"rcl_KN1QVIHDBMH2","client":"rcl_KN1QVIHDBMH2","full_response":{"success":"success","clientData":{"client":"rcl_KN1QVIHDBMH2","type":"open_api","status":"active","email":"tester@testerboi.com","first_name":"Ashley","last_name":"Thomas","address":"3432 Brahma Bull Circle North","city":"Jacksonville Beach","zip_code":"32218","home_phone":null,"cell_phone":"9045029405","channel":null,"on_the_way":null,"completed":null,"off_schedule":null,"tracking_field":null,"service_days":null,"assigned_to":null,"cleanup_frequency":"","subscription_names":"1d-1xW"}}}	rcl_KN1QVIHDBMH2	completed	\N	2025-09-16 11:40:41.107393+00	2025-09-16T11:40:43.786Z	one_month	completed,on_the_way	sms		no_gate	{}
1651991b-63ff-4948-9e7a-5da1ed7fddac	Ashley	Thomas	kellum.ryan@gmail.com	183 fkdndi	Jacksonville Beach	FL	32226	9045026405	9045029405	1	once_a_week	f	completed,on_the_way	sms			{"success":"success","client_id":"rcl_JWCVAPWNPXKJ","client":"rcl_JWCVAPWNPXKJ","full_response":{"success":"success","clientData":{"client":"rcl_JWCVAPWNPXKJ","type":"open_api","status":"active","email":"kellum.ryan@gmail.com","first_name":"Ashley","last_name":"Thomas","address":"183 fkdndi","city":"Jacksonville Beach","zip_code":"32226","home_phone":"9045026405","cell_phone":"9045029405","channel":null,"on_the_way":null,"completed":null,"off_schedule":null,"tracking_field":null,"service_days":null,"assigned_to":null,"cleanup_frequency":"","subscription_names":null}}}	rcl_JWCVAPWNPXKJ	completed	\N	2025-09-24 11:18:03.429666+00	2025-09-24T11:18:05.616Z	one_month	completed,on_the_way	sms		no_gate	{}
b23e6485-e0e9-4aca-b950-de5a746234db	john	mckinley	johnmckinley09@gmail.com	3971 kaden dr 	Jacksonville	FL	32277	9044046551	9043358553	2	twice_a_week	f	completed,on_the_way	sms		Watch out for the turtles 	{"error":"Onboarding failed: 422 Unprocessable Content","details":{"message":"The selected last time yard was thoroughly cleaned is invalid. (and 1 more error)","errors":{"last_time_yard_was_thoroughly_cleaned":["The selected last time yard was thoroughly cleaned is invalid."],"clean_up_frequency":["The selected clean up frequency is invalid."]}}}	\N	failed	Onboarding failed: 422 Unprocessable Content	2025-09-24 21:02:00.725129+00	2025-09-24T21:02:00.977Z	one_year	completed,on_the_way	email		no_gate	{Dook}
\.


--
-- Data for Name: page_content; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.page_content (id, page_id, element_id, content_type, content, metadata, updated_at) FROM stdin;
2aee234c-c1b7-422f-ab95-3b3883e010f1	6231a32a-2199-45e1-869d-5077d8549322	hero-title	text	WE FEAR NO PILE	\N	2025-08-24 14:03:12.184038+00
e0858cfa-b847-43bf-b372-4af94baf0998	6231a32a-2199-45e1-869d-5077d8549322	hero-subtitle	text	Professional Pet Waste Removal Service	\N	2025-08-24 14:03:12.283865+00
2072cbda-6766-44df-97af-2bc3db1f1a03	6231a32a-2199-45e1-869d-5077d8549322	service-description	text	Starting in Yulee, Fernandina, Oceanway & Nassau County with plans to expand across Northeast Florida in 2025.	\N	2025-08-24 14:03:12.376829+00
b1a3168b-6b9b-46c4-aeb6-f9778566f218	6231a32a-2199-45e1-869d-5077d8549322	pricing-regular	text	$100	\N	2025-08-24 14:03:12.470258+00
9a0e391a-4ffd-40c0-9086-5aad68ad1562	6231a32a-2199-45e1-869d-5077d8549322	pricing-founding	text	$85	\N	2025-08-24 14:03:12.563382+00
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.pages (id, slug, title, status, created_at, updated_at) FROM stdin;
6231a32a-2199-45e1-869d-5077d8549322	/	Dook Scoop 'Em - Professional Pet Waste Removal	published	2025-08-24 14:03:12.077187+00	2025-08-24 14:03:12.077187+00
4a19c1bc-f44a-44f5-b9cb-b9d2a0651cb8	/about	About Us	draft	2025-08-24 14:03:50.269323+00	2025-08-24 14:03:50.269323+00
\.


--
-- Data for Name: seo_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.seo_settings (id, page_id, meta_title, meta_description, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, structured_data, custom_meta, updated_at) FROM stdin;
35ca6373-9d25-45b4-b5c1-a406993a711a	6231a32a-2199-45e1-869d-5077d8549322	Dook Scoop 'Em - Professional Pet Waste Removal Service	Professional dog poop cleanup service in Nassau County. Starting in Yulee, Fernandina Beach, and Oceanway. We fear no pile!	Dook Scoop 'Em - We Fear No Pile	Professional pet waste removal service coming to Northeast Florida in 2025.	\N	\N	\N	\N	{"@context":"https://schema.org","@type":"LocalBusiness","name":"Dook Scoop 'Em","description":"Professional pet waste removal service","address":{"@type":"PostalAddress","addressRegion":"FL","addressCountry":"US"},"serviceArea":["Nassau County","Yulee","Fernandina Beach","Oceanway"]}	\N	2025-08-24 14:03:12.658765+00
\.


--
-- Data for Name: service_locations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_locations (id, city, state, zip_codes, launch_date, is_active) FROM stdin;
e0b01262-acff-4d84-aff8-3235d86e2fe9	Yulee	FL	{32097}		false
d4f4cc1e-291d-4ed6-ada6-66827069f701	Jacksonville	FL	{32256,32257,32258}	\N	true
3fd70238-978b-414e-ac21-0b963596dc89	Miami	FL	{33101,33102}	\N	true
7edb8676-3543-4928-a3e7-7a5b170ba597	Oceanway	Fl	{32218,32226}		true
a9ae8bc3-e8b9-49fd-8908-ac8770da5dec	Fernandina	Fl	{32097}		true
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscriptions (id, customer_id, stripe_subscription_id, plan, dog_count, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at) FROM stdin;
eb18ff57-d326-4b29-bed0-25d65b97140a	d91a7313-20b9-4a2d-9c86-ad77d3c6fb53	sub_1SEC9sBR9FsYjNNMl657Dbd8	weekly	1	active	\N	\N	f	2025-10-03 17:25:27.142378+00	2025-10-03 17:25:27.142378+00
f06601f6-2e7e-485a-8530-708d052ffc00	c5a46cb0-0fb9-4753-b660-5ce14c37caa9	sub_1SEC1iBR9FsYjNNMaqKTyyAj	weekly	1	active	\N	\N	f	2025-10-03 17:25:27.386563+00	2025-10-03 17:25:27.386563+00
14251c7c-3519-465b-8a88-5f66c33fb20b	084b2676-4a9d-49fb-8ce0-1012200e2d83	sub_1SEBkpBR9FsYjNNM6Q9NPBRE	weekly	1	active	\N	\N	f	2025-10-03 17:25:27.619177+00	2025-10-03 17:25:27.619177+00
bae0f95f-2e37-4332-9df0-492a9ecc2b82	40f51f25-c926-4c4e-9d22-a082748857d7	sub_1SED3WBR9FsYjNNM9cFoDDL1	biweekly	1	active	\N	\N	f	2025-10-03 17:47:08.486134+00	2025-10-03 17:47:08.486134+00
b519c106-f081-463d-a2e6-0a40b8ebe981	43a93aa9-0997-49e9-8104-78ef88184f08	sub_1SEDnpBR9FsYjNNMLZP6mHcd	weekly	1	active	2025-10-03T19:35:26.601Z	2025-11-02T19:35:26.601Z	f	2025-10-03 19:35:26.619765+00	2025-10-03 19:35:26.619765+00
dc322b30-3141-4b84-b01e-2b0399d3f221	81d8f60b-4dce-4d5f-b819-d40c5ebe66cf	sub_1SEE5kBR9FsYjNNMlqwtDHE4	biweekly	1	active	2025-10-03T19:52:20.249Z	2025-11-02T19:52:20.249Z	f	2025-10-03 19:52:20.268015+00	2025-10-03 19:52:20.268015+00
84313888-ce69-4bda-921c-561564a01f43	10105159-3eb1-495c-bdeb-ec69960e8ec4	sub_1SEE9QBR9FsYjNNMLgVabTzB	weekly	1	active	2025-10-03T19:56:32.119Z	2025-11-02T19:56:32.119Z	f	2025-10-03 19:56:32.137742+00	2025-10-03 19:56:32.137742+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password) FROM stdin;
c1d268ed-b475-4033-96cb-00c68a3a7da9	admin	$2b$12$EYXg/SakS2RK.a0/RHlw9.gesbCB5PpYX.R5uvV/khhz7toOSHxt2
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.visits (id, subscription_id, customer_id, scheduled_for, status, tech_notes, completed_at, created_at) FROM stdin;
\.


--
-- Data for Name: waitlist_submissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.waitlist_submissions (id, name, email, address, zip_code, phone, number_of_dogs, submitted_at, referral_source, urgency, status, can_text, last_cleanup, preferred_plan) FROM stdin;
ea51ec36-1c77-4276-bcca-484a613b6f8c	Test User	test@example.com	Zip: 12345	12345	5551234567	2	2025-08-17 14:27:28.67904+00	facebook	asap	archived	f	unknown	unknown
8bdf27d9-8cec-4fa1-b17c-b24cb3b1fa2d	Ryan Kellumer	kellum.ryan.test@gmail.com	Zip: 32218	32218	9045029405	3	2025-08-17 14:30:12.913626+00	instagram	asap	archived	f	unknown	unknown
ebb25a86-21c1-4694-850e-758352c94b70	Test User Complete	testcomplete@example.com	Zip: 54321	54321	5559876543	3	2025-08-17 14:33:02.019631+00	instagram	yesterday	archived	f	unknown	unknown
a14d7365-4278-4d2f-8653-ff5591e628c9	Billy Badass	bill@badass.com	Zip: 32226	32226	9045029405	2	2025-08-17 14:58:14.288423+00	instagram	yesterday	archived	f	unknown	unknown
48f4b496-a17e-44dc-b013-95b9daa7fe64	Test Archive User	testarchive@example.com	Zip: 67890	67890	5551112222	1	2025-08-17 19:11:03.302372+00	google	asap	archived	f	unknown	unknown
9a6f343f-2cdc-4329-b6a4-1bd58b8b650b	Test Delete User	testdelete@example.com	Zip: 98765	98765	5553334444	2	2025-08-17 19:14:57.458365+00	friend	whenever	archived	f	unknown	unknown
08ae3a30-e41b-4e16-b980-818300ce8eb5	Test Archive Function	testarchivefunction@example.com	Test Archive Street	11111	5557778888	1	2025-08-17 19:17:08.807917+00	website	whenever	archived	f	unknown	unknown
7d32612d-bf5c-490b-9352-19e1df006652	Ryan Kellum	kellum.ryan@gmail.com	3432 Brahma Bull Circle North	32226	9045029405	3	2025-08-08 00:50:12.257448+00	not_specified	not_specified	archived	f	unknown	unknown
6edb3638-ebf0-48ae-a641-ec1641bd539c	Ryan Kellum	ry@kellumfoto.com	3432 Brahma Bull Circle North	32226	9045029405	3	2025-08-15 23:16:56.560809+00	not_specified	not_specified	archived	f	unknown	unknown
68cde754-206d-4096-928d-67e509f481a5	Text Permission Test	texttest@example.com	123 Test Street	12345	5551234567	2	2025-08-18 10:56:06.542414+00	website	asap	active	t	unknown	unknown
49d9caff-cee4-48c9-a1d7-5fd2eb04fb9e	bob bob	bob@bob.com	Zip: 32226	32226	9045555555	2	2025-08-18 11:10:04.565609+00	instagram	asap	active	f	unknown	unknown
f7f41ad0-7d89-470c-a231-8f60fc73a4c9	Bobby Kellum	bobby@bob.com	Zip: 32218	32218	9045029405	2	2025-08-18 11:17:29.84868+00	facebook	asap	active	f	unknown	unknown
57e21845-e020-4c00-b175-b95bafb0c48d	Email Test User	emailtest@example.com	123 Test Street	12345	5551234567	1	2025-08-18 11:21:20.505548+00	website	this_week	active	f	unknown	unknown
759635a1-f95a-40cb-842f-e394d9dadaae	Upgraded Account Test	upgrade@example.com	456 Premium Street	54321	5559876543	3	2025-08-18 11:22:54.843424+00	google	asap	active	t	unknown	unknown
cbdb23af-150d-4a9d-8c2a-306bf2c657c2	Final Email Test	finaltest@example.com	789 Success Avenue	98765	5551112222	2	2025-08-18 11:23:13.823536+00	friend_family	this_week	active	t	unknown	unknown
468e58d5-cb6d-4d5f-b76a-3ca59c338d9a	Hey Man	kellum.ryan@gmail.com	Zip: 32226	32226	9045029405	2	2025-08-18 11:25:29.473955+00	instagram	this_week	active	t	unknown	unknown
5f684197-9692-495c-8681-e14eeffc9ce6	Thread Test User	threadtest@example.com	123 Gmail Street	11111	5550001111	1	2025-08-18 11:29:54.963239+00	google	next_week	active	f	unknown	unknown
1712d6da-21f5-4966-9c3c-d10665114493	billy bobby	ry@kellumfoto.com	Zip: 32226	32226	9045029405	2	2025-08-18 11:33:43.092561+00	google	asap	active	t	unknown	unknown
456bc3df-c635-4633-9667-ad918645968b	Matthew Thomas	matthew@thomasgroupfl.com	Zip: 32224	32224	9048911790	1	2025-08-18 11:48:27.950708+00	friend_family	whenever	active	t	unknown	unknown
6145d53c-774e-4580-ae03-e253840c2f73	Poo Pourri	xenosentient@gmail.com	Zip: 32209	32209	90495556300	2	2025-08-19 00:27:05.76792+00	other	planning_ahead	active	t	unknown	unknown
ffacc6e0-7bd6-44e0-acbc-0006af2b763d	Thea Kellum	misty.blue.iz69@gmail.com	Zip: 32277	32277	9045048725	3	2025-08-19 20:17:54.449562+00	instagram	asap	active	t	unknown	unknown
da671528-030f-47c9-8a8a-acba1a57fb8e	Ryan Kellum	kellum.ryan@gmail.com	Zip: 32218	32218	9045029405	2	2025-08-25 13:21:55.95564+00	facebook	asap	active	t	unknown	unknown
1cb94909-347a-40fc-89c8-92313d738623	bob bobby	bob@test.com	Zip: 32218	32218	9045555555	2	2025-08-25 13:36:10.208309+00	google	asap	active	t	unknown	unknown
b476dbf7-77d7-4a6a-818c-65dc20c18b8c	Ryan Kellum	kellum.ryan@gmail.com	Zip: 32226	32226	9045029405	2	2025-08-25 13:39:11.864324+00	instagram	asap	active	t	unknown	unknown
6a8684fb-4594-4160-a71b-51a780246560	Ryan Kellum	kellum.ryan@gmail.com	Zip: 32226	32226	9045029405	2	2025-08-25 13:40:02.204417+00	instagram	asap	active	f	unknown	unknown
d50e5113-b72a-4eba-b206-af2aefd1fbdf	Ryan Kellum	kellum.ryan@gmail.com	Zip: 32226	32226	9045029405	3	2025-08-25 13:41:36.012613+00	google	this_week	active	t	unknown	unknown
313729dc-8d97-4900-8000-04cc7fbc3398	Ryan Kellum	kellum.ryan@gmail.com	Zip: 32226	32226	9045029405	2	2025-08-25 13:44:45.462992+00	instagram	asap	active	t	unknown	unknown
8294c985-fe39-45aa-9886-91f4d801d85c	Crystal Linville 	crystalnlinville@gmail.com	Zip: 32097	32097	9045640601	2	2025-08-25 13:53:41.035849+00	friend_family	planning_ahead	active	f	unknown	unknown
c0a15471-8089-49f9-970d-3f484fc661eb	Ryan Kellum	ry@kellumfoto.com	Zip: 32226	32226	9045029405	2	2025-08-25 14:01:03.070037+00	instagram	asap	active	t	unknown	unknown
f4d41526-ba7b-4861-ab2d-924e6e1e4056	S'mantha Kellum	samizabs@gmail.com	Zip: 32218	32218	9046166432	4	2025-08-25 14:04:20.939411+00	friend_family	asap	active	t	unknown	unknown
45424a7f-8b40-48a0-be1a-ac0d69798a74	Josh Dookem	coconutkickflip@gmail.com	Zip: 32250	32250	9048782255	1	2025-08-25 14:05:35.448918+00	friend_family	next_week	active	t	unknown	unknown
7a6e3f45-e306-4e09-995c-c5bb850b4fd2	R Ff	kellum.ryan@gmail.com	Zip: 32214	32214	9055555555	2	2025-08-27 10:19:18.899504+00	google	within_month	active	t	long_time	founding_annual
\.


--
-- PostgreSQL database dump complete
--
