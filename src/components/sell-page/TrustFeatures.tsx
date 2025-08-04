
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, Zap, Shield } from "lucide-react";

const TrustFeatures: React.FC = () => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white/90 dark:bg-black/80 shadow-md">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <IndianRupee className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">Instant Price Quote</h3>
          <p className="text-sm text-muted-foreground">
            Our AI-powered pricing engine analyzes market data to give you the best possible price for your car instantly.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/90 dark:bg-black/80 shadow-md">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Zap className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">Hassle-Free Process</h3>
          <p className="text-sm text-muted-foreground">
            Sell your car in just 3 simple steps. No more endless negotiations or paperwork nightmares.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/90 dark:bg-black/80 shadow-md">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">100% Trusted & Secure</h3>
          <p className="text-sm text-muted-foreground">
            All our buyers are verified, and our secure transaction process ensures your safety and peace of mind.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustFeatures;
