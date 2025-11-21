# Admin Dashboard Setup Guide

This guide will help you configure the admin dashboard to fetch real user data from Firebase Authentication.

## Current Status

The admin dashboard is now fully integrated with Firebase Admin SDK and will fetch real users from your Firebase Authentication system.

## Files Created/Modified

### New Files:
1. **[lib/firebaseAdmin.ts](lib/firebaseAdmin.ts)** - Firebase Admin SDK configuration
2. **[.env.local.example](.env.local.example)** - Environment variables template
3. **[app/admin/dashboard/page.tsx](app/admin/dashboard/page.tsx)** - Admin dashboard UI
4. **[app/api/users/route.ts](app/api/users/route.ts)** - API endpoint to fetch users

### Modified Files:
1. **[components/NavBar.tsx](components/NavBar.tsx)** - Added admin dashboard link
2. **[package.json](package.json)** - Added firebase-admin dependency

## Setup Instructions

### Step 1: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **hirely-bb476**
3. Click the gear icon ⚙️ > **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **Generate New Private Key** button
6. A JSON file will be downloaded - keep it safe!

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```

2. Open the downloaded JSON file from Step 1 and extract:
   - `project_id`
   - `client_email`
   - `private_key`

3. Add these values to `.env.local`:
   ```env
   FIREBASE_PROJECT_ID=hirely-bb476
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@hirely-bb476.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourActualPrivateKeyHere\n-----END PRIVATE KEY-----\n"
   ```

   **Important Notes:**
   - Keep the quotes around the private key
   - Keep the `\n` characters (they represent newlines)
   - Don't remove the BEGIN and END markers

### Step 3: Restart the Development Server

After adding the environment variables, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Access the Admin Dashboard

Open your browser and navigate to:
- **URL:** http://localhost:3001/admin/dashboard

You should now see real users from your Firebase Authentication!

## Features

### Dashboard Statistics
- **Total Users** - Count of all registered users
- **Verified Users** - Users who have verified their email
- **Unverified Users** - Users pending email verification
- **Active Today** - Users who logged in today

### User Details Table
For each user, you'll see:
- User avatar (based on initials)
- Display name and UID
- Email address
- Phone number
- Verification status badge
- Account creation date
- Last login timestamp

### API Features
The `/api/users` endpoint supports:
- **Pagination** via query parameters:
  - `maxResults` - Number of users to fetch (default: 1000)
  - `pageToken` - Token for next page
- **Real-time data** from Firebase Authentication
- **Graceful fallback** if credentials are missing

## Troubleshooting

### Issue: "Firebase Admin SDK not configured"

**Solution:** Make sure you've created `.env.local` with the correct credentials from Firebase Console.

### Issue: "Failed to fetch users"

**Possible causes:**
1. Invalid service account credentials
2. Private key not properly formatted (check for `\n` characters)
3. Service account doesn't have proper permissions

**Solution:**
- Double-check your `.env.local` file
- Ensure the private key is wrapped in quotes
- Verify the service account has "Firebase Authentication Admin" role

### Issue: API returns empty users array

**Possible causes:**
1. No users registered in Firebase Authentication yet
2. Credentials not loaded (server needs restart)

**Solution:**
- Create a test user via the sign-up page
- Restart the development server after adding credentials

## Security Recommendations

### Production Deployment

1. **Never commit `.env.local`** to version control
   - It's already in `.gitignore`
   - The private key is sensitive!

2. **Use environment variables** in your hosting platform:
   - Vercel: Project Settings > Environment Variables
   - Netlify: Site Settings > Environment Variables
   - AWS/GCP: Use secrets manager

3. **Restrict Admin Access** (Optional)
   - Add authentication check to admin routes
   - Create middleware to verify admin role
   - Use Firebase custom claims for role-based access

### Example Middleware (Optional):

Create `app/admin/dashboard/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add your admin authentication logic here
  // For example, check if user has admin role

  const isAdmin = checkIfUserIsAdmin(); // Implement this

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
```

## API Endpoint Documentation

### GET /api/users

Fetches all users from Firebase Authentication.

**Query Parameters:**
- `maxResults` (optional): Number of users to fetch (default: 1000, max: 1000)
- `pageToken` (optional): Token for pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "uid": "user-id",
        "email": "user@example.com",
        "displayName": "John Doe",
        "photoURL": null,
        "emailVerified": true,
        "phoneNumber": "+1234567890",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "lastLoginAt": "2025-11-09T12:00:00.000Z"
      }
    ],
    "totalUsers": 1,
    "verifiedUsers": 1,
    "unverifiedUsers": 0,
    "pageToken": null
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "hint": "Make sure Firebase Admin SDK is properly configured..."
}
```

## Next Steps

### Recommended Enhancements:

1. **Add Search & Filtering**
   - Search users by email/name
   - Filter by verification status
   - Sort by creation date or last login

2. **Add User Management Actions**
   - Delete user
   - Disable/Enable user
   - Resend verification email
   - Reset password

3. **Add Admin Authentication**
   - Protect admin routes with middleware
   - Use Firebase custom claims for roles
   - Create admin-only access

4. **Add Analytics**
   - User growth charts
   - Activity trends
   - Registration statistics

5. **Add Export Functionality**
   - Export users to CSV
   - Generate reports
   - Backup user data

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs (terminal output)
3. Verify Firebase Admin SDK credentials
4. Ensure Firebase Admin SDK is properly installed: `npm list firebase-admin`

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Authentication Admin API](https://firebase.google.com/docs/auth/admin)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
