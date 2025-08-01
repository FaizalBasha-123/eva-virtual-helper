
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const AppDownloadSection = () => {
  return (
    <Card className="w-full mb-8 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-medium mb-2">Get the VahaanXchange App</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download our app for a faster, more convenient way to buy and sell vehicles.
            </p>
            
            <div className="flex space-x-3 mb-4">
              <a href="#" className="block">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
                  alt="Get it on Google Play" 
                  className="h-10"
                />
              </a>
              <a href="#" className="block">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1200px-Download_on_the_App_Store_Badge.svg.png" 
                  alt="Download on App Store" 
                  className="h-10"
                />
              </a>
            </div>
            
            <div className="bg-secondary/50 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-gray-300 flex items-center justify-center rounded">
                  <span className="text-xs text-muted-foreground">QR Code</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Scan to Download</h4>
                <p className="text-xs text-muted-foreground">
                  Scan this QR code with your phone camera to download our app.
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block w-full md:w-1/2">
            <AspectRatio ratio={9/16} className="w-40 mx-auto">
              <img 
                src="https://placehold.co/400x800/2222/eee?text=App+Preview" 
                alt="App Preview" 
                className="object-cover rounded-xl shadow-lg"
              />
            </AspectRatio>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppDownloadSection;
