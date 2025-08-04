
import { supabase } from '../lib/supabaseClient';
import { Brand, Model, Variant } from '../types/vehicleTypes';

// Fetch all brands
export const fetchAllBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
  
  return data || [];
};

// Fetch car models by brand and year (updated to show models for the selected year AND earlier years)
export const fetchModelsByBrandAndYear = async (
  brandId: string,
  year: string
): Promise<Model[]> => {
  const { data, error } = await supabase
    .from('models')
    .select('id, brand_id, model_name, launch_year')
    .eq('brand_id', brandId);
  
  if (error) {
    console.error('Error fetching models:', error);
    return [];
  }
  
  return data || [];
};

// Fetch variants by model
export const fetchVariantsByModel = async (
  modelId: string,
  fuelType?: string | null,
  transmission?: string | null
): Promise<Variant[]> => {
  let query = supabase
    .from('variants')
    .select('id, model_id, variant_name, fuel_type, transmission')
    .eq('model_id', modelId);
  
  if (fuelType) {
    query = query.eq('fuel_type', fuelType);
  }
  
  if (transmission) {
    query = query.eq('transmission', transmission);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching variants:', error);
    return [];
  }
  
  return data || [];
};

// Fetch available fuel types for a specific model
export const fetchFuelTypesByModel = async (modelId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('variants')
    .select('fuel_type')
    .eq('model_id', modelId)
    .not('fuel_type', 'is', null);
  
  if (error || !data) {
    console.error('Error fetching fuel types:', error);
    return [];
  }
  
  // Extract unique fuel types
  const uniqueFuelTypes = [...new Set(data.map(item => item.fuel_type))];
  return uniqueFuelTypes.filter(Boolean) as string[];
};

// Fetch available transmissions for a specific model
export const fetchTransmissionsByModel = async (modelId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('variants')
    .select('transmission')
    .eq('model_id', modelId)
    .not('transmission', 'is', null);
  
  if (error || !data) {
    console.error('Error fetching transmissions:', error);
    return [];
  }
  
  // Extract unique transmissions
  const uniqueTransmissions = [...new Set(data.map(item => item.transmission))];
  return uniqueTransmissions.filter(Boolean) as string[];
};

// Find brand ID by name
export const findBrandIdByName = async (brandName: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single();
  
  if (error || !data) {
    console.error('Error finding brand ID:', error);
    return null;
  }
  
  return data.id;
};

// NEW BIKE-SPECIFIC FUNCTIONS

// Fetch all bike brands
export const fetchAllBikeBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('bike_brand')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching bike brands:', error);
    return [];
  }
  
  return data || [];
};

// Find bike brand ID by name
export const findBikeBrandIdByName = async (brandName: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('bike_brand')
    .select('id')
    .eq('name', brandName)
    .single();
  
  if (error || !data) {
    console.error('Error finding bike brand ID:', error);
    return null;
  }
  
  return data.id;
};

// Fetch bike models by brand and year
export const fetchBikeModelsByBrandAndYear = async (
  brandId: string,
  year: string
): Promise<Model[]> => {
  const { data, error } = await supabase
    .from('bike_model')
    .select('id, brand_id, model_name, launch_year')
    .eq('brand_id', brandId);
  
  if (error) {
    console.error('Error fetching bike models:', error);
    return [];
  }
  
  return data || [];
};

// Fetch bike variants by model
export const fetchBikeVariantsByModel = async (
  modelId: string,
  fuelType?: string | null
): Promise<Variant[]> => {
  let query = supabase
    .from('bike_variant')
    .select('id, model_id, variant_name, fuel_type')
    .eq('model_id', modelId);
  
  if (fuelType) {
    query = query.eq('fuel_type', fuelType);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching bike variants:', error);
    return [];
  }
  
  return data || [];
};

// Fetch available fuel types for a specific bike model
export const fetchBikeFuelTypesByModel = async (modelId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('bike_variant')
    .select('fuel_type')
    .eq('model_id', modelId)
    .not('fuel_type', 'is', null);
  
  if (error || !data) {
    console.error('Error fetching bike fuel types:', error);
    return [];
  }
  
  // Extract unique fuel types
  const uniqueFuelTypes = [...new Set(data.map(item => item.fuel_type))];
  return uniqueFuelTypes.filter(Boolean) as string[];
};
