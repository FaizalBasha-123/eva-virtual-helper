
import React from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Privacy = () => {
  return (
    <Layout>
      <SEOHead
        title="VahaanXchange Privacy Policy | User Rights"
        description="Read the VahaanXchange Privacy Policy to learn how your data is collected, used, and protected when buying or selling used vehicles on our platform."
        canonicalUrl="https://www.vahaanxchange.com/privacy"
      />
      <div className="container mx-auto px-4 pt-24 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Privacy Policy</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">This is the official VahaanXchange Privacy Policy. Learn how we protect your data and your rights as a user of our used car and bike marketplace.</p>
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-8">
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <p className="text-lg mb-6">
                At VahaanXchange (operated by Matchorax Technologies Private Limited), protecting your privacy is a priority.
                This Privacy Policy describes how we collect, use, disclose, and protect your information.
              </p>
              
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
              
              <h3 className="font-semibold mt-4 mb-2">(a) Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Name, phone number, email address, address</li>
                <li>Government-issued ID details (for verification)</li>
                <li>Bank/payment details (if applicable)</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">(b) Vehicle Information</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Registration details</li>
                <li>VIN/Chassis number</li>
                <li>Service and insurance history</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">(c) Usage Information</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Device info, browser type, IP address</li>
                <li>Activity logs, cookies, and tracking data</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Facilitate account creation and login</li>
                <li>Connect buyers and sellers</li>
                <li>Authenticate user identity and ownership</li>
                <li>Improve platform functionality and user experience</li>
                <li>Communicate important updates or promotional offers</li>
                <li>Prevent fraud and maintain security</li>
                <li>Comply with legal requirements</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">3. Sharing Your Information</h2>
              <p className="text-muted-foreground mb-4">We may share your data:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>With other users during transactions</li>
                <li>With trusted third-party service providers (e.g., payment gateways, verification agencies)</li>
                <li>As required by law enforcement or regulatory authorities</li>
                <li>In case of merger, sale, or acquisition of the Company</li>
              </ul>
              <p className="text-muted-foreground mb-4">We do not sell your personal data for marketing purposes.</p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
              <p className="text-muted-foreground mb-4">We use industry-standard safeguards to protect your information.</p>
              <p className="text-muted-foreground mb-4">However, no platform can guarantee 100% security. You share information at your own risk.</p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">Depending on your jurisdiction, you may:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Access, correct, or delete your data</li>
                <li>Object to or restrict processing</li>
                <li>Request data portability</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="text-muted-foreground mb-4">Requests can be made by contacting support@vahaanxchange.com.</p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground mb-4">We retain your personal information as long as necessary for platform operations or as required by law.</p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Third-Party Links</h2>
              <p className="text-muted-foreground mb-4">Our platform may contain links to external websites.
              We are not responsible for their content or privacy practices.</p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">Our services are not intended for individuals under the age of 18.
              We do not knowingly collect data from minors.</p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">We may update this Privacy Policy periodically.
              Changes will be posted and your continued use of the platform will constitute acceptance.</p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground mb-4">If you have questions about this Privacy Policy:</p>
              <ul className="list-none pl-6 mb-4 text-muted-foreground">
                <li>Email: admin@vahaanxchange.com</li>
                <li>Phone: +91 810-810-4175</li>
                <li>Address: Egattur, Chennai</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">Ownership Notice</h2>
              <p className="text-muted-foreground mb-4">VahaanXchange is operated by Matchorax Technologies Private Limited.
              All rights related to the platform, data, and content are reserved by Matchorax Technologies.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
