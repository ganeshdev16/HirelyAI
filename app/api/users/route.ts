import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';

interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  createdAt: string | null;
  lastLoginAt: string | null;
}

interface CreateUserRequest {
  email: string;
  password: string;
  displayName?: string;
  emailVerified?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const adminAuth = getAdminAuth();

    // If Firebase Admin is not configured, return error
    if (!adminAuth) {
      return NextResponse.json(
        {
          success: false,
          error: 'Firebase Admin SDK not configured',
          hint: 'Please add service account credentials to .env.local',
        },
        { status: 500 }
      );
    }

    const body: CreateUserRequest = await request.json();
    const { email, password, displayName, emailVerified } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 6 characters long',
        },
        { status: 400 }
      );
    }

    // Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: displayName || undefined,
      emailVerified: emailVerified || false,
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);

    // Return specific error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminAuth = getAdminAuth();

    // If Firebase Admin is not configured, return empty list with helpful message
    if (!adminAuth) {
      return NextResponse.json({
        success: true,
        data: {
          users: [],
          totalUsers: 0,
          verifiedUsers: 0,
          unverifiedUsers: 0,
        },
        message: 'Firebase Admin SDK not configured. Please add service account credentials to .env.local',
      });
    }

    // Get query parameters for pagination
    const url = new URL(request.url);
    const maxResults = parseInt(url.searchParams.get('maxResults') || '1000');
    const pageToken = url.searchParams.get('pageToken') || undefined;

    // Fetch users from Firebase Authentication using Admin SDK
    const listUsersResult = await adminAuth.listUsers(maxResults, pageToken);

    // Transform Firebase user records to our UserInfo interface
    const users: UserInfo[] = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email || null,
      displayName: userRecord.displayName || null,
      photoURL: userRecord.photoURL || null,
      emailVerified: userRecord.emailVerified,
      phoneNumber: userRecord.phoneNumber || null,
      createdAt: userRecord.metadata.creationTime || null,
      lastLoginAt: userRecord.metadata.lastSignInTime || null,
    }));

    // Calculate statistics
    const verifiedUsers = users.filter(u => u.emailVerified).length;
    const unverifiedUsers = users.filter(u => !u.emailVerified).length;

    return NextResponse.json({
      success: true,
      data: {
        users: users,
        totalUsers: users.length,
        verifiedUsers: verifiedUsers,
        unverifiedUsers: unverifiedUsers,
        pageToken: listUsersResult.pageToken || null,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);

    // Return specific error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        hint: 'Make sure Firebase Admin SDK is properly configured with service account credentials in .env.local',
      },
      { status: 500 }
    );
  }
}
