#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { query } from '../lib/db';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function createTokensTable() {
  try {
    console.log('Creating tokens table for JWT session management...');
    
    // Create tokens table
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

    console.log('✅ Tokens table created!');

    // Create indexes
    console.log('Creating indexes...');
    
    await query(`CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_tokens_hash ON tokens(token_hash);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_tokens_expires_at ON tokens(expires_at);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_tokens_revoked ON tokens(revoked);`);

    console.log('✅ Indexes created!');
    
    // Verify table exists
    const tableCheck = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'tokens' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Tokens table structure:');
    console.table(tableCheck.rows);

    console.log('\n🎉 Token management table setup complete!');
    console.log('Now you can use database-backed token validation and invalidation.');

  } catch (error) {
    console.error('❌ Error creating tokens table:', error);
    process.exit(1);
  }
}

createTokensTable();
