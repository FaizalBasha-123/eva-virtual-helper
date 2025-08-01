
import { createClient } from '@supabase/supabase-js';

// Updated to new Supabase project values
export const supabase = createClient(
  'https://iaptxaruwnwqeukrjibq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcHR4YXJ1d253cWV1a3JqaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQ0NTQsImV4cCI6MjA2OTA5MDQ1NH0.VxJGls9WiYXIATCUHmlZ2VjbJJKgiRSzgx6cqXTfKa8'
);
