import { useState, useEffect } from 'react';
import { ExternalBlob } from '../../backend';
import { ImageOff, Loader2 } from 'lucide-react';

interface PlanPosterImageProps {
  poster: ExternalBlob;
  planTitle: string;
  fallbackSrc?: string;
}

export function PlanPosterImage({ poster, planTitle, fallbackSrc }: PlanPosterImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when poster changes
    setIsLoading(true);
    setHasError(false);
    setImageUrl(null);

    try {
      const url = poster.getDirectURL();
      if (url && url.trim().length > 0) {
        setImageUrl(url);
      } else if (fallbackSrc) {
        setImageUrl(fallbackSrc);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error getting poster URL:', error);
      if (fallbackSrc) {
        setImageUrl(fallbackSrc);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    }
  }, [poster, fallbackSrc]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    // If primary image fails and we have a fallback, try it
    if (fallbackSrc && imageUrl !== fallbackSrc) {
      setImageUrl(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground p-4">
          <ImageOff className="h-12 w-12 mb-2" />
          <p className="text-sm text-center">Image unavailable</p>
        </div>
      )}
      
      {imageUrl && !hasError && (
        <img
          src={imageUrl}
          alt={`${planTitle} poster`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}
