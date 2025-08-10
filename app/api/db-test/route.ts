import { NextResponse } from 'next/server';
import { testConnection, query } from '@/lib/db';

export async function GET() {
  try {
    // Test the database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Test a simple query
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    
    return NextResponse.json({
      message: 'Database connection successful',
      data: result.rows[0],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
