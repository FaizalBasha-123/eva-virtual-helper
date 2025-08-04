import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

// FAQ Data
const faqData = [
  {
    question: "How long does the car selling process take?",
    answer: "The entire process typically takes 2-3 days from getting a quote to receiving payment. Once you accept our offer, we handle all the paperwork and can complete the transaction in as little as 24 hours."
  },
  {
    question: "How is my car's value determined?",
    answer: "Our AI-powered pricing engine analyzes several factors including your car's make, model, year, condition, mileage, service history, and current market demand to provide an accurate valuation."
  },
  {
    question: "Do I need to have all my car documents ready?",
    answer: "Yes, you'll need your car's registration certificate, insurance papers, service records, and valid ID proof. Having all documents ready helps speed up the process and may positively impact your car's valuation."
  },
  {
    question: "Can I sell my car if it has an existing loan?",
    answer: "Yes, you can sell a car with an existing loan. We'll help you clear the loan and pay you the remaining amount after deducting the outstanding loan balance."
  },
  {
    question: "Is there any fee for using your service?",
    answer: "No, our service is completely free for car sellers. We make our commission from the buyers in our network, not from you."
  }
];

// Testimonial Data
const testimonials = [
  {
    name: "User 1",
    location: "Mumbai",
    avatar: "",
    rating: 5,
    comment: "I was surprised at how quick and easy the process was. Got a fair price for my Maruti Swift and the payment was processed within 24 hours!",
  },
  {
    name: "User 2",
    location: "Delhi",
    avatar: "",
    rating: 5,
    comment: "As a first-time car seller, I was nervous about the process. The team guided me through every step and made it completely hassle-free.",
  },
  {
    name: "User 3",
    location: "Bangalore",
    avatar: "",
    rating: 4,
    comment: "The price estimator was spot on! I got almost exactly what was quoted initially, and the entire process was transparent and professional.",
  },
  {
    name: "User 4",
    location: "Hyderabad",
    avatar: "",
    rating: 5,
    comment: "After trying to sell my Honda City on my own for weeks, I used this service and sold it in just 2 days. Highly recommended!",
  },
];

const ActionSection = () => {
  const [showMore, setShowMore] = useState(false);
  
  // Render star ratings
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-t from-background/70 to-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-2">Ready to Sell Your Car?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have sold their cars with us
          </p>
        </motion.div>

        {/* Customer Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">What Our Customers Say</h3>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="bg-card p-6 rounded-xl border border-border/40 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>{`U${index + 1}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-muted-foreground flex-grow">{testimonial.comment}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-semibold mb-8 text-center">Frequently Asked Questions</h3>
          
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {faqData.slice(0, showMore ? faqData.length : 3).map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {faqData.length > 3 && (
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Show Less" : "Show More FAQs"}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-xl border border-primary/20"
        >
          <h3 className="text-2xl font-semibold mb-4">Get Your Instant Car Valuation Today</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fill in your car details and get an instant quote. Our process is quick, transparent, and hassle-free.
          </p>
          <Button 
            size="lg" 
            className="animated-card text-lg py-6 px-10 font-semibold"
            onClick={() => {
              const formElement = document.getElementById("car-details-form");
              if (formElement) {
                formElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Sell Your Car Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ActionSection;
