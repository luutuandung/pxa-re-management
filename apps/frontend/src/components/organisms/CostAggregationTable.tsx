import type { SelectOption, TableRowData } from '@pxa-re-management/shared';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type CostAggregationTableProps = {
  data: TableRowData[];
  salesVersionOptions: SelectOption[];
  costTypeOptions: SelectOption[];
  onSalesVersionChange?: (index: number, value: string) => void;
  onCostTypeChange?: (index: number, value: string) => void;
};

const CostAggregationTable: React.FC<CostAggregationTableProps> = ({
  data,
  salesVersionOptions,
  costTypeOptions,
  onSalesVersionChange,
  onCostTypeChange,
}) => {
  const { t } = useTranslation('costAggregationScenario');

  return (
    <div className="overflow-x-auto mb-6">
      <Table>
        <TableHeader className="bg-[#00388E] text-white">
          <TableRow>
            <TableHead>{t('table.headers.base')}</TableHead>
            <TableHead>{t('table.headers.classification')}</TableHead>
            <TableHead>{t('table.headers.salesVersion')}</TableHead>
            <TableHead>{t('table.headers.costType')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {data.map((row) => (
            <TableRow key={`${row.rowType}-${row.buCd ?? ''}-${row.aggConcatId ?? ''}`}>
              <TableCell>{row.base}</TableCell>
              <TableCell>
                {row.rowType === 'axis'
                  ? t('table.classification.axis')
                  : row.rowType === 'parent'
                    ? t('table.classification.parent')
                    : t('table.classification.child')}
              </TableCell>
              <TableCell>
                {row.rowType === 'axis' ? (
                  <span className="text-gray-500">-</span>
                ) : (
                  <Select
                    value={row.salesVersion}
                    onValueChange={(value) => onSalesVersionChange?.(data.indexOf(row), value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {salesVersionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                {row.rowType === 'axis' ? (
                  <span className="text-gray-500">-</span>
                ) : (
                  <Select value={row.costType} onValueChange={(value) => onCostTypeChange?.(data.indexOf(row), value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {costTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CostAggregationTable;
