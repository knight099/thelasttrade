import { NextRequest, NextResponse } from 'next/server';
import { invalidateToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    // Invalidate token in database if it exists
    if (token) {
      await invalidateToken(token);
    }

    // Create response
    const response = NextResponse.json({
      message: 'Logged out successfully'
    });

    // Clear the auth cookie
    response.cookies.delete('auth-token');

    return response;

  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}

// Also handle GET requests for logout
export async function GET(request: NextRequest) {
  return POST(request);
}
