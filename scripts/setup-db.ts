import { readFileSync } from 'fs';
import { join } from 'path';
import { query, testConnection } from '../lib/db';

async function setupDatabase() {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }
    
    console.log('Database connected successfully!');
    
    // Drop existing tables if they exist (in reverse dependency order)
    console.log('Dropping existing tables...');
    const dropQueries = [
      'DROP TABLE IF EXISTS user_video_progress CASCADE',
      'DROP TABLE IF EXISTS user_courses CASCADE',
      'DROP TABLE IF EXISTS videos CASCADE',
      'DROP TABLE IF EXISTS courses CASCADE',
      'DROP TABLE IF EXISTS categories CASCADE',
      'DROP TABLE IF EXISTS features CASCADE',
      'DROP TABLE IF EXISTS users CASCADE'
    ];
    
    for (const dropQuery of dropQueries) {
      try {
        await query(dropQuery);
        console.log(`Dropped table: ${dropQuery}`);
      } catch (error) {
        console.log(`Note: ${dropQuery} - ${error}`);
      }
    }
    
    // Read and execute schema file
    const schemaPath = join(process.cwd(), 'lib', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    await query(schema);
    
    console.log('Database schema setup completed successfully!');
    
    // Test query to verify setup
    const result = await query('SELECT COUNT(*) as user_count FROM users');
    console.log('Current user count:', result.rows[0].user_count);
    
    // Insert a default admin user for testing
    // TODO: Use environment variables for admin credentials in production
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // In production, use a secure password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['Admin User', 'admin@example.com', hashedPassword, 'admin']
    );
    
    // Insert the special super admin user
    // TODO: Use environment variables for super admin credentials in production
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'superadmin123'; // In production, use a secure password
    const superAdminHashedPassword = await bcrypt.hash(superAdminPassword, 10);
    
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['Super Admin', 'admin@thelasttrade.com', superAdminHashedPassword, 'admin']
    );
    
    console.log('Default admin user created: admin@example.com / admin123');
    console.log('Super admin user created: admin@thelasttrade.com / superadmin123');
    console.log('⚠️  WARNING: These are default passwords. Please change them in production!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;
