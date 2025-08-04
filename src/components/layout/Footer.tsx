import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, PhoneCall, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 dark:bg-gray-900 -mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              VahaanXchange – Smart & Secure Car Deals!
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Buy and sell with Aadhar-verified safety in a fraud-free marketplace. Get AI-powered price estimates and connect with mechanics, insurers, and more—all in one place.
            </p>
            <Separator className="my-2" />
            <p className="text-muted-foreground">Join now for a seamless experience! 🚗</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1AUeVrzwu5/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/vahaanxchange_official?utm_source=qr&igsh=NTI5OTdseTV5a3Zr" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a
  href="https://www.youtube.com/@VahaanXchange"
  target="_blank"
  rel="noopener noreferrer"
  className="text-foreground hover:text-primary transition-colors"
  aria-label="YouTube"
>
  <Youtube size={20} />
</a>

              {/* Added WhatsApp Button */}
              <a 
  href="https://wa.me/918108104175" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="text-foreground hover:text-primary transition-colors" 
  aria-label="WhatsApp"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    fill="currentColor" 
    className="mr-2" 
    viewBox="0 0 16 16"
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
  </svg>
</a>

            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/search-used-cars" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Cars
                </Link>
              </li>
              <li>
                <Link to="/search-used-bikes" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Bikes
                </Link>
              </li>
              <li>
                <Link to="/sell?mode=car" className="text-muted-foreground hover:text-primary transition-colors">
                  Sell Your Cars
                </Link>
              </li>
              <li>
                <Link to="/sell?mode=bike" className="text-muted-foreground hover:text-primary transition-colors">
                  Sell Your Bikes
                </Link>
              </li>
              <li>
                <Link to="/ai" className="text-muted-foreground hover:text-primary transition-colors">
                  Ask AI
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Help & Support - Updated links to point to the proper routes */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Help & Support</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Contact Us</h5>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Egattur, Chennai, Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneCall size={20} className="text-primary flex-shrink-0" />
                <a href="tel:+918108104175" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 810-810-4175
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <a href="mailto:info@vahaanxchange.com" className="text-muted-foreground hover:text-primary transition-colors">
                  admin@vahaanxchange.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} VahaanXchange- Matchorax technologies pvt ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
