import React, { useState } from 'react';
import { Share2, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
  vehicleId?: string;
  vehicleType?: 'car' | 'bike';
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  title, 
  text, 
  className = "", 
  vehicleId, 
  vehicleType 
}) => {
  const [showFallback, setShowFallback] = useState(false);

  const getShareUrl = () => {
    // Always use the current page URL which already has the slug format
    // This ensures consistency between what users see and what they share
    return window.location.href;
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing or other error
        console.error("Sharing failed:", error);
      }
    } else {
      setShowFallback(true);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Vehicle link has been copied to clipboard.",
      });
      setShowFallback(false);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Unable to copy link to clipboard.",
      });
    }
  };

  const getWhatsAppShareUrl = () => {
    const shareUrl = getShareUrl();
    const shareText = `${text}\n\nCheck it out: ${shareUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  };

  const getFacebookShareUrl = () => {
    const shareUrl = getShareUrl();
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  };

  const getTwitterShareUrl = () => {
    const shareUrl = getShareUrl();
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <>
      <Button 
        size="icon" 
        variant="ghost" 
        className={className}
        onClick={handleShare}
        title="Share this vehicle"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      {/* Fallback Modal */}
      {showFallback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">Share this listing</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFallback(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="w-full justify-start gap-3"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <span className="text-base">📱</span>
                  Share on WhatsApp
                </Button>
              </a>
              
              <a
                href={getFacebookShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <span className="text-base">📘</span>
                  Share on Facebook
                </Button>
              </a>
              
              <a
                href={getTwitterShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <span className="text-base">🐦</span>
                  Share on Twitter
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
