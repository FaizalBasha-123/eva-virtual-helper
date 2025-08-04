
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

const sellerDetailsSchema = z.object({
  seller_name: z.string().min(1, "Seller name is required"),
  seller_price: z.string().min(1, "Expected price is required"),
  phone_number: z.string().min(10, "Valid phone number is required"),
  number_of_owners: z.string().min(1, "Number of owners is required"),
});

interface SellerDetailsProps {
  onSubmit: (data: z.infer<typeof sellerDetailsSchema>) => void;
  onBack: () => void;
}

const SellerDetails: React.FC<SellerDetailsProps> = ({ onSubmit, onBack }) => {
  const form = useForm<z.infer<typeof sellerDetailsSchema>>({
    resolver: zodResolver(sellerDetailsSchema),
    defaultValues: {
      seller_name: "",
      seller_price: "",
      phone_number: "",
      number_of_owners: "",
    },
  });

  const [isValid, setIsValid] = useState(false);

  // Monitor form validity
  useEffect(() => {
    const subscription = form.watch((values) => {
      const isFormValid = Object.values(values).every(value => value && value.length > 0);
      setIsValid(isFormValid);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-0 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-xl font-medium">Seller Details</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="seller_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seller Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    className="h-12" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seller_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="Enter your expected price" 
                    className="h-12" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="Enter your phone number" 
                    className="h-12" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number_of_owners"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Owners</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select number of owners" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1st Owner</SelectItem>
                    <SelectItem value="2">2nd Owner</SelectItem>
                    <SelectItem value="3">3rd Owner</SelectItem>
                    <SelectItem value="4">4th Owner</SelectItem>
                    <SelectItem value="5+">5+ Owners</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isValid && (
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary/90 h-12"
            >
              Continue to Photo Upload
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default SellerDetails;
