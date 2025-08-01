import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: number;
  name: string;
  photoUrl?: string;
  rating: number;
  text: string;
  role?: string; // Added role for the new reviews
}

const reviews: Review[] = [
  {
    id: 1,
    name: "User 1",
    photoUrl: "",
    rating: 5,
    text: "I found my dream car within a week of searching on VahaanXchange. The filters made it easy to narrow down exactly what I was looking for, and the seller was verified which gave me extra confidence.",
    role: "Car Buyer"
  },
  {
    id: 2,
    name: "User 2",
    photoUrl: "",
    rating: 5,
    text: "Selling my car on VahaanXchange was incredibly simple. I had multiple inquiries within days and sold for a great price. The platform made it easy to communicate with potential buyers.",
    role: "Car Seller"
  },
  {
    id: 3,
    name: "User 3",
    photoUrl: "",
    rating: 5,
    text: "As a small dealership, VahaanXchange has become an essential part of our business. The platform's reach and user-friendly interface has helped us connect with more customers than ever before.",
    role: "Car Dealer"
  }
];

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="pb-8">
      <h2 className="text-xl font-bold mb-4">What Our Users Say</h2>
      
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevReview}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 min-w-[4px] min-h-[4px]"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <button
          onClick={nextReview}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -mr-4 min-w-[4px] min-h-[4px]"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>

        {/* Review Card */}
        <div className="px-8">
          <Card className="w-full shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4 flex-shrink-0">
                  <AvatarImage src={reviews[currentIndex].photoUrl} alt="" />
                  <AvatarFallback>{reviews[currentIndex].name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="font-medium text-base truncate">{reviews[currentIndex].name}</span>
                  <p className="text-xs text-muted-foreground">{reviews[currentIndex].role}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < reviews[currentIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-base text-muted-foreground whitespace-normal break-words leading-relaxed">
                "{reviews[currentIndex].text}"
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              } min-w-[2px] min-h-[2px]`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
