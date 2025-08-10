import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT id, title FROM courses ORDER BY title');
    return NextResponse.json({ courses: result.rows });
  } catch (error) {
    console.error('Error fetching courses list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses list' },
      { status: 500 }
    );
  }
}
