import type React from 'react';
import { Link } from 'react-router';
import logoImage from '../../assets/logo.svg';

interface LogoProps {
  to?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ to = '/', className = 'h-8' }) => {
  return (
    <Link to={to} className="flex items-center">
      <img src={logoImage} alt="PxA-RE" className={className} />
    </Link>
  );
};

export default Logo;
