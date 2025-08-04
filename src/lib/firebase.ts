
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAux0RWE9MYUf56y8dPZUR9C1cwI2aiT0",
  authDomain: "vahaanxchange-phoneauth.firebaseapp.com",
  projectId: "vahaanxchange-phoneauth",
  storageBucket: "vahaanxchange-phoneauth.appspot.com",
  messagingSenderId: "109078289469",
  appId: "1:109078289469:web:3190c74449010cfe12fb0",
  measurementId: "G-8ZSXHN0NXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
