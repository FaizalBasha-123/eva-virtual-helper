
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminButtons = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const navigateToCars = () => {
    navigate('/search');
  };

  const navigateToBikes = () => {
    navigate('/bikes');
  };

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
      <Button 
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-full shadow-lg"
        onClick={navigateToCars}
      >
        Edit Cars
      </Button>
      <Button 
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-full shadow-lg"
        onClick={navigateToBikes}
      >
        Edit Bikes
      </Button>
    </div>
  );
};

export default AdminButtons;
