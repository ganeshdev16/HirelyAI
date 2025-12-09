import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
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

    const { uid } = await params;

    // Validate UID
    if (!uid) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
        },
        { status: 400 }
      );
    }

    // Delete user from Firebase Authentication
    await adminAuth.deleteUser(uid);

    return NextResponse.json({
      success: true,
      message: `User ${uid} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    // Return specific error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
