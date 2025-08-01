
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
  const title = generateVehicleTitle(vehicle, type);
  const description = generateVehicleDescription(vehicle, type);
  const canonicalUrl = `https://www.vahaanxchange.com/used-${type}-details/${slug}`;
  
  // Get main image for Open Graph
  const getMainImage = () => {
    if (vehicle.photos && typeof vehicle.photos === 'object') {
      const categories = Object.values(vehicle.photos);
      for (const category of categories) {
        if (Array.isArray(category) && category.length > 0) {
          return category[0];
        }
      }
    }
    return "https://www.vahaanxchange.com/og-image.png";
  };

  const mainImage = getMainImage();

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
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={mainImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="product" />
      <meta property="og:site_name" content="VahaanXchange" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={mainImage} />
      
      {/* Product Schema */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      
      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default VehicleSEOHead;
