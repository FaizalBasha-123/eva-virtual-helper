
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface ConfirmationData {
  phoneNumber: string | null;
  brand: string | null;
  year: string | null;
  model: string | null;
  variant: string | null;
  kilometers: string | null;
  city: string | null;
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
}

interface ConfirmationProps {
  confirmationData: ConfirmationData;
  isBike: boolean;
  formattedPrice: string;
  selectedFeatures: string[];
  setIsConfirmationView: (value: boolean) => void;
}

type PhotoCategory = "Exterior" | "Interior" | "Tyres" | "Features" | "Defects" | "Front" | "Rear" | "Left" | "Right";

const Confirmation: React.FC<ConfirmationProps> = ({
  confirmationData,
  isBike,
  formattedPrice,
  selectedFeatures,
  setIsConfirmationView
}) => {
  const [uploadedImages, setUploadedImages] = useState<Record<PhotoCategory, string[]>>({
    Exterior: [],
    Interior: [],
    Tyres: [],
    Features: [],
    Defects: [],
    Front: [],
    Rear: [],
    Left: [],
    Right: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentChecklist, setDocumentChecklist] = useState<Record<string, boolean>>({
    insurance_document: false,
    puc_certificate: false,
    road_tax_status: false,
    battery_health_proof: false,
    loan_noc_document: false,
    warranty_document: false
  });
  const [showDocumentChecklist, setShowDocumentChecklist] = useState<Record<string, boolean>>({
    insurance_document: true,
    puc_certificate: true,
    road_tax_status: true,
    battery_health_proof: false,
    loan_noc_document: false,
    warranty_document: false
  });
  const [step2Data, setStep2Data] = useState<Record<string, any>>({});
  const [step3Data, setStep3Data] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load uploaded image URLs from localStorage
    const savedUrls = localStorage.getItem("uploadedFileUrls");
    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls) as Record<PhotoCategory, string[]>;
        setUploadedImages(parsedUrls);
      } catch (error) {
        console.error("Error parsing uploaded image URLs:", error);
      }
    }

    // Load step2 and step3 data from localStorage for document checklist conditions
    const step2DataStr = localStorage.getItem("appointment_step2_data");
    const step3DataStr = localStorage.getItem("appointment_step3_data");

    try {
      if (step2DataStr) {
        const parsedStep2Data = JSON.parse(step2DataStr);
        setStep2Data(parsedStep2Data);
        
        // Show battery_health_proof checkbox conditionally
        if (parsedStep2Data.battery_health && parsedStep2Data.battery_health.trim() !== '') {
          setShowDocumentChecklist(prev => ({...prev, battery_health_proof: true}));
        }
      }

      if (step3DataStr) {
        const parsedStep3Data = JSON.parse(step3DataStr);
        setStep3Data(parsedStep3Data);
        
        // Show loan_noc_document checkbox conditionally
        if (parsedStep3Data.loan_status === "Yes-got NOC") {
          setShowDocumentChecklist(prev => ({...prev, loan_noc_document: true}));
        }

        // Show warranty_document checkbox conditionally
        if (parsedStep3Data.warranty_status === "At Present") {
          setShowDocumentChecklist(prev => ({...prev, warranty_document: true}));
        }
      }
    } catch (error) {
      console.error("Error parsing step data:", error);
    }
  }, []);

  // Check if all required documents are checked
  const areAllDocumentsChecked = () => {
    for (const [key, isVisible] of Object.entries(showDocumentChecklist)) {
      if (isVisible && !documentChecklist[key]) {
        return false;
      }
    }
    return true;
  };

  const handleDocumentCheckboxChange = (document: string, checked: boolean) => {
    setDocumentChecklist(prev => ({...prev, [document]: checked}));
  };

  const handlePublishListing = async () => {
    if (!areAllDocumentsChecked()) {
      toast.error("Please agree to provide all required documents");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get vehicle type and determine which table to use
      const sellFormDataStr = localStorage.getItem("sellFormData");
      if (!sellFormDataStr) {
        throw new Error("Sell form data not found in localStorage");
      }

      const sellFormData = JSON.parse(sellFormDataStr);
      const vehicleType = localStorage.getItem("vehicle");
      const vehicle = localStorage.getItem("vehicle");

      console.log("vehicle", vehicleType);
      
      // Get user phone number from user profile
      let phoneNumber = confirmationData.phoneNumber;
      
      // Try to find userProfile in localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("userProfile_")) {
          try {
            const profile = JSON.parse(localStorage.getItem(key) || "{}");
            phoneNumber = profile.phoneNumber || phoneNumber;
          } catch (e) {
            console.error("Error parsing user profile:", e);
          }
        }
      });

      // Format photos based on vehicle type
      const uploadedFileUrlsStr = localStorage.getItem("uploadedFileUrls");
      let photos = {};
      
      if (uploadedFileUrlsStr) {
        try {
          const parsedUrls = JSON.parse(uploadedFileUrlsStr);
          
          if (vehicle === "car") {
            photos = {
              exterior: parsedUrls.Exterior || [],
              interior: parsedUrls.Interior || [],
              tyres: parsedUrls.Tyres || [],
              features: parsedUrls.Features || [],
              defects: parsedUrls.Defects || []
            };
          } else {
            photos = {
              front: parsedUrls.Front || [],
              rear: parsedUrls.Rear || [],
              left: parsedUrls.Left || [],
              right: parsedUrls.Right || [],
              defects: parsedUrls.Defects || []
            };
          }
        } catch (error) {
          console.error("Error parsing uploaded file URLs:", error);
          photos = {};
        }
      }

      const sellingPrice = parseInt(localStorage.getItem("seller_price") || "0", 10);
      const parsedFeatures = JSON.parse(localStorage.getItem("key_features") || "[]");

      if (vehicle === "car") {
        // Prepare car listing data
        const carData = {
          brand: sellFormData.brand || confirmationData.brand,
          model: sellFormData.model || confirmationData.model,
          variant: sellFormData.variant || confirmationData.variant,
          year: parseInt(sellFormData.year || confirmationData.year || "0", 10),
          city: localStorage.getItem("selectedCity") || confirmationData.city,
          color: localStorage.getItem("color") || confirmationData.color,
          fuel_type: localStorage.getItem("fuel_type") || confirmationData.fuelType || "Petrol",
          transmission: localStorage.getItem("transmission") || confirmationData.transmission || "Manual",
          mileage: parseFloat(localStorage.getItem("mileage") || confirmationData.mileage || "0"),
          seats: parseInt(localStorage.getItem("seats") || confirmationData.seats || "0", 10),
          cc: parseInt(localStorage.getItem("cc") || confirmationData.cc || "0", 10),
          gncap_rating: parseInt(localStorage.getItem("safety_rating") || confirmationData.safetyRating || "0", 10),
          airbags: parseInt(localStorage.getItem("airbags") || confirmationData.airbags || "0", 10),
          cylinders: parseInt(localStorage.getItem("cylinders") || confirmationData.cylinders || "0", 10),
          wheel_drive: localStorage.getItem("wheel_drive") || confirmationData.wheelDrive,
          sell_price: sellingPrice,
          features: selectedFeatures.length > 0 ? selectedFeatures : parsedFeatures,
          phone_number: phoneNumber || "0000000000",
          vehicle_type: vehicleType,
          photos: photos
        };

        // Insert car listing into Supabase
        const { data: carData_res, error: carError } = await supabase
          .from("car_seller_listings")
          .insert([carData]);

        if (carError) {
          throw carError;
        }
        
        console.log("Car listing published successfully");
        toast.success("Car listing has been published successfully!");
      } else {
        // Prepare bike listing data
        const bikeData = {
          brand: sellFormData.brand || confirmationData.brand,
          model: sellFormData.model || confirmationData.model,
          variant: sellFormData.variant || confirmationData.variant,
          year: parseInt(sellFormData.year || confirmationData.year || "0", 10),
          city: localStorage.getItem("selectedCity") || confirmationData.city,
          color: localStorage.getItem("color") || confirmationData.color,
          fuel_type: localStorage.getItem("fuel_type") || confirmationData.fuelType || "Petrol",
          mileage: parseFloat(localStorage.getItem("mileage") || confirmationData.mileage || "0"),
          seats: parseInt(localStorage.getItem("seats") || confirmationData.seats || "0", 10),
          cc: parseInt(localStorage.getItem("cc") || confirmationData.cc || "0", 10),
          gncap_rating: parseInt(localStorage.getItem("safety_rating") || confirmationData.safetyRating || "0", 10),
          sell_price: sellingPrice,
          features: selectedFeatures.length > 0 ? selectedFeatures : parsedFeatures,
          phone_number: phoneNumber || "0000000000",
          vehicle_type: vehicleType,
          photos: photos
        };

        // Insert bike listing into Supabase
        const { data: bikeData_res, error: bikeError } = await supabase
          .from("bike_seller_listings")
          .insert([bikeData]);

        if (bikeError) {
          throw bikeError;
        }
        
        console.log("Bike listing published successfully");
        toast.success("Bike listing has been published successfully!");
      }

      // Optional: Clear certain localStorage data after successful submission
      // localStorage.removeItem("uploadedFileUrls");
      // localStorage.removeItem("seller_price");
      // localStorage.removeItem("key_features");
      
    } catch (error) {
      console.error("Error publishing listing:", error);
      toast.error("Failed to publish listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Confirmation</h2>
      
      <div className="space-y-6">
        {/* Vehicle Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Brand</p>
              <p className="font-medium">{confirmationData.brand || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
              <p className="font-medium">{confirmationData.model || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
              <p className="font-medium">{confirmationData.variant || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
              <p className="font-medium">{confirmationData.year || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kilometers Driven</p>
              <p className="font-medium">{confirmationData.kilometers || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
              <p className="font-medium">{confirmationData.city || "N/A"}</p>
            </div>
          </div>
        </div>
        
        {/* Vehicle Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Type</p>
              <p className="font-medium">{confirmationData.vehicleType || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fuel Type</p>
              <p className="font-medium">{confirmationData.fuelType || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Color</p>
              <p className="font-medium">{confirmationData.color || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mileage</p>
              <p className="font-medium">{confirmationData.mileage || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
              <p className="font-medium">{confirmationData.seats || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">CC</p>
              <p className="font-medium">{confirmationData.cc || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Safety Rating</p>
              <p className="font-medium">{confirmationData.safetyRating || "N/A"}</p>
            </div>
            
            {/* Render car-specific fields only if not a bike */}
            {!isBike && (
              <>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transmission</p>
                  <p className="font-medium">{confirmationData.transmission || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Airbags</p>
                  <p className="font-medium">{confirmationData.airbags || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cylinders</p>
                  <p className="font-medium">{confirmationData.cylinders || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Wheel Drive</p>
                  <p className="font-medium">{confirmationData.wheelDrive || "N/A"}</p>
                </div>
              </>
            )}
          </div>

          {/* Photos section */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Vehicle Photos</h4>
            
            {Object.entries(uploadedImages).map(([category, urls]) => (
              urls.length > 0 && (
                <div key={category} className="mb-6">
                  <h5 className="text-md font-semibold mb-2">{category}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {urls.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded-md overflow-hidden border dark:border-gray-600">
                        <img
                          src={url}
                          alt={`${category}-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        
        {/* Price and Features */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Price and Features</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
            <p className="font-medium text-xl">₹ {formattedPrice}</p>
          </div>
          
          {selectedFeatures.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Selected Features</p>
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map((feature, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Document Checklist Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">To Post Ads Agree to give your Documents for</h3>
          <div className="space-y-3">
            {/* Always visible documents */}
            {showDocumentChecklist.insurance_document && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="insurance_document"
                  checked={documentChecklist.insurance_document}
                  onChange={(e) => handleDocumentCheckboxChange("insurance_document", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="insurance_document" className="text-sm">Insurance Document</label>
              </div>
            )}
            
            {showDocumentChecklist.puc_certificate && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="puc_certificate"
                  checked={documentChecklist.puc_certificate}
                  onChange={(e) => handleDocumentCheckboxChange("puc_certificate", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="puc_certificate" className="text-sm">PUC Certificate</label>
              </div>
            )}
            
            {showDocumentChecklist.road_tax_status && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="road_tax_status"
                  checked={documentChecklist.road_tax_status}
                  onChange={(e) => handleDocumentCheckboxChange("road_tax_status", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="road_tax_status" className="text-sm">Road Tax Status</label>
              </div>
            )}
            
            {/* Conditional documents */}
            {showDocumentChecklist.battery_health_proof && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="battery_health_proof"
                  checked={documentChecklist.battery_health_proof}
                  onChange={(e) => handleDocumentCheckboxChange("battery_health_proof", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="battery_health_proof" className="text-sm">Battery Health Proof</label>
              </div>
            )}
            
            {showDocumentChecklist.loan_noc_document && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="loan_noc_document"
                  checked={documentChecklist.loan_noc_document}
                  onChange={(e) => handleDocumentCheckboxChange("loan_noc_document", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="loan_noc_document" className="text-sm">Loan NOC Document</label>
              </div>
            )}
            
            {showDocumentChecklist.warranty_document && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="warranty_document"
                  checked={documentChecklist.warranty_document}
                  onChange={(e) => handleDocumentCheckboxChange("warranty_document", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="warranty_document" className="text-sm">Warranty Document</label>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setIsConfirmationView(false)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handlePublishListing}
            disabled={isSubmitting || !areAllDocumentsChecked()}
          >
            {isSubmitting ? "Publishing..." : "Listing Published Successfully"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
