
import React from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const AboutUs = () => {
  return (
    <Layout>
      <SEOHead
        title="About VahaanXchange - Trusted Peer-to-Peer Vehicle Marketplace"
        description="Learn about VahaanXchange, India's trusted platform for buying and selling used cars and bikes directly. Discover our mission, values, and how we empower individuals with a secure, commission-free marketplace."
        canonicalUrl="https://www.vahaanxchange.com/about-us"
      />
      <div className="container mx-auto px-4 pt-24 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">About Us</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-8">
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed mb-4">
                At VahaanXchange, we provide a simple, transparent, and secure digital platform 
                that enables individuals to buy and sell vehicles directly—without involvement 
                from intermediaries or external agents.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                With over 30 years of industry experience behind our vision, VahaanXchange is 
                designed to empower people to handle their own vehicle transactions—whether it's 
                a car, bike, scooter, or commercial vehicle.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are not a buyer, seller, or agent. We do not participate in transactions. 
                Our role is to offer a technology-driven space where genuine buyers and sellers 
                can connect, communicate, and carry out deals on their own terms.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our peer-to-peer platform helps users create listings, discover verified leads, 
                and engage in direct conversations—while we ensure that the experience remains safe, 
                secure, and user-controlled. A nominal platform fee is charged to maintain and enhance 
                service quality.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are committed to a future where every individual has the power to manage their 
                vehicle transactions with confidence, trust, and privacy.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                VahaanXchange — A Platform for People, Powered by Trust.
              </p>
              
              {/* Contact Block */}
              <div className="p-4 border border-border rounded-lg bg-secondary/50 dark:bg-gray-800 mt-8">
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-muted-foreground mb-1">
                  <span className="font-medium">Website:</span> www.vahaanxchange.com
                </p>
                <p className="text-muted-foreground mb-1">
                  <span className="font-medium">Contact:</span> 810-810-4175
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> admin@vahaanxchange.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
