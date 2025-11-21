import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | null = null;

// Initialize Firebase Admin SDK
export function getAdminApp() {
  if (getApps().length === 0) {
    // Check if all required environment variables are present
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Log what we found (without exposing the full private key)
    console.log('Firebase Admin Environment Check:');
    console.log('- FIREBASE_PROJECT_ID:', projectId ? '✓ Found' : '✗ Missing');
    console.log('- FIREBASE_CLIENT_EMAIL:', clientEmail ? '✓ Found' : '✗ Missing');
    console.log('- FIREBASE_PRIVATE_KEY:', privateKey ? `✓ Found (${privateKey.length} chars)` : '✗ Missing');

    // If any required credential is missing, return null
    if (!projectId || !clientEmail || !privateKey) {
      console.error('Firebase Admin SDK credentials are incomplete. Please check your .env.local file.');
      return null;
    }

    try {
      // Replace escaped newlines with actual newlines
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

      adminApp = initializeApp({
        credential: cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: formattedPrivateKey,
        }),
      });

      console.log('✓ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      // If credentials are not available, return null
      // The API will fall back to empty response
      return null;
    }
  } else {
    adminApp = getApps()[0];
  }

  return adminApp;
}

// Get Firebase Admin Auth instance
export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) return null;
  return getAuth(app);
}
