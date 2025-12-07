# Firebase Firestore Setup Guide

## Current Status
✅ Code is ready - all functions use Firebase Firestore
❌ Firebase Console needs configuration to fix "Missing or insufficient permissions" error

## Step-by-Step Setup Instructions

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **hirely-bb476**

### Step 2: Enable Firestore Database
1. In the left sidebar, click on **Build** → **Firestore Database**
2. If Firestore is not enabled yet:
   - Click **Create database**
   - Choose **Start in production mode** (we'll set custom rules next)
   - Select your preferred location (e.g., `us-central` or closest to your users)
   - Click **Enable**

### Step 3: Configure Security Rules
1. Once Firestore is enabled, click on the **Rules** tab at the top
2. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Saved Jobs Collection Rules
    match /savedJobs/{jobId} {
      // Users can only read their own saved jobs
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;

      // Users can only create saved jobs with their own userId
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;

      // Users can only delete their own saved jobs
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;

      // Users can only update their own saved jobs
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish** to save the rules

### Step 4: Verify Setup
After publishing the rules, your Firestore is ready! The rules ensure:
- ✅ Only authenticated users can save jobs
- ✅ Users can only see their own saved jobs
- ✅ Users cannot access other users' saved jobs
- ✅ All operations are secured by userId

### Step 5: Test the Feature
1. Start your development server: `npm run dev`
2. Sign in to your application
3. Try saving a job - it should work without permission errors
4. Check the Firestore Database in Firebase Console to see the saved job document

## What the Code Does

### Authentication Check
Every function checks if a user is logged in:
```typescript
const user = auth.currentUser;
if (!user) {
  console.error("User must be logged in to save jobs");
  return false;
}
```

### Data Structure in Firestore
Each saved job document contains:
```typescript
{
  jobId: number,
  employerId: number,
  employerName: string,
  jobTitle: string,
  locationName: string,
  minimumSalary?: number,
  maximumSalary?: number,
  currency?: string,
  expirationDate: string,
  date: string,
  jobDescription: string,
  jobUrl: string,
  userId: string,        // User who saved the job
  savedAt: Timestamp     // When job was saved
}
```

## Troubleshooting

### If you still see "Missing or insufficient permissions":
1. Make sure you published the security rules in Firebase Console
2. Verify you're signed in (check `auth.currentUser` in browser console)
3. Try signing out and signing back in
4. Check browser console for detailed error messages

### If jobs don't appear after saving:
1. Check Firebase Console → Firestore Database → Data tab
2. Look for the `savedJobs` collection
3. Verify documents have the correct `userId` field

### If you want to view all data in development:
For development/testing only, you can temporarily use these permissive rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
**⚠️ WARNING: This allows any authenticated user to access all data. Only use for testing!**

## Project Information
- **Project ID**: hirely-bb476
- **Auth Domain**: hirely-bb476.firebaseapp.com
- **Collection Name**: savedJobs

## Files Modified
- ✅ `firebaseConfig.ts` - Added Firestore initialization
- ✅ `utils/savedJobs.ts` - All functions use Firebase Firestore
- ✅ `components/JobBoard.tsx` - Async save operations
- ✅ `app/jobs/[jobId]/JobDetailsPage.tsx` - Async save operations
- ✅ `app/saved-jobs/page.tsx` - Loads from Firestore

## Next Steps
After completing the setup:
1. Test saving a job while signed in
2. Test viewing saved jobs on `/saved-jobs` page
3. Test unsaving a job
4. Verify data appears in Firebase Console
5. Test that signed-out users cannot save jobs
