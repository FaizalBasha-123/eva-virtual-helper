
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, CheckCircle, TrendingUp, ShieldCheck, Users, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PartnerBenefitCard = ({ icon, title, description }) => {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const Partner = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const businessTypes = [
    "Car Dealership",
    "Bike Dealership",
    "Auto Service Center",
    "Car Rental",
    "Bike Rental",
    "Insurance Provider",
    "Auto Parts Supplier",
    "Other"
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "We'll review your application and get back to you soon!",
    });
  };
  
  // Check authentication
  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500 hover:bg-blue-600">Partner Program</Badge>
          <h1 className="text-4xl font-bold mb-4">Join as a VahaanXchange Partner</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expand your reach by collaborating with India's smart vehicle marketplace.
          </p>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Benefits of Becoming a Partner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PartnerBenefitCard 
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
              title="Increased Visibility"
              description="Get your business in front of thousands of potential customers actively looking for vehicle services."
            />
            <PartnerBenefitCard 
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Qualified Leads"
              description="Connect with customers who are already interested in your services and ready to make decisions."
            />
            <PartnerBenefitCard 
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              title="Credibility & Trust"
              description="Association with VahaanXchange adds a layer of trust and credibility to your business."
            />
            <PartnerBenefitCard 
              icon={<Building className="h-6 w-6 text-primary" />}
              title="Business Growth"
              description="Expand your business through our platform and grow your customer base throughout India."
            />
            <PartnerBenefitCard 
              icon={<CheckCircle className="h-6 w-6 text-primary" />}
              title="Easy Onboarding"
              description="Simple sign-up process and dashboard to manage your business profile and interactions."
            />
            <PartnerBenefitCard 
              icon={<Briefcase className="h-6 w-6 text-primary" />}
              title="Marketing Support"
              description="Benefit from VahaanXchange's marketing initiatives and gain wider market exposure."
            />
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Partner Application</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Enter your full name" 
                      defaultValue={userProfile?.displayName || ""} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" placeholder="Enter your business name" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 12345 67890" 
                      defaultValue={userProfile?.phoneNumber || ""} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select required aria-label="Select business type">
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Your city" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">
                    Tell us about your business
                  </Label>
                  <Textarea 
                    id="businessDescription" 
                    placeholder="Describe your business and services offered..."
                    rows={5}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">Submit Application</Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  By submitting this form, you agree to VahaanXchange's terms and conditions.
                  Our team will review your application and contact you soon.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Partner;
