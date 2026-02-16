import { useState } from 'react';
import { FileImage, Loader2 } from 'lucide-react';
import { ExternalBlob } from '../../backend';

interface PlanPosterImageProps {
  poster: ExternalBlob;
  planTitle: string;
  className?: string;
  fallbackClassName?: string;
}

export function PlanPosterImage({ poster, planTitle, className = '', fallbackClassName = '' }: PlanPosterImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = poster.getDirectURL();

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted rounded-lg ${fallbackClassName}`}>
        <FileImage className="h-12 w-12 text-muted-foreground/50 mb-2" />
        <p className="text-xs text-muted-foreground text-center px-2">
          Image unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-muted rounded-lg ${fallbackClassName}`}>
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
      )}
      <img
        src={imageUrl}
        alt={`${planTitle} poster`}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
