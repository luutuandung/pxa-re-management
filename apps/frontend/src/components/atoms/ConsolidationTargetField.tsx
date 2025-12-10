import type React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ConsolidationTargetFieldProps {
  childChecked: boolean;
  parentChecked: boolean;
  onChildChange: (checked: boolean) => void;
  onParentChange: (checked: boolean) => void;
  childLabel: string;
  parentLabel: string;
  groupLabel: string;
}

const ConsolidationTargetField: React.FC<ConsolidationTargetFieldProps> = ({
  childChecked,
  parentChecked,
  onChildChange,
  onParentChange,
  childLabel,
  parentLabel,
  groupLabel,
}) => {
  return (
    <div className="flex items-center gap-2">
      <fieldset>
        <legend className="text-sm font-medium text-gray-700 whitespace-nowrap">{groupLabel}</legend>
      </fieldset>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="child" checked={childChecked} onCheckedChange={onChildChange} />
          <label htmlFor="child" className="text-sm text-gray-700">
            {childLabel}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="parent" checked={parentChecked} onCheckedChange={onParentChange} />
          <label htmlFor="parent" className="text-sm text-gray-700">
            {parentLabel}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ConsolidationTargetField;
