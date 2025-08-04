
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Calendar, MapPin, Phone } from "lucide-react";

export const Complete: React.FC = () => {
  const appointmentData = {
    step1: JSON.parse(localStorage.getItem("appointment_step1_data") || "{}"),
    step2: JSON.parse(localStorage.getItem("appointment_step2_data") || "{}"),
    step3: JSON.parse(localStorage.getItem("appointment_step3_data") || "{}")
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900">
        Appointment Confirmed!
      </h2>
      
      <p className="text-gray-600">
        Your vehicle inspection has been scheduled successfully. 
        Our expert will contact you shortly to confirm the details.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-left">
        <h3 className="font-medium text-gray-900 mb-3">Appointment Details:</h3>
        
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {appointmentData.step2.date && appointmentData.step2.time 
              ? `${appointmentData.step2.date} at ${appointmentData.step2.time}`
              : "Date & Time: To be confirmed"
            }
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {appointmentData.step3.address 
              ? `${appointmentData.step3.address}, ${appointmentData.step3.city}`
              : "Location: To be confirmed"
            }
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            Vehicle: {appointmentData.step1.brand} {appointmentData.step1.model} ({appointmentData.step1.year})
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={() => window.location.href = "/"} 
          className="w-full"
        >
          Back to Home
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/profile"} 
          className="w-full"
        >
          View My Appointments
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        You will receive a confirmation call within 2 hours. 
        For any queries, contact us at +91-XXXXXXXXXX
      </p>
    </div>
  );
};
