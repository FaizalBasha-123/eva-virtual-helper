import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Loader, ChevronDown, ArrowRight, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import OTPInput from "./OTPInput";
import { auth } from "@/lib/firebase";
import SignInHero from "./SignInHero";
import { useIsMobile } from "@/hooks/use-mobile";
import { userService } from "@/services/userService";

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({ isOpen, onClose }) => {
  const { setConfirmationResult, confirmationResult, currentUser, setUserPhoneNumber } = useAuth();
  
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [modalOpen, setModalOpen] = useState(isOpen);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const eventListenerAdded = useRef(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
  // Handle external open modal requests with a ref to prevent duplicate listeners
  useEffect(() => {
    // Only add the event listener if it hasn't been added already
    if (!eventListenerAdded.current) {
      const handleOpenModal = () => {
        setModalOpen(true);
      };
      
      window.addEventListener('openSignInModal', handleOpenModal);
      eventListenerAdded.current = true;
      
      return () => {
        window.removeEventListener('openSignInModal', handleOpenModal);
        eventListenerAdded.current = false;
      };
    }
  }, []);
  
  // Sync props with internal state
  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);
  
  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    onClose();
  };
  
  useEffect(() => {
    if (currentUser) {
      handleModalClose();
    }
  }, [currentUser]);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (resendTimeLeft > 0) {
      interval = window.setInterval(() => {
        setResendTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimeLeft]);
  
  useEffect(() => {
    if (modalOpen) {
      setStep("phone");
      setName("");
      setOtp("");
      setIsLoading(false);
    }
  }, [modalOpen]);

  const setupRecaptcha = (elementId: string) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
      },
      'expired-callback': () => {
        toast({
          variant: "destructive",
          title: "Verification expired",
          description: "Please try again",
        });
      }
    });
    
    return window.recaptchaVerifier;
  };

  const handleSendOTP = async () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your full name",
      });
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      const formattedPhoneNumber = `${countryCode}${phoneNumber}`;
      
      const confirmation = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber,
        recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setStep("otp");
      setResendTimeLeft(30);
      
      setUserPhoneNumber(formattedPhoneNumber);
      
      // Store name in localStorage
      localStorage.setItem('user_name', name.trim());
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formattedPhoneNumber}`,
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      toast({
        variant: "destructive",
        title: "Session expired",
        description: "Please request a new OTP",
      });
      setStep("phone");
      return;
    }
    
    if (!otp || otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
      const formattedPhoneNumber = `${phoneNumber}`;
      setUserPhoneNumber(formattedPhoneNumber);

      // Store user details in Supabase
      try {
        const existingUser = await userService.getUserByPhone(formattedPhoneNumber);
        if (existingUser) {
          // Update name if user exists
          await userService.updateUserName(existingUser.id, name.trim());
        } else {
          // Create new user
          const userId = await userService.insertUser(formattedPhoneNumber, name.trim());
          if (userId) {
            await userService.updateUserName(userId, name.trim());
          }
        }
      } catch (dbError) {
        console.error("Error storing user details:", dbError);
        // Don't block authentication for database errors
      }

      // Fetch dealer id from dealer_details using phone number and store in localStorage
      try {
        // Remove +91 if present for DB query
        const phoneNumForQuery = formattedPhoneNumber.replace('+91', '');
        const { data: dealerDetails, error: dealerError } = await supabase
          .from('dealer_details')
          .select('id')
          .eq('phone_number', parseInt(phoneNumForQuery))
          .single();
        if (!dealerError && dealerDetails && dealerDetails.id) {
          localStorage.setItem('dealerId', dealerDetails.id.toString());
        }
      } catch (err) {
        console.error('Error fetching dealer id:', err);
      }

      toast({
        title: "Authentication successful",
        description: "You're now signed in!",
      });
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The code you entered is incorrect",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setStep("phone");
    if (window.recaptchaWidgetId !== null && window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      if (recaptchaContainerRef.current) {
        recaptchaContainerRef.current.innerHTML = '<div id="recaptcha-container"></div>';
      }
    }
  };

  // Handle Enter key press for phone input
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name.trim() && phoneNumber.length >= 10 && !isLoading) {
      e.preventDefault();
      handleSendOTP();
    }
  };

  // Handle Enter key press for OTP input
  const handleOtpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6 && !isLoading) {
      e.preventDefault();
      handleVerifyOTP();
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="flex flex-col lg:flex-row h-auto lg:h-[600px] max-w-[900px] overflow-hidden rounded-lg p-0" id="phone-auth-modal">
        <SignInHero />
        
        <div className="flex flex-1 flex-col overflow-y-auto w-full lg:w-1/2 px-8 py-6">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleModalClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="mx-auto w-full max-w-md space-y-6">
            {step === "phone" ? (
              <>
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold tracking-tight">Log in to continue</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile number</Label>
                    <div className="flex">
                      <div className="flex items-center gap-1 rounded-l-md border bg-background px-3">
                        <span className="text-sm font-medium">{countryCode}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="999 999 9999"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setPhoneNumber(value);
                        }}
                        onKeyDown={handlePhoneKeyDown}
                        className="flex-1 rounded-l-none"
                        maxLength={10}
                        disabled={isLoading}
                        ref={phoneInputRef}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp"
                      checked={whatsappUpdates}
                      onCheckedChange={(checked) => 
                        setWhatsappUpdates(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="whatsapp"
                      className="text-sm text-muted-foreground"
                    >
                      Get updates on WhatsApp
                    </label>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Terms and Conditions</a>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={agreePrivacy}
                        onCheckedChange={(checked) => setAgreePrivacy(!!checked)}
                      />
                      <label htmlFor="privacy" className="text-sm text-muted-foreground">
                        I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  <div ref={recaptchaContainerRef}>
                    <div id="recaptcha-container"></div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleSendOTP}
                    disabled={isLoading || !name.trim() || phoneNumber.length < 10 || !agreeTerms || !agreePrivacy}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Get OTP"
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Verify your phone
                  </h2>
                  <p className="text-muted-foreground">
                    We've sent a verification code to {countryCode} {phoneNumber}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter 6-digit OTP</Label>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={handleOtpKeyDown}
                    />
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue"
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">
                      {resendTimeLeft > 0 ? (
                        `Resend OTP in ${resendTimeLeft}s`
                      ) : (
                        <Button
                          variant="link"
                          onClick={handleResendOTP}
                          className="p-0 h-auto"
                        >
                          Resend OTP
                        </Button>
                      )}
                    </p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("phone")}
                    >
                      Change Number
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneAuthModal;

// Add RecaptchaVerifier to Window interface
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    recaptchaWidgetId: number | null;
  }
}
