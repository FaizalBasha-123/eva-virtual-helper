import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  ConfirmationResult,
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  RecaptchaVerifier
} from "firebase/auth";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";

interface AuthContextType {
  currentUser: User | null;
  user: any;
  userProfile: UserProfile | null;
  loading: boolean;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: React.Dispatch<React.SetStateAction<ConfirmationResult | null>>;
  signOut: () => Promise<void>;
  updateUserProfile: (name: string, photoFile?: File) => Promise<void>;
  setupRecaptcha: (elementId: string) => RecaptchaVerifier;
  isAdmin: boolean;
  setUserPhoneNumber: (phoneNumber: string) => void;
  setUser: (user: any) => void;
}

export interface UserProfile {
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Admin phone numbers
const ADMIN_PHONE_NUMBERS = ['8870986738', '8883867155', '8838574247'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user profile from localStorage or set default values
        const storedProfile = localStorage.getItem(`userProfile_${user.uid}`);
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setUserProfile(profile);
          
          // Check if user is admin based on phone number
          if (profile.phoneNumber) {
            const formattedPhone = profile.phoneNumber.replace('+91', '');
            setIsAdmin(ADMIN_PHONE_NUMBERS.includes(formattedPhone));
          }
        } else {
          // Create default profile with just the phone number
          const defaultProfile: UserProfile = {
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          setUserProfile(defaultProfile);
          localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(defaultProfile));
          
          // Check if user is admin based on phone number
          if (user.phoneNumber) {
            const formattedPhone = user.phoneNumber.replace('+91', '');
            setIsAdmin(ADMIN_PHONE_NUMBERS.includes(formattedPhone));
          }
        }

        // Handle Supabase integration for new sign-in
        if (user.phoneNumber) {
          const cleanPhoneNumber = user.phoneNumber.replace('+91', '');
          
          // Store clean phone number in localStorage
          localStorage.setItem("phoneNumber", cleanPhoneNumber);
          
          // Check if user already exists in Supabase
          const existingUser = await userService.getUserByPhone(cleanPhoneNumber);
          
          if (!existingUser) {
            // Insert new user and get ID
            const userId = await userService.insertUser(cleanPhoneNumber, '');
            if (userId) {
              localStorage.setItem("userId", userId);
              console.log("User inserted into Supabase with ID:", userId);
            }
          } else {
            // User exists, store the existing ID
            localStorage.setItem("userId", existingUser.id);
            if (existingUser.name) {
              localStorage.setItem("userName", existingUser.name);
            }
            console.log("Existing user found with ID:", existingUser.id);
          }
        }
        
        // Check if we need to process any stored form data after sign-in
        const savedFormData = localStorage.getItem('vehicleFormData');
        if (savedFormData) {
          try {
            const formData = JSON.parse(savedFormData);
            
            // If we have stored form data, navigate to appointment page
            if (formData && window.location.pathname !== '/posting') {
              // Redirect to appointment page with form data
              setTimeout(() => {
                window.location.href = '/posting';
              }, 100);
            }
            
            // Dispatch event to notify components that login is complete and form data is ready
            window.dispatchEvent(new CustomEvent('userSignedIn', { 
              detail: { formData } 
            }));
            
          } catch (error) {
            console.error("Error parsing saved form data:", error);
          }
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
        // Clear localStorage on sign out
        localStorage.removeItem("phoneNumber");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Set user phone number specifically (for checking admin status)
  const setUserPhoneNumber = (phoneNumber: string) => {
    const formattedPhone = phoneNumber.replace('+91', '');
    setIsAdmin(ADMIN_PHONE_NUMBERS.includes(formattedPhone));
    
    if (currentUser) {
      const updatedProfile = {
        ...(userProfile || { displayName: null, photoURL: null }),
        phoneNumber
      };
      setUserProfile(updatedProfile);
      localStorage.setItem(`userProfile_${currentUser.uid}`, JSON.stringify(updatedProfile));
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "An error occurred while signing out",
      });
    }
  };

  // Update user profile
  const updateUserProfile = async (name: string, photoFile?: File) => {
    if (!currentUser) return;
    
    try {
      let photoURL = userProfile?.photoURL || null;
      
      // Upload photo if provided
      if (photoFile) {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      
      // Create updated profile
      const updatedProfile: UserProfile = {
        phoneNumber: currentUser.phoneNumber,
        displayName: name,
        photoURL
      };
      
      // Save to localStorage
      localStorage.setItem(`userProfile_${currentUser.uid}`, JSON.stringify(updatedProfile));
      localStorage.setItem("userName", name);
      setUserProfile(updatedProfile);

      // Update in Supabase using stored userId
      const userId = localStorage.getItem("userId");
      if (userId) {
        const success = await userService.updateUserName(userId, name);
        if (success) {
          console.log("User name updated in Supabase successfully");
        } else {
          console.error("Failed to update user name in Supabase");
        }
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: "An error occurred while updating your profile",
      });
    }
  };

  // Setup reCAPTCHA verifier
  const setupRecaptcha = (elementId: string) => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again
        toast({
          variant: "destructive",
          title: "Verification expired",
          description: "Please try again",
        });
      }
    });
    
    return window.recaptchaVerifier;
  };

  const value = {
    currentUser,
    user,
    userProfile,
    loading,
    confirmationResult,
    setConfirmationResult,
    signOut,
    updateUserProfile,
    setupRecaptcha,
    isAdmin,
    setUserPhoneNumber,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Add RecaptchaVerifier to Window interface
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    recaptchaWidgetId: number | null;
  }
}
