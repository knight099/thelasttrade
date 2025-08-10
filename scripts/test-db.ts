import * as dotenv from 'dotenv';
import { testConnection } from '../lib/db';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function test() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('URL starts with:', process.env.DATABASE_URL?.substring(0, 30) + '...');
    const result = await testConnection();
    
    if (result) {
      console.log('✅ Database connection successful!');
    } else {
      console.log('❌ Database connection failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing database:', error);
    process.exit(1);
  }
}

test();
