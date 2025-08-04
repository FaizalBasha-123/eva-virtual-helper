
import { HelmetProvider } from 'react-helmet-async';

const SEOProvider = ({ children }: { children: React.ReactNode }) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};

export default SEOProvider;
