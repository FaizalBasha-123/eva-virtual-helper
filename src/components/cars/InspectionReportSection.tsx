
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const InspectionReportSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Inspection Report</h2>
      <Separator className="mb-6" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Car Service History</h3>
              <p className="text-sm text-muted-foreground">Logged at authorized service center</p>
            </div>
            <div className="text-sm text-muted-foreground">
              19 March, 2023
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm mb-2">Service includes oil change, brake check, and full inspection.</p>
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Background Check</h3>
              <p className="text-sm text-muted-foreground">Verified vehicle history</p>
            </div>
            <div className="text-sm text-muted-foreground">
              15 January, 2023
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm mb-2">Complete history check including accidents and ownership.</p>
            <Button size="sm" variant="outline">View Report</Button>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">Chassis Check</h3>
              <p className="text-sm text-muted-foreground">Detailed inspection</p>
            </div>
            <div className="text-sm text-muted-foreground">
              5 October, 2022
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm mb-2">Verified chassis condition with no structural damage.</p>
            <Button size="sm" variant="outline">View Report</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionReportSection;
