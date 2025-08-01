
export interface VehicleSlugData {
  brand: string;
  model: string;
  variant: string;
  fuelType: string;
  year: number;
  city: string;
  id: string;
}

export interface ParsedSlug {
  vehicleId: string;
  isValid: boolean;
  data?: VehicleSlugData;
}

/**
 * Converts text to URL-friendly slug format
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

/**
 * Generates SEO-friendly slug for vehicle details page
 */
export const generateVehicleSlug = (vehicle: {
  brand: string;
  model: string;
  variant: string;
  fuel_type: string;
  year: number;
  seller_location_city: string;
  id: string;
}): string => {
  const brand = slugify(vehicle.brand || 'unknown');
  const model = slugify(vehicle.model || 'unknown');
  const variant = slugify(vehicle.variant || 'base');
  const fuelType = slugify(vehicle.fuel_type || 'petrol');
  const year = vehicle.year || new Date().getFullYear();
  const city = slugify(vehicle.seller_location_city || 'india');
  const id = vehicle.id;

  return `used-${brand}-${model}-${variant}-${fuelType}-${year}-${city}-${id}`;
};

/**
 * Parses vehicle slug to extract ID and validate components
 */
export const parseVehicleSlug = (slug: string): ParsedSlug => {
  if (!slug || typeof slug !== 'string') {
    return { vehicleId: '', isValid: false };
  }

  // Expected format: used-{brand}-{model}-{variant}-{fuel}-{year}-{city}-{id}
  // The id is always a UUID (36 chars, with dashes)
  // We'll extract the last 36 characters as the id if it matches UUID format
  const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  const match = slug.match(uuidRegex);
  if (!match) {
    return { vehicleId: '', isValid: false };
  }
  const vehicleId = match[0];

  // Try to parse the components (optional validation)
  const parts = slug.split('-');
  if (parts.length >= 8) {
    const [, brand, model, variant, fuelType, yearStr, city] = parts;
    const year = parseInt(yearStr, 10);
    if (!isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 2) {
      return {
        vehicleId,
        isValid: true,
        data: {
          brand,
          model,
          variant,
          fuelType,
          year,
          city,
          id: vehicleId
        }
      };
    }
  }

  // If we can't parse all components but have a valid ID, still return it
  return { vehicleId, isValid: true };
};

/**
 * Generates proper page title for SEO
 */
export const generateVehicleTitle = (vehicle: {
  brand: string;
  model: string;
  variant: string;
  year: number;
  seller_location_city: string;
}, type: 'car' | 'bike'): string => {
  const vehicleType = type === 'car' ? 'Car' : 'Bike';
  return `Used ${vehicle.brand} ${vehicle.model} ${vehicle.variant} ${vehicle.year} in ${vehicle.seller_location_city} - VahaanXchange`;
};

/**
 * Generates meta description for SEO
 */
export const generateVehicleDescription = (vehicle: {
  brand: string;
  model: string;
  variant: string;
  year: number;
  seller_location_city: string;
  sell_price?: number;
  kilometers_driven?: number;
  fuel_type?: string;
}, type: 'car' | 'bike'): string => {
  const vehicleType = type === 'car' ? 'car' : 'bike';
  const price = vehicle.sell_price ? ` for ₹${vehicle.sell_price.toLocaleString()}` : '';
  const km = vehicle.kilometers_driven ? `, ${vehicle.kilometers_driven.toLocaleString()} km driven` : '';
  const fuel = vehicle.fuel_type ? `, ${vehicle.fuel_type}` : '';
  
  return `Buy used ${vehicle.brand} ${vehicle.model} ${vehicleType} in ${vehicle.seller_location_city}, ${vehicle.year} ${vehicle.variant} variant${price}${km}${fuel}. Verified seller. Zero commission.`;
};
