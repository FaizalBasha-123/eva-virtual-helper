import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Check, User } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameUpdated, setNameUpdated] = useState(false);
  const [phoneUpdated, setPhoneUpdated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Redirect if not logged in (wait for auth to load)
  useEffect(() => {
    // Don't redirect immediately - wait for auth to initialize
    const timer = setTimeout(() => {
      if (currentUser === null) {
        navigate("/");
      }
    }, 1000); // Give 1 second for auth to load

    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  // Load profile data when user is available
  useEffect(() => {
    if (currentUser) {
      // Load values from localStorage
      const savedName = localStorage.getItem("userName") || 
                       localStorage.getItem(`userProfile_name_${currentUser.uid}`) || 
                       userProfile?.displayName || "";
      const savedPhone = localStorage.getItem("phoneNumber") || 
                        localStorage.getItem(`userProfile_phone_${currentUser.uid}`) || 
                        userProfile?.phoneNumber?.replace('+91', '') || "";
      const savedLastUpdated = localStorage.getItem(`userProfile_lastUpdated_${currentUser.uid}`);
      
      setDisplayName(savedName);
      setPhoneNumber(savedPhone);
      setLastUpdated(savedLastUpdated || null);
    }
  }, [currentUser, userProfile]);

  const handleSaveName = async () => {
    if (!currentUser) return;
    
    // Validate name (only alphabets, spaces and dots)
    if (!/^[a-zA-Z\s.]+$/.test(displayName) && displayName.trim() !== "") {
      toast({
        variant: "destructive",
        title: "Invalid name",
        description: "Name should contain only alphabets, spaces and dots",
      });
      return;
    }
    
    // Save to localStorage
    localStorage.setItem(`userProfile_name_${currentUser.uid}`, displayName);
    localStorage.setItem("userName", displayName);
    
    // Update last updated timestamp
    const now = new Date().toISOString();
    localStorage.setItem(`userProfile_lastUpdated_${currentUser.uid}`, now);
    setLastUpdated(now);
    
    // Update in Auth context and Supabase
    if (updateUserProfile) {
      await updateUserProfile(displayName);
    }
    
    // Show success toast
    toast({
      title: "Name updated",
      description: "Your name has been updated successfully",
    });
    
    // Show animation
    setNameUpdated(true);
    setTimeout(() => setNameUpdated(false), 2000);
  };

  const handleSavePhone = () => {
    if (!currentUser) return;
    
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber) && phoneNumber.trim() !== "") {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
      });
      return;
    }
    
    // Save to localStorage
    localStorage.setItem(`userProfile_phone_${currentUser.uid}`, phoneNumber);
    localStorage.setItem("phoneNumber", phoneNumber);
    
    // Update last updated timestamp
    const now = new Date().toISOString();
    localStorage.setItem(`userProfile_lastUpdated_${currentUser.uid}`, now);
    setLastUpdated(now);
    
    // Show success toast
    toast({
      title: "Phone number updated",
      description: "Your phone number has been updated successfully",
    });
    
    // Show animation
    setPhoneUpdated(true);
    setTimeout(() => setPhoneUpdated(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Profile Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          {/* Name Field */}
          <div className="mb-6">
            <Label htmlFor="displayName" className="text-base font-medium mb-2 block">
              Your Name
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex-grow">
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleSaveName}
                className={`${nameUpdated ? 'bg-green-500 hover:bg-green-600' : ''} transition-colors duration-300`}
                type="button"
              >
                {nameUpdated ? <Check className="mr-1 h-4 w-4" /> : null}
                Save Name
              </Button>
            </div>
          </div>
          
          {/* Phone Number Field */}
          <div className="mb-6">
            <Label htmlFor="phoneNumber" className="text-base font-medium mb-2 block">
              Phone Number
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex items-center flex-grow">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-l-md border border-r-0 border-input">
                  +91
                </div>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={() => {}}
                  placeholder="Enter your phone number"
                  className="rounded-l-none w-full"
                  maxLength={10}
                  disabled
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in with a different number, as this one is not editable.
            </p>
          </div>
          
          {/* Last Updated Info */}
          {lastUpdated && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted-foreground">
                Last updated: {formatDate(lastUpdated)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
