
import React from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const BonusOfferBanner: React.FC = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary/90 to-primary rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <Gift className="w-10 h-10" />
            <div>
              <h3 className="text-2xl font-bold">Sell & Upgrade Bonus</h3>
              <p className="text-white/90 max-w-md">
                Get up to ₹2,000 extra when you sell your car and upgrade with us.
              </p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            variant="secondary" 
            className="font-semibold text-primary bg-white hover:bg-white/90"
          >
            Check Your Bonus
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BonusOfferBanner;
