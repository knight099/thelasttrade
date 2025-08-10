import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
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
    
    console.log('📋 Tokens table structure:');
    console.table(tableCheck.rows);

    return NextResponse.json({
      success: true,
      message: 'Tokens table created successfully',
      table_structure: tableCheck.rows
    });

  } catch (error) {
    console.error('❌ Error creating tokens table:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create tokens table',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
