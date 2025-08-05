import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useCityStore } from "@/store/useCityStore";
import CityModal from "@/components/cars/CityModal";
import LocationInput from "@/components/shared/LocationInput";
import { DealerService } from "./DealerService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import OTPInput from "./OTPInput";
import { X } from "lucide-react";
import SignInHero from "./SignInHero";

interface DealerSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DealerSignInModal: React.FC<DealerSignInModalProps> = ({ isOpen, onClose }) => {
  const [dealerName, setDealerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Get phone number from localStorage if available
    return localStorage.getItem("phoneNumber") || "";
  });
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(isOpen);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const { selectedCity } = useCityStore();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleModalClose = () => {
    setModalOpen(false);
    resetModal();
    onClose();
  };

  const setupRecaptcha = (elementId: string) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': () => {},
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
    if (!dealerName.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your dealer name",
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
    if (!selectedCity) {
      toast({
        variant: "destructive",
        title: "City required",
        description: "Please select your city",
      });
      return;
    }
    setLoading(true);
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formattedPhone}`,
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: error.message || "Please try again later",
      });
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      // Add dealer to dealer_details table
      const { data, error } = await DealerService.upsertDealer({
        phoneNumber,
        dealerName,
        dealerLocation: selectedCity
      });
      if (error) {
        console.error('Error saving dealer:', error);
        toast({
          variant: "destructive",
          title: "Failed to save dealer information",
          description: error.message || "Failed to save dealer information",
        });
        return;
      }
      setUser({
        uid: user.uid,
        phoneNumber: phoneNumber,
        isDealer: true,
        dealerName: dealerName
      });

      // Fetch dealer id from dealer_details using DealerService and store in localStorage
      try {
        const dealerId = await DealerService.getDealerId(phoneNumber);
        if (dealerId) {
          localStorage.setItem('dealerId', dealerId.toString());
        }
      } catch (err) {
        console.error('Error fetching dealer id:', err);
      }
      toast({
        title: "Authentication successful",
        description: "Dealer account created successfully!",
      });
      handleModalClose();
      navigate('/dealer-dashboard');
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The code you entered is incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCityModal = () => setIsCityModalOpen(true);
  const closeCityModal = () => setIsCityModalOpen(false);
  const resetModal = () => {
    setDealerName("");
    setPhoneNumber("");
    setOtp("");
    setStep('phone');
    setConfirmationResult(null);
  };

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent className="flex flex-col lg:flex-row h-auto lg:h-[600px] max-w-[900px] overflow-hidden rounded-lg p-0">
          <SignInHero />
          <div className="flex flex-1 flex-col overflow-y-auto w-full lg:w-1/2 px-8 py-6">
            {step === 'phone' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dealerName">Dealer Name</Label>
                  <Input
                    id="dealerName"
                    type="text"
                    placeholder="Enter your dealer name"
                    value={dealerName}
                    onChange={(e) => setDealerName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    disabled
                    className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <LocationInput onClick={openCityModal} className="w-full" />
                </div>
                <div ref={recaptchaContainerRef}>
                  <div id="recaptcha-container"></div>
                </div>
                <Button 
                  onClick={handleSendOTP} 
                  disabled={loading || !dealerName.trim() || phoneNumber.length < 10 || !selectedCity}
                  className="w-full"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* OTP input and verification UI here */}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <CityModal 
        isOpen={isCityModalOpen}
        onClose={closeCityModal}
        isMandatory={false}
      />
    </div>
  );
};

export default DealerSignInModal;
