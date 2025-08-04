
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { parseVehicleSlug } from '@/utils/slugUtils';
import BikeDetail from './BikeDetail';

const UsedBikeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [vehicleId, setVehicleId] = useState<string>('');
  const [isValidSlug, setIsValidSlug] = useState<boolean>(true);

  useEffect(() => {
    console.log('UsedBikeDetail - Processing slug:', slug);
    
    if (slug) {
      const parsed = parseVehicleSlug(slug);
      console.log('UsedBikeDetail - Parsed slug result:', parsed);
      
      if (parsed.isValid && parsed.vehicleId) {
        console.log('UsedBikeDetail - Setting vehicle ID:', parsed.vehicleId);
        setVehicleId(parsed.vehicleId);
      } else {
        console.warn('UsedBikeDetail - Invalid slug format:', slug);
        setIsValidSlug(false);
      }
    } else {
      console.warn('UsedBikeDetail - No slug provided');
      setIsValidSlug(false);
    }
  }, [slug]);

  // If invalid slug, redirect to search page
  if (!isValidSlug) {
    console.log('UsedBikeDetail - Redirecting due to invalid slug');
    return <Navigate to="/search-used-bikes" replace />;
  }

  // If we don't have a vehicle ID yet, show loading
  if (!vehicleId) {
    console.log('UsedBikeDetail - No vehicle ID yet, showing loading');
    return <div>Loading...</div>;
  }

  console.log('UsedBikeDetail - Rendering BikeDetail with ID:', vehicleId);
  return <BikeDetail vehicleId={vehicleId} />;
};

export default UsedBikeDetail;
