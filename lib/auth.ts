import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const encodedKey = new TextEncoder().encode(secretKey);

export interface CustomJWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Create JWT token with database storage
export async function createToken(
  payload: Omit<CustomJWTPayload, 'iat' | 'exp'>, 
  deviceInfo?: string, 
  ipAddress?: string
): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(encodedKey);

  // Store token in database using server-side utility
  try {
    const { storeTokenInDatabase } = await import('./auth-server');
    await storeTokenInDatabase(token, payload.userId, deviceInfo, ipAddress);
  } catch (error) {
    console.error('Error storing token in database:', error);
    // Don't fail token creation if database storage fails
  }

  return token;
}

// Verify JWT token with database validation
export async function verifyToken(token: string): Promise<CustomJWTPayload | null> {
  try {
    // First verify the JWT signature and expiration
    const { payload } = await jwtVerify(token, encodedKey);
    const jwtPayload = payload as unknown as CustomJWTPayload;

    // Check if token exists in database and is not revoked
    try {
      const { verifyTokenInDatabase } = await import('./auth-server');
      const isValid = await verifyTokenInDatabase(token);
      if (!isValid) {
        return null;
      }
    } catch (dbError) {
      console.error('Database token validation error:', dbError);
      // Fall back to JWT-only validation if database check fails
    }

    return jwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Get token from cookies
export function getTokenFromCookies(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token');
  return token?.value || null;
}

// Set auth cookie
export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
}

// Clear auth cookie
export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
}

// Database token operations using server-side utilities
export async function invalidateToken(token: string): Promise<boolean> {
  try {
    const { invalidateToken: serverInvalidateToken } = await import('./auth-server');
    return await serverInvalidateToken(token);
  } catch (error) {
    console.error('Error invalidating token:', error);
    return false;
  }
}

export async function invalidateAllUserTokens(userId: number): Promise<boolean> {
  try {
    const { invalidateAllUserTokens: serverInvalidateAllUserTokens } = await import('./auth-server');
    return await serverInvalidateAllUserTokens(userId);
  } catch (error) {
    console.error('Error invalidating user tokens:', error);
    return false;
  }
}

export async function getUserActiveTokens(userId: number): Promise<any[]> {
  try {
    const { getUserActiveTokens: serverGetUserActiveTokens } = await import('./auth-server');
    return await serverGetUserActiveTokens(userId);
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return [];
  }
}

export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const { cleanupExpiredTokens: serverCleanupExpiredTokens } = await import('./auth-server');
    return await serverCleanupExpiredTokens();
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
}

// Get current user from token
export async function getCurrentUser(): Promise<CustomJWTPayload | null> {
  try {
    const token = getTokenFromCookies();
    if (!token) return null;
    
    return await verifyToken(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user has required role
export function hasRole(user: CustomJWTPayload | null, requiredRole: string): boolean {
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === 'admin') return true;
  
  return user.role === requiredRole;
}

// Validate password strength - use client-side version for compatibility
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Rate limiting - use simple in-memory approach for compatibility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const key = identifier;
  
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}
