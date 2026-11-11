import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Firebase Admin SDK Configuration for Project: CLUBX (clubx-27666)
 * Supports both Service Account credentials from environment or default credential initialization
 */
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Parse service account JSON from environment string (ideal for production / Vercel / Render)
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'clubx-27666',
      });
      console.log('✅ Firebase Admin SDK initialized with Service Account for Project: clubx-27666');
    } else {
      // Default initialization using Project ID
      admin.initializeApp({
        projectId: 'clubx-27666',
      });
      console.log('ℹ️ Firebase Admin SDK initialized with Project ID: clubx-27666');
    }
  } catch (error) {
    console.error('⚠️ Firebase Admin Initialization warning:', error.message);
  }
}

export const firebaseAuth = admin.auth();
export const firebaseDb = admin.firestore();
export default admin;
