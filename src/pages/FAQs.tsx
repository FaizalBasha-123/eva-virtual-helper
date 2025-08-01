
import React from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/seo/SEOHead";

const FAQs = () => {
  return (
    <Layout>
      <SEOHead
        title="VahaanXchange FAQs | Frequently Asked Questions About Buying & Selling"
        description="Find answers to common questions about buying and selling used cars and bikes on VahaanXchange. Learn about our process, safety, and support."
        canonicalUrl="https://www.vahaanxchange.com/faqs"
      />
      <div className="container mx-auto px-4 pt-24
  max-w-sm
  sm:max-w-md
  md:max-w-lg
  lg:max-w-xl
  xl:max-w-2xl
  2xl:max-w-4xl
">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">FAQs</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-4">Explore the most frequently asked questions about VahaanXchange. Get help with buying, selling, safety, and using our platform for used vehicles.</p>
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium">
                  How does VahaanXchange work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  VahaanXchange is a platform that connects vehicle buyers and sellers. Sellers can list their vehicles with details and photos, while buyers can browse listings, connect with sellers, and make offers. We provide AI-powered price estimates, verification services, and facilitate the entire buying and selling process to make it transparent and hassle-free.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium">
                  Is it free to use VahaanXchange?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, basic browsing and listing your vehicle on VahaanXchange is completely free. We may charge nominal fees for premium features like featured listings, professional photoshoots, or expedited verification services, but these are always clearly marked as paid services before you opt for them.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-medium">
                  Can I sell my bike or only cars?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  VahaanXchange supports both car and bike listings. Our platform is designed to accommodate various vehicle types, making it easy for both car and bike owners to list their vehicles and find potential buyers interested in their specific category.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium">
                  How do I verify a vehicle's ownership?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  To verify vehicle ownership, we recommend checking the Registration Certificate (RC), ensuring it matches the seller's ID, reviewing service records, and looking for loan NOC if applicable. Our platform also offers Aadhar-verified seller profiles for added security. For complete peace of mind, consider using our inspection service where our experts can verify all documents.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium">
                  What should I do if I encounter fraud?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  If you suspect fraud, immediately report it to our support team at support@vahaanxchange.com or call us at +91 88838 67155. Do not proceed with any payment or share additional personal information. Document all communications and transaction details. Our team will investigate the matter and take appropriate action to protect our users.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-medium">
                  How is the price of my vehicle determined?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our AI-powered pricing model analyzes multiple factors including market trends, vehicle age, mileage, condition, variant, location demand, service history, and comparable recent sales. This gives you a data-backed estimate, but sellers can still set their own asking price based on unique features or urgency.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-medium">
                  How long does it typically take to sell a vehicle?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The selling timeline varies based on vehicle type, condition, pricing, and location. Well-priced, popular models in good condition typically sell within 2-3 weeks. Premium or unique vehicles may take longer to find the right buyer. Our instant buying option can complete transactions in as little as 24-48 hours for those who need immediate sales.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-medium">
                  Does VahaanXchange handle the paperwork for transfers?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, we can assist with all necessary paperwork for vehicle ownership transfer. Our optional transfer assistance service helps with RC transfer, insurance transfers, and other documentation requirements. We partner with RTO agents who can handle the process efficiently, saving both buyers and sellers from navigating the complex paperwork.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQs;
