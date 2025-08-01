import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, BadgeDollarSign, Car, Handshake, Shield, Lock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface PricingProps {
  onBack: () => void;
  expectedPrice: string;
  selectedFeatures: string[];
}

interface ConfirmationData {
  phoneNumber: string | null;
  brand: string | null;
  year: string | null;
  model: string | null;
  variant: string | null;
  kilometers: string | null;
  vehicleType: string | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  mileage: string | null;
  seats: string | null;
  safetyRating: string | null;
  cc: string | null;
  airbags: string | null;
  cylinders: string | null;
  wheelDrive: string | null;
  warrantyStatus: string | null;
  loanStatus: string | null;
  batteryHealth: string | null;
  seller_price: string | null;
  insurance_validity: string | null;
  seller_location_city: string | null;
}

const Pricing: React.FC<PricingProps> = ({ onBack, expectedPrice, selectedFeatures }) => {
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isConfirmationView, setIsConfirmationView] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>({
    phoneNumber: null,
    brand: null,
    year: null,
    model: null,
    variant: null,
    kilometers: null,
    vehicleType: null,
    fuelType: null,
    transmission: null,
    color: null,
    mileage: null,
    seats: null,
    safetyRating: null,
    cc: null,
    airbags: null,
    cylinders: null,
    wheelDrive: null,
    warrantyStatus: null,
    loanStatus: null,
    batteryHealth: null,
    seller_price: null,
    insurance_validity: null,
    seller_location_city: null,
  });
  
  // State for document checkboxes
  const [documents, setDocuments] = useState({
    insurance: false,
    batteryHealth: false,
    loanNOC: false,
    warranty: false,
    pucCertificate: false,
    roadTaxStatus: false
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load data from localStorage for confirmation view
    if (isConfirmationView) {
      // Get regular localStorage data
      const data: ConfirmationData = {
        phoneNumber: localStorage.getItem('phoneNumber'),
        brand: localStorage.getItem('brand'),
        year: localStorage.getItem('year'),
        model: localStorage.getItem('model'),
        variant: localStorage.getItem('variant'),
        kilometers: localStorage.getItem('kilometers'),
        vehicleType: localStorage.getItem('vehicle_type'),
        fuelType: localStorage.getItem('fuel_type'),
        transmission: localStorage.getItem('transmission'),
        color: localStorage.getItem('color'),
        mileage: localStorage.getItem('mileage'),
        seats: localStorage.getItem('seats'),
        safetyRating: localStorage.getItem('safety_rating'),
        cc: localStorage.getItem('cc'),
        airbags: localStorage.getItem('airbags'),
        cylinders: localStorage.getItem('cylinders'),
        wheelDrive: localStorage.getItem('wheel_drive'),
        warrantyStatus: localStorage.getItem('warranty_status'),
        loanStatus: localStorage.getItem('loan_status'),
        batteryHealth: localStorage.getItem('battery_health'),
        seller_price: localStorage.getItem('seller_price'),
        insurance_validity: localStorage.getItem('insurance_validity'),
        seller_location_city: localStorage.getItem('selectedCity'),
      };
      
      // Also get data from sellFormData
      try {
        const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
        
        // Update data with sellFormData values if they exist
        if (sellFormData.brand) data.brand = sellFormData.brand;
        if (sellFormData.year) data.year = sellFormData.year;
        if (sellFormData.model) data.model = sellFormData.model;
        if (sellFormData.variant) data.variant = sellFormData.variant;
        if (sellFormData.kilometersDriven) data.kilometers = sellFormData.kilometersDriven;
        if (sellFormData.city) data.seller_location_city = sellFormData.city;
      } catch (error) {
        console.error("Error parsing sellFormData:", error);
      }

      // Try to get data from appointment steps
      try {
        for (let i = 1; i <= 6; i++) {
          const stepData = localStorage.getItem(`appointment_step${i}_data`);
          if (stepData) {
            const parsedData = JSON.parse(stepData);
            
            // Update specific fields based on step data
            if (i === 4 && parsedData.seller_price) {
              data.seller_price = parsedData.seller_price;
            }
            if (i === 2 && parsedData.warranty_status) {
              data.warrantyStatus = parsedData.warranty_status;
            }
            if (i === 2 && parsedData.loan_status) {
              data.loanStatus = parsedData.loan_status;
            }
            if (i === 1 && parsedData.insurance_validity) {
              data.insurance_validity = parsedData.insurance_validity;
            }
            if (i === 1 && parsedData.battery_health) {
              data.batteryHealth = parsedData.battery_health;
            }
          }
        }
      } catch (error) {
        console.error("Error parsing appointment step data:", error);
      }
      
      const step5Data = JSON.parse(localStorage.getItem('appointment_step5_data') || '{}');
      
      setConfirmationData(data);
    }
  }, [isConfirmationView]);
  
  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value.toUpperCase());
    // Reset promo applied state when changing the code
    if (promoApplied) setPromoApplied(false);
  };
  
  const applyPromo = () => {
    if (promoCode.toLowerCase() === "friend") {
      setPromoApplied(true);
      toast.success("🎉 Promo applied! Listing is free.");
    } else {
      toast.error("Invalid promo code");
    }
  };
  
  const handleDocumentChange = (documentName: keyof typeof documents) => {
    setDocuments(prev => ({
      ...prev,
      [documentName]: !prev[documentName]
    }));
  };
  
  const handleProceedToPay = () => {
    // Retrieve step 6 data from localStorage
    const appointmentDataString = localStorage.getItem("appointment_step6_data");
    const appointmentData = appointmentDataString ? JSON.parse(appointmentDataString) : {};

    const aadhaar = appointmentData?.aadhaar_number?.trim();
    const pan = appointmentData?.pan_number?.trim();
    const terms = !!appointmentData?.terms_agreement;
    const privacy = !!appointmentData?.privacy_agreement;
    const dataAgreement = !!appointmentData?.data_agreement;

    // Aadhaar or PAN required
    if (!aadhaar && !pan) {
      toast.error("Please enter either Aadhaar number or PAN number.");
      return;
    }

    // Aadhaar must be 16 digits if provided
    if (aadhaar && !/^\d{16}$/.test(aadhaar)) {
      toast.error("Aadhaar number must be exactly 16 digits.");
      return;
    }

    // All agreements must be checked
    if (!terms || !privacy || !dataAgreement) {
      toast.error("Please agree to all terms, privacy policy, and required documents.");
      return;
    }

    // If the promo is applied, show the confirmation view
    if (promoApplied) {
      // Save additional data to localStorage for bike listings
      const vehicleType = localStorage.getItem("vehicle");
      if (vehicleType === "bike") {        
        // Get data from forms/input fields if available
        // For example, from sellFormData
        try {
          const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
          if (sellFormData.mileage) localStorage.setItem("mileage", sellFormData.mileage);
          if (sellFormData.color) localStorage.setItem("color", sellFormData.color);
          if (sellFormData.cc) localStorage.setItem("cc", sellFormData.cc);
        } catch (error) {
          console.error("Error parsing sellFormData:", error);
        }
      }
      
      setIsConfirmationView(true);
      return;
    }
    
    // This will be integrated with Razorpay in a future phase
    toast.info("Payment integration will be available in a future update");
  };
  
  const handlePublishListing = async () => {
    // Save document agreement to localStorage
    localStorage.setItem("document_agreement", JSON.stringify(documents));
    
    // Set submitting state to show loading indicator
    setIsSubmitting(true);
    
    // Determine the vehicle type and appropriate table
    const vehicleType = localStorage.getItem('vehicle');
    const table = vehicleType === 'car'
      ? 'car_seller_listings'
      : vehicleType === 'bike'
      ? 'bike_seller_listings'
      : null;

    if (!table) {
      console.error('🚫 Invalid vehicle type. Table selection failed.');
      toast.error("Could not determine vehicle type");
      setIsSubmitting(false);
      return;
    }

    const parseJSON = (key: string) => {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        console.warn(`⚠️ Failed to parse JSON: ${key}`, err);
        return null;
      }
    };

    const parseIntOrNull = (key: string) => {
      const val = localStorage.getItem(key);
      return val ? parseInt(val) : null;
    };

    const parseFloatOrNull = (key: string) => {
      const val = localStorage.getItem(key);
      return val ? parseFloat(val) : null;
    };

    // Parse step data from localStorage
    const stepData: {[key: string]: any} = {};
    for (let i = 1; i <= 6; i++) {
      const key = `appointment_step${i}_data`;
      try {
        const data = localStorage.getItem(key);
        if (data) {
          stepData[key] = JSON.parse(data);
        }
      } catch (error) {
        console.error(`Error parsing ${key}:`, error);
      }
    }

    // Get step5Data specifically to ensure we have access to seller_price
    const step5Data = JSON.parse(localStorage.getItem('appointment_step5_data') || '{}');
    
    // Prepare data for submission
    const data = {
      registration_number: stepData.appointment_step1_data?.registration_number || null,
      rto_state: stepData.appointment_step1_data?.rto_state || null,
      rto: stepData.appointment_step1_data?.rto || null,
      vehicle_type: stepData.appointment_step1_data?.body_type || null,
      cc: parseIntOrNull('cc') || (stepData.appointment_step1_data?.engine_cc ? parseInt(stepData.appointment_step1_data.engine_cc) : null),
      load_capacity: stepData.appointment_step1_data?.load_capacity ? parseInt(stepData.appointment_step1_data.load_capacity) : null,
      number_of_owners: stepData.appointment_step2_data?.number_of_owners ? parseInt(stepData.appointment_step2_data.number_of_owners) : null,
      ownership_type: stepData.appointment_step2_data?.ownership_type || null,
      fuel_type: localStorage.getItem('fuel_type') || null,
      color: stepData.appointment_step2_data?.color || localStorage.getItem('color') || null,
      insurance_validity: stepData.appointment_step2_data?.insurance_validity || localStorage.getItem('insurance_validity') || null,
      transmission_type: stepData.appointment_step2_data?.transmission_type || localStorage.getItem('transmission') || null,
      modifications: stepData.appointment_step2_data?.modifications || null,
      battery_health: stepData.appointment_step2_data?.battery_health || localStorage.getItem('battery_health') || null,
      warranty_status: stepData.appointment_step3_data?.warranty_status || localStorage.getItem('warranty_status') || null,
      loan_status: stepData.appointment_step3_data?.loan_status || localStorage.getItem('loan_status') || null,
      tire_condition: stepData.appointment_step3_data?.tire_condition || null,
      permit_type: stepData.appointment_step3_data?.permit_type || null,
      fitness_certificate: stepData.appointment_step3_data?.fitness_certificate || null,
      vehicle_battery: stepData.appointment_step3_data?.vehicle_battery || null,
      accident_history: stepData.appointment_step3_data?.accident_history || null,
      major_replacements: stepData.appointment_step3_data?.major_replacements || null,
      seller_name: stepData.appointment_step5_data?.seller_name || null,
      sell_price: localStorage.getItem('seller_price') || null,
      seller_phone_number: stepData.appointment_step5_data?.phone_number || localStorage.getItem('phoneNumber') || null,
      seller_location_city: localStorage.getItem('selectedCity') || null,
      preferred_contact_time: stepData.appointment_step5_data?.preferred_contact_time || null,
      warranty_details: stepData.appointment_step5_data?.warranty_details || null,
      ev_charger_included: stepData.appointment_step5_data?.ev_charger_included || null,
      reason_for_sale: stepData.appointment_step5_data?.reason_for_sale || null,
      accessories: stepData.appointment_step5_data?.accessories || null,
      aadhaar_number: stepData.appointment_step6_data?.aadhaar_number || null,
      pan_number: stepData.appointment_step6_data?.pan_number || null,
      brand: localStorage.getItem('brand') || null,
      year: parseIntOrNull('year') || null,
      model: localStorage.getItem('model') || null,
      variant: localStorage.getItem('variant') || null,
      kilometers_driven: localStorage.getItem('kilometers') || null,
      user_id: localStorage.getItem('userId') || null,  
      photos: parseJSON('uploadedFileUrls') || {},
      seller_type: localStorage.getItem('seller_type') || null,
    };

    // Get sellFormData if available
    try {
      const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
      if (sellFormData.brand) data.brand = sellFormData.brand;
      if (sellFormData.year) data.year = parseInt(sellFormData.year);
      if (sellFormData.model) data.model = sellFormData.model;
      if (sellFormData.variant) data.variant = sellFormData.variant;
    } catch (error) {
      console.error("Error parsing sellFormData:", error);
    }

    console.log('📤 Uploading to table:', table);
    console.log('🧾 Final Data Object:', data);

    try {
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert([data]);

      if (error) {
        console.error('❌ Supabase insert error:', error.message, error.details);
        toast.error(`Failed to ad posting: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Successfully inserted:', insertedData);
      toast.success("Your ad has been posted successfully! Our Team will contact you soon.");
      
      // Reset confirmation view and submitting state
      setIsConfirmationView(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error('🚨 Insert exception:', error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Wrapper for posting and redirecting
  const handleStartPosting = async () => {
    // Call the original function
    const result = await handlePublishListing();
    // handlePublishListing does not return a value, so we check for toast and isSubmitting
    // Instead, use a MutationObserver on the DOM for the toast, or use a timeout as a fallback
    // Here, we use a timeout to allow the toast to show, then redirect
    setTimeout(() => {
      navigate("/posted");
    }, 1200); // 1.2s for toast visibility
  };
  
  // Format the expected price for display
  const formattedPrice = expectedPrice 
    ? new Intl.NumberFormat("en-IN").format(parseInt(expectedPrice))
    : "0";
    
  // Check if vehicle is a bike
  const isBike = localStorage.getItem("vehicle") === "bike";
  
  // Custom document confirmation view
  const renderDocumentConfirmation = () => {
    return (
      <div className="w-full max-w-2xl mx-auto">
        
        <Button 
          onClick={handleStartPosting}
          className="w-full py-2 bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting your ad..." : "Start Posting"}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setIsConfirmationView(false)}
          className="w-full mt-4"
          disabled={isSubmitting}
        >
          Back to Payment
        </Button>
      </div>
    );
  };
  
  // Render confirmation component if payment is successful
  if (isConfirmationView) {
    return renderDocumentConfirmation();
  }
  
  // Default pricing view
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300">Listing Fee</span>
          <span className={`font-semibold ${promoApplied ? "line-through text-gray-400" : ""}`}>
            ₹ 199
          </span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between items-center py-4 text-green-600 dark:text-green-400">
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Promo Applied
            </span>
            <span className="font-semibold">- ₹ 199</span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 text-lg font-bold">
          <span>Total</span>
          <span>₹ {promoApplied ? "0" : "199"}</span>
        </div>
      </div>
      
      {/* Promo code section */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Have a promo code?</label>
        <div className="flex gap-2">
          <Input
            value={promoCode}
            onChange={handlePromoChange}
            placeholder="Type FRIEND for Free Listing"
            disabled={promoApplied}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && promoCode && !promoApplied) {
                e.preventDefault();
                applyPromo();
              }
            }}
          />
          <Button
            onClick={applyPromo}
            variant="outline"
            disabled={!promoCode || promoApplied}
          >
            Apply
          </Button>
        </div>
        {promoApplied && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            🎉 Promo code FRIEND applied successfully!
          </p>
        )}
      </div>
      
      {/* Selected features section */}
      {selectedFeatures.length > 0 && (
        <div className="mb-8">
          <h3 className="font-medium text-lg mb-3">Selected Features:</h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleProceedToPay} 
          className={`flex items-center gap-2 ${promoApplied ? "bg-green-500 hover:bg-green-600" : ""}`}
        >
          {promoApplied && <Check className="h-4 w-4" />}
          {promoApplied ? "List for Free" : "Proceed to Pay"}
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
