
/**
 * Utility to dynamically load the EmailJS script
 */
export const loadEmailJsScript = () => {
  if (document.getElementById('emailjs-sdk')) return;
  
  const script = document.createElement('script');
  script.id = 'emailjs-sdk';
  script.src = 'https://cdn.emailjs.com/sdk/2.6.4/email.min.js';
  script.async = true;
  
  script.onload = () => {
    // Initialize EmailJS with your public key
    // @ts-ignore
    if (window.emailjs) {
      // @ts-ignore
      window.emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
    }
  };
  
  document.body.appendChild(script);
};

// Helper to dispatch an event when city is selected in the same window
export const notifyCitySelected = () => {
  window.dispatchEvent(new Event('citySelected'));
};

// Send vehicle data via EmailJS
export const sendVehicleDataEmail = async (vehicleData: {
  vehicleType: string;
  brand: string;
  year: string;
  model: string;
  variant: string;
  kilometers: string;
  city: string;
  phoneNumber: string;
}) => {
  // Build email template data
  const emailData = {
    to_email: "faizalbashasfaizalbashas@gmail.com",
    subject: "New Manual Car Entry Request - VahaanXchange",
    vehicle_type: vehicleData.vehicleType,
    brand: vehicleData.brand,
    year: vehicleData.year,
    model: vehicleData.model,
    variant: vehicleData.variant,
    kilometers: vehicleData.kilometers,
    city: vehicleData.city,
    phone_number: vehicleData.phoneNumber
  };
  
  try {
    // @ts-ignore
    const result = await window.emailjs.send(
      "service_id", // Replace with your EmailJS service ID
      "template_id", // Replace with your EmailJS template ID
      emailData,
      "public_key" // Replace with your EmailJS public key
    );
    
    return { success: true, result };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
};

// Process any saved vehicle form data after login
export const setupPostLoginHandler = (callback?: () => void) => {
  const handlePostLogin = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail?.formData) {
      const formData = customEvent.detail.formData;
      
      // Access user phone number from current user
      // This would be implemented based on your auth system
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const phoneNumber = user.phone || 'Not provided';
      
      // Auto-submit the email with the saved data
      sendVehicleDataEmail({
        ...formData,
        phoneNumber
      });
      
      // Clean up the saved form data
      localStorage.removeItem('vehicleFormData');
      
      // Optional callback
      if (callback) callback();
    }
  };
  
  window.addEventListener('userSignedIn', handlePostLogin);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('userSignedIn', handlePostLogin);
  };
};
