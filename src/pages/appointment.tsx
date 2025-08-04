import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import ProgressBar from "@/components/appointment/ProgressBar";
import Pricing from "@/components/appointment/Pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, AlertCircle, CheckCircle, MapPin, Upload } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// API key stored in a constant
const OPENCAGE_API_KEY = "9de658a249b54e55a10ea5310398f9b4";

// Define step types for new 2-step flow
type AppointmentStep = 1 | 2;
type StepData = Record<string, any>;

const Appointment: React.FC = () => {
  // Auth state
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(1);
  const [stepData, setStepData] = useState<Record<number, StepData>>({});
  const [isElectric, setIsElectric] = useState<boolean>(false);
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vehicleType, setVehicleType] = useState<"car" | "bike">(
    (localStorage.getItem("vehicle") as "car" | "bike") || "car"
  );

  const [agreements, setAgreements] = useState({
    termsAndCondition: false,
    privacyPolicy: false,
    RequiredDocuments: false,
  });

  // Get vehicle type from localStorage on component mount
  useEffect(() => {
    const storedVehicleType = localStorage.getItem("vehicle");
    if (storedVehicleType === "car" || storedVehicleType === "bike") {
      setVehicleType(storedVehicleType);
    }
    
    // Load previously saved step data from localStorage
    for (let i = 1; i <= 6; i++) {
      const data = localStorage.getItem(`appointment_step${i}_data`);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setStepData(prev => ({...prev, [i-1]: parsedData}));
          
          // Check if the vehicle is electric
          if (i === 2 && parsedData.fuel_type === "Electric") {
            setIsElectric(true);
          }
        } catch (error) {
          console.error(`Error parsing step ${i} data:`, error);
        }
      }
    }
  }, []);
  
  const steps = [
    "Optional Details",
    "Payment Page"
  ];
  
  const handleBack = () => {
    if (currentStep === 1) {
      // Go back to the previous page in browser history
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        // Fallback to /sell if no previous page
        navigate("/");
      }
    } else {
      setCurrentStep(1);
    }
  };
  
  const handleNext = () => {
    if (validateCurrentStep()) {
      saveCurrentStepData();
      setCurrentStep(2);
    }
  };

  const handleSkip = () => {
    // Save any entered data before skipping
    saveCurrentStepData();
    setCurrentStep(2);
  };

  // Get data from localStorage for components
  const getExpectedPrice = () => {
    return localStorage.getItem("seller_price") || localStorage.getItem("expected_price") || "0";
  };

  const getSelectedFeatures = () => {
    try {
      const features = localStorage.getItem("key_features");
      return features ? JSON.parse(features) : [];
    } catch {
      return [];
    }
  };
  
  const validateCurrentStep = (): boolean => {
    // Add validation for Step 2 (Payment Page)
    if (currentStep === 2) {
      const currentFormData = stepData[5] || {};
      
      // Validate Aadhaar (must be exactly 16 digits)
      if (currentFormData.aadhaar_number && !/^\d{16}$/.test(currentFormData.aadhaar_number)) {
        toast.error("Aadhaar number must be exactly 16 digits");
        return false;
      }
    }
    
    return true;
  };
  
  const saveCurrentStepData = () => {
    // Save data for each section to their respective localStorage keys
    if (stepData[0]) {
      localStorage.setItem('appointment_step1_data', JSON.stringify(stepData[0]));
    }
    if (stepData[1]) {
      localStorage.setItem('appointment_step2_data', JSON.stringify(stepData[1]));
    }
    if (stepData[2]) {
      localStorage.setItem('appointment_step3_data', JSON.stringify(stepData[2]));
    }
    if (stepData[4]) {
      localStorage.setItem('appointment_step5_data', JSON.stringify(stepData[4]));
    }
    if (stepData[5]) {
      localStorage.setItem('appointment_step6_data', JSON.stringify(stepData[5]));
    }
  };
  
  const updateStepData = (stepIndex: number, data: StepData) => {
    setStepData(prev => ({...prev, [stepIndex]: {...(prev[stepIndex] || {}), ...data}}));
  };
  
  const handleInputChange = (stepIndex: number, field: string, value: any) => {
    updateStepData(stepIndex, {[field]: value});
  };

  // Function to fetch location using OpenCage Geocoder API
  const fetchLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error("Failed to fetch location details");
          }
          
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const locationData = data.results[0];
            setLocationDetails(locationData);
            
            // Save location data to stepData
            updateStepData(5, {
              live_location: {
                latitude,
                longitude,
                formatted_address: locationData.formatted,
                components: locationData.components
              }
            });
            
            toast.success("Location verified successfully!");
          } else {
            toast.error("Could not determine your location");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Failed to fetch location details");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get your location. Please check your browser permissions.");
        setIsLoading(false);
      }
    );
  };
  
  const renderOptionalDetails = () => {
    const step1Data = stepData[0] || {};
    const step2Data = stepData[1] || {};
    const step3Data = stepData[2] || {};
    const step5Data = stepData[4] || {};
    const isBike = vehicleType === "bike";
    
    return (
      <div className="space-y-8">
        {/* Basic Vehicle Info Section */}
        <div className="space-y-6 px-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Basic Vehicle Information</h3>
            {currentStep === 1 && (
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="flex items-center bg-primary gap-2"
              >
                Skip
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Registration Number 
              </label>
              <Input 
                value={step1Data.registration_number || ""}
                onChange={(e) => handleInputChange(0, "registration_number", e.target.value)}
                placeholder="eg, AY 4564"
              />
            </div>
            
            <div>
            <label className="block text-sm font-medium mb-1">
              RTO 
            </label>
            <div className="flex gap-2">
              <Select 
                value={step1Data.rto_state || ""}
                onValueChange={(value) => handleInputChange(0,"rto_state", value)}
                aria-label="Select State"
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delhi">DL-Delhi</SelectItem>
                  <SelectItem value="Maharashtra">MH-Maharashtra</SelectItem>
                  <SelectItem value="Uttar Pradesh">UP-Uttar Pradesh</SelectItem>
                  <SelectItem value="Haryana">HR-Haryana</SelectItem>
                  <SelectItem value="Karnataka">KA-Karnataka</SelectItem>
                  <SelectItem value="Gujarat">GJ-Gujarat</SelectItem>
                  <SelectItem value="Tamil Nadu">TN-Tamil Nadu</SelectItem>
                  <SelectItem value="Rajasthan">RJ-Rajasthan</SelectItem>
                  <SelectItem value="Kerala">KL-Kerala</SelectItem>
                  <SelectItem value="Madhya Pradesh">MP-Madhya Pradesh</SelectItem>
                  <SelectItem value="Andhra Pradesh">AP-Andhra Pradesh</SelectItem>
                  <SelectItem value="Telangana">TS-Telangana</SelectItem>
                  <SelectItem value="Bihar">BR-Bihar</SelectItem>
                  <SelectItem value="Punjab">PB-Punjab</SelectItem>
                  <SelectItem value="West Bengal">WB-West Bengal</SelectItem>
                  <SelectItem value="Jharkhand">JH-Jharkhand</SelectItem>
                  <SelectItem value="Uttarakhand">UK-Uttarakhand</SelectItem>
                  <SelectItem value="Chandigarh">CH-Chandigarh</SelectItem>
                  <SelectItem value="Assam">AS-Assam</SelectItem>
                  <SelectItem value="Jammu & Kashmir">JK-Jammu & Kashmir</SelectItem>
                  <SelectItem value="Chhattisgarh">CG-Chhattisgarh</SelectItem>
                  <SelectItem value="Himachal Pradesh">HP-Himachal Pradesh</SelectItem>
                  <SelectItem value="Mizoram">MZ-Mizoram</SelectItem>
                  <SelectItem value="Goa">GA-Goa</SelectItem>
                  <SelectItem value="Nagaland">NL-Nagaland</SelectItem>
                  <SelectItem value="Odisha">OD-Odisha</SelectItem>
                  <SelectItem value="Sikkim">SK-Sikkim</SelectItem>
                  <SelectItem value="Puducherry">PY-Puducherry</SelectItem>
                  <SelectItem value="Meghalaya">ML-Meghalaya</SelectItem>
                  <SelectItem value="Dadra and Nagar Haveli">DN-Dadra and Nagar Haveli</SelectItem>
                  <SelectItem value="Daman and Diu">DD-Daman and Diu</SelectItem>
                  <SelectItem value="Arunachal Pradesh">AR-Arunachal Pradesh</SelectItem>
                  <SelectItem value="Tripura">TR-Tripura</SelectItem>
                  <SelectItem value="Manipur">MN-Manipur</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={step1Data.rto || ""}
                onValueChange={(value) => handleInputChange(0, "rto", value)}
                disabled={!step1Data.rto_state}
                aria-label="Select RTO"
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select RTO" />
                </SelectTrigger>
                <SelectContent>
                  {step1Data.rto_state === "Delhi" && (
                    <>
                      <SelectItem value="DL-05">DL-05</SelectItem>
                      <SelectItem value="DL-09">DL-09</SelectItem>
                      <SelectItem value="DL-15">DL-15</SelectItem>
                      <SelectItem value="DL-16">DL-16</SelectItem>
                      <SelectItem value="DL-17">DL-17</SelectItem>
                      <SelectItem value="DL-18">DL-18</SelectItem>
                      <SelectItem value="DL-51">DL-51</SelectItem>
                    </>
                  )}
                  
                  {step1Data.rto_state === "Maharashtra" && (
                    <>
                      <SelectItem value="MH-07">MH-07</SelectItem>
                      <SelectItem value="MH-22">MH-22</SelectItem>
                      <SelectItem value="MH-25">MH-25</SelectItem>
                      <SelectItem value="MH-28">MH-28</SelectItem>
                      <SelectItem value="MH-33">MH-33</SelectItem>
                      <SelectItem value="MH-35">MH-35</SelectItem>
                      <SelectItem value="MH-36">MH-36</SelectItem>
                      <SelectItem value="MH-37">MH-37</SelectItem>
                      <SelectItem value="MH-38">MH-38</SelectItem>
                      <SelectItem value="MH-39">MH-39</SelectItem>
                      <SelectItem value="MH-44">MH-44</SelectItem>
                      <SelectItem value="MH-45">MH-45</SelectItem>
                      <SelectItem value="MH-50">MH-50</SelectItem>
                      <SelectItem value="MH-51">MH-51</SelectItem>
                      <SelectItem value="MH-52">MH-52</SelectItem>
                      <SelectItem value="MH-99">MH-99</SelectItem>
                    </>
                  )}
                  
                  {step1Data.rto_state === "Uttar Pradesh" && (
                    <>
                      <SelectItem value="UP-01">UP-01</SelectItem>
                      <SelectItem value="UP-03">UP-03</SelectItem>
                      <SelectItem value="UP-04">UP-04</SelectItem>
                      <SelectItem value="UP-05">UP-05</SelectItem>
                      <SelectItem value="UP-06">UP-06</SelectItem>
                      <SelectItem value="UP-08">UP-08</SelectItem>
                      <SelectItem value="UP-09">UP-09</SelectItem>
                      <SelectItem value="UP-10">UP-10</SelectItem>
                      <SelectItem value="UP-17">UP-17</SelectItem>
                      <SelectItem value="UP-18">UP-18</SelectItem>
                      <SelectItem value="UP-19">UP-19</SelectItem>
                      <SelectItem value="UP-20">UP-20</SelectItem>
                      <SelectItem value="UP-22">UP-22</SelectItem>
                      <SelectItem value="UP-23">UP-23</SelectItem>
                      <SelectItem value="UP-24">UP-24</SelectItem>
                      <SelectItem value="UP-26">UP-26</SelectItem>
                      <SelectItem value="UP-27">UP-27</SelectItem>
                      <SelectItem value="UP-28">UP-28</SelectItem>
                      <SelectItem value="UP-30">UP-30</SelectItem>
                      <SelectItem value="UP-31">UP-31</SelectItem>
                      <SelectItem value="UP-34">UP-34</SelectItem>
                      <SelectItem value="UP-38">UP-38</SelectItem>
                      <SelectItem value="UP-40">UP-40</SelectItem>
                      <SelectItem value="UP-41">UP-41</SelectItem>
                      <SelectItem value="UP-42">UP-42</SelectItem>
                      <SelectItem value="UP-43">UP-43</SelectItem>
                      <SelectItem value="UP-44">UP-44</SelectItem>
                      <SelectItem value="UP-45">UP-45</SelectItem>
                      <SelectItem value="UP-46">UP-46</SelectItem>
                      <SelectItem value="UP-47">UP-47</SelectItem>
                      <SelectItem value="UP-50">UP-50</SelectItem>
                      <SelectItem value="UP-51">UP-51</SelectItem>
                      <SelectItem value="UP-52">UP-52</SelectItem>
                      <SelectItem value="UP-54">UP-54</SelectItem>
                      <SelectItem value="UP-55">UP-55</SelectItem>
                      <SelectItem value="UP-56">UP-56</SelectItem>
                      <SelectItem value="UP-57">UP-57</SelectItem>
                      <SelectItem value="UP-58">UP-58</SelectItem>
                      <SelectItem value="UP-60">UP-60</SelectItem>
                      <SelectItem value="UP-61">UP-61</SelectItem>
                      <SelectItem value="UP-62">UP-62</SelectItem>
                      <SelectItem value="UP-63">UP-63</SelectItem>
                      <SelectItem value="UP-64">UP-64</SelectItem>
                      <SelectItem value="UP-66">UP-66</SelectItem>
                      <SelectItem value="UP-67">UP-67</SelectItem>
                      <SelectItem value="UP-71">UP-71</SelectItem>
                      <SelectItem value="UP-72">UP-72</SelectItem>
                      <SelectItem value="UP-73">UP-73</SelectItem>
                      <SelectItem value="UP-74">UP-74</SelectItem>
                      <SelectItem value="UP-75">UP-75</SelectItem>
                      <SelectItem value="UP-76">UP-76</SelectItem>
                      <SelectItem value="UP-77">UP-77</SelectItem>
                      <SelectItem value="UP-79">UP-79</SelectItem>
                      <SelectItem value="UP-82">UP-82</SelectItem>
                      <SelectItem value="UP-84">UP-84</SelectItem>
                      <SelectItem value="UP-86">UP-86</SelectItem>
                      <SelectItem value="UP-87">UP-87</SelectItem>
                      <SelectItem value="UP-90">UP-90</SelectItem>
                      <SelectItem value="UP-91">UP-91</SelectItem>
                      <SelectItem value="UP-92">UP-92</SelectItem>
                      <SelectItem value="UP-94">UP-94</SelectItem>
                      <SelectItem value="UP-95">UP-95</SelectItem>
                      <SelectItem value="UP-96">UP-96</SelectItem>
                    </>
                  )}
                  
                  {step1Data.rto_state === "Haryana" && (
                    <>
                      <SelectItem value="HR-04">HR-04</SelectItem>
                      <SelectItem value="HR-09">HR-09</SelectItem>
                      <SelectItem value="HR-15">HR-15</SelectItem>
                      <SelectItem value="HR-17">HR-17</SelectItem>
                      <SelectItem value="HR-18">HR-18</SelectItem>
                      <SelectItem value="HR-23">HR-23</SelectItem>
                      <SelectItem value="HR-25">HR-25</SelectItem>
                      <SelectItem value="HR-28">HR-28</SelectItem>
                      <SelectItem value="HR-32">HR-32</SelectItem>
                      <SelectItem value="HR-33">HR-33</SelectItem>
                      <SelectItem value="HR-34">HR-34</SelectItem>
                      <SelectItem value="HR-37">HR-37</SelectItem>
                      <SelectItem value="HR-39">HR-39</SelectItem>
                      <SelectItem value="HR-40">HR-40</SelectItem>
                      <SelectItem value="HR-41">HR-41</SelectItem>
                      <SelectItem value="HR-43">HR-43</SelectItem>
                      <SelectItem value="HR-44">HR-44</SelectItem>
                      <SelectItem value="HR-45">HR-45</SelectItem>
                      <SelectItem value="HR-46">HR-46</SelectItem>
                      <SelectItem value="HR-47">HR-47</SelectItem>
                      <SelectItem value="HR-48">HR-48</SelectItem>
                      <SelectItem value="HR-49">HR-49</SelectItem>
                      <SelectItem value="HR-52">HR-52</SelectItem>
                      <SelectItem value="HR-53">HR-53</SelectItem>
                      <SelectItem value="HR-54">HR-54</SelectItem>
                      <SelectItem value="HR-56">HR-56</SelectItem>
                      <SelectItem value="HR-57">HR-57</SelectItem>
                      <SelectItem value="HR-58">HR-58</SelectItem>
                      <SelectItem value="HR-59">HR-59</SelectItem>
                      <SelectItem value="HR-61">HR-61</SelectItem>
                      <SelectItem value="HR-62">HR-62</SelectItem>
                      <SelectItem value="HR-63">HR-63</SelectItem>
                      <SelectItem value="HR-64">HR-64</SelectItem>
                      <SelectItem value="HR-65">HR-65</SelectItem>
                      <SelectItem value="HR-66">HR-66</SelectItem>
                      <SelectItem value="HR-67">HR-67</SelectItem>
                      <SelectItem value="HR-68">HR-68</SelectItem>
                      <SelectItem value="HR-71">HR-71</SelectItem>
                      <SelectItem value="HR-73">HR-73</SelectItem>
                      <SelectItem value="HR-74">HR-74</SelectItem>
                      <SelectItem value="HR-75">HR-75</SelectItem>
                      <SelectItem value="HR-77">HR-77</SelectItem>
                      <SelectItem value="HR-78">HR-78</SelectItem>
                      <SelectItem value="HR-79">HR-79</SelectItem>
                      <SelectItem value="HR-80">HR-80</SelectItem>
                      <SelectItem value="HR-81">HR-81</SelectItem>
                      <SelectItem value="HR-82">HR-82</SelectItem>
                      <SelectItem value="HR-83">HR-83</SelectItem>
                      <SelectItem value="HR-84">HR-84</SelectItem>
                      <SelectItem value="HR-85">HR-85</SelectItem>
                      <SelectItem value="HR-86">HR-86</SelectItem>
                      <SelectItem value="HR-87">HR-87</SelectItem>
                      <SelectItem value="HR-88">HR-88</SelectItem>
                      <SelectItem value="HR-89">HR-89</SelectItem>
                      <SelectItem value="HR-90">HR-90</SelectItem>
                      <SelectItem value="HR-91">HR-91</SelectItem>
                      <SelectItem value="HR-92">HR-92</SelectItem>
                      <SelectItem value="HR-93">HR-93</SelectItem>
                      <SelectItem value="HR-94">HR-94</SelectItem>
                      <SelectItem value="HR-95">HR-95</SelectItem>
                      <SelectItem value="HR-96">HR-96</SelectItem>
                      <SelectItem value="HR-97">HR-97</SelectItem>
                      <SelectItem value="HR-98">HR-98</SelectItem>
                      <SelectItem value="HR-99">HR-99</SelectItem>
                    </>
                  )}
                  
                  {step1Data.rto_state === "Karnataka" && (
                    <>
                      <SelectItem value="KA-07">KA-07</SelectItem>
                      <SelectItem value="KA-08">KA-08</SelectItem>
                      <SelectItem value="KA-10">KA-10</SelectItem>
                      <SelectItem value="KA-11">KA-11</SelectItem>
                      <SelectItem value="KA-13">KA-13</SelectItem>
                      <SelectItem value="KA-14">KA-14</SelectItem>
                      <SelectItem value="KA-15">KA-15</SelectItem>
                      <SelectItem value="KA-16">KA-16</SelectItem>
                      <SelectItem value="KA-18">KA-18</SelectItem>
                      <SelectItem value="KA-21">KA-21</SelectItem>
                      <SelectItem value="KA-23">KA-23</SelectItem>
                      <SelectItem value="KA-24">KA-24</SelectItem>
                      <SelectItem value="KA-26">KA-26</SelectItem>
                      <SelectItem value="KA-27">KA-27</SelectItem>
                      <SelectItem value="KA-28">KA-28</SelectItem>
                      <SelectItem value="KA-29">KA-29</SelectItem>
                      <SelectItem value="KA-30">KA-30</SelectItem>
                      <SelectItem value="KA-31">KA-31</SelectItem>
                      <SelectItem value="KA-32">KA-32</SelectItem>
                      <SelectItem value="KA-33">KA-33</SelectItem>
                      <SelectItem value="KA-34">KA-34</SelectItem>
                      <SelectItem value="KA-35">KA-35</SelectItem>
                      <SelectItem value="KA-36">KA-36</SelectItem>
                      <SelectItem value="KA-37">KA-37</SelectItem>
                      <SelectItem value="KA-38">KA-38</SelectItem>
                      <SelectItem value="KA-39">KA-39</SelectItem>
                      <SelectItem value="KA-40">KA-40</SelectItem>
                      <SelectItem value="KA-42">KA-42</SelectItem>
                      <SelectItem value="KA-43">KA-43</SelectItem>
                      <SelectItem value="KA-44">KA-44</SelectItem>
                      <SelectItem value="KA-45">KA-45</SelectItem>
                      <SelectItem value="KA-46">KA-46</SelectItem>
                      <SelectItem value="KA-47">KA-47</SelectItem>
                      <SelectItem value="KA-48">KA-48</SelectItem>
                      <SelectItem value="KA-49">KA-49</SelectItem>
                      <SelectItem value="KA-52">KA-52</SelectItem>
                      <SelectItem value="KA-54">KA-54</SelectItem>
                      <SelectItem value="KA-56">KA-56</SelectItem>
                      <SelectItem value="KA-59">KA-59</SelectItem>
                      <SelectItem value="KA-61">KA-61</SelectItem>
                      <SelectItem value="KA-62">KA-62</SelectItem>
                      <SelectItem value="KA-64">KA-64</SelectItem>
                      <SelectItem value="KA-65">KA-65</SelectItem>
                      <SelectItem value="KA-66">KA-66</SelectItem>
                      <SelectItem value="KA-67">KA-67</SelectItem>
                      <SelectItem value="KA-68">KA-68</SelectItem>
                      <SelectItem value="KA-69">KA-69</SelectItem>
                      <SelectItem value="KA-70">KA-70</SelectItem>
                      <SelectItem value="KA-71">KA-71</SelectItem>
                    </>
                  )}
                  
                  {step1Data.rto_state === "Gujarat" && (
                    <>
                      <SelectItem value="GJ-14">GJ-14</SelectItem>
                      <SelectItem value="GJ-20">GJ-20</SelectItem>
                      <SelectItem value="GJ-22">GJ-22</SelectItem>
                      <SelectItem value="GJ-25">GJ-25</SelectItem>
                      <SelectItem value="GJ-26">GJ-26</SelectItem>
                      <SelectItem value="GJ-28">GJ-28</SelectItem>
                      <SelectItem value="GJ-29">GJ-29</SelectItem>
                      <SelectItem value="GJ-30">GJ-30</SelectItem>
                      <SelectItem value="GJ-31">GJ-31</SelectItem>
                      <SelectItem value="GJ-32">GJ-32</SelectItem>
                      <SelectItem value="GJ-33">GJ-33</SelectItem>
                      <SelectItem value="GJ-34">GJ-34</SelectItem>
                      <SelectItem value="GJ-35">GJ-35</SelectItem>
                      <SelectItem value="GJ-36">GJ-36</SelectItem>
                      <SelectItem value="GJ-37">GJ-37</SelectItem>
                    </>
                  )}
                  
                  {step1Data.rto_state === "Tamil Nadu" && (
  <>
    <SelectItem value="TN-01">TN-01 Chennai (Central)</SelectItem>
    <SelectItem value="TN-02">TN-02 Chennai (North West)</SelectItem>
    <SelectItem value="TN-03">TN-03 Chennai (North East)</SelectItem>
    <SelectItem value="TN-04">TN-04 Chennai (East)</SelectItem>
    <SelectItem value="TN-05">TN-05 Chennai (South)</SelectItem>
    <SelectItem value="TN-06">TN-06 Chennai (South East)</SelectItem>
    <SelectItem value="TN-07">TN-07 Chennai (South West)</SelectItem>
    <SelectItem value="TN-09">TN-09 Chennai (West)</SelectItem>
    <SelectItem value="TN-10">TN-10 Chennai (South East II)</SelectItem>
    <SelectItem value="TN-11">TN-11 Tambaram</SelectItem>
    <SelectItem value="TN-12">TN-12 Poonamallee</SelectItem>
    <SelectItem value="TN-13">TN-13 Ambattur</SelectItem>
    <SelectItem value="TN-14">TN-14 Sholinganallur</SelectItem>
    <SelectItem value="TN-15">TN-15 Ulundurpet</SelectItem>
    <SelectItem value="TN-16">TN-16 Tindivanam</SelectItem>
    <SelectItem value="TN-18">TN-18 Red Hills</SelectItem>
    <SelectItem value="TN-19">TN-19 Chengalpattu</SelectItem>
    <SelectItem value="TN-20">TN-20 Tiruvallur</SelectItem>
    <SelectItem value="TN-21">TN-21 Kanchipuram</SelectItem>
    <SelectItem value="TN-22">TN-22 Meenambakkam</SelectItem>
    <SelectItem value="TN-23">TN-23 Vellore</SelectItem>
    <SelectItem value="TN-24">TN-24 Krishnagiri</SelectItem>
    <SelectItem value="TN-25">TN-25 Thiruvannamalai</SelectItem>
    <SelectItem value="TN-27">TN-27 Salem (West)</SelectItem>
    <SelectItem value="TN-28">TN-28 Namakkal (North)</SelectItem>
    <SelectItem value="TN-29">TN-29 Dharmapuri</SelectItem>
    <SelectItem value="TN-30">TN-30 Salem (East)</SelectItem>
    <SelectItem value="TN-31">TN-31 Cuddalore</SelectItem>
    <SelectItem value="TN-32">TN-32 Villupuram</SelectItem>
    <SelectItem value="TN-33">TN-33 Erode</SelectItem>
    <SelectItem value="TN-34">TN-34 Tiruchengode</SelectItem>
    <SelectItem value="TN-36">TN-36 Gobichettipalayam</SelectItem>
    <SelectItem value="TN-37">TN-37 Coimbatore (South)</SelectItem>
    <SelectItem value="TN-38">TN-38 Coimbatore (North)</SelectItem>
    <SelectItem value="TN-39">TN-39 Tirupur (North)</SelectItem>
    <SelectItem value="TN-40">TN-40 Tirupur (South)</SelectItem>
    <SelectItem value="TN-41">TN-41 Pollachi</SelectItem>
    <SelectItem value="TN-42">TN-42 Mettupalayam</SelectItem>
    <SelectItem value="TN-43">TN-43 Ooty (Udhagamandalam)</SelectItem>
    <SelectItem value="TN-45">TN-45 Tiruchirappalli</SelectItem>
    <SelectItem value="TN-46">TN-46 Perambalur</SelectItem>
    <SelectItem value="TN-47">TN-47 Karur</SelectItem>
    <SelectItem value="TN-48">TN-48 Ariyalur</SelectItem>
    <SelectItem value="TN-49">TN-49 Thanjavur</SelectItem>
    <SelectItem value="TN-50">TN-50 Tiruvarur</SelectItem>
    <SelectItem value="TN-51">TN-51 Nagapattinam</SelectItem>
    <SelectItem value="TN-52">TN-52 Srirangam</SelectItem>
    <SelectItem value="TN-54">TN-54 Mannargudi</SelectItem>
    <SelectItem value="TN-55">TN-55 Mayiladuthurai</SelectItem>
    <SelectItem value="TN-56">TN-56 Thuraiyur</SelectItem>
    <SelectItem value="TN-57">TN-57 Dindigul</SelectItem>
    <SelectItem value="TN-58">TN-58 Madurai (South)</SelectItem>
    <SelectItem value="TN-59">TN-59 Madurai (North)</SelectItem>
    <SelectItem value="TN-60">TN-60 Theni</SelectItem>
    <SelectItem value="TN-61">TN-61 Sivagangai</SelectItem>
    <SelectItem value="TN-63">TN-63 Ramanathapuram</SelectItem>
    <SelectItem value="TN-64">TN-64 Madurai (Central)</SelectItem>
    <SelectItem value="TN-65">TN-65 Virudhunagar</SelectItem>
    <SelectItem value="TN-66">TN-66 Salem (South)</SelectItem>
    <SelectItem value="TN-67">TN-67 Kumbakonam</SelectItem>
    <SelectItem value="TN-68">TN-68 Palani</SelectItem>
    <SelectItem value="TN-69">TN-69 Tuticorin (Thoothukudi)</SelectItem>
    <SelectItem value="TN-70">TN-70 Sankarankoil</SelectItem>
    <SelectItem value="TN-72">TN-72 Tirunelveli</SelectItem>
    <SelectItem value="TN-73">TN-73 Nagercoil</SelectItem>
    <SelectItem value="TN-74">TN-74 Tenkasi (Old code)</SelectItem>
    <SelectItem value="TN-75">TN-75 Marthandam</SelectItem>
    <SelectItem value="TN-76">TN-76 Tenkasi (New)</SelectItem>
    <SelectItem value="TN-77">TN-77 Coimbatore (West)</SelectItem>
    <SelectItem value="TN-78">TN-78 Attur</SelectItem>
    <SelectItem value="TN-79">TN-79 Arani</SelectItem>
    <SelectItem value="TN-81">TN-81 Manapparai</SelectItem>
    <SelectItem value="TN-82">TN-82 Pattukkottai</SelectItem>
    <SelectItem value="TN-83">TN-83 Gudiyatham</SelectItem>
    <SelectItem value="TN-84">TN-84 Avadi (Chennai West)</SelectItem>
    <SelectItem value="TN-85">TN-85 Sriperumbudur</SelectItem>
    <SelectItem value="TN-86">TN-86 Dharapuram</SelectItem>
    <SelectItem value="TN-87">TN-87 Udumalaipet</SelectItem>
    <SelectItem value="TN-88">TN-88 Namakkal (South)</SelectItem>
    <SelectItem value="TN-89">TN-89 Vaniyambadi</SelectItem>
    <SelectItem value="TN-90">TN-90 Thirukovilur</SelectItem>
    <SelectItem value="TN-91">TN-91 Sivakasi</SelectItem>
    <SelectItem value="TN-92">TN-92 Thiruchendur</SelectItem>
    <SelectItem value="TN-93">TN-93 Melur</SelectItem>
    <SelectItem value="TN-94">TN-94 Tiruverkadu</SelectItem>
    <SelectItem value="TN-95">TN-95 Manamadurai</SelectItem>
    <SelectItem value="TN-96">TN-96 Ilayangudi</SelectItem>
    <SelectItem value="TN-97">TN-97 Aruppukkottai</SelectItem>
    <SelectItem value="TN-99">TN-99 Tiruparankundram</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Rajasthan" && (
  <>
    <SelectItem value="RJ-03">RJ-03 (Bikaner)</SelectItem>
    <SelectItem value="RJ-04">RJ-04 (Alwar)</SelectItem>
    <SelectItem value="RJ-08">RJ-08 (Jhunjhunu)</SelectItem>
    <SelectItem value="RJ-10">RJ-10 (Udaipur)</SelectItem>
    <SelectItem value="RJ-11">RJ-11 (Pali)</SelectItem>
    <SelectItem value="RJ-12">RJ-12 (Chittorgarh)</SelectItem>
    <SelectItem value="RJ-13">RJ-13 (Kota)</SelectItem>
    <SelectItem value="RJ-15">RJ-15 (Bharatpur)</SelectItem>
    <SelectItem value="RJ-16">RJ-16 (Dholpur)</SelectItem>
    <SelectItem value="RJ-17">RJ-17 (Tonk)</SelectItem>
    <SelectItem value="RJ-21">RJ-21 (Baran)</SelectItem>
    <SelectItem value="RJ-22">RJ-22 (Ajmer)</SelectItem>
    <SelectItem value="RJ-24">RJ-24 (Sirohi)</SelectItem>
    <SelectItem value="RJ-25">RJ-25 (Jalore)</SelectItem>
    <SelectItem value="RJ-26">RJ-26 (Dungarpur)</SelectItem>
    <SelectItem value="RJ-28">RJ-28 (Banswara)</SelectItem>
    <SelectItem value="RJ-29">RJ-29 (Barmer)</SelectItem>
    <SelectItem value="RJ-30">RJ-30 (Jaisalmer)</SelectItem>
    <SelectItem value="RJ-31">RJ-31 (Sawai Madhopur)</SelectItem>
    <SelectItem value="RJ-32">RJ-32 (Karauli)</SelectItem>
    <SelectItem value="RJ-33">RJ-33 (Jhalawar)</SelectItem>
    <SelectItem value="RJ-34">RJ-34 (Pratapgarh)</SelectItem>
    <SelectItem value="RJ-35">RJ-35 (Hanumangarh)</SelectItem>
    <SelectItem value="RJ-36">RJ-36 (Kotputli)</SelectItem>
    <SelectItem value="RJ-37">RJ-37 (Shahpura)</SelectItem>
    <SelectItem value="RJ-38">RJ-38 (Phalodi)</SelectItem>
    <SelectItem value="RJ-39">RJ-39 (Didwana)</SelectItem>
    <SelectItem value="RJ-41">RJ-41 (Nokha)</SelectItem>
    <SelectItem value="RJ-42">RJ-42 (Sanchore)</SelectItem>
    <SelectItem value="RJ-43">RJ-43 (Behror)</SelectItem>
    <SelectItem value="RJ-44">RJ-44 (Rawatsar)</SelectItem>
    <SelectItem value="RJ-46">RJ-46 (Bhiwadi)</SelectItem>
    <SelectItem value="RJ-47">RJ-47 (Chomu)</SelectItem>
    <SelectItem value="RJ-48">RJ-48 (Kekri)</SelectItem>
    <SelectItem value="RJ-49">RJ-49 (Deeg)</SelectItem>
    <SelectItem value="RJ-50">RJ-50 (Bundi)</SelectItem>
    <SelectItem value="RJ-51">RJ-51 (Abu Road)</SelectItem>
    <SelectItem value="RJ-52">RJ-52 (Balotra)</SelectItem>
    <SelectItem value="RJ-53">RJ-53 (Shahabad)</SelectItem>
    <SelectItem value="RJ-54">RJ-54 (Phagi)</SelectItem>
    <SelectItem value="RJ-55">RJ-55 (Raisinghnagar)</SelectItem>
    <SelectItem value="RJ-56">RJ-56 (Sujangarh)</SelectItem>
    <SelectItem value="RJ-57">RJ-57 (Rajsamand)</SelectItem>
    <SelectItem value="RJ-58">RJ-58 (Makrana)</SelectItem>
    <SelectItem value="RJ-59">RJ-59 (Nathdwara)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Kerala" && (
  <>
    <SelectItem value="KL-03">KL-03 (Pathanamthitta)</SelectItem>
    <SelectItem value="KL-06">KL-06 (Idukki)</SelectItem>
    <SelectItem value="KL-09">KL-09 (Palakkad)</SelectItem>
    <SelectItem value="KL-10">KL-10 (Malappuram)</SelectItem>
    <SelectItem value="KL-12">KL-12 (Wayanad)</SelectItem>
    <SelectItem value="KL-13">KL-13 (Kannur)</SelectItem>
    <SelectItem value="KL-14">KL-14 (Kasaragod)</SelectItem>
    <SelectItem value="KL-15">KL-15 (KSRTC, Thiruvananthapuram)</SelectItem>
    <SelectItem value="KL-16">KL-16 (Attingal)</SelectItem>
    <SelectItem value="KL-18">KL-18 (Vadakara)</SelectItem>
    <SelectItem value="KL-19">KL-19 (Parassala)</SelectItem>
    <SelectItem value="KL-20">KL-20 (Neyyattinkara)</SelectItem>
    <SelectItem value="KL-21">KL-21 (Nedumangad)</SelectItem>
    <SelectItem value="KL-22">KL-22 (Kazhakoottam)</SelectItem>
    <SelectItem value="KL-23">KL-23 (Karunagappalli)</SelectItem>
    <SelectItem value="KL-24">KL-24 (Kottarakkara)</SelectItem>
    <SelectItem value="KL-25">KL-25 (Punalur)</SelectItem>
    <SelectItem value="KL-26">KL-26 (Adoor)</SelectItem>
    <SelectItem value="KL-27">KL-27 (Thiruvalla)</SelectItem>
    <SelectItem value="KL-28">KL-28 (Mallappally)</SelectItem>
    <SelectItem value="KL-29">KL-29 (Kayamkulam)</SelectItem>
    <SelectItem value="KL-30">KL-30 (Chengannur)</SelectItem>
    <SelectItem value="KL-31">KL-31 (Mavelikkara)</SelectItem>
    <SelectItem value="KL-33">KL-33 (Changanassery)</SelectItem>
    <SelectItem value="KL-34">KL-34 (Kanjirappally)</SelectItem>
    <SelectItem value="KL-35">KL-35 (Pala)</SelectItem>
    <SelectItem value="KL-36">KL-36 (Vaikom)</SelectItem>
    <SelectItem value="KL-37">KL-37 (Vandiperiyar)</SelectItem>
    <SelectItem value="KL-38">KL-38 (Thodupuzha)</SelectItem>
    <SelectItem value="KL-44">KL-44 (Kothamangalam)</SelectItem>
    <SelectItem value="KL-45">KL-45 (Irinjalakuda)</SelectItem>
    <SelectItem value="KL-46">KL-46 (Kodungallur)</SelectItem>
    <SelectItem value="KL-47">KL-47 (Guruvayur)</SelectItem>
    <SelectItem value="KL-48">KL-48 (Wadakkanchery)</SelectItem>
    <SelectItem value="KL-49">KL-49 (Alathur)</SelectItem>
    <SelectItem value="KL-50">KL-50 (Mannarkkad)</SelectItem>
    <SelectItem value="KL-51">KL-51 (Ottapalam)</SelectItem>
    <SelectItem value="KL-52">KL-52 (Pattambi)</SelectItem>
    <SelectItem value="KL-53">KL-53 (Perinthalmanna)</SelectItem>
    <SelectItem value="KL-54">KL-54 (Ponnani)</SelectItem>
    <SelectItem value="KL-55">KL-55 (Tirur)</SelectItem>
    <SelectItem value="KL-56">KL-56 (Koyilandy)</SelectItem>
    <SelectItem value="KL-57">KL-57 (Koduvally)</SelectItem>
    <SelectItem value="KL-58">KL-58 (Thalassery)</SelectItem>
    <SelectItem value="KL-59">KL-59 (Taliparamba)</SelectItem>
    <SelectItem value="KL-60">KL-60 (Kanhangad)</SelectItem>
    <SelectItem value="KL-61">KL-61 (Sasthamcotta)</SelectItem>
    <SelectItem value="KL-62">KL-62 (Ranni)</SelectItem>
    <SelectItem value="KL-63">KL-63 (Perumbavoor)</SelectItem>
    <SelectItem value="KL-64">KL-64 (Chalakudy)</SelectItem>
    <SelectItem value="KL-65">KL-65 (Tirurangadi)</SelectItem>
    <SelectItem value="KL-66">KL-66 (Kuttanadu)</SelectItem>
    <SelectItem value="KL-67">KL-67 (Uzhavoor)</SelectItem>
    <SelectItem value="KL-68">KL-68 (Devikulam)</SelectItem>
    <SelectItem value="KL-69">KL-69 (Udumbanchola)</SelectItem>
    <SelectItem value="KL-70">KL-70 (Chittur)</SelectItem>
    <SelectItem value="KL-71">KL-71 (Nilambur)</SelectItem>
    <SelectItem value="KL-72">KL-72 (Mananthavady)</SelectItem>
    <SelectItem value="KL-73">KL-73 (Sulthan Bathery)</SelectItem>
    <SelectItem value="KL-74">KL-74 (Kattakkada)</SelectItem>
    <SelectItem value="KL-75">KL-75 (Thriprayar)</SelectItem>
    <SelectItem value="KL-76">KL-76 (Nanmanda)</SelectItem>
    <SelectItem value="KL-77">KL-77 (Perambra)</SelectItem>
    <SelectItem value="KL-78">KL-78 (Iritty)</SelectItem>
    <SelectItem value="KL-79">KL-79 (Vellarikundu)</SelectItem>
    <SelectItem value="KL-80">KL-80 (Pathanapuram)</SelectItem>
    <SelectItem value="KL-81">KL-81 (Varkala)</SelectItem>
    <SelectItem value="KL-82">KL-82 (Chadayamangalam)</SelectItem>
    <SelectItem value="KL-83">KL-83 (Konni)</SelectItem>
    <SelectItem value="KL-84">KL-84 (Kondotty)</SelectItem>
    <SelectItem value="KL-85">KL-85 (Ramanattukara)</SelectItem>
    <SelectItem value="KL-86">KL-86 (Payyanur)</SelectItem>
    <SelectItem value="KL-99">KL-99 (State Transport Department)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Madhya Pradesh" && (
  <>
    <SelectItem value="MP-01">MP-01 (State Governor's Vehicle)</SelectItem>
    <SelectItem value="MP-02">MP-02 (MP Government Vehicles)</SelectItem>
    <SelectItem value="MP-03">MP-03 (MP Police Vehicles)</SelectItem>
    <SelectItem value="MP-05">MP-05 (Hoshangabad)</SelectItem>
    <SelectItem value="MP-06">MP-06 (Morena)</SelectItem>
    <SelectItem value="MP-08">MP-08 (Guna)</SelectItem>
    <SelectItem value="MP-10">MP-10 (Khargone)</SelectItem>
    <SelectItem value="MP-11">MP-11 (Dhar)</SelectItem>
    <SelectItem value="MP-12">MP-12 (Khandwa)</SelectItem>
    <SelectItem value="MP-14">MP-14 (Mandsaur)</SelectItem>
    <SelectItem value="MP-15">MP-15 (Sagar)</SelectItem>
    <SelectItem value="MP-16">MP-16 (Chhatarpur)</SelectItem>
    <SelectItem value="MP-17">MP-17 (Rewa)</SelectItem>
    <SelectItem value="MP-18">MP-18 (Shahdol)</SelectItem>
    <SelectItem value="MP-19">MP-19 (Satna)</SelectItem>
    <SelectItem value="MP-21">MP-21 (Katni)</SelectItem>
    <SelectItem value="MP-22">MP-22 (Seoni)</SelectItem>
    <SelectItem value="MP-25">MP-25 (Jagdalpur)</SelectItem>
    <SelectItem value="MP-26">MP-26 (Bilaspur)</SelectItem>
    <SelectItem value="MP-28">MP-28 (Chhindwara)</SelectItem>
    <SelectItem value="MP-30">MP-30 (Bhind)</SelectItem>
    <SelectItem value="MP-31">MP-31 (Sheopur)</SelectItem>
    <SelectItem value="MP-32">MP-32 (Datia)</SelectItem>
    <SelectItem value="MP-33">MP-33 (Shivpuri)</SelectItem>
    <SelectItem value="MP-34">MP-34 (Damoh)</SelectItem>
    <SelectItem value="MP-35">MP-35 (Panna)</SelectItem>
    <SelectItem value="MP-36">MP-36 (Tikamgarh)</SelectItem>
    <SelectItem value="MP-37">MP-37 (Sehore)</SelectItem>
    <SelectItem value="MP-38">MP-38 (Raisen)</SelectItem>
    <SelectItem value="MP-39">MP-39 (Rajgarh)</SelectItem>
    <SelectItem value="MP-40">MP-40 (Vidisha)</SelectItem>
    <SelectItem value="MP-41">MP-41 (Dewas)</SelectItem>
    <SelectItem value="MP-42">MP-42 (Shajapur)</SelectItem>
    <SelectItem value="MP-43">MP-43 (Ratlam)</SelectItem>
    <SelectItem value="MP-44">MP-44 (Neemuch)</SelectItem>
    <SelectItem value="MP-45">MP-45 (Jhabua)</SelectItem>
    <SelectItem value="MP-46">MP-46 (Barwani)</SelectItem>
    <SelectItem value="MP-47">MP-47 (Harda)</SelectItem>
    <SelectItem value="MP-48">MP-48 (Betul)</SelectItem>
    <SelectItem value="MP-49">MP-49 (Narsinghpur)</SelectItem>
    <SelectItem value="MP-50">MP-50 (Balaghat)</SelectItem>
    <SelectItem value="MP-51">MP-51 (Mandla)</SelectItem>
    <SelectItem value="MP-52">MP-52 (Dindori)</SelectItem>
    <SelectItem value="MP-53">MP-53 (Sidhi)</SelectItem>
    <SelectItem value="MP-54">MP-54 (Umaria)</SelectItem>
    <SelectItem value="MP-65">MP-65 (Anuppur)</SelectItem>
    <SelectItem value="MP-66">MP-66 (Singrauli)</SelectItem>
    <SelectItem value="MP-67">MP-67 (Ashoknagar)</SelectItem>
    <SelectItem value="MP-68">MP-68 (Burhanpur)</SelectItem>
    <SelectItem value="MP-69">MP-69 (Alirajpur)</SelectItem>
    <SelectItem value="MP-70">MP-70 (Agar Malwa)</SelectItem>
    <SelectItem value="MP-71">MP-71 (Niwari)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Andhra Pradesh" && (
  <>
    <SelectItem value="AP-01">AP-01 (Adilabad)</SelectItem>
    <SelectItem value="AP-04">AP-04 (Kadapa)</SelectItem>
    <SelectItem value="AP-06">AP-06 (Kakinada)</SelectItem>
    <SelectItem value="AP-08">AP-08 (Guntur)</SelectItem>
    <SelectItem value="AP-14">AP-14 (Karimnagar)</SelectItem>
    <SelectItem value="AP-22">AP-22 (Mahbubnagar)</SelectItem>
    <SelectItem value="AP-23">AP-23 (Medak)</SelectItem>
    <SelectItem value="AP-25">AP-25 (Nizamabad)</SelectItem>
    <SelectItem value="AP-30">AP-30 (Srikakulam)</SelectItem>
    <SelectItem value="AP-33">AP-33 (Gajuwaka)</SelectItem>
    <SelectItem value="AP-36">AP-36 (Warangal)</SelectItem>
    <SelectItem value="AP-39">AP-39 (Prakasam)</SelectItem>
    <SelectItem value="AP-43">AP-43 (Kathipudi)</SelectItem>
    <SelectItem value="AP-202">AP-202 (Guntakal)</SelectItem>
    <SelectItem value="AP-316">AP-316 (Nandigama)</SelectItem>
    <SelectItem value="AP-402">AP-402 (Location not specified)</SelectItem>
    <SelectItem value="AP-416">AP-416 (Location not specified)</SelectItem>
    <SelectItem value="AP-427">AP-427 (Location not specified)</SelectItem>
    <SelectItem value="AP-516">AP-516 (Location not specified)</SelectItem>
    <SelectItem value="AP-616">AP-616 (Location not specified)</SelectItem>
    <SelectItem value="AP-705">AP-705 (Location not specified)</SelectItem>
    <SelectItem value="AP-707">AP-707 (Location not specified)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Telangana" && (
  <>
    <SelectItem value="TS-01">TS-01 (Adilabad)</SelectItem>
    <SelectItem value="TS-02">TS-02 (Karimnagar)</SelectItem>
    <SelectItem value="TS-03">TS-03 (Warangal Urban)</SelectItem>
    <SelectItem value="TS-04">TS-04 (Khammam)</SelectItem>
    <SelectItem value="TS-05">TS-05 (Nalgonda)</SelectItem>
    <SelectItem value="TS-06">TS-06 (Mahbubnagar)</SelectItem>
    <SelectItem value="TS-07">TS-07 (Ranga Reddy)</SelectItem>
    <SelectItem value="TS-08">TS-08 (Medchal–Malkajgiri)</SelectItem>
    <SelectItem value="TS-09">TS-09 (Hyderabad Central)</SelectItem>
    <SelectItem value="TS-10">TS-10 (Hyderabad North)</SelectItem>
    <SelectItem value="TS-11">TS-11 (Hyderabad East)</SelectItem>
    <SelectItem value="TS-12">TS-12 (Hyderabad South)</SelectItem>
    <SelectItem value="TS-13">TS-13 (Hyderabad West)</SelectItem>
    <SelectItem value="TS-14">TS-14 (Hyderabad - Reserved)</SelectItem>
    <SelectItem value="TS-15">TS-15 (Sangareddy)</SelectItem>
    <SelectItem value="TS-16">TS-16 (Nizamabad)</SelectItem>
    <SelectItem value="TS-17">TS-17 (Kamareddy)</SelectItem>
    <SelectItem value="TS-18">TS-18 (Nirmal)</SelectItem>
    <SelectItem value="TS-19">TS-19 (Mancherial)</SelectItem>
    <SelectItem value="TS-20">TS-20 (Kumaram Bheem Asifabad)</SelectItem>
    <SelectItem value="TS-21">TS-21 (Jagtial)</SelectItem>
    <SelectItem value="TS-22">TS-22 (Peddapalli)</SelectItem>
    <SelectItem value="TS-23">TS-23 (Sircilla)</SelectItem>
    <SelectItem value="TS-24">TS-24 (Warangal Rural)</SelectItem>
    <SelectItem value="TS-25">TS-25 (Jayashankar Bhupalpally)</SelectItem>
    <SelectItem value="TS-26">TS-26 (Mahabubabad)</SelectItem>
    <SelectItem value="TS-27">TS-27 (Jangaon)</SelectItem>
    <SelectItem value="TS-28">TS-28 (Bhadradri Kothagudem)</SelectItem>
    <SelectItem value="TS-29">TS-29 (Suryapet)</SelectItem>
    <SelectItem value="TS-30">TS-30 (Yadadri Bhuvanagiri)</SelectItem>
    <SelectItem value="TS-31">TS-31 (Nagarkurnool)</SelectItem>
    <SelectItem value="TS-32">TS-32 (Wanaparthy)</SelectItem>
    <SelectItem value="TS-33">TS-33 (Jogulamba Gadwal)</SelectItem>
    <SelectItem value="TS-34">TS-34 (Vikarabad)</SelectItem>
    <SelectItem value="TS-35">TS-35 (Medak)</SelectItem>
    <SelectItem value="TS-36">TS-36 (Siddipet)</SelectItem>
    <SelectItem value="TS-38">TS-38 (Narayanpet)</SelectItem>
    <SelectItem value="TS-102">TS-102 (Huzurabad)</SelectItem>
    <SelectItem value="TS-107">TS-107 (Ibrahimpatnam)</SelectItem>
    <SelectItem value="TS-108">TS-108 (Uppal Kalan)</SelectItem>
    <SelectItem value="TS-121">TS-121 (Korutla)</SelectItem>
    <SelectItem value="TS-122">TS-122 (Ramagundam)</SelectItem>
    <SelectItem value="TS-128">TS-128 (Bhadrachalam)</SelectItem>
    <SelectItem value="TS-129">TS-129 (Kodad)</SelectItem>
    <SelectItem value="TS-132">TS-132 (Pebbair)</SelectItem>
    <SelectItem value="TS-207">TS-207 (Shadnagar)</SelectItem>
    <SelectItem value="TS-208">TS-208 (Kukatpally)</SelectItem>
    <SelectItem value="TS-215">TS-215 (Zahirabad)</SelectItem>
    <SelectItem value="TS-216">TS-216 (Bodhan)</SelectItem>
    <SelectItem value="TS-305">TS-305 (Miryalaguda)</SelectItem>
    <SelectItem value="TS-415">TS-415 (Patancheruvu)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Bihar" && (
  <>
    <SelectItem value="BR-03">BR-03 (Bhojpur)</SelectItem>
    <SelectItem value="BR-04">BR-04 (Chhapra)</SelectItem>
    <SelectItem value="BR-05">BR-05 (Motihari)</SelectItem>
    <SelectItem value="BR-07">BR-07 (Darbhanga)</SelectItem>
    <SelectItem value="BR-08">BR-08 (Munger)</SelectItem>
    <SelectItem value="BR-09">BR-09 (Begusarai)</SelectItem>
    <SelectItem value="BR-13">BR-13 (Hazaribagh)</SelectItem>
    <SelectItem value="BR-14">BR-14 (Ranchi)</SelectItem>
    <SelectItem value="BR-15">BR-15 (Daltonganj)</SelectItem>
    <SelectItem value="BR-16">BR-16 (Jamshedpur)</SelectItem>
    <SelectItem value="BR-17">BR-17 (Dhanbad)</SelectItem>
    <SelectItem value="BR-18">BR-18 (Chaibasa)</SelectItem>
    <SelectItem value="BR-19">BR-19 (Saharsa)</SelectItem>
    <SelectItem value="BR-20">BR-20 (Bokaro)</SelectItem>
    <SelectItem value="BR-21">BR-21 (Nalanda)</SelectItem>
    <SelectItem value="BR-22">BR-22 (Bettiah)</SelectItem>
    <SelectItem value="BR-24">BR-24 (Dehri)</SelectItem>
    <SelectItem value="BR-25">BR-25 (Jehanabad)</SelectItem>
    <SelectItem value="BR-27">BR-27 (Nawada)</SelectItem>
    <SelectItem value="BR-28">BR-28 (Gopalganj)</SelectItem>
    <SelectItem value="BR-30">BR-30 (Sitamarhi)</SelectItem>
    <SelectItem value="BR-31">BR-31 (Vaishali)</SelectItem>
    <SelectItem value="BR-32">BR-32 (Madhubani)</SelectItem>
    <SelectItem value="BR-33">BR-33 (Samastipur)</SelectItem>
    <SelectItem value="BR-34">BR-34 (Khagaria)</SelectItem>
    <SelectItem value="BR-35">BR-35 (Sahibganj)</SelectItem>
    <SelectItem value="BR-37">BR-37 (Kishanganj)</SelectItem>
    <SelectItem value="BR-38">BR-38 (Araria)</SelectItem>
    <SelectItem value="BR-39">BR-39 (Katihar)</SelectItem>
    <SelectItem value="BR-43">BR-43 (Madhepura)</SelectItem>
    <SelectItem value="BR-44">BR-44 (Buxar)</SelectItem>
    <SelectItem value="BR-45">BR-45 (Bhabua)</SelectItem>
    <SelectItem value="BR-46">BR-46 (Jamui)</SelectItem>
    <SelectItem value="BR-47">BR-47 (Koderma)</SelectItem>
    <SelectItem value="BR-50">BR-50 (Supaul)</SelectItem>
    <SelectItem value="BR-51">BR-51 (Banka)</SelectItem>
    <SelectItem value="BR-52">BR-52 (Sheikhpura)</SelectItem>
    <SelectItem value="BR-53">BR-53 (Lakhisarai)</SelectItem>
    <SelectItem value="BR-55">BR-55 (Sheohar)</SelectItem>
    <SelectItem value="BR-56">BR-56 (Arwal)</SelectItem>
    <SelectItem value="BR-57">BR-57 (Rohtas)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Punjab" && (
  <>
    <SelectItem value="PB-04">PB-04 (Faridkot)</SelectItem>
    <SelectItem value="PB-05">PB-05 (Ferozepur)</SelectItem>
    <SelectItem value="PB-12">PB-12 (Rupnagar)</SelectItem>
    <SelectItem value="PB-14">PB-14 (Ajnala)</SelectItem>
    <SelectItem value="PB-15">PB-15 (Abohar)</SelectItem>
    <SelectItem value="PB-16">PB-16 (Anandpur Sahib)</SelectItem>
    <SelectItem value="PB-17">PB-17 (Baba Bakala)</SelectItem>
    <SelectItem value="PB-18">PB-18 (Batala)</SelectItem>
    <SelectItem value="PB-19">PB-19 (Barnala)</SelectItem>
    <SelectItem value="PB-20">PB-20 (Balachaur)</SelectItem>
    <SelectItem value="PB-21">PB-21 (Dasuya)</SelectItem>
    <SelectItem value="PB-22">PB-22 (Fazilka)</SelectItem>
    <SelectItem value="PB-24">PB-24 (Garhshankar)</SelectItem>
    <SelectItem value="PB-25">PB-25 (Jagraon)</SelectItem>
    <SelectItem value="PB-26">PB-26 (Khanna)</SelectItem>
    <SelectItem value="PB-27">PB-27 (Kharar)</SelectItem>
    <SelectItem value="PB-28">PB-28 (Malerkotla)</SelectItem>
    <SelectItem value="PB-30">PB-30 (Muktsar)</SelectItem>
    <SelectItem value="PB-31">PB-31 (Mansa)</SelectItem>
    <SelectItem value="PB-32">PB-32 (Nawanshahr)</SelectItem>
    <SelectItem value="PB-33">PB-33 (Nakodar)</SelectItem>
    <SelectItem value="PB-34">PB-34 (Nabha)</SelectItem>
    <SelectItem value="PB-35">PB-35 (Pathankot)</SelectItem>
    <SelectItem value="PB-36">PB-36 (Phagwara)</SelectItem>
    <SelectItem value="PB-37">PB-37 (Phillaur)</SelectItem>
    <SelectItem value="PB-38">PB-38 (Patti)</SelectItem>
    <SelectItem value="PB-39">PB-39 (Rajpura)</SelectItem>
    <SelectItem value="PB-40">PB-40 (Rampura Phul)</SelectItem>
    <SelectItem value="PB-41">PB-41 (Sultanpur Lodhi)</SelectItem>
    <SelectItem value="PB-42">PB-42 (Samana)</SelectItem>
    <SelectItem value="PB-43">PB-43 (Samrala)</SelectItem>
    <SelectItem value="PB-44">PB-44 (Sunam)</SelectItem>
    <SelectItem value="PB-45">PB-45 (Talwandi Sabo)</SelectItem>
    <SelectItem value="PB-47">PB-47 (Zira)</SelectItem>
    <SelectItem value="PB-48">PB-48 (Amloh)</SelectItem>
    <SelectItem value="PB-49">PB-49 (Khamanon)</SelectItem>
    <SelectItem value="PB-50">PB-50 (Budhlada)</SelectItem>
    <SelectItem value="PB-51">PB-51 (Sardulgarh)</SelectItem>
    <SelectItem value="PB-52">PB-52 (Bassi Pathana)</SelectItem>
    <SelectItem value="PB-53">PB-53 (Malout)</SelectItem>
    <SelectItem value="PB-54">PB-54 (Mukerian)</SelectItem>
    <SelectItem value="PB-55">PB-55 (Payal)</SelectItem>
    <SelectItem value="PB-56">PB-56 (Raikot)</SelectItem>
    <SelectItem value="PB-57">PB-57 (Bhulath)</SelectItem>
    <SelectItem value="PB-58">PB-58 (Dera Baba Nanak)</SelectItem>
    <SelectItem value="PB-59">PB-59 (Dhuri)</SelectItem>
    <SelectItem value="PB-60">PB-60 (Gidderbaha)</SelectItem>
    <SelectItem value="PB-61">PB-61 (Jalalabad)</SelectItem>
    <SelectItem value="PB-62">PB-62 (Jaitu)</SelectItem>
    <SelectItem value="PB-63">PB-63 (Khadoor Sahib)</SelectItem>
    <SelectItem value="PB-64">PB-64 (Moonak)</SelectItem>
    <SelectItem value="PB-66">PB-66 (Nihal Singh Wala)</SelectItem>
    <SelectItem value="PB-67">PB-67 (Shahkot)</SelectItem>
    <SelectItem value="PB-68">PB-68 (Dhar Kalan)</SelectItem>
    <SelectItem value="PB-69">PB-69 (Bagha Purana)</SelectItem>
    <SelectItem value="PB-70">PB-70 (Dera Bassi)</SelectItem>
    <SelectItem value="PB-71">PB-71 (Chamkaur Sahib)</SelectItem>
    <SelectItem value="PB-72">PB-72 (Pattran)</SelectItem>
    <SelectItem value="PB-73">PB-73 (Tappa Mandi)</SelectItem>
    <SelectItem value="PB-74">PB-74 (Nangal)</SelectItem>
    <SelectItem value="PB-75">PB-75 (Lehragaga)</SelectItem>
    <SelectItem value="PB-76">PB-76 (Dharamkot)</SelectItem>
    <SelectItem value="PB-77">PB-77 (Guru Har Sahai)</SelectItem>
    <SelectItem value="PB-78">PB-78 (Banga)</SelectItem>
    <SelectItem value="PB-79">PB-79 (Kotkapura)</SelectItem>
    <SelectItem value="PB-80">PB-80 (Maur)</SelectItem>
    <SelectItem value="PB-81">PB-81 (Majitha)</SelectItem>
    <SelectItem value="PB-82">PB-82 (Ahmedgarh)</SelectItem>
    <SelectItem value="PB-83">PB-83 (Dudhan Sadhan)</SelectItem>
    <SelectItem value="PB-84">PB-84 (Bhawanigarh)</SelectItem>
    <SelectItem value="PB-85">PB-85 (Kalanaur)</SelectItem>
    <SelectItem value="PB-86">PB-86 (Dirba)</SelectItem>
    <SelectItem value="PB-87">PB-87 (Morinda)</SelectItem>
    <SelectItem value="PB-88">PB-88 (Bhikhiwind)</SelectItem>
    <SelectItem value="PB-89">PB-89 (Amritsar II)</SelectItem>
    <SelectItem value="PB-90">PB-90 (Jalandhar II)</SelectItem>
    <SelectItem value="PB-91">PB-91 (Ludhiana East)</SelectItem>
    <SelectItem value="PB-99">PB-99 (Dinanagar)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "West Bengal" && (
  <>
    <SelectItem value="WB-01">WB-01 (Kolkata Beltala - Two-wheelers)</SelectItem>
    <SelectItem value="WB-03">WB-03 (Kolkata Beltala - Goods carriages)</SelectItem>
    <SelectItem value="WB-04">WB-04 (Kolkata Beltala - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-05">WB-05 (Kolkata Kasba - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-07">WB-07 (Kolkata Salt Lake - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-09">WB-09 (Behala - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-10">WB-10 (Behala - Private vehicles)</SelectItem>
    <SelectItem value="WB-11">WB-11 (Howrah - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-13">WB-13 (Uluberia - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-14">WB-14 (Uluberia - Private vehicles)</SelectItem>
    <SelectItem value="WB-15">WB-15 (Hugli-Chuchura - Transport vehicles)</SelectItem>
    <SelectItem value="WB-16">WB-16 (Hugli-Chuchura - Private vehicles)</SelectItem>
    <SelectItem value="WB-17">WB-17 (Hooghly Srirampur - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-18">WB-18 (Dankuni)</SelectItem>
    <SelectItem value="WB-19">WB-19 (Alipore - Transport vehicles)</SelectItem>
    <SelectItem value="WB-21">WB-21 (Basirhat - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-22">WB-22 (Basirhat - Private vehicles)</SelectItem>
    <SelectItem value="WB-23">WB-23 (Barrackpore - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-25">WB-25 (Barasat - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-27">WB-27 (Bangaon - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-28">WB-28 (Bangaon - Private vehicles)</SelectItem>
    <SelectItem value="WB-29">WB-29 (Tamluk - Transport vehicles)</SelectItem>
    <SelectItem value="WB-30">WB-30 (Tamluk - Private vehicles)</SelectItem>
    <SelectItem value="WB-31">WB-31 (Contai - Transport vehicles)</SelectItem>
    <SelectItem value="WB-32">WB-32 (Contai - Private vehicles)</SelectItem>
    <SelectItem value="WB-33">WB-33 (Midnapore - Transport vehicles)</SelectItem>
    <SelectItem value="WB-34">WB-34 (Midnapore - Private vehicles)</SelectItem>
    <SelectItem value="WB-35">WB-35 (Kharagpur - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-36">WB-36 (Kharagpur - Private vehicles)</SelectItem>
    <SelectItem value="WB-37">WB-37 (Asansol - Transport vehicles)</SelectItem>
    <SelectItem value="WB-38">WB-38 (Asansol - Private vehicles)</SelectItem>
    <SelectItem value="WB-40">WB-40 (Durgapur - Private vehicles)</SelectItem>
    <SelectItem value="WB-41">WB-41 (Burdwan - Transport vehicles)</SelectItem>
    <SelectItem value="WB-42">WB-42 (Burdwan - Private vehicles)</SelectItem>
    <SelectItem value="WB-43">WB-43 (Kalna - Transport vehicles)</SelectItem>
    <SelectItem value="WB-44">WB-44 (Kalna - Private vehicles)</SelectItem>
    <SelectItem value="WB-45">WB-45 (Rampurhat - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-46">WB-46 (Rampurhat - Private vehicles)</SelectItem>
    <SelectItem value="WB-47">WB-47 (Bolpur - Transport vehicles)</SelectItem>
    <SelectItem value="WB-48">WB-48 (Bolpur - Private vehicles)</SelectItem>
    <SelectItem value="WB-49">WB-49 (Jhargram - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-50">WB-50 (Jhargram - Private vehicles)</SelectItem>
    <SelectItem value="WB-51">WB-51 (Krishnanagar - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-52">WB-52 (Krishnanagar - Private vehicles)</SelectItem>
    <SelectItem value="WB-53">WB-53 (Birbhum - Transport vehicles)</SelectItem>
    <SelectItem value="WB-54">WB-54 (Birbhum - Private vehicles)</SelectItem>
    <SelectItem value="WB-55">WB-55 (Purulia - Transport vehicles)</SelectItem>
    <SelectItem value="WB-56">WB-56 (Purulia - Private vehicles)</SelectItem>
    <SelectItem value="WB-57">WB-57 (Murshidabad - Transport vehicles)</SelectItem>
    <SelectItem value="WB-58">WB-58 (Murshidabad - Private vehicles)</SelectItem>
    <SelectItem value="WB-59">WB-59 (Raiganj - Transport vehicles)</SelectItem>
    <SelectItem value="WB-60">WB-60 (Raiganj - Private vehicles)</SelectItem>
    <SelectItem value="WB-61">WB-61 (Balurghat - Transport vehicles)</SelectItem>
    <SelectItem value="WB-62">WB-62 (Balurghat - Private vehicles)</SelectItem>
    <SelectItem value="WB-63">WB-63 (Cooch Behar - Transport vehicles)</SelectItem>
    <SelectItem value="WB-64">WB-64 (Cooch Behar - Private vehicles)</SelectItem>
    <SelectItem value="WB-65">WB-65 (Malda - Transport vehicles)</SelectItem>
    <SelectItem value="WB-66">WB-66 (Malda - Private vehicles)</SelectItem>
    <SelectItem value="WB-67">WB-67 (Bankura - Transport vehicles)</SelectItem>
    <SelectItem value="WB-68">WB-68 (Bankura - Private vehicles)</SelectItem>
    <SelectItem value="WB-69">WB-69 (Alipurduar - Transport vehicles)</SelectItem>
    <SelectItem value="WB-70">WB-70 (Alipurduar - Private vehicles)</SelectItem>
    <SelectItem value="WB-71">WB-71 (Jalpaiguri - Transport vehicles)</SelectItem>
    <SelectItem value="WB-72">WB-72 (Jalpaiguri - Private vehicles)</SelectItem>
    <SelectItem value="WB-73">WB-73 (Siliguri - Transport vehicles)</SelectItem>
    <SelectItem value="WB-74">WB-74 (Siliguri - Private vehicles)</SelectItem>
    <SelectItem value="WB-75">WB-75 (Katwa - Private and Commercial vehicles)</SelectItem>
    <SelectItem value="WB-76">WB-76 (Darjeeling - Transport vehicles)</SelectItem>
    <SelectItem value="WB-77">WB-77 (Darjeeling - Private vehicles)</SelectItem>
    <SelectItem value="WB-78">WB-78 (Kalimpong - Transport vehicles)</SelectItem>
    <SelectItem value="WB-79">WB-79 (Kalimpong - Private vehicles)</SelectItem>
    <SelectItem value="WB-81">WB-81 (Raghunathpur - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-82">WB-82 (Raghunathpur - Private vehicles)</SelectItem>
    <SelectItem value="WB-83">WB-83 (Chanchal - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-85">WB-85 (Mathabhanga - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-86">WB-86 (Mathabhanga - Private vehicles)</SelectItem>
    <SelectItem value="WB-87">WB-87 (Bishnupur - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-88">WB-88 (Bishnupur - Private vehicles)</SelectItem>
    <SelectItem value="WB-89">WB-89 (Kalyani - Transport vehicles)</SelectItem>
    <SelectItem value="WB-90">WB-90 (Kalyani - Private vehicles)</SelectItem>
    <SelectItem value="WB-91">WB-91 (Islampur - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-92">WB-92 (Islampur - Private vehicles)</SelectItem>
    <SelectItem value="WB-93">WB-93 (Jangipur - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-94">WB-94 (Jangipur - Private vehicles)</SelectItem>
    <SelectItem value="WB-95">WB-95 (Baruipur - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-96">WB-96 (Baruipur - Private vehicles)</SelectItem>
    <SelectItem value="WB-97">WB-97 (Diamond Harbour - Commercial vehicles)</SelectItem>
    <SelectItem value="WB-98">WB-98 (Diamond Harbour - Private vehicles)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Jharkhand" && (
  <>
    <SelectItem value="JH-02">JH-02 (Bokaro)</SelectItem>
    <SelectItem value="JH-03">JH-03 (Chatra)</SelectItem>
    <SelectItem value="JH-04">JH-04 (Dhanbad)</SelectItem>
    <SelectItem value="JH-06">JH-06 (Dumka)</SelectItem>
    <SelectItem value="JH-07">JH-07 (East Singhbhum)</SelectItem>
    <SelectItem value="JH-08">JH-08 (Garhwa)</SelectItem>
    <SelectItem value="JH-09">JH-09 (Giridih)</SelectItem>
    <SelectItem value="JH-11">JH-11 (Hazaribagh)</SelectItem>
    <SelectItem value="JH-12">JH-12 (Jamtara)</SelectItem>
    <SelectItem value="JH-13">JH-13 (Khunti)</SelectItem>
    <SelectItem value="JH-14">JH-14 (Koderma)</SelectItem>
    <SelectItem value="JH-15">JH-15 (Latehar)</SelectItem>
    <SelectItem value="JH-16">JH-16 (Lohardaga)</SelectItem>
    <SelectItem value="JH-17">JH-17 (Pakur)</SelectItem>
    <SelectItem value="JH-18">JH-18 (Palamu)</SelectItem>
    <SelectItem value="JH-19">JH-19 (Ramgarh)</SelectItem>
    <SelectItem value="JH-20">JH-20 (Ranchi)</SelectItem>
    <SelectItem value="JH-21">JH-21 (Sahibganj)</SelectItem>
    <SelectItem value="JH-22">JH-22 (Seraikela Kharsawan)</SelectItem>
    <SelectItem value="JH-23">JH-23 (Simdega)</SelectItem>
    <SelectItem value="JH-24">JH-24 (West Singhbhum)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Uttarakhand" && (
  <>
    <SelectItem value="UK-01">UK-01 (Dehradun)</SelectItem>
    <SelectItem value="UK-04">UK-04 (Haridwar)</SelectItem>
    <SelectItem value="UK-05">UK-05 (Nainital)</SelectItem>
    <SelectItem value="UK-09">UK-09 (Almora)</SelectItem>
    <SelectItem value="UK-11">UK-11 (Pauri Garhwal)</SelectItem>
    <SelectItem value="UK-12">UK-12 (Pithoragarh)</SelectItem>
    <SelectItem value="UK-13">UK-13 (Rudraprayag)</SelectItem>
    <SelectItem value="UK-15">UK-15 (Udham Singh Nagar)</SelectItem>
    <SelectItem value="UK-16">UK-16 (Tehri Garhwal)</SelectItem>
    <SelectItem value="UK-19">UK-19 (Champawat)</SelectItem>
    <SelectItem value="UK-20">UK-20 (Bageshwar)</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Chandigarh" && (
  <>
    <SelectItem value="CH-02">CH-02 (Chandigarh Central)</SelectItem>
    <SelectItem value="CH-03">CH-03 (Chandigarh South)</SelectItem>
    <SelectItem value="CH-04">CH-04 (Chandigarh North)</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Assam" && (
  <>
    <SelectItem value="AS-08">AS-08 (Barpeta)</SelectItem>
    <SelectItem value="AS-09">AS-09 (Bongaigaon)</SelectItem>
    <SelectItem value="AS-10">AS-10 (Cachar)</SelectItem>
    <SelectItem value="AS-11">AS-11 (Darrang)</SelectItem>
    <SelectItem value="AS-13">AS-13 (Dibrugarh)</SelectItem>
    <SelectItem value="AS-14">AS-14 (Goalpara)</SelectItem>
    <SelectItem value="AS-15">AS-15 (Golaghat)</SelectItem>
    <SelectItem value="AS-16">AS-16 (Hailakandi)</SelectItem>
    <SelectItem value="AS-17">AS-17 (Jorhat)</SelectItem>
    <SelectItem value="AS-18">AS-18 (Kamrup)</SelectItem>
    <SelectItem value="AS-19">AS-19 (Karbi Anglong)</SelectItem>
    <SelectItem value="AS-20">AS-20 (Karimganj)</SelectItem>
    <SelectItem value="AS-21">AS-21 (Kokrajhar)</SelectItem>
    <SelectItem value="AS-22">AS-22 (Lakhimpur)</SelectItem>
    <SelectItem value="AS-23">AS-23 (Majuli)</SelectItem>
    <SelectItem value="AS-24">AS-24 (Morigaon)</SelectItem>
    <SelectItem value="AS-25">AS-25 (Nagaon)</SelectItem>
    <SelectItem value="AS-27">AS-27 (Nalbari)</SelectItem>
    <SelectItem value="AS-28">AS-28 (Sivasagar)</SelectItem>
    <SelectItem value="AS-29">AS-29 (Sonitpur)</SelectItem>
    <SelectItem value="AS-31">AS-31 (Tinsukia)</SelectItem>
    <SelectItem value="AS-32">AS-32 (Dhemaji)</SelectItem>
    <SelectItem value="AS-33">AS-33 (Chirang)</SelectItem>
    <SelectItem value="AS-34">AS-34 (Baksa)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Jammu and Kashmir" && (
  <>
    <SelectItem value="JK-05">JK-05 (Anantnag)</SelectItem>
    <SelectItem value="JK-06">JK-06 (Baramulla)</SelectItem>
    <SelectItem value="JK-07">JK-07 (Budgam)</SelectItem>
    <SelectItem value="JK-08">JK-08 (Doda)</SelectItem>
    <SelectItem value="JK-09">JK-09 (Jammu)</SelectItem>
    <SelectItem value="JK-11">JK-11 (Kathua)</SelectItem>
    <SelectItem value="JK-12">JK-12 (Kishtwar)</SelectItem>
    <SelectItem value="JK-14">JK-14 (Kulgam)</SelectItem>
    <SelectItem value="JK-15">JK-15 (Kupwara)</SelectItem>
    <SelectItem value="JK-17">JK-17 (Poonch)</SelectItem>
    <SelectItem value="JK-19">JK-19 (Rajouri)</SelectItem>
    <SelectItem value="JK-20">JK-20 (Samba)</SelectItem>
    <SelectItem value="JK-21">JK-21 (Shopian)</SelectItem>
    <SelectItem value="JK-22">JK-22 (Udhampur)</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Himachal Pradesh" && (
  <>
    <SelectItem value="HP-01">HP-01 (Kangra)</SelectItem>
    <SelectItem value="HP-02">HP-02 (Mandi)</SelectItem>
    <SelectItem value="HP-03">HP-03 (Solan)</SelectItem>
    <SelectItem value="HP-04">HP-04 (Chamba)</SelectItem>
    <SelectItem value="HP-05">HP-05 (Kullu)</SelectItem>
    <SelectItem value="HP-06">HP-06 (Bilaspur)</SelectItem>
    <SelectItem value="HP-07">HP-07 (Hamirpur)</SelectItem>
    <SelectItem value="HP-08">HP-08 (Una)</SelectItem>
    <SelectItem value="HP-09">HP-09 (Sirmaur)</SelectItem>
    <SelectItem value="HP-11">HP-11 (Kullu)</SelectItem>
    <SelectItem value="HP-13">HP-13 (Shimla)</SelectItem>
    <SelectItem value="HP-14">HP-14 (Una)</SelectItem>
    <SelectItem value="HP-15">HP-15 (Solan)</SelectItem>
    <SelectItem value="HP-16">HP-16 (Chamba)</SelectItem>
    <SelectItem value="HP-17">HP-17 (Kangra)</SelectItem>
    <SelectItem value="HP-18">HP-18 (Bilaspur)</SelectItem>
    <SelectItem value="HP-19">HP-19 (Hamirpur)</SelectItem>
    <SelectItem value="HP-21">HP-21 (Kullu)</SelectItem>
    <SelectItem value="HP-23">HP-23 (Mandi)</SelectItem>
    <SelectItem value="HP-24">HP-24 (Sirmaur)</SelectItem>
    <SelectItem value="HP-25">HP-25 (Solan)</SelectItem>
    <SelectItem value="HP-26">HP-26 (Una)</SelectItem>
    <SelectItem value="HP-27">HP-27 (Bilaspur)</SelectItem>
    <SelectItem value="HP-29">HP-29 (Chamba)</SelectItem>
    <SelectItem value="HP-30">HP-30 (Hamirpur)</SelectItem>
    <SelectItem value="HP-31">HP-31 (Shimla)</SelectItem>
    <SelectItem value="HP-32">HP-32 (Kangra)</SelectItem>
    <SelectItem value="HP-33">HP-33 (Mandi)</SelectItem>
    <SelectItem value="HP-34">HP-34 (Solan)</SelectItem>
    <SelectItem value="HP-35">HP-35 (Kullu)</SelectItem>
    <SelectItem value="HP-37">HP-37 (Chamba)</SelectItem>
    <SelectItem value="HP-38">HP-38 (Sirmaur)</SelectItem>
    <SelectItem value="HP-39">HP-39 (Bilaspur)</SelectItem>
    <SelectItem value="HP-40">HP-40 (Hamirpur)</SelectItem>
    <SelectItem value="HP-41">HP-41 (Shimla)</SelectItem>
    <SelectItem value="HP-42">HP-42 (Una)</SelectItem>
    <SelectItem value="HP-43">HP-43 (Kullu)</SelectItem>
    <SelectItem value="HP-44">HP-44 (Solan)</SelectItem>
    <SelectItem value="HP-45">HP-45 (Chamba)</SelectItem>
    <SelectItem value="HP-46">HP-46 (Sirmaur)</SelectItem>
    <SelectItem value="HP-47">HP-47 (Bilaspur)</SelectItem>
    <SelectItem value="HP-48">HP-48 (Hamirpur)</SelectItem>
    <SelectItem value="HP-49">HP-49 (Shimla)</SelectItem>
    <SelectItem value="HP-50">HP-50 (Kullu)</SelectItem>
    <SelectItem value="HP-51">HP-51 (Solan)</SelectItem>
    <SelectItem value="HP-52">HP-52 (Chamba)</SelectItem>
    <SelectItem value="HP-53">HP-53 (Sirmaur)</SelectItem>
    <SelectItem value="HP-54">HP-54 (Bilaspur)</SelectItem>
    <SelectItem value="HP-56">HP-56 (Hamirpur)</SelectItem>
    <SelectItem value="HP-57">HP-57 (Shimla)</SelectItem>
    <SelectItem value="HP-59">HP-59 (Kullu)</SelectItem>
    <SelectItem value="HP-60">HP-60 (Solan)</SelectItem>
    <SelectItem value="HP-61">HP-61 (Chamba)</SelectItem>
    <SelectItem value="HP-62">HP-62 (Sirmaur)</SelectItem>
    <SelectItem value="HP-63">HP-63 (Bilaspur)</SelectItem>
    <SelectItem value="HP-64">HP-64 (Hamirpur)</SelectItem>
    <SelectItem value="HP-65">HP-65 (Shimla)</SelectItem>
    <SelectItem value="HP-66">HP-66 (Kullu)</SelectItem>
    <SelectItem value="HP-67">HP-67 (Solan)</SelectItem>
    <SelectItem value="HP-68">HP-68 (Chamba)</SelectItem>
    <SelectItem value="HP-69">HP-69 (Sirmaur)</SelectItem>
    <SelectItem value="HP-70">HP-70 (Bilaspur)</SelectItem>
    <SelectItem value="HP-71">HP-71 (Hamirpur)</SelectItem>
    <SelectItem value="HP-72">HP-72 (Shimla)</SelectItem>
    <SelectItem value="HP-73">HP-73 (Kullu)</SelectItem>
    <SelectItem value="HP-74">HP-74 (Solan)</SelectItem>
    <SelectItem value="HP-76">HP-76 (Chamba)</SelectItem>
    <SelectItem value="HP-77">HP-77 (Sirmaur)</SelectItem>
    <SelectItem value="HP-79">HP-79 (Bilaspur)</SelectItem>
    <SelectItem value="HP-80">HP-80 (Hamirpur)</SelectItem>
    <SelectItem value="HP-81">HP-81 (Shimla)</SelectItem>
    <SelectItem value="HP-82">HP-82 (Kullu)</SelectItem>
    <SelectItem value="HP-83">HP-83 (Solan)</SelectItem>
    <SelectItem value="HP-84">HP-84 (Chamba)</SelectItem>
    <SelectItem value="HP-85">HP-85 (Sirmaur)</SelectItem>
    <SelectItem value="HP-86">HP-86 (Bilaspur)</SelectItem>
    <SelectItem value="HP-87">HP-87 (Hamirpur)</SelectItem>
    <SelectItem value="HP-88">HP-88 (Shimla)</SelectItem>
    <SelectItem value="HP-89">HP-89 (Kullu)</SelectItem>
    <SelectItem value="HP-90">HP-90 (Solan)</SelectItem>
    <SelectItem value="HP-91">HP-91 (Chamba)</SelectItem>
    <SelectItem value="HP-92">HP-92 (Sirmaur)</SelectItem>
    <SelectItem value="HP-93">HP-93 (Bilaspur)</SelectItem>
    <SelectItem value="HP-94">HP-94 (Hamirpur)</SelectItem>
    <SelectItem value="HP-95">HP-95 (Shimla)</SelectItem>
    <SelectItem value="HP-96">HP-96 (Kullu)</SelectItem>
    <SelectItem value="HP-97">HP-97 (Solan)</SelectItem>
    <SelectItem value="HP-98">HP-98 (Chamba)</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Mizoram" && (
  <>
    <SelectItem value="MZ-07">MZ-07</SelectItem>
    <SelectItem value="MZ-08">MZ-08</SelectItem>
    <SelectItem value="MZ-09">MZ-09</SelectItem>
    <SelectItem value="MZ-99">MZ-99</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Goa" && (
  <>
    <SelectItem value="GA-02">GA-02</SelectItem>
    <SelectItem value="GA-06">GA-06</SelectItem>
    <SelectItem value="GA-09">GA-09</SelectItem>
    <SelectItem value="GA-10">GA-10</SelectItem>
    <SelectItem value="GA-11">GA-11</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Nagaland" && (
  <>
    <SelectItem value="NL-01">NL-01</SelectItem>
    <SelectItem value="NL-02">NL-02</SelectItem>
    <SelectItem value="NL-03">NL-03</SelectItem>
    <SelectItem value="NL-04">NL-04</SelectItem>
    <SelectItem value="NL-05">NL-05</SelectItem>
    <SelectItem value="NL-06">NL-06</SelectItem>
    <SelectItem value="NL-07">NL-07</SelectItem>
    <SelectItem value="NL-08">NL-08</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Odisha" && (
  <>
    <SelectItem value="OD-07">OD-07</SelectItem>
    <SelectItem value="OD-12">OD-12</SelectItem>
    <SelectItem value="OD-14">OD-14</SelectItem>
    <SelectItem value="OD-16">OD-16</SelectItem>
    <SelectItem value="OD-17">OD-17</SelectItem>
    <SelectItem value="OD-18">OD-18</SelectItem>
    <SelectItem value="OD-19">OD-19</SelectItem>
    <SelectItem value="OD-20">OD-20</SelectItem>
    <SelectItem value="OD-21">OD-21</SelectItem>
    <SelectItem value="OD-22">OD-22</SelectItem>
    <SelectItem value="OD-27">OD-27</SelectItem>
    <SelectItem value="OD-28">OD-28</SelectItem>
    <SelectItem value="OD-29">OD-29</SelectItem>
    <SelectItem value="OD-30">OD-30</SelectItem>
    <SelectItem value="OD-31">OD-31</SelectItem>
    <SelectItem value="OD-32">OD-32</SelectItem>
    <SelectItem value="OD-35">OD-35</SelectItem>
    <SelectItem value="OR-01">OR-01</SelectItem>
    <SelectItem value="OR-02">OR-02</SelectItem>
    <SelectItem value="OR-03">OR-03</SelectItem>
    <SelectItem value="OR-04">OR-04</SelectItem>
    <SelectItem value="OR-05">OR-05</SelectItem>
    <SelectItem value="OR-06">OR-06</SelectItem>
    <SelectItem value="OR-07">OR-07</SelectItem>
    <SelectItem value="OR-08">OR-08</SelectItem>
    <SelectItem value="OR-09">OR-09</SelectItem>
    <SelectItem value="OR-10">OR-10</SelectItem>
    <SelectItem value="OR-11">OR-11</SelectItem>
    <SelectItem value="OR-12">OR-12</SelectItem>
    <SelectItem value="OR-13">OR-13</SelectItem>
    <SelectItem value="OR-14">OR-14</SelectItem>
    <SelectItem value="OR-15">OR-15</SelectItem>
    <SelectItem value="OR-16">OR-16</SelectItem>
    <SelectItem value="OR-17">OR-17</SelectItem>
    <SelectItem value="OR-18">OR-18</SelectItem>
    <SelectItem value="OR-19">OR-19</SelectItem>
    <SelectItem value="OR-20">OR-20</SelectItem>
    <SelectItem value="OR-21">OR-21</SelectItem>
    <SelectItem value="OR-22">OR-22</SelectItem>
    <SelectItem value="OR-23">OR-23</SelectItem>
    <SelectItem value="OR-24">OR-24</SelectItem>
    <SelectItem value="OR-25">OR-25</SelectItem>
    <SelectItem value="OR-26">OR-26</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Sikkim" && (
  <>
    <SelectItem value="SK-02">SK-02</SelectItem>
    <SelectItem value="SK-05">SK-05</SelectItem>
    <SelectItem value="SK-06">SK-06</SelectItem>
    <SelectItem value="SK-07">SK-07</SelectItem>
    <SelectItem value="SK-08">SK-08</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Puducherry" && (
  <>
    <SelectItem value="PY-01">PY-01</SelectItem>
    <SelectItem value="PY-02">PY-02</SelectItem>
    <SelectItem value="PY-03">PY-03</SelectItem>
    <SelectItem value="PY-04">PY-04</SelectItem>
    <SelectItem value="PY-05">PY-05</SelectItem>
    <SelectItem value="PY-11">PY-11</SelectItem>
    <SelectItem value="PY-51">PY-51</SelectItem>
    <SelectItem value="PY-99">PY-99</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Meghalaya" && (
  <>
    <SelectItem value="ML-01">ML-01</SelectItem>
    <SelectItem value="ML-02">ML-02</SelectItem>
    <SelectItem value="ML-03">ML-03</SelectItem>
    <SelectItem value="ML-04">ML-04</SelectItem>
    <SelectItem value="ML-05">ML-05</SelectItem>
    <SelectItem value="ML-06">ML-06</SelectItem>
    <SelectItem value="ML-07">ML-07</SelectItem>
    <SelectItem value="ML-08">ML-08</SelectItem>
    <SelectItem value="ML-09">ML-09</SelectItem>
    <SelectItem value="ML-10">ML-10</SelectItem>
    <SelectItem value="ML-11">ML-11</SelectItem>
    <SelectItem value="ML-12">ML-12</SelectItem>
    <SelectItem value="ML-13">ML-13</SelectItem>
    <SelectItem value="ML-14">ML-14</SelectItem>
    <SelectItem value="ML-99">ML-99</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Dadra and Nagar Haveli" && (
  <>
    <SelectItem value="DN-09">DN-09</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Daman and Diu" && (
  <>
    <SelectItem value="DD-01">DD-01</SelectItem>
    <SelectItem value="DD-02">DD-02</SelectItem>
    <SelectItem value="DD-03">DD-03</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Arunachal Pradesh" && (
  <>
    <SelectItem value="AR-01">AR-01</SelectItem>
    <SelectItem value="AR-02">AR-02</SelectItem>
    <SelectItem value="AR-03">AR-03</SelectItem>
    <SelectItem value="AR-04">AR-04</SelectItem>
    <SelectItem value="AR-05">AR-05</SelectItem>
    <SelectItem value="AR-06">AR-06</SelectItem>
    <SelectItem value="AR-07">AR-07</SelectItem>
    <SelectItem value="AR-08">AR-08</SelectItem>
    <SelectItem value="AR-09">AR-09</SelectItem>
    <SelectItem value="AR-10">AR-10</SelectItem>
    <SelectItem value="AR-11">AR-11</SelectItem>
    <SelectItem value="AR-12">AR-12</SelectItem>
    <SelectItem value="AR-13">AR-13</SelectItem>
    <SelectItem value="AR-14">AR-14</SelectItem>
    <SelectItem value="AR-15">AR-15</SelectItem>
    <SelectItem value="AR-16">AR-16</SelectItem>
    <SelectItem value="AR-17">AR-17</SelectItem>
    <SelectItem value="AR-20">AR-20</SelectItem>
    <SelectItem value="AR-26">AR-26</SelectItem>
  </>
)}

                  {step1Data.rto_state === "Tripura" && (
  <>
    <SelectItem value="TR-01">TR-01</SelectItem>
    <SelectItem value="TR-02">TR-02</SelectItem>
    <SelectItem value="TR-03">TR-03</SelectItem>
    <SelectItem value="TR-04">TR-04</SelectItem>
    <SelectItem value="TR-05">TR-05</SelectItem>
    <SelectItem value="TR-06">TR-06</SelectItem>
    <SelectItem value="TR-07">TR-07</SelectItem>
    <SelectItem value="TR-08">TR-08</SelectItem>
    <SelectItem value="TR-99">TR-99</SelectItem>
    <SelectItem value="TR-A4">TR-A4</SelectItem>
  </>
)}
                  {step1Data.rto_state === "Manipur" && (
  <>
    <SelectItem value="MN-01">MN-01</SelectItem>
    <SelectItem value="MN-02">MN-02</SelectItem>
    <SelectItem value="MN-03">MN-03</SelectItem>
    <SelectItem value="MN-04">MN-04</SelectItem>
    <SelectItem value="MN-05">MN-05</SelectItem>
    <SelectItem value="MN-06">MN-06</SelectItem>
    <SelectItem value="MN-07">MN-07</SelectItem>
    <SelectItem value="MN-08">MN-08</SelectItem>
  </>
)}
                  
                  {/* Add more states and RTOs as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Body Type</label>
              <Select 
                value={step1Data.body_type || ""}
                onValueChange={(value) => handleInputChange(0, "body_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Body Type" />
                </SelectTrigger>
                <SelectContent>
                  {isBike ? (
                    <>
                      <SelectItem value="Commuter">Commuter</SelectItem>
                      <SelectItem value="Cruiser">Cruiser</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Engine CC</label>
              <Input 
                type="number"
                value={step1Data.engine_cc || ""}
                onChange={(e) => handleInputChange(0, "engine_cc", e.target.value)}
                placeholder="Enter Engine CC"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Load Capacity</label>
              <Input 
                value={step1Data.load_capacity || ""}
                onChange={(e) => handleInputChange(0, "load_capacity", e.target.value)}
                placeholder="Enter load capacity"
              />
            </div>
          </div>
        </div>

        {/* Ownership & Usage Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Ownership & Usage</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">            
            <div>
              <label className="block text-sm font-medium mb-1">Ownership Type</label>
              <Select 
                value={step2Data.ownership_type || ""}
                onValueChange={(value) => handleInputChange(1, "ownership_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Ownership Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Own board">Own board</SelectItem>
                  <SelectItem value="T-board">T-board</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Insurance Validity</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={"w-full justify-start text-left font-normal"}>
                    {step2Data.insurance_validity ? format(new Date(step2Data.insurance_validity), "PPP") : "Pick a date"}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={step2Data.insurance_validity ? new Date(step2Data.insurance_validity) : undefined}
                    onSelect={(newDate) => {
                      handleInputChange(1, "insurance_validity", newDate ? format(newDate, "yyyy-MM-dd") : null);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Fuel Type 
              </label>
              <Select 
                value={step2Data.fuel_type || ""}
                onValueChange={(value) => {
                  handleInputChange(1, "fuel_type", value);
                  setIsElectric(value === "Electric");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  {isBike ? (
                    <>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="CNG">CNG</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="CNG">CNG</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="LPG">LPG</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Transmission Type</label>
              <Select 
                value={step2Data.transmission_type || ""}
                onValueChange={(value) => handleInputChange(1, "transmission_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Transmission Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                  <SelectItem value="AMT">AMT</SelectItem>
                  <SelectItem value="DCT">DCT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Color 
              </label>
              <Input 
                value={step2Data.color || ""}
                onChange={(e) => handleInputChange(1, "color", e.target.value)}
                placeholder="Enter vehicle color"
              />
            </div>
            
            {isElectric && (
              <div>
                <label className="block text-sm font-medium mb-1">EV Battery Health</label>
                <Select 
                  value={step2Data.battery_health || ""}
                  onValueChange={(value) => handleInputChange(1, "battery_health", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select EV Battery Health" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent (greater than 90%)">Excellent (&gt; 90%)</SelectItem>
                    <SelectItem value="Good (75-90%)">Good (75-90%)</SelectItem>
                    <SelectItem value="Average (60-75%)">Average (60-75%)</SelectItem>
                    <SelectItem value="Poor (less than 60%)">Poor (&lt; 60%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Any Modifications</label>
              <Textarea 
                value={step2Data.modifications || ""}
                onChange={(e) => handleInputChange(1, "modifications", e.target.value)}
                placeholder="Enter details of any modifications made to the vehicle"
                className="h-24"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Condition Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Vehicle Condition</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Warranty Status 
              </label>
              <Select 
                value={step3Data.warranty_status || ""}
                onValueChange={(value) => handleInputChange(2, "warranty_status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Warranty Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finished">Finished</SelectItem>
                  <SelectItem value="At Present">At Present</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Loan Status</label>
              <Select 
                value={step3Data.loan_status || ""}
                onValueChange={(value) => handleInputChange(2, "loan_status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Loan Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No Loan</SelectItem>
                  <SelectItem value="Yes-not completed">Yes - Not Completed</SelectItem>
                  <SelectItem value="Yes-got NOC">Yes - Got NOC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tyre Condition</label>
              <Select 
                value={step3Data.tire_condition || ""}
                onValueChange={(value) => handleInputChange(2, "tire_condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Tire Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Bad">Bad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Permit Type</label>
              <Select 
                value={step3Data.permit_type || ""}
                onValueChange={(value) => handleInputChange(2, "permit_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Permit Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="National">National</SelectItem>
                  <SelectItem value="State">State</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fitness Certificate</label>
              <Select 
                value={step3Data.fitness_certificate || ""}
                onValueChange={(value) => handleInputChange(2, "fitness_certificate", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Battery Condition of Vehicle</label>
              <Select 
                value={step3Data.vehicle_battery || ""}
                onValueChange={(value) => handleInputChange(2, "vehicle_battery", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Good</SelectItem>
                  <SelectItem value="No">Not Good</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Accident History</label>
              <Textarea 
                value={step3Data.accident_history || ""}
                onChange={(e) => handleInputChange(2, "accident_history", e.target.value)}
                placeholder="Enter details of any accidents the vehicle has been in"
                className="h-24"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Major Replacements</label>
              <Textarea 
                value={step3Data.major_replacements || ""}
                onChange={(e) => handleInputChange(2, "major_replacements", e.target.value)}
                placeholder="Enter details of any major parts replaced"
                className="h-24"
              />
            </div>
          </div>
        </div>

        {/* Seller Details Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Seller Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">   
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Contact Time</label>
              <Select 
                value={step5Data.preferred_contact_time || ""}
                onValueChange={(value) => handleInputChange(4, "preferred_contact_time", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="Afternoon (12 PM - 6 PM)">Afternoon (12 PM - 6 PM)</SelectItem>
                  <SelectItem value="Evening (6 PM - 9 PM)">Evening (6 PM - 9 PM)</SelectItem>
                  <SelectItem value="Anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reason for Sale</label>
              <Input 
                value={step5Data.reason_for_sale || ""}
                onChange={(e) => handleInputChange(4, "reason_for_sale", e.target.value)}
                placeholder="Why are you selling?"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Additional Accessories</label>
              <Textarea 
                value={step5Data.additional_accessories || ""}
                onChange={(e) => handleInputChange(4, "additional_accessories", e.target.value)}
                placeholder="List any additional accessories included with the vehicle"
                className="h-24"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentPage = () => {
    const step6Data = stepData[5] || {};

    const saveStep6ToLocalStorage = (aadhaar, pan, agreements) => {
      localStorage.setItem(
        'appointment_step6_data',
        JSON.stringify({
          aadhaar_number: aadhaar,
          pan_number: pan,
          terms_agreement: agreements.termsAndCondition,
          data_agreement: agreements.RequiredDocuments,
          privacy_agreement: agreements.privacyPolicy,
        })
      );
    };

    return (
      <div className="space-y-8">
        {/* Verification Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Verification & Legal Compliance</h3>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Important Note</h4>
                  <p className="text-sm mt-1">
                    To ensure legal compliance and verify your identity, we require either your Aadhaar or PAN details. 
                    This information will be securely stored and only used for verification purposes.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Identification Document <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Aadhaar Number (16 digits)
                  </label>
                  <Input 
                    value={step6Data.aadhaar_number || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                      handleInputChange(5, "aadhaar_number", value);
                    }}
                    onBlur={() => saveStep6ToLocalStorage(
                      stepData[5]?.aadhaar_number || "",
                      stepData[5]?.pan_number || "",
                      agreements
                    )}
                    placeholder="Enter Aadhaar number"
                    maxLength={16}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    OR PAN Number
                  </label>
                  <Input 
                    value={step6Data.pan_number || ""}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().slice(0, 10);
                      handleInputChange(5, "pan_number", value);
                    }}
                    onBlur={() => saveStep6ToLocalStorage(
                      stepData[5]?.aadhaar_number || "",
                      stepData[5]?.pan_number || "",
                      agreements
                    )}
                    placeholder="Enter PAN number"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Agreement checkboxes section */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreements.termsAndCondition}
                  onCheckedChange={(checked) => {
                    handleAgreementChange("termsAndCondition")(!!checked);
                    saveStep6ToLocalStorage(
                      stepData[5]?.aadhaar_number || "",
                      stepData[5]?.pan_number || "",
                      { ...agreements, termsAndCondition: !!checked }
                    );
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary underline underline-offset-2"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/terms";
                      }}
                    >
                      Terms and Conditions
                    </a>
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={agreements.privacyPolicy}
                  onCheckedChange={(checked) => {
                    handleAgreementChange("privacyPolicy")(!!checked);
                    saveStep6ToLocalStorage(
                      stepData[5]?.aadhaar_number || "",
                      stepData[5]?.pan_number || "",
                      { ...agreements, privacyPolicy: !!checked }
                    );
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="privacy">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary underline underline-offset-2"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/privacy";
                      }}
                    >
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="documents"
                  checked={agreements.RequiredDocuments}
                  onCheckedChange={(checked) => {
                    handleAgreementChange("RequiredDocuments")(!!checked);
                    saveStep6ToLocalStorage(
                      stepData[5]?.aadhaar_number || "",
                      stepData[5]?.pan_number || "",
                      { ...agreements, RequiredDocuments: !!checked }
                    );
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="documents">
                    I agree to provide all Required Documents
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <Pricing 
            onBack={handleBack}
            expectedPrice={getExpectedPrice()}
            selectedFeatures={getSelectedFeatures()}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderOptionalDetails();
      case 2:
        return renderPaymentPage();
      default:
        return renderOptionalDetails();
    }
  };

  const progressStep = currentStep - 1;

  // Sync agreements state with step6Data
  useEffect(() => {
    if (stepData[5]) {
      setAgreements({
        termsAndCondition: !!stepData[5].termsAndCondition,
        privacyPolicy: !!stepData[5].privacyPolicy,
        RequiredDocuments: !!stepData[5].RequiredDocuments,
      });
    }
  }, [stepData[5]]);

  // Sync agreements to stepData when changed
  useEffect(() => {
    updateStepData(5, {
      termsAndCondition: agreements.termsAndCondition,
      privacyPolicy: agreements.privacyPolicy,
      RequiredDocuments: agreements.RequiredDocuments,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreements]);

  const handleAgreementChange = (type: keyof typeof agreements) => (checked: boolean) => {
    setAgreements(prev => ({ ...prev, [type]: checked }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 mt-8 sm:mt-12 lg:mt-16">
            <ProgressBar currentStep={progressStep} steps={steps} />
          </div>
          
          <div className="bg-background rounded-lg shadow-sm p-6 border border-border">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                ← Back 
              </Button>
              
              <div className="flex gap-3">
                
                {currentStep < 2 && (
                  <Button 
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Next →
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;
