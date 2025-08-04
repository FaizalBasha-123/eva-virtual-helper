
import React, { createContext, useContext, useState, ReactNode } from 'react';

type VehicleType = 'car' | 'bike';

interface VehicleContextType {
  vehicleType: VehicleType;
  setVehicleType: (type: VehicleType) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize vehicle type from localStorage or default to 'car'
  const getInitialVehicleType = (): VehicleType => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vehicle');
      return (stored === 'car' || stored === 'bike') ? stored : 'car';
    }
    return 'car';
  };

  const [vehicleType, setVehicleType] = useState<VehicleType>(getInitialVehicleType);

  // Sync with localStorage when vehicle type changes
  const handleSetVehicleType = (type: VehicleType) => {
    setVehicleType(type);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vehicle', type);
    }
  };

  return (
    <VehicleContext.Provider value={{ vehicleType, setVehicleType: handleSetVehicleType }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
