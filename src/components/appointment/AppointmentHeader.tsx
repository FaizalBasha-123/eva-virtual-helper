
import React from "react";

interface AppointmentHeaderProps {
  currentStep: number;
}

export const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({ currentStep }) => {
  const steps = [
    "Vehicle Details",
    "Schedule",
    "Location",
    "Pricing",
    "Complete"
  ];

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-center mb-6">Book Your Appointment</h1>
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index + 1 <= currentStep
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-center">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
