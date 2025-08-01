
export type Brand = {
  id: string;
  name: string;
  created_at?: string;
};

export type Model = {
  id: string;
  brand_id: string;
  model_name: string;
  launch_year?: number;
  created_at?: string;
};

export type Variant = {
  id: string;
  model_id: string;
  variant_name: string;
  fuel_type?: string;
  transmission?: string;
  created_at?: string;
};
