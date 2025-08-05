import { supabase } from '@/integrations/supabase/client';

export const dealerService = {
  // Insert dealer and return the generated ID
  async insertDealer(phoneNumber: string, name: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('dealer_details')
        .insert({ phone_number: phoneNumber, name })
        .select('id')
        .maybeSingle();

      if (error) {
        console.error('Error inserting dealer:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error inserting dealer:', error);
      return null;
    }
  },

  // Update dealer name by ID
  async updateDealerName(dealerId: string, name: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dealer_details')
        .update({ name })
        .eq('id', dealerId);

      if (error) {
        console.error('Error updating dealer name:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating dealer name:', error);
      return false;
    }
  },

  // Get dealer by phone number
  async getDealerByPhone(phoneNumber: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('dealer_details')
        .select('*')
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      if (error) {
        console.error('Error fetching dealer:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching dealer:', error);
      return null;
    }
  }
};
