import type { SelectOption, TableRowData } from '@pxa-re-management/shared';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type CostAggregationTableProps = {
  data: TableRowData[];
  buCdOptionsCache: Record<string, { salesVersions: SelectOption[]; costTypes: SelectOption[] }>;
  onSalesVersionChange?: (index: number, value: string) => void;
  onCostTypeChange?: (index: number, value: string) => void;
};

const CostAggregationTable: React.FC<CostAggregationTableProps> = ({
  data,
  buCdOptionsCache,
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
                <Select
                  value={row.salesVersion || ''}
                  onValueChange={(value) => onSalesVersionChange?.(data.indexOf(row), value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('form.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {(row.buCd ? buCdOptionsCache[row.buCd]?.salesVersions ?? [] : []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select 
                  value={row.costType || ''} 
                  onValueChange={(value) => onCostTypeChange?.(data.indexOf(row), value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('form.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {(row.buCd ? buCdOptionsCache[row.buCd]?.costTypes ?? [] : []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CostAggregationTable;
