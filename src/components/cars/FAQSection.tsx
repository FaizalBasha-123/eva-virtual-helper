
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { CarType } from '@/types/car';

interface FAQSectionProps {
  car: CarType;
}

const FAQSection = ({ car }: FAQSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
      <Separator className="mb-6" />
      <div className="space-y-4">
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-medium mb-2">How old is this car?</h3>
          <p className="text-sm text-muted-foreground">
            This car is {new Date().getFullYear() - car.year} years old, manufactured in {car.year}.
          </p>
        </div>
        
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-medium mb-2">Is this car under warranty?</h3>
          <p className="text-sm text-muted-foreground">
            Yes, this car comes with a manufacturer warranty valid until 2025.
          </p>
        </div>
        
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-medium mb-2">Can I arrange for a test drive?</h3>
          <p className="text-sm text-muted-foreground">
            Yes, you can schedule a test drive by contacting the seller using the contact details provided.
          </p>
        </div>
        
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-medium mb-2">What financing options are available?</h3>
          <p className="text-sm text-muted-foreground">
            We offer various financing options including bank loans and in-house financing. Use the EMI calculator to estimate your monthly payments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
