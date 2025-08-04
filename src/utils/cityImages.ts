
// City Image mapping for the Popular Cities section
type CityImageMap = {
  [key: string]: string;
};

export const cityImages: CityImageMap = {
  // Add the custom image for Ahmedabad
  "Ahmedabad": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Bangalore": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Chandigarh": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Chennai": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Delhi NCR": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Gurgaon": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Hyderabad": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Jaipur": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Mumbai": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "New Delhi": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Noida": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png",
  "Pune": "/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png"
};

// Default image to use if a city doesn't have a specific image assigned
export const getDefaultCityImage = (): string => {
  return "https://plus.unsplash.com/premium_photo-1697730464803-fcede713753e?w=128&h=128&fit=crop";
};

// Get the image URL for a specific city
export const getCityImageUrl = (cityName: string): string => {
  return cityImages[cityName] || getDefaultCityImage();
};
