export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bike_brand: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      bike_buyer_listings: {
        Row: {
          aadhaar_number: string | null
          accessories: string | null
          body_type: string | null
          brand: string | null
          cc: number | null
          color: string | null
          discounted: string | null
          e_vehicle_battery_health: string | null
          ev_charger_included: string | null
          features: string | null
          fitness_certificate: string | null
          fuel_type: string | null
          gncap_rating: number | null
          id: string
          insurance_validity: string | null
          kms_driven: number | null
          load_capacity: number | null
          loan_status: string | null
          major_replacement: string | null
          mileage: number | null
          model: string | null
          modifications: string | null
          number_of_owners: number | null
          pan_number: string | null
          phone_number: string | null
          photos: Json | null
          recommended: string | null
          registration_number: string | null
          rto: string | null
          rto_state: string | null
          seats: number | null
          sell_price: number | null
          seller_name: string | null
          tag: string | null
          tyre_condition: string | null
          user_id: string | null
          variant: string | null
          vehicle_battery: string | null
          vehicle_city: string | null
          vehicle_id: string | null
          vehicle_location_city: string | null
          warranty_details: string | null
          warranty_status: string | null
          year: number | null
        }
        Insert: {
          aadhaar_number?: string | null
          accessories?: string | null
          body_type?: string | null
          brand?: string | null
          cc?: number | null
          color?: string | null
          discounted?: string | null
          e_vehicle_battery_health?: string | null
          ev_charger_included?: string | null
          features?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          gncap_rating?: number | null
          id?: string
          insurance_validity?: string | null
          kms_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacement?: string | null
          mileage?: number | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          pan_number?: string | null
          phone_number?: string | null
          photos?: Json | null
          recommended?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          seats?: number | null
          sell_price?: number | null
          seller_name?: string | null
          tag?: string | null
          tyre_condition?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_city?: string | null
          vehicle_id?: string | null
          vehicle_location_city?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Update: {
          aadhaar_number?: string | null
          accessories?: string | null
          body_type?: string | null
          brand?: string | null
          cc?: number | null
          color?: string | null
          discounted?: string | null
          e_vehicle_battery_health?: string | null
          ev_charger_included?: string | null
          features?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          gncap_rating?: number | null
          id?: string
          insurance_validity?: string | null
          kms_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacement?: string | null
          mileage?: number | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          pan_number?: string | null
          phone_number?: string | null
          photos?: Json | null
          recommended?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          seats?: number | null
          sell_price?: number | null
          seller_name?: string | null
          tag?: string | null
          tyre_condition?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_city?: string | null
          vehicle_id?: string | null
          vehicle_location_city?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id_bike_buyer"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vehicle_id_bike"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "bike_seller_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      bike_model: {
        Row: {
          brand_id: string | null
          created_at: string | null
          id: string
          launch_year: number
          model_name: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          launch_year: number
          model_name: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          launch_year?: number
          model_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bike_model_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "bike_brand"
            referencedColumns: ["id"]
          },
        ]
      }
      bike_seller_listings: {
        Row: {
          aadhaar_number: string | null
          accessories: string | null
          accident_history: string | null
          api_location: Json | null
          battery_health: string | null
          brand: string | null
          cc: number | null
          city: string | null
          color: string | null
          created_at: string | null
          ev_charger_included: string | null
          fitness_certificate: string | null
          fuel_type: string | null
          id: string
          insurance_validity: string | null
          kilometers_driven: number | null
          load_capacity: number | null
          loan_status: string | null
          major_replacements: string | null
          model: string | null
          modifications: string | null
          number_of_owners: number | null
          ownership_type: string | null
          pan_number: string | null
          permit_type: string | null
          photos: Json | null
          preferred_contact_time: string | null
          reason_for_sale: string | null
          registration_number: string | null
          rto: string | null
          rto_state: string | null
          sell_price: number | null
          seller_location_city: string | null
          seller_name: string | null
          seller_phone_number: string | null
          tire_condition: string | null
          transmission_type: string | null
          user_id: string | null
          variant: string | null
          vehicle_battery: string | null
          vehicle_type: string | null
          warranty_details: string | null
          warranty_status: string | null
          year: number | null
        }
        Insert: {
          aadhaar_number?: string | null
          accessories?: string | null
          accident_history?: string | null
          api_location?: Json | null
          battery_health?: string | null
          brand?: string | null
          cc?: number | null
          city?: string | null
          color?: string | null
          created_at?: string | null
          ev_charger_included?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          id?: string
          insurance_validity?: string | null
          kilometers_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacements?: string | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          ownership_type?: string | null
          pan_number?: string | null
          permit_type?: string | null
          photos?: Json | null
          preferred_contact_time?: string | null
          reason_for_sale?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          sell_price?: number | null
          seller_location_city?: string | null
          seller_name?: string | null
          seller_phone_number?: string | null
          tire_condition?: string | null
          transmission_type?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_type?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Update: {
          aadhaar_number?: string | null
          accessories?: string | null
          accident_history?: string | null
          api_location?: Json | null
          battery_health?: string | null
          brand?: string | null
          cc?: number | null
          city?: string | null
          color?: string | null
          created_at?: string | null
          ev_charger_included?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          id?: string
          insurance_validity?: string | null
          kilometers_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacements?: string | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          ownership_type?: string | null
          pan_number?: string | null
          permit_type?: string | null
          photos?: Json | null
          preferred_contact_time?: string | null
          reason_for_sale?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          sell_price?: number | null
          seller_location_city?: string | null
          seller_name?: string | null
          seller_phone_number?: string | null
          tire_condition?: string | null
          transmission_type?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_type?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id_bike"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
        ]
      }
      bike_variant: {
        Row: {
          created_at: string | null
          fuel_type: string
          id: string
          model_id: string | null
          variant_name: string
        }
        Insert: {
          created_at?: string | null
          fuel_type: string
          id?: string
          model_id?: string | null
          variant_name: string
        }
        Update: {
          created_at?: string | null
          fuel_type?: string
          id?: string
          model_id?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bike_variant_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "bike_model"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      buy_booking_listings: {
        Row: {
          created_at: string | null
          id: string
          phone_number: number | null
          user_id: string | null
          user_name: string | null
          vehicle: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          phone_number?: number | null
          user_id?: string | null
          user_name?: string | null
          vehicle?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone_number?: number | null
          user_id?: string | null
          user_name?: string | null
          vehicle?: string | null
          vehicle_id?: string | null
        }
        Relationships: []
      }
      car_buyer_listings: {
        Row: {
          aadhaar_number: string | null
          accessories: string | null
          airbags: number | null
          body_type: string | null
          brand: string | null
          cc: number | null
          color: string | null
          cylinders: number | null
          discounted: string | null
          e_vehicle_battery_health: string | null
          ev_charger_included: string | null
          features: string | null
          fitness_certificate: string | null
          fuel_type: string | null
          gncap_rating: number | null
          id: string
          insurance_validity: string | null
          kms_driven: number | null
          load_capacity: number | null
          loan_status: string | null
          major_replacement: string | null
          mileage: number | null
          model: string | null
          modifications: string | null
          number_of_owners: number | null
          pan_number: string | null
          phone_number: string | null
          photos: Json | null
          recommended: string | null
          registration_number: string | null
          rto: string | null
          rto_state: string | null
          seats: number | null
          sell_price: number | null
          seller_name: string | null
          tag: string | null
          transmission: string | null
          tyre_condition: string | null
          user_id: string | null
          variant: string | null
          vehicle_battery: string | null
          vehicle_city: string | null
          vehicle_id: string | null
          vehicle_location_city: string | null
          warranty_details: string | null
          warranty_status: string | null
          year: number | null
        }
        Insert: {
          aadhaar_number?: string | null
          accessories?: string | null
          airbags?: number | null
          body_type?: string | null
          brand?: string | null
          cc?: number | null
          color?: string | null
          cylinders?: number | null
          discounted?: string | null
          e_vehicle_battery_health?: string | null
          ev_charger_included?: string | null
          features?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          gncap_rating?: number | null
          id?: string
          insurance_validity?: string | null
          kms_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacement?: string | null
          mileage?: number | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          pan_number?: string | null
          phone_number?: string | null
          photos?: Json | null
          recommended?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          seats?: number | null
          sell_price?: number | null
          seller_name?: string | null
          tag?: string | null
          transmission?: string | null
          tyre_condition?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_city?: string | null
          vehicle_id?: string | null
          vehicle_location_city?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Update: {
          aadhaar_number?: string | null
          accessories?: string | null
          airbags?: number | null
          body_type?: string | null
          brand?: string | null
          cc?: number | null
          color?: string | null
          cylinders?: number | null
          discounted?: string | null
          e_vehicle_battery_health?: string | null
          ev_charger_included?: string | null
          features?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          gncap_rating?: number | null
          id?: string
          insurance_validity?: string | null
          kms_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacement?: string | null
          mileage?: number | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          pan_number?: string | null
          phone_number?: string | null
          photos?: Json | null
          recommended?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          seats?: number | null
          sell_price?: number | null
          seller_name?: string | null
          tag?: string | null
          transmission?: string | null
          tyre_condition?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_city?: string | null
          vehicle_id?: string | null
          vehicle_location_city?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id_car_buyer"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vehicle_id_car"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "car_seller_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      car_seller_listings: {
        Row: {
          aadhaar_number: string | null
          accessories: string | null
          accident_history: string | null
          api_location: Json | null
          battery_health: string | null
          brand: string | null
          cc: number | null
          city: string | null
          color: string | null
          created_at: string | null
          ev_charger_included: string | null
          fitness_certificate: string | null
          fuel_type: string | null
          id: string
          insurance_validity: string | null
          kilometers_driven: number | null
          load_capacity: number | null
          loan_status: string | null
          major_replacements: string | null
          model: string | null
          modifications: string | null
          number_of_owners: number | null
          ownership_type: string | null
          pan_number: string | null
          permit_type: string | null
          photos: Json | null
          preferred_contact_time: string | null
          reason_for_sale: string | null
          registration_number: string | null
          rto: string | null
          rto_state: string | null
          sell_price: number | null
          seller_location_city: string | null
          seller_name: string | null
          seller_phone_number: string | null
          tire_condition: string | null
          transmission_type: string | null
          user_id: string | null
          variant: string | null
          vehicle_battery: string | null
          vehicle_type: string | null
          warranty_details: string | null
          warranty_status: string | null
          year: number | null
        }
        Insert: {
          aadhaar_number?: string | null
          accessories?: string | null
          accident_history?: string | null
          api_location?: Json | null
          battery_health?: string | null
          brand?: string | null
          cc?: number | null
          city?: string | null
          color?: string | null
          created_at?: string | null
          ev_charger_included?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          id?: string
          insurance_validity?: string | null
          kilometers_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacements?: string | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          ownership_type?: string | null
          pan_number?: string | null
          permit_type?: string | null
          photos?: Json | null
          preferred_contact_time?: string | null
          reason_for_sale?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          sell_price?: number | null
          seller_location_city?: string | null
          seller_name?: string | null
          seller_phone_number?: string | null
          tire_condition?: string | null
          transmission_type?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_type?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Update: {
          aadhaar_number?: string | null
          accessories?: string | null
          accident_history?: string | null
          api_location?: Json | null
          battery_health?: string | null
          brand?: string | null
          cc?: number | null
          city?: string | null
          color?: string | null
          created_at?: string | null
          ev_charger_included?: string | null
          fitness_certificate?: string | null
          fuel_type?: string | null
          id?: string
          insurance_validity?: string | null
          kilometers_driven?: number | null
          load_capacity?: number | null
          loan_status?: string | null
          major_replacements?: string | null
          model?: string | null
          modifications?: string | null
          number_of_owners?: number | null
          ownership_type?: string | null
          pan_number?: string | null
          permit_type?: string | null
          photos?: Json | null
          preferred_contact_time?: string | null
          reason_for_sale?: string | null
          registration_number?: string | null
          rto?: string | null
          rto_state?: string | null
          sell_price?: number | null
          seller_location_city?: string | null
          seller_name?: string | null
          seller_phone_number?: string | null
          tire_condition?: string | null
          transmission_type?: string | null
          user_id?: string | null
          variant?: string | null
          vehicle_battery?: string | null
          vehicle_type?: string | null
          warranty_details?: string | null
          warranty_status?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id_car"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
        ]
      }
      favourites: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          vehicle_id: string
          vehicle_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          vehicle_id: string
          vehicle_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          vehicle_id?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourites_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          brand_id: string | null
          created_at: string | null
          id: string
          launch_year: number | null
          model_name: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          launch_year?: number | null
          model_name: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          launch_year?: number | null
          model_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_uploads: {
        Row: {
          file_path: string
          id: string
          uploaded_at: string | null
        }
        Insert: {
          file_path: string
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          file_path?: string
          id?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      user_details: {
        Row: {
          id: string
          name: string | null
          phone_number: number | null
        }
        Insert: {
          id?: string
          name?: string | null
          phone_number?: number | null
        }
        Update: {
          id?: string
          name?: string | null
          phone_number?: number | null
        }
        Relationships: []
      }
      variants: {
        Row: {
          created_at: string | null
          fuel_type: string | null
          id: string
          model_id: string | null
          transmission: string | null
          variant_name: string
        }
        Insert: {
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          model_id?: string | null
          transmission?: string | null
          variant_name: string
        }
        Update: {
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          model_id?: string | null
          transmission?: string | null
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "variants_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      listing_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      listing_status: ["pending", "verified", "rejected"],
    },
  },
} as const
