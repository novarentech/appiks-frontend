# NextAuth.js Implementation with Custom API

This implementation provides a complete authentication system using NextAuth.js with your custom API endpoints.

## Features

✅ **JWT Token Management**: Automatic token handling and refresh
✅ **Session Persistence**: Secure session management with NextAuth.js
✅ **Automatic Token Refresh**: Seamless token renewal when expired
✅ **Route Protection**: Middleware-based route protection
✅ **TypeScript Support**: Full type safety throughout the application
✅ **Error Handling**: Comprehensive error handling and user feedback
✅ **Custom API Integration**: Direct integration with your backend API

## Architecture

### 1. Authentication Flow

```
User Login → API Call → JWT Token → NextAuth Session → Protected Routes
```

### 2. Token Refresh Flow

```
Expired Token → Automatic Refresh → New Token → Updated Session
```

## File Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts    # NextAuth API routes
│   ├── login/page.tsx                     # Login page
│   └── dashboard/page.tsx                 # Protected dashboard
├── components/
│   ├── auth/
│   │   └── UserProfile.tsx               # User profile component
│   ├── components/auth/
│   │   └── login-form.tsx                # Login form component
│   └── providers/
│       └── AuthProvider.tsx              # Session provider wrapper
├── hooks/
│   └── useAuth.ts                        # Custom authentication hooks
├── lib/
│   ├── auth.ts                           # JWT utilities and API calls
│   ├── api.ts                            # Authenticated API utilities
│   └── nextauth.ts                       # NextAuth configuration
├── types/
│   └── auth.ts                           # TypeScript type definitions
└── middleware.ts                         # Route protection middleware
```

## Configuration

### Environment Variables

```bash
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secure-secret-key
API_BASE_URL=https://appiks-be.disyfa.cloud/api

# Optional
JWT_SECRET=your-jwt-secret-for-verification
NEXT_PUBLIC_API_BASE_URL=https://appiks-be.disyfa.cloud/api
```

### API Endpoints Used

1. **Login**: `POST /login`

   ```json
   {
     "username": "string",
     "password": "string"
   }
   ```

2. **Refresh**: `POST /refresh`
   ```bash
   Authorization: Bearer <token>
   ```

## Usage Examples

### 1. Login Form Component

```tsx
import { signIn } from "next-auth/react";

const handleLogin = async () => {
  const result = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });
};
```

### 2. Access User Data

```tsx
import { useAuthData } from "@/hooks/useAuth";

function Profile() {
  const { username, verified, token } = useAuthData();
  return <div>Welcome, {username}!</div>;
}
```

### 3. Make Authenticated API Calls

```tsx
import { authGet, authPost } from "@/lib/api";

// GET request
const data = await authGet("/user/profile");

// POST request
const result = await authPost("/user/update", { name: "New Name" });
```

### 4. Route Protection

```tsx
import { useAuth } from "@/hooks/useAuth";

function ProtectedPage() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authorized</div>;

  return <div>Protected content</div>;
}
```

### 5. Server-Side Session Access

```tsx
import { auth } from "@/lib/nextauth";

export default async function ServerComponent() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello, {session.user.username}!</div>;
}
```

## Security Best Practices

### 1. Environment Variables

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Keep JWT secrets in sync with backend

### 2. Token Management

- Tokens are automatically refreshed when expired
- Secure storage in HTTP-only cookies (NextAuth.js handles this)
- No token storage in localStorage or sessionStorage

### 3. Route Protection

- Middleware automatically protects specified routes
- Client-side hooks provide additional protection
- Server-side session verification available

### 4. Error Handling

- Graceful handling of authentication failures
- Automatic logout on refresh token failure
- User-friendly error messages

## Advanced Features

### 1. Custom Token Refresh Logic

The system automatically refreshes tokens when they expire:

```typescript
// In nextauth.ts JWT callback
if (token.token && isTokenExpired(token.token)) {
  const refreshResponse = await refreshTokenAPI(token.token);
  // Update token data
}
```

### 2. JWT Payload Extraction

Extract user information directly from JWT tokens:

```typescript
import { decodeJWT } from "@/lib/auth";

const userInfo = decodeJWT(token);
// Access username, verified status, etc.
```

### 3. Middleware Route Protection

Automatic redirection for protected routes:

```typescript
// middleware.ts
const protectedRoutes = ["/dashboard", "/profile"];
// Automatically redirects unauthenticated users
```

## Deployment Considerations

### 1. Production Environment

- Set `NEXTAUTH_URL` to your production domain
- Use secure, randomly generated secrets
- Configure CORS settings on your backend

### 2. Backend Integration

- Ensure your backend accepts the JWT tokens
- Implement proper token refresh endpoint
- Handle token expiration gracefully

### 3. Performance

- NextAuth.js uses efficient session management
- Automatic token refresh reduces unnecessary API calls
- Middleware runs at edge for fast redirects

## Troubleshooting

### Common Issues

1. **"Invalid token" errors**

   - Check if JWT_SECRET matches backend
   - Verify token format and expiration

2. **Redirect loops**

   - Check middleware configuration
   - Verify protected routes array

3. **Session not persisting**
   - Ensure AuthProvider wraps your app
   - Check NEXTAUTH_SECRET configuration

### Debug Mode

Enable debug logging in development:

```bash
NEXTAUTH_DEBUG=true
```

## Testing

### 1. Manual Testing

1. Navigate to `/login`
2. Enter credentials
3. Verify redirection to dashboard
4. Check user profile display
5. Test logout functionality

### 2. Token Expiration Testing

1. Use short-lived tokens in development
2. Monitor automatic refresh behavior
3. Verify proper error handling

This implementation provides a robust, secure, and scalable authentication system that follows NextAuth.js best practices while integrating seamlessly with your custom API.
