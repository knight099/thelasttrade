import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredTokens } from '@/lib/auth';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Clean up expired tokens
    const cleanedUp = await cleanupExpiredTokens();

    return NextResponse.json({
      message: 'Token cleanup completed',
      cleanedUp: cleanedUp
    });

  } catch (error) {
    console.error('Token cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to clean up tokens' },
      { status: 500 }
    );
  }
}
