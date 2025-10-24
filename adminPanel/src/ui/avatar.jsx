import React from 'react';

export const Avatar = ({ className = '', children }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt, className = '' }) => (
  src ? <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} /> : null
);

export const AvatarFallback = ({ children, className = '' }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
    {children}
  </div>
);