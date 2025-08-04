
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

// Define the kilometers form schema
const kilometersSchema = z.object({
  kilometers: z.string()
    .refine(value => /^\d+$/.test(value), { message: "🛑 Enter only the numbers" })
    .refine(value => parseInt(value) >= 0, { message: "Kilometers cannot be negative" }),
});

interface KilometersInputProps {
  onSubmit: (data: z.infer<typeof kilometersSchema>) => void;
  onBack: () => void;
}

const KilometersInput: React.FC<KilometersInputProps> = ({ onSubmit, onBack }) => {
  // Kilometers form
  const form = useForm<z.infer<typeof kilometersSchema>>({
    resolver: zodResolver(kilometersSchema),
    defaultValues: {
      kilometers: "",
    },
  });

  const [isValid, setIsValid] = useState(false);

  // Monitor form validity
  useEffect(() => {
    const subscription = form.watch((value) => {
      const kilometers = value.kilometers;
      setIsValid(kilometers !== undefined && /^\d+$/.test(kilometers) && parseInt(kilometers) >= 0);
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
        <h3 className="text-xl font-medium">Kilometers Driven</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="kilometers"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="e.g. 25000" 
                    className="text-center text-lg h-12" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isValid && (
            <Button 
              type="submit" 
              className="w-full bg-primary text-white hover:bg-primary/90 h-12"
            >
              Next
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default KilometersInput;
