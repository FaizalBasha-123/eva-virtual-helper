
import React from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Terms = () => {
  return (
    <Layout>
      <SEOHead
        title="VahaanXchange Terms and Conditions | User Agreement & Platform Rules"
        description="Read the official Terms and Conditions for using VahaanXchange. Learn about user rights, responsibilities, and platform policies for buying and selling used vehicles."
        canonicalUrl="https://www.vahaanxchange.com/terms"
      />
      <div className="container mx-auto  px-4 pt-24 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Terms & Conditions</span>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-4">Welcome to the official VahaanXchange Terms and Conditions page. Here you’ll find all the rules, user rights, and platform policies for buying and selling used cars and bikes on VahaanXchange.</p>
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-8">
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              <p className="text-lg mb-6">
                Welcome to VahaanXchange ("Company", "we", "our", or "us"), operated by Matchorax Technologies Private Limited.
                By signing up and using our platform, you ("User", "Buyer", "Seller", "you") agree to comply with and be legally bound by these Terms and Conditions ("Terms").
                If you do not agree to these Terms, you must not access or use our services.
              </p>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">1. Eligibility</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>You must be at least 18 years old and legally capable of entering into binding contracts.</li>
                <li>You must provide accurate, complete, and updated information during registration.</li>
                <li>We reserve the right to suspend or terminate your account if any information provided is inaccurate or incomplete.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">2. User Obligations</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>You agree to use the platform for lawful purposes only.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must not impersonate any other person or entity.</li>
                <li>Sellers must ensure that vehicles listed are legally owned and free of undisclosed encumbrances.</li>
                <li>Buyers must conduct proper due diligence before completing any transaction.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">3. Listings and Transactions</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>VahaanXchange is an online platform that facilitates connections between buyers and sellers. We are not a party to any transaction.</li>
                <li>All negotiations, inspections, payments, and ownership transfers are handled directly between buyers and sellers.</li>
                <li>VahaanXchange does not guarantee the quality, legality, authenticity, or ownership of listed vehicles.</li>
                <li>We recommend verifying documents (e.g., RC, insurance, service history) independently before purchase.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">4. Fees and Payments</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Registration is currently free unless specified otherwise.</li>
                <li>Any future charges, service fees, or premium features will be informed separately and governed by these Terms.</li>
                <li>VahaanXchange is not responsible for payment disputes between users.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">5. Prohibited Activities</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Post false, misleading, or fraudulent information.</li>
                <li>List stolen or illegally obtained vehicles.</li>
                <li>Violate any local, state, national, or international law.</li>
                <li>Harm, harass, or defraud other users.</li>
                <li>Interfere with the platform's operation.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>All content, trademarks, designs, and proprietary technology of VahaanXchange are owned by Matchorax Technologies Private Limited.</li>
                <li>You may not reproduce, distribute, modify, or create derivative works without prior written consent.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>VahaanXchange is not liable for any damages, losses, or disputes arising from transactions between users.</li>
                <li>We are not responsible for fraud, misrepresentation, or failed transactions.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">8. Account Suspension and Termination</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>We may suspend or permanently terminate your account without notice if you violate these Terms or engage in harmful activity.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">9. Privacy</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Your data will be handled according to our Privacy Policy.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">10. Modifications</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>VahaanXchange reserves the right to modify these Terms at any time.</li>
                <li>Updated terms will be posted, and continued use of the platform constitutes acceptance.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">11. Governing Law and Jurisdiction</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>These Terms are governed by the laws of India.</li>
                <li>Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai.</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground mb-4">For queries, support, or concerns, contact:</p>
              <ul className="list-none pl-6 mb-4 text-muted-foreground">
                <li>Email: admin@vahaanxchange.com</li>
                <li>Phone: +91 810-810-4175</li>
                <li>Address: Egattur, Chennai</li>
              </ul>
              
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">13. Ownership and Rights</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>VahaanXchange is owned and operated by Matchorax Technologies Private Limited.</li>
                <li>All intellectual property rights relating to VahaanXchange are exclusively held by Matchorax Technologies.</li>
                <li>Unauthorized use of content, branding, or technology is strictly prohibited.</li>
                <li>All rights reserved.</li>
              </ul>
              <hr className="my-8" />
              
              <h2 className="text-xl font-semibold mt-8 mb-4">14. Listing and Advertising Terms</h2>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Whether a listing is posted through a paid or unpaid method (including promotional codes), the charges collected by VahaanXchange are solely for displaying the advertisement. </li>
                <li>VahaanXchange does not guarantee the availability or quality of potential buyers or sellers, whether verified or unverified. The company is not liable for any such outcomes.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
