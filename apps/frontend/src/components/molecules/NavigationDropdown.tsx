import type React from 'react';
import triangleIcon from '../../assets/btn_triangle.svg';
import Icon from '../atoms/Icon';

interface NavigationDropdownProps {
  title: string;
  items: { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
  width?: string;
}

const NavigationDropdown: React.FC<NavigationDropdownProps> = ({ title, items, isOpen, onToggle, width = 'w-48' }) => {
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
        onClick={onToggle}
      >
        <span>{title}</span>
        <Icon src={triangleIcon} alt="▼" className="h-3 w-3" />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-1 ${width} bg-white border border-gray-200 rounded-md shadow-lg z-10`}
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationDropdown;
