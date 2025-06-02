import React, { useState } from 'react';
import Icon from './AppIcon';

function Image({
  src,
  alt = "Image",
  className = "",
  fallbackSrc = "/assets/images/no_image.png",
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative inline-block">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] rounded-lg animate-pulse">
          <Icon name="Image" className="text-[var(--text-secondary)] opacity-50" />
        </div>
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}

export default Image;
