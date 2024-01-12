import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_URL,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_API_KEY,
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDatabase = getDatabase(app);
export default app;
