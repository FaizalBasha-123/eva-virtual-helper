
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AppointmentCalendarProps {
  onNext: () => void;
  onBack: () => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      localStorage.setItem("appointment_step2_data", JSON.stringify({
        date: selectedDate,
        time: selectedTime
      }));
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
      
      <div>
        <label className="block text-sm font-medium mb-2">Preferred Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Available Time Slots</label>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 text-sm border rounded-md ${
                selectedTime === time
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
