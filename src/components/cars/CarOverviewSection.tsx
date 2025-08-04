
import React from 'react';
import { Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CarType } from '@/types/car';

interface CarOverviewSectionProps {
  car: CarType;
}

const CarOverviewSection = ({ car }: CarOverviewSectionProps) => {
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Car Overview</h2>
        <Separator className="mb-6" />
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-muted-foreground text-sm block">Make Year</span>
            <span className="font-medium">{car.year}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">Register Year</span>
            <span className="font-medium">{car.registerYear || car.year}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">Register Number</span>
            <span className="font-medium">{car.registerNumber || 'UP-14-CD-5678'}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">Fuel</span>
            <span className="font-medium">{car.fuelType || car.fuel || 'Petrol'}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">Transmission</span>
            <span className="font-medium">{car.transmission || 'Manual'}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">Engine CC</span>
            <span className="font-medium">{car.engineSize || '1396'} cc</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">Ownership</span>
            <span className="font-medium">{car.owner || '1st Owner'}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">Insurance</span>
            <span className="font-medium">Valid till {car.insurance || 'July 2025'}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">KM Driven</span>
            <span className="font-medium">{car.mileage?.toLocaleString() || '98,690'} km</span>
          </div>
          <div>
            <span className="text-muted-foreground text-sm block">BS Norm</span>
            <span className="font-medium">{car.bsNorm || 'BS6'}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Features</h2>
        <Separator className="mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
          {(car.features || []).map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Service History</h2>
        <Separator className="mb-6" />
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full mr-3 mt-1">
              Regular Service
            </div>
            <div>
              <h3 className="font-medium text-sm">Full Service at Authorized Center</h3>
              <p className="text-sm text-muted-foreground">July 15, 2023</p>
              <p className="text-sm mt-1">Oil change, brake check, and general inspection completed.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full mr-3 mt-1">
              Repair Work
            </div>
            <div>
              <h3 className="font-medium text-sm">Battery Replacement</h3>
              <p className="text-sm text-muted-foreground">December 10, 2022</p>
              <p className="text-sm mt-1">Original battery replaced with new one with 3-year warranty.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full mr-3 mt-1">
              Regular Service
            </div>
            <div>
              <h3 className="font-medium text-sm">Routine Maintenance</h3>
              <p className="text-sm text-muted-foreground">May 22, 2022</p>
              <p className="text-sm mt-1">Standard service including oil change and filter replacement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarOverviewSection;
