#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { query } from '../lib/db';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function addTokensTable() {
  try {
    console.log('Creating tokens table...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Create tokens table for session management
    await query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        revoked BOOLEAN DEFAULT FALSE,
        device_info TEXT,
        ip_address INET
      );
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_tokens_hash ON tokens(token_hash);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_tokens_expires_at ON tokens(expires_at);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_tokens_revoked ON tokens(revoked);
    `);

    console.log('✅ Tokens table created successfully!');
    console.log('');
    console.log('Table structure:');
    console.log('- id: Primary key');
    console.log('- user_id: Reference to users table');
    console.log('- token_hash: SHA-256 hash of the JWT token');
    console.log('- expires_at: Token expiration timestamp');
    console.log('- created_at: When token was created');
    console.log('- last_used_at: When token was last used');
    console.log('- revoked: Whether token has been manually revoked');
    console.log('- device_info: Optional device/browser information');
    console.log('- ip_address: IP address where token was created');
    console.log('');
    
    // Show table structure
    const tableInfo = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'tokens' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Current table structure:');
    console.table(tableInfo.rows);

    // Show indexes
    const indexes = await query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'tokens';
    `);
    
    console.log('Indexes created:');
    console.table(indexes.rows);

  } catch (error) {
    console.error('❌ Error creating tokens table:', error);
    process.exit(1);
  }
}

addTokensTable();
