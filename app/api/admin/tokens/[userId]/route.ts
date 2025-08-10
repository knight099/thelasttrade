import { NextRequest, NextResponse } from 'next/server';
import { getUserActiveTokens, invalidateAllUserTokens } from '@/lib/auth';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/tokens/[userId] - Get active tokens for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const userId = parseInt(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const tokens = await getUserActiveTokens(userId);

    return NextResponse.json({
      userId: userId,
      activeTokens: tokens.length,
      tokens: tokens.map(token => ({
        id: token.id,
        created_at: token.created_at,
        last_used_at: token.last_used_at,
        expires_at: token.expires_at,
        device_info: token.device_info,
        ip_address: token.ip_address
      }))
    });

  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user tokens' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/tokens/[userId] - Invalidate all tokens for a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const userId = parseInt(params.userId);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const success = await invalidateAllUserTokens(userId);

    if (success) {
      return NextResponse.json({
        message: `All tokens invalidated for user ${userId}`
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to invalidate tokens' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error invalidating user tokens:', error);
    return NextResponse.json(
      { error: 'Failed to invalidate user tokens' },
      { status: 500 }
    );
  }
}
