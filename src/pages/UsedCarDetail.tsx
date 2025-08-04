
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { parseVehicleSlug } from '@/utils/slugUtils';
import CarDetail from './CarDetail';

const UsedCarDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [vehicleId, setVehicleId] = useState<string>('');
  const [isValidSlug, setIsValidSlug] = useState<boolean>(true);

  useEffect(() => {
    console.log('UsedCarDetail - Processing slug:', slug);
    
    if (slug) {
      const parsed = parseVehicleSlug(slug);
      console.log('UsedCarDetail - Parsed slug result:', parsed);
      
      if (parsed.isValid && parsed.vehicleId) {
        console.log('UsedCarDetail - Setting vehicle ID:', parsed.vehicleId);
        setVehicleId(parsed.vehicleId);
      } else {
        console.warn('UsedCarDetail - Invalid slug format:', slug);
        setIsValidSlug(false);
      }
    } else {
      console.warn('UsedCarDetail - No slug provided');
      setIsValidSlug(false);
    }
  }, [slug]);

  // If invalid slug, redirect to search page
  if (!isValidSlug) {
    console.log('UsedCarDetail - Redirecting due to invalid slug');
    return <Navigate to="/search-used-cars" replace />;
  }

  // If we don't have a vehicle ID yet, show loading
  if (!vehicleId) {
    console.log('UsedCarDetail - No vehicle ID yet, showing loading');
    return <div>Loading...</div>;
  }

  console.log('UsedCarDetail - Rendering CarDetail with ID:', vehicleId);
  return <CarDetail vehicleId={vehicleId} />;
};

export default UsedCarDetail;
