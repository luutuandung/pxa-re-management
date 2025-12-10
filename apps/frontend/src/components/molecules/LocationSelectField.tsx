import type { BusinessUnitItem } from '@pxa-re-management/shared';
import React from 'react';
import LocationSelect from '@/components/atoms/LocationSelect';

interface LocationSelectFieldProps {
  value: string | null;
  onValueChange: (value: string) => void;
  locations: ReadonlyArray<BusinessUnitItem>;
  placeholder?: string;
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
}

const LocationSelectField: React.FC<LocationSelectFieldProps> = ({
  value,
  onValueChange,
  locations,
  placeholder,
  className,
  selectClassName,
  disabled = false,
}) => {
  return (
    <div className={className}>
      <LocationSelect
        value={value}
        onValueChange={onValueChange}
        locations={locations}
        placeholder={placeholder}
        className={selectClassName}
        disabled={disabled}
      />
    </div>
  );
};

export default LocationSelectField;
