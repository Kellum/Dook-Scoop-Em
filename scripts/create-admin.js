// Simple script to create the first admin user
// Run with: node scripts/create-admin.js

const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    console.log('\n=== Dook Scoop Em Admin User Creation ===\n');
    
    const username = 'admin';
    const password = 'DookScoop2025!';
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('Admin user credentials:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);
    console.log('\nTo create this user, make a POST request to:');
    console.log('POST /api/admin/create-admin');
    console.log('Body: { "username": "' + username + '", "password": "' + password + '" }');
    console.log('\n=== Instructions ===');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Use curl or a REST client to create the admin user:');
    console.log('\ncurl -X POST http://localhost:5000/api/admin/create-admin \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"username":"' + username + '","password":"' + password + '"}\'');
    console.log('\n3. Then login at: http://localhost:5000/admin/login');
    console.log('\nIMPORTANT: Change the password after first login!');
    console.log('==========================================\n');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();