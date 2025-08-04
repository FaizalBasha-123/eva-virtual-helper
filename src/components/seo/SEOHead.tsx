
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  breadcrumbSchema?: any;
  productSchema?: any;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

const SEOHead = ({ 
  title, 
  description, 
  canonicalUrl, 
  breadcrumbSchema,
  productSchema,
  openGraph,
  twitter
}: SEOHeadProps) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VahaanXchange",
    "url": "https://www.vahaanxchange.com",
    "logo": "https://www.vahaanxchange.com/og-image.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-810-810-4175",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/vahaanxchange",
      "https://instagram.com/vahaanxchange_official",
      "https://youtube.com/channel/UCaZWFt72Cyu8w9kyfjWGJRA"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "VahaanXchange",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "148, Old Mahabalipuram Rd, Thoraipakkam",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600119",
      "addressCountry": "IN"
    },
    "telephone": "+91-810-810-4175",
    "url": "https://www.vahaanxchange.com",
    "logo": "https://www.vahaanxchange.com/og-image.png"
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={openGraph?.title || title} />
      <meta property="og:description" content={openGraph?.description || description} />
      <meta property="og:image" content={openGraph?.image || "https://www.vahaanxchange.com/og-image.png"} />
      <meta property="og:url" content={openGraph?.url || canonicalUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitter?.card || "summary_large_image"} />
      <meta name="twitter:title" content={twitter?.title || title} />
      <meta name="twitter:description" content={twitter?.description || description} />
      <meta name="twitter:image" content={twitter?.image || "https://www.vahaanxchange.com/og-image.png"} />
      
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      
      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {/* Product Schema */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
