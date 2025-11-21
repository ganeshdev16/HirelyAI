#!/usr/bin/env node

/**
 * Script to validate Firebase Admin SDK environment variables
 * Run with: node scripts/check-firebase-env.js
 */

const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

console.log('\n=== Firebase Admin SDK Environment Check ===\n');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Check Project ID
if (projectId) {
  console.log('✓ FIREBASE_PROJECT_ID found:', projectId);
} else {
  console.log('✗ FIREBASE_PROJECT_ID is missing');
}

// Check Client Email
if (clientEmail) {
  console.log('✓ FIREBASE_CLIENT_EMAIL found:', clientEmail);
} else {
  console.log('✗ FIREBASE_CLIENT_EMAIL is missing');
}

// Check Private Key
if (privateKey) {
  console.log('✓ FIREBASE_PRIVATE_KEY found');
  console.log('  - Length:', privateKey.length, 'characters');
  console.log('  - Starts with:', privateKey.substring(0, 30) + '...');

  // Check if it contains the BEGIN marker
  if (privateKey.includes('BEGIN PRIVATE KEY')) {
    console.log('  ✓ Contains BEGIN PRIVATE KEY marker');
  } else {
    console.log('  ✗ Missing BEGIN PRIVATE KEY marker');
  }

  // Check if it contains the END marker
  if (privateKey.includes('END PRIVATE KEY')) {
    console.log('  ✓ Contains END PRIVATE KEY marker');
  } else {
    console.log('  ✗ Missing END PRIVATE KEY marker');
  }

  // Check for newline characters
  if (privateKey.includes('\\n')) {
    console.log('  ✓ Contains \\n characters (will be processed)');
  } else if (privateKey.includes('\n')) {
    console.log('  ✓ Contains actual newline characters');
  } else {
    console.log('  ⚠ No newline characters found (might be an issue)');
  }
} else {
  console.log('✗ FIREBASE_PRIVATE_KEY is missing');
}

console.log('\n=== Summary ===\n');

if (projectId && clientEmail && privateKey) {
  console.log('✓ All required environment variables are present!');
  console.log('\nNext steps:');
  console.log('1. Make sure the server is restarted after adding these variables');
  console.log('2. Visit http://localhost:3001/admin/dashboard');
  console.log('3. Check the server console for initialization logs');
} else {
  console.log('✗ Some environment variables are missing.');
  console.log('\nPlease add the missing variables to your .env.local file:');
  if (!projectId) console.log('  - FIREBASE_PROJECT_ID=hirely-bb476');
  if (!clientEmail) console.log('  - FIREBASE_CLIENT_EMAIL=your-service-account-email@hirely-bb476.iam.gserviceaccount.com');
  if (!privateKey) console.log('  - FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour-Key-Here\\n-----END PRIVATE KEY-----\\n"');
}

console.log('\n');
