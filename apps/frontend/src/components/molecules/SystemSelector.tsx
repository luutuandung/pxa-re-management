import type React from 'react';
import Select from '../atoms/Select';

interface SystemSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SystemSelector: React.FC<SystemSelectorProps> = ({ value, onChange }) => {
  const systemOptions = [
    { value: '0', label: 'PxA-RE' },
    { value: '1', label: 'System1' },
    { value: '2', label: 'System2' },
  ];

  return (
    <Select
      value={value}
      onChange={onChange}
      options={systemOptions}
      className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default SystemSelector;
