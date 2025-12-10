import type React from 'react';

interface IconProps {
  src: string;
  alt: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ src, alt, className = 'h-5 w-5' }) => {
  return <img src={src} alt={alt} className={className} />;
};

export default Icon;
