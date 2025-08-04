import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const SocialMediaRedirect = () => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    // Detect if this is a social media crawler or a share request
    const isShareRequest = new URLSearchParams(location.search).get('share') === '1';
    const userAgent = navigator.userAgent.toLowerCase();
    
    // List of social media crawler user agents
    const socialMediaCrawlers = [
      'facebookexternalhit',
      'whatsapp',
      'twitterbot',
      'linkedinbot',
      'telegrambot',
      'slackbot',
      'skype',
      'discordbot',
      'applebot'
    ];
    
    const isCrawler = socialMediaCrawlers.some(crawler => 
      userAgent.includes(crawler)
    );

    // Check if this is a vehicle detail page
    const vehiclePageMatch = location.pathname.match(/\/used-(car|bike)-details\/([^/?]+)/);
    
    if ((isCrawler || isShareRequest) && vehiclePageMatch) {
      const [, vehicleType, slug] = vehiclePageMatch;
      
      // Redirect crawlers to backend SSR endpoint with slug format
      const backendUrl = `https://vahaan-backend.vercel.app/used-${vehicleType}-details/${slug}`;
      
      console.log('Redirecting crawler/share request to:', backendUrl);
      window.location.replace(backendUrl);
      return;
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default SocialMediaRedirect;
