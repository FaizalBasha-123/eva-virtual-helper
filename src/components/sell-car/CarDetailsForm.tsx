
import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Car, Calendar, MapPin, Image, KeyRound, Bike } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const formSchema = z.object({
  licensePlate: z.string().min(4, "License plate must be at least 4 characters"),
  make: z.string().min(2, "Please select a car make"),
  model: z.string().min(2, "Please select a car model"),
  year: z.string().min(4, "Please enter a valid year"),
  mileage: z.string().min(1, "Please enter your car's mileage"),
  city: z.string().min(2, "Please enter your city"),
});

const CarDetailsForm = () => {
  const [step, setStep] = useState(1);
  const [estimatedValue, setEstimatedValue] = useState("₹0");
  const [vehicleType, setVehicleType] = useState("car");
  const [entryMethod, setEntryMethod] = useState("licensePlate");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licensePlate: "",
      make: "",
      model: "",
      year: "",
      mileage: "",
      city: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // In a real app, you would send this data to your backend
    setEstimatedValue("₹4,75,000");
    setStep(step + 1);
  };

  // Simulate fetching car details from license plate
  const detectCarFromLicense = () => {
    if (form.getValues("licensePlate").length >= 4) {
      setTimeout(() => {
        form.setValue("make", "Maruti Suzuki");
        form.setValue("model", "Swift");
        form.setValue("year", "2019");
        // Update estimated value based on the detected car
        setEstimatedValue("₹4,75,000");
      }, 800);
    }
  };

  const handleVehicleTypeChange = (value: string) => {
    if (value) setVehicleType(value);
  };

  return (
    <section id="car-details-form" className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-2">Tell Us About Your Vehicle</h2>
          
          
          {/* Vehicle Type Toggle */}
          <div className="flex justify-center mb-10">
            <ToggleGroup 
              type="single" 
              value={vehicleType}
              onValueChange={handleVehicleTypeChange}
              className="border rounded-md"
            >
              <ToggleGroupItem 
                value="car" 
                className={`flex-1 px-8 py-2 rounded-l-md transition-all duration-300 ease-in-out ${
                  vehicleType === "car" ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-800"
                }`}
              >
                <Car className="h-5 w-5 mr-2" />
                Car
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="bike" 
                className={`flex-1 px-8 py-2 rounded-r-md transition-all duration-300 ease-in-out ${
                  vehicleType === "bike" ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-800"
                }`}
              >
                <Bike className="h-5 w-5 mr-2" />
                Bike
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </motion.div>

        {vehicleType === "car" && (
          <>
            {/* License Plate Method Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex text-center mt-4 items-center gap-2">
                    Enter Your Car Registration Number
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="licensePlate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="e.g., MH02AB1234" 
                                  className="bg-background/60 backdrop-blur-sm" 
                                  {...field}
                                  onBlur={detectCarFromLicense}
                                />
                                <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter your license plate for auto-detection
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col text-center mb-4 justify-between items-center bg-primary/5 p-4 rounded-lg">
                        <Button 
                          type="button" 
                          onClick={form.handleSubmit(onSubmit)}
                          className="w-full md:w-auto hover-scale"
                        >
                          Start Selling
                        </Button>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* OR Separator */}
            <div className="flex items-center justify-center my-6">
                <Separator className="w-1/3" />
                <span className="mx-4 font-bold text-lg text-neutral-700 dark:text-neutral-200">OR</span>
                <Separator className="w-1/3" />
            </div>


            {/* Manual Entry Method Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Enter your Car Details
                  </CardTitle>
                  <CardDescription>
                    Enter your car's details manually for a personalized valuation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="make"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Car Make</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Maruti Suzuki" className="bg-background/60 backdrop-blur-sm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Car Model</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Swift" className="bg-background/60 backdrop-blur-sm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manufacturing Year</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="e.g., 2019" 
                                    className="bg-background/60 backdrop-blur-sm" 
                                    {...field}
                                  />
                                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="mileage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mileage (KM)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., 45000" 
                                  className="bg-background/60 backdrop-blur-sm" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="e.g., Mumbai" 
                                    className="bg-background/60 backdrop-blur-sm" 
                                    {...field}
                                  />
                                  <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex flex-col justify-between text-center items-center bg-primary/5 p-4 rounded-lg">
                        <Button type="submit" className="w-full md:w-auto hover-scale">
                          Start Selling
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col text-center text-sm text-muted-foreground">
                  <p>Sell Your Car Effortlessly...</p>
                </CardFooter>
              </Card>
            </motion.div>
          </>
        )}

        {/* For Bikes */}
        {vehicleType === "bike" && (
      <>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
        <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex text-center mt-4 items-center gap-2">
                    Enter Your Bike Registration Number
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="licensePlate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="e.g., MH02AB1234" 
                                  className="bg-background/60 backdrop-blur-sm" 
                                  {...field}
                                  onBlur={detectCarFromLicense}
                                />
                                <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter your license plate for auto-detection
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col text-center mb-4 justify-between items-center bg-primary/5 p-4 rounded-lg">
                        <Button 
                          type="button" 
                          onClick={form.handleSubmit(onSubmit)}
                          className="w-full md:w-auto hover-scale"
                        >
                          Start Selling
                        </Button>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* OR Separator */}
            <div className="flex items-center justify-center my-6">
                <Separator className="w-1/3" />
                <span className="mx-4 font-bold text-lg text-neutral-700 dark:text-neutral-200">OR</span>
                <Separator className="w-1/3" />
            </div>

        {/* Manual Entry Method Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bike className="h-5 w-5 text-primary" />
                  Bike Details
                </CardTitle>
                <CardDescription>
                  Enter your bike details to get an accurate valuation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Placeholder for bike form fields - these would be properly connected in a real implementation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bike Make</label>
                      <Input placeholder="e.g., Honda" className="bg-background/60 backdrop-blur-sm" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bike Model</label>
                      <Input placeholder="e.g., CB Shine" className="bg-background/60 backdrop-blur-sm" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Manufacturing Year</label>
                      <div className="relative">
                        <Input placeholder="e.g., 2019" className="bg-background/60 backdrop-blur-sm" />
                        <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mileage (KM)</label>
                      <Input placeholder="e.g., 25000" className="bg-background/60 backdrop-blur-sm" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <div className="relative">
                        <Input placeholder="e.g., Mumbai" className="bg-background/60 backdrop-blur-sm" />
                        <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between text-center items-center bg-primary/5 p-4 rounded-lg">
                    <Button className="w-full md:w-auto hover-scale">
                      Start Selling
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col text-center text-sm text-muted-foreground">
                <p>Sell your car Effortless...</p>
              </CardFooter>
            </Card>
          </motion.div> 
        </>
        )}
      </div>
    </section>
  );
};

export default CarDetailsForm;
