import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA-UBVrDaKl6BaPilONddZP1M_NN8amCDw",
  authDomain: "final-project-f42c4.firebaseapp.com",
  databaseURL: "https://final-project-f42c4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "final-project-f42c4",
  storageBucket: "final-project-f42c4.firebasestorage.app",
  messagingSenderId: "588627842703"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
