
import React from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, Home, Mail, Phone, MapPin, Clock, Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/seo/SEOHead";
import LocationInput from "@/components/cars/LocationInput";
import CityModal from "@/components/cars/CityModal";
import { useCityStore } from '@/store/useCityStore';
import { useState } from 'react';

const Contact = () => {
  const { selectedCity } = useCityStore();
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  return (
    <Layout>
      <SEOHead
        title="Contact VahaanXchange - We're Here to Help!"
        description="Get in touch with VahaanXchange for support, questions, or feedback. Our team is ready to assist you with your vehicle buying and selling needs. Contact us today!"
        canonicalUrl="https://www.vahaanxchange.com/contact-us"
      />
      <div className="w-full min-h-screen bg-gradient-to-b from-blue-100 via-blue-200 to-blue-400 dark:from-[#1e293b] dark:via-[#1e40af] dark:to-[#2563eb] py-16 flex justify-center items-start">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Tagline Section */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#ff7b00' }}>Questions? Feedback? We're all ears and ready to help!</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-8 flex flex-col md:flex-row gap-10 items-stretch">
            {/* Left: Email Contact */}
            <div className="md:w-1/2 flex flex-col items-start justify-center border-r border-gray-200 dark:border-gray-800 pr-0 md:pr-8 mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">E-MAIL</span>
              </div>
              <a href="mailto:admin@vahaanxchange.com" className="text-lg text-muted-foreground hover:text-primary font-medium break-all">admin@vahaanxchange.com</a>
            </div>
            {/* Right: Contact Form */}
            <div className="md:w-1/2 flex flex-col items-stretch">
              <h2 className="text-center text-xl font-semibold mb-6">LET US CONTACT YOU</h2>
              <form className="space-y-5 w-full">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <LocationInput onClick={() => setIsCityModalOpen(true)} className="w-full" />
                  <CityModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
                  {selectedCity && (
                    <div className="text-xs text-muted-foreground mt-1">Selected city: <span className="font-medium text-primary">{selectedCity}</span></div>
                  )}
                </div>
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium mb-1">Feedback</label>
                  <Textarea id="feedback" name="feedback" placeholder="Please share your feedback, what can we improve?" rows={4} required className="w-full" />
                </div>
                <div>
                  <label htmlFor="file" className="block text-sm font-medium mb-1">Upload File</label>
                  <Input id="file" name="file" type="file" accept=".jpg,.png" className="w-full" />
                  <span className="text-xs text-muted-foreground">Upload .jpg, .png files only.</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" name="terms" required className="accent-primary" />
                  <label htmlFor="terms" className="text-sm">I agree to <a href="/terms" className="text-primary underline" target="_blank" rel="noopener noreferrer">Terms & Conditions</a></label>
                </div>
                <Button type="submit" className="w-full bg-primary text-white text-lg py-2 rounded-md">Submit</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
