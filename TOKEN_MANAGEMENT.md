# 🔐 Database-Based Token Management System

## Overview

A comprehensive JWT token management system with database validation, session tracking, and invalidation capabilities has been implemented. This provides enhanced security by allowing server-side token control.

## 🗄️ Database Schema

### Tokens Table
```sql
CREATE TABLE tokens (
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
```

### Indexes
- `idx_tokens_user_id` - Fast user token lookups
- `idx_tokens_hash` - Fast token validation
- `idx_tokens_expires_at` - Efficient cleanup queries
- `idx_tokens_revoked` - Quick revocation checks

## 🔧 Core Features

### 1. **Enhanced Token Creation**
```typescript
// Creates JWT and stores hash in database
const token = await createToken({
  userId: user.id,
  email: user.email,
  role: user.role
}, deviceInfo, ipAddress);
```

### 2. **Database-Backed Validation**
- Verifies JWT signature AND database validity
- Checks for token revocation
- Updates last_used_at timestamp
- Falls back to JWT-only validation if DB unavailable

### 3. **Token Invalidation**
```typescript
// Invalidate specific token
await invalidateToken(token);

// Invalidate all user tokens
await invalidateAllUserTokens(userId);
```

### 4. **Session Tracking**
- Device information (User-Agent)
- IP address tracking
- Last used timestamp
- Creation timestamp
- Expiration tracking

### 5. **Automatic Cleanup**
```typescript
// Clean expired/revoked tokens
const cleaned = await cleanupExpiredTokens();
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signin` - Enhanced with token tracking
- `POST /api/auth/signup` - Enhanced with token tracking  
- `POST /api/auth/logout` - Now invalidates token in database
- `GET /api/auth/me` - Token validation includes DB check

### Admin Token Management
- `GET /api/admin/tokens/[userId]` - View user's active tokens
- `DELETE /api/admin/tokens/[userId]` - Invalidate all user tokens
- `POST /api/admin/tokens/cleanup` - Clean expired tokens

## 📋 Database Management Scripts

### Setup
```bash
# Add tokens table to schema
npm run db:create-tokens

# Or use API endpoint (when server is running)
curl -X POST http://localhost:3000/api/admin/create-tokens-table
```

### Manual Token Table Creation
The tokens table structure is included in `lib/schema.sql` for new installations.

## 🔒 Security Features

### 1. **Token Hashing**
- Tokens stored as SHA-256 hashes in database
- Original JWT never stored in plaintext

### 2. **Revocation Support**
- Immediate token invalidation
- Logout from specific devices
- Force logout from all devices

### 3. **Session Management**
- Track active sessions per user
- View login history and device info
- Monitor suspicious activity

### 4. **Automatic Expiration**
- Database-level expiration checks
- Automatic cleanup of old tokens
- Configurable token lifetime

## 🛠️ Technical Implementation

### Token Lifecycle
1. **Creation**: JWT created + hash stored in DB with metadata
2. **Validation**: JWT verified + DB checked for revocation/expiration
3. **Usage**: last_used_at updated on each validation
4. **Invalidation**: Token marked as revoked in DB
5. **Cleanup**: Expired/revoked tokens periodically removed

### Error Handling
- Graceful degradation if DB unavailable
- JWT-only validation as fallback
- Comprehensive error logging

### Performance Optimizations
- Database indexes for fast lookups
- Efficient cleanup queries
- Minimal overhead on token validation

## 📊 Admin Features

### Token Statistics
- Active tokens per user
- Device/IP tracking
- Login patterns
- Session duration analytics

### Security Controls
- Force logout capabilities
- Suspicious activity detection
- Bulk token management

## 🔄 Migration from Simple JWT

The system maintains backward compatibility:
- Existing JWT validation still works
- Database validation adds extra security layer
- Gradual migration as users re-authenticate

## 🎯 Benefits

1. **Enhanced Security**: Server-side token control
2. **Session Management**: Track and control user sessions
3. **Audit Trail**: Complete login/logout history
4. **Admin Control**: Force logout, view active sessions
5. **Performance**: Efficient database operations
6. **Scalability**: Clean token management at scale

## 🚦 Usage Examples

### User Login with Tracking
```typescript
// Sign in captures device info
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### Admin Token Management
```typescript
// View user's active sessions
const response = await fetch(`/api/admin/tokens/${userId}`);
const data = await response.json();
console.log(`User has ${data.activeTokens} active sessions`);

// Force logout from all devices
await fetch(`/api/admin/tokens/${userId}`, { method: 'DELETE' });
```

### Cleanup Maintenance
```typescript
// Clean expired tokens (can be run via cron)
await fetch('/api/admin/tokens/cleanup', { method: 'POST' });
```

This token management system provides enterprise-grade session control while maintaining the performance and simplicity of JWT authentication.
