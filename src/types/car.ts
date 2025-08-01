
export interface CarType {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  image?: string; // Making this optional since some data might not have it
  imageUrl?: string; // Added for backward compatibility
  transmission?: string; // Making this optional to match the data structure
  fuelType?: string; // Added for backward compatibility
  fuel?: string;
  owners?: number;
  brand?: string;
  model?: string;
  variant?: string;
  color?: string;
  engineSize?: number;
  features?: string[];
  rating?: number;
  description?: string;
  postedDate?: string;
  sellerType?: 'dealer' | 'individual';
  emi?: number;
  seats?: number;
  owner?: string;
  featured?: boolean;
  assured?: boolean;
  highlightFeatures?: string[];
  seller?: string;
  
  // Explicitly define these properties
  registerYear?: number;
  registerNumber?: string;
  insurance?: string;
  bsNorm?: string;
}
