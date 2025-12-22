import type React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  accessibilityGuidance?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  accessibilityGuidance
}) => {
  const baseClasses = 'font-medium rounded cursor-pointer focus:outline-none focus:ring-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classNameAttributeValue: string = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    ...typeof className === 'string' ? [ className ] : []
  ].join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNameAttributeValue}
      aria-label={ accessibilityGuidance }
    >
      {children}
    </button>
  );
};

export default Button;
