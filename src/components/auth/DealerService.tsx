
// Use untyped supabase client to avoid type errors for dealer_details
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = "https://iaptxaruwnwqeukrjibq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcHR4YXJ1d253cWV1a3JqaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQ0NTQsImV4cCI6MjA2OTA5MDQ1NH0.VxJGls9WiYXIATCUHmlZ2VjbJJKgiRSzgx6cqXTfKa8";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const DealerService = {
  async upsertDealer({ phoneNumber, dealerName }) {
    // Upsert dealer into dealer_details table (runtime cast)
    return await supabase
      .from("dealer_details")
      .upsert(
        {
          phone_number: parseInt(phoneNumber),
          name: dealerName,
        },
        {
          onConflict: "phone_number",
        }
      )
      .select()
      .single();
  },

  async getDealerId(phoneNumber) {
    // Fetch dealer id from dealer_details using phone number (runtime cast)
    const { data, error } = await supabase
      .from("dealer_details")
      .select("id")
      .eq("phone_number", parseInt(phoneNumber))
      .single();
    if (!error && data && (data as any).id) {
      return (data as any).id;
    }
    return null;
  },
};
