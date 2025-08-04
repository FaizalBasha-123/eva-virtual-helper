
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

// Define the registration form schema
const registrationSchema = z.object({
  registrationNumber: z.string().min(1, { message: "Registration number is required" }),
});

interface RegistrationFormProps {
  vehicleType: "car" | "bike";
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ vehicleType }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Registration form
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      registrationNumber: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof registrationSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Registration submitted:", data);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-left">
        Enter your {vehicleType} registration number
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex items-center space-x-4">
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormControl>
                    <Input 
                      placeholder={`e.g. KA 01 AB 1234`}
                      className="text-left text-lg h-12"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    Enter your license plate for auto-detection
                  </p>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="bg-primary text-white hover:bg-primary/90 h-12 text-lg whitespace-nowrap self-start"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Sell my ${vehicleType}`}
              {isSuccess && <Check className="ml-2" size={16} />}
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Success Message */}
      {isSuccess && (
        <div className="text-left text-sm text-green-600 mt-2 bg-white animate-fade-in">
          Please Enter Manually, we are working on this.
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
