
import React from "react";
import Layout from "../components/layout/Layout";
import { Bot, Mic, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const suggestionButtons = [
  { id: 1, text: "Cars under ₹10L" },
  { id: 2, text: "Best EV Cars" },
  { id: 3, text: "Compare SUVs" },
  { id: 4, text: "Fuel-efficient Sedans" },
  { id: 5, text: "Bike recommendations" },
];

const AI = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center py-20">
        <div className="max-w-3xl w-full">
          <div className="mb-8 mt-4 flex flex-col items-center">
            <h1 className="text-3xl mb-4">What can I help with?</h1>
            <p className="text-lg text-muted-foreground">
              Your AI car expert is here – ask away!
            </p>
          </div>

          <div className="relative mb-8">
            <Input 
              type="text"
              placeholder="Ask me anything about vehicles..."
              className="pr-12 py-6 text-lg glass-input"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-[#2E5BFF]"
            >
              <Mic size={20} />
            </Button>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-medium mb-4">Try asking</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestionButtons.map((button) => (
                <Button
                  key={button.id}
                  variant="outline"
                  className="rounded-full border-[#2E5BFF]/30 hover:bg-[#2E5BFF]/10 hover:text-[#2E5BFF] hover:border-[#2E5BFF]"
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">Can't find what you're looking for?</h3>
              <p className="text-muted-foreground">
                Browse our extensive catalog of cars and bikes
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-[#2E5BFF] text-white hover:bg-blue-700 h-10 px-4 py-2 transition-colors"
            >
              View all listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AI;
