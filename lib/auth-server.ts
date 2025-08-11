// Server-side auth utilities that use Node.js features
import crypto from 'crypto';
import { isIP } from 'net';
import { query } from './db';

export interface TokenRecord {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  last_used_at: Date;
  revoked: boolean;
  device_info?: string;
  ip_address?: string;
}

// Hash token for database storage
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Store token in database
export async function storeTokenInDatabase(
  token: string,
  userId: number,
  deviceInfo?: string,
  ipAddress?: string
): Promise<void> {
  try {
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Ensure ip_address is valid for INET column; otherwise store NULL
    const ipForDb = ipAddress && isIP(ipAddress) ? ipAddress : null;

    await query(`
      INSERT INTO tokens (user_id, token_hash, expires_at, device_info, ip_address)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (token_hash) DO NOTHING
    `, [userId, tokenHash, expiresAt, deviceInfo ?? null, ipForDb]);

    console.log(`Token created for user ${userId}`);
  } catch (error) {
    console.error('Error storing token in database:', error);
    // Don't fail token creation if database storage fails
  }
}

// Verify token exists in database and is not revoked
export async function verifyTokenInDatabase(token: string): Promise<boolean> {
  try {
    const tokenHash = hashToken(token);
    const result = await query(`
      SELECT id, user_id, expires_at, revoked, last_used_at
      FROM tokens 
      WHERE token_hash = $1 AND expires_at > NOW() AND revoked = FALSE
    `, [tokenHash]);

    if (result.rows.length === 0) {
      console.log('Token not found in database or expired/revoked');
      return false;
    }

    // Update last_used_at timestamp
    await query(`
      UPDATE tokens 
      SET last_used_at = NOW() 
      WHERE token_hash = $1
    `, [tokenHash]);

    return true;
  } catch (dbError) {
    console.error('Database token validation error:', dbError);
    // Fall back to JWT-only validation if database check fails
    return true;
  }
}

// Invalidate a specific token
export async function invalidateToken(token: string): Promise<boolean> {
  try {
    const tokenHash = hashToken(token);
    const result = await query(`
      UPDATE tokens 
      SET revoked = TRUE 
      WHERE token_hash = $1
    `, [tokenHash]);
    
    return (result.rowCount || 0) > 0;
  } catch (error) {
    console.error('Error invalidating token:', error);
    return false;
  }
}

// Invalidate all tokens for a user
export async function invalidateAllUserTokens(userId: number): Promise<boolean> {
  try {
    const result = await query(`
      UPDATE tokens 
      SET revoked = TRUE 
      WHERE user_id = $1 AND revoked = FALSE
    `, [userId]);
    
    console.log(`Invalidated ${result.rowCount} tokens for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error invalidating user tokens:', error);
    return false;
  }
}

// Get active tokens for a user
export async function getUserActiveTokens(userId: number): Promise<TokenRecord[]> {
  try {
    const result = await query(`
      SELECT id, user_id, token_hash, expires_at, created_at, last_used_at, revoked, device_info, ip_address
      FROM tokens 
      WHERE user_id = $1 AND expires_at > NOW() AND revoked = FALSE
      ORDER BY last_used_at DESC
    `, [userId]);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return [];
  }
}

// Clean up expired tokens
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await query(`
      DELETE FROM tokens 
      WHERE expires_at <= NOW() OR revoked = TRUE
    `);
    
    console.log(`Cleaned up ${result.rowCount} expired/revoked tokens`);
    return result.rowCount || 0;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
}
