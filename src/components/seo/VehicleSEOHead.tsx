
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { generateVehicleTitle, generateVehicleDescription } from '@/utils/slugUtils';

interface VehicleSEOHeadProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    year: number;
    seller_location_city: string;
    sell_price?: number;
    kilometers_driven?: number;
    fuel_type?: string;
    photos?: any;
  };
  type: 'car' | 'bike';
  slug: string;
}

const VehicleSEOHead = ({ vehicle, type, slug }: VehicleSEOHeadProps) => {
  const [metaData, setMetaData] = useState<any>(null);
  
  // Fallback meta data using local generation
  const fallbackTitle = generateVehicleTitle(vehicle, type);
  const fallbackDescription = generateVehicleDescription(vehicle, type);
  const canonicalUrl = `https://www.vahaanxchange.com/used-${type}-details/${slug}`;
  
  useEffect(() => {
    // Fetch meta data from backend
    const fetchMetaData = async () => {
      try {
        const response = await fetch(`https://vahaan-backend.vercel.app/api/meta/${type}/${vehicle.id}`);
        if (response.ok) {
          const data = await response.json();
          setMetaData(data);
          console.log('Backend meta data:', data);
        } else {
          console.warn('Failed to fetch meta data from backend, using fallback');
        }
      } catch (error) {
        console.error('Error fetching meta data from backend:', error);
      }
    };

    if (vehicle.id) {
      fetchMetaData();
    }
  }, [vehicle.id, type]);

  // Use backend meta data if available, otherwise use fallback
  const title = metaData?.title || fallbackTitle;
  const description = metaData?.description || fallbackDescription;
  const mainImage = metaData?.image || 'https://www.vahaanxchange.com/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png';
  
  console.log('Final SEO data:', { title, description, mainImage });

  // Product schema for rich snippets
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${vehicle.brand} ${vehicle.model} ${vehicle.variant} ${vehicle.year}`,
    "brand": {
      "@type": "Brand",
      "name": vehicle.brand
    },
    "model": vehicle.model,
    "vehicleModelDate": vehicle.year.toString(),
    "vehicleConfiguration": vehicle.variant,
    "fuelType": vehicle.fuel_type,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": vehicle.kilometers_driven,
      "unitCode": "KMT"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": vehicle.sell_price || 0,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/UsedCondition",
      "seller": {
        "@type": "Organization",
        "name": "VahaanXchange"
      }
    },
    "image": mainImage,
    "url": canonicalUrl
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.vahaanxchange.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `Buy ${type === 'car' ? 'Cars' : 'Bikes'}`,
        "item": `https://www.vahaanxchange.com/search-used-${type}s`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${vehicle.brand} ${vehicle.model}`,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={mainImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="VahaanXchange" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={mainImage} />

      {/* WhatsApp specific */}
      <meta property="og:image:alt" content={`${vehicle.brand} ${vehicle.model} available on VahaanXchange`} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default VehicleSEOHead;
