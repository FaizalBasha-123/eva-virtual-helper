import { supabase } from '@/lib/supabaseClient';

export interface UserDetails {
  id: string;
  phone_number: string;
  name?: string;
  created_at?: string;
}

export const userService = {
  // Insert phone number and return the generated ID
  async insertUser(phoneNumber: string, name: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_details')
        .insert({ phone_number: phoneNumber, name })
        .select('id')
        .maybeSingle();

      if (error) {
        console.error('Error inserting user:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error inserting user:', error);
      return null;
    }
  },

  // Update user name by ID
  async updateUserName(userId: string, name: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_details')
        .update({ name })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user name:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating user name:', error);
      return false;
    }
  },

  // Get user by phone number
  async getUserByPhone(phoneNumber: string): Promise<UserDetails | null> {
    try {
      const { data, error } = await supabase
        .from('user_details')
        .select('*')
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data as UserDetails;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
};
