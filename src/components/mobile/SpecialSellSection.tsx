import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Clock, DollarSign } from "lucide-react";

const SpecialSellSection = () => {
  const [activeTab, setActiveTab] = useState("others");

  return (
    <Card className="w-full mb-8 shadow-sm overflow-hidden">
      <CardHeader className="p-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <Tabs defaultValue="others" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto rounded-none">
            <TabsTrigger 
              value="others" 
              className={`py-3 ${
                activeTab === "others" 
                  ? "bg-white dark:bg-gray-800 border-b-2 border-primary shadow-sm" 
                  : "bg-transparent"
              }`}
            >
              Others Platforms
            </TabsTrigger>
            <TabsTrigger 
              value="us" 
              className={`py-3 ${
                activeTab === "us" 
                  ? "bg-white dark:bg-gray-800 border-b-2 border-primary shadow-sm" 
                  : "bg-transparent"
              }`}
            >
              Vahaanxchange
            </TabsTrigger>
          </TabsList>

          <TabsContent value="others" className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Commission Eats Profit</h3>
                  <p className="text-xs text-muted-foreground">
                    Brokers, agents, or platform commission eat into your profit
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Interference in Deals</h3>
                  <p className="text-xs text-muted-foreground">
                    Platform or agents often interfere in final deal
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Dependent on Approval</h3>
                  <p className="text-xs text-muted-foreground">
                    Dependent on platform approval or 3rd-party mediation
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="us" className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Zero Commission</h3>
                  <p className="text-xs text-muted-foreground">
                    Zero brokerage, zero commission – 100% direct deal
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Direct Negotiation</h3>
                  <p className="text-xs text-muted-foreground">
                    Direct negotiation between buyer & seller
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Full Control</h3>
                  <p className="text-xs text-muted-foreground">
                    Full control – meet, negotiate, finalize
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default SpecialSellSection;
