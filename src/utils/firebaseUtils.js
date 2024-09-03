import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Define the Firebase configuration object with appropriate types
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Define the VAPID key as a constant string
const vapidKey = process.env.REACT_APP_VAPID_KEY;

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get messaging instance from Firebase
const messaging = getMessaging(app);

// Function to request FCM token
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if (permission === 'granted') {
      // Get the FCM token using the VAPID key
      console.log(messaging);
      console.log(getToken(messaging, { vapidKey }));
      return getToken(messaging, { vapidKey });
    } else {
      throw new Error('Notification permission not granted');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    throw error;
  }
};
