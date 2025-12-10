import type React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormFieldProps {
  label: string;
  type: 'select' | 'checkbox' | 'display';
  value?: string | boolean;
  onChange?: (value: string | boolean) => void;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  options = [],
  placeholder,
  id,
  className = '',
  disabled = false,
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor={fieldId} className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-fit">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {type === 'select' && (
          <Select value={value as string} onValueChange={onChange as (value: string) => void}>
            <SelectTrigger id={fieldId} className="w-48" disabled={disabled}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {type === 'checkbox' && (
          <>
            <Checkbox
              id={fieldId}
              checked={value as boolean}
              onCheckedChange={onChange as (checked: boolean) => void}
              disabled={disabled}
            />
            <label htmlFor={fieldId} className="text-sm text-gray-700">
              {label}
            </label>
          </>
        )}
        {type === 'display' && <p className="text-sm text-gray-600">{value as string}</p>}
      </div>
    </div>
  );
};

export default FormField;
