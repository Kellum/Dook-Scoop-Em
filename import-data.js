import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function importData() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Import service_locations
    console.log('Importing service locations...');
    await client.query(`
      INSERT INTO service_locations (id, city, state, zip_codes, launch_date, is_active) VALUES
      ('e0b01262-acff-4d84-aff8-3235d86e2fe9', 'Yulee', 'FL', '{32097}', NULL, 'false'),
      ('d4f4cc1e-291d-4ed6-ada6-66827069f701', 'Jacksonville', 'FL', '{32256,32257,32258}', NULL, 'true'),
      ('3fd70238-978b-414e-ac21-0b963596dc89', 'Miami', 'FL', '{33101,33102}', NULL, 'true'),
      ('7edb8676-3543-4928-a3e7-7a5b170ba597', 'Oceanway', 'Fl', '{32218,32226}', NULL, 'true'),
      ('a9ae8bc3-e8b9-49fd-8908-ac8770da5dec', 'Fernandina', 'Fl', '{32097}', NULL, 'true')
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✓ Service locations imported');

    // Import admin user
    console.log('Importing admin user...');
    await client.query(`
      INSERT INTO users (id, username, password) VALUES
      ('c1d268ed-b475-4033-96cb-00c68a3a7da9', 'admin', '$2b$12$EYXg/SakS2RK.a0/RHlw9.gesbCB5PpYX.R5uvV/khhz7toOSHxt2')
      ON CONFLICT (id) DO NOTHING
    `);
    console.log('✓ Admin user imported (username: admin, password: admin123)');

    console.log('\n✅ Data import complete!');

  } catch (error) {
    console.error('❌ Error importing data:', error);
  } finally {
    await client.end();
  }
}

importData();
