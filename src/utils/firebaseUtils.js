import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

// Define the Firebase configuration object with appropriate types
const firebaseConfig = {
  apiKey: 'AIzaSyCAHapnxRWqH8lwgYuFjrHQ7rDrkRlSe54',
  authDomain: 'pushnotifaction-11aab.firebaseapp.com',
  projectId: 'pushnotifaction-11aab',
  storageBucket: 'pushnotifaction-11aab.appspot.com',
  messagingSenderId: '329227476273',
  appId: '1:329227476273:web:d977025db3317cafeee410',
  measurementId: 'G-LB4BB5PSG5',
};

// Define the VAPID key as a constant string
const vapidKey = 'BEugoszFFht1wxmeOdaA_3f3mpT_x-gR3KneVOa2zUcl3jPOBVmwqSoNncQyPQcgdggcT7C1yTXtx5mn8bbJcVY';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get messaging instance from Firebase
const messaging = getMessaging(app);

// Function to request FCM token
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get the FCM token using the VAPID key
      return getToken(messaging, { vapidKey });
    } else {
      throw new Error('Notification permission not granted');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    throw error;
  }
};
