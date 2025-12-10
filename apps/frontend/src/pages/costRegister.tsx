import { useEffect, useRef, useState } from 'react';
import type { CostRegisterListItemDto, GetCostRegisterListResponse, PatternDetailDto } from '@pxa-re-management/shared';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStickyMessageActions } from '@/store/stickyMessage';
import { fetchCostRegisterList, fetchPatternDetails, uploadExcel, downloadExcel } from '../utils/costRegister.api';

const CostRegisterPage = () => {
  const { t } = useTranslation('costRegister');
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  const [patternDetails, setPatternDetails] = useState<PatternDetailDto[]>([]);
  const [selectedPatternId, setSelectedPatternId] = useState<string>('');
  const [rows, setRows] = useState<CostRegisterListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadSummary, setUploadSummary] = useState<{ inserted: number; updated: number } | null>(null);

  useEffect(() => {
    fetchPatternDetails().then(setPatternDetails);
  }, []);

  useEffect(() => {
    if (!selectedPatternId) {
      setRows([]);
      return;
    }
    setLoading(true);
    fetchCostRegisterList({ costPatternDetailId: selectedPatternId })
      .then((res: GetCostRegisterListResponse) => setRows(res.items))
      .finally(() => setLoading(false));
  }, [selectedPatternId]);

  const onDownload = async () => {
    if (!selectedPatternId) return;
    try {
      const blob = await downloadExcel({ costPatternDetailId: selectedPatternId });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cost_register.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addSuccessMessage(t('messages.downloadSuccess'));
    } catch (_e) {
      addErrorMessage(t('messages.downloadError'));
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatternId) return;
    try {
      const result = await uploadExcel({ costPatternDetailId: selectedPatternId }, file);
      if (result.success) {
        const res = await fetchCostRegisterList({ costPatternDetailId: selectedPatternId });
        setRows(res.items);
        setUploadSummary({ inserted: result.insertedCount, updated: result.updatedCount });
        setShowUploadDialog(true);
      } else {
        addErrorMessage(`${t('messages.uploadError')}: ${result.errorCode} ${result.message}`);
      }
    } catch (_e) {
      addErrorMessage(t('messages.uploadError'));
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  const hasData = rows.length > 0;
  const columnsCount = 10;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div>
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-[#00388E] mb-2">{t('title')}</h1>
            <div className="h-1 bg-[#00388E] w-full"></div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-end mb-6">
              <div className="flex flex-col gap-1 min-w-64">
                <span className="text-sm text-gray-700">{t('controls.patternDetail')}</span>
                <Select value={selectedPatternId} onValueChange={setSelectedPatternId}>
                  <SelectTrigger className="w-[320px]">
                    <SelectValue placeholder={t('controls.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {patternDetails.map((p) => (
                      <SelectItem key={p.costPatternDetailId} value={p.costPatternDetailId}>
                        {p.costPatternDetailName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={onDownload} disabled={!hasData} className="bg-[#00388E] hover:bg-[#002a6e] text-white">
                  {t('controls.download')}
                </Button>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onUpload} />
                <Button onClick={handleUploadClick} className="bg-[#00388E] hover:bg-[#002a6e] text-white">
                  {t('controls.upload')}
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg bg-white overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#00388E] text-white">
                  <TableRow>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.code')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.name')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium w-20">{t('table.headers.costType')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium w-20">{t('table.headers.currency')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.patternDetailName')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.modelCategories')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.destCategories')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.secondDestCategories')}</TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium w-28">{t('table.headers.startDate')}</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium w-32">{t('table.headers.costValue')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columnsCount} className="px-4 py-6 text-center text-sm text-gray-50">
                        {t('messages.loading')}
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columnsCount} className="px-4 py-6 text-center text-sm text-gray-700">
                        {t('messages.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r) => (
                      <TableRow key={r.costRegisterId} className="border-b border-gray-200">
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.buCostCd}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.buCostNameJa}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.costTypeLabel}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.curCd}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.costPatternDetailName}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.modelCategoriesText}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.destCategoriesText}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.secondDestCategoriesText}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.startDate ?? ''}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">{r.costValue ?? ''}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.upload.title')}</DialogTitle>
            <DialogDescription>
              {uploadSummary ? (
                t('modals.upload.summary', { inserted: uploadSummary.inserted, updated: uploadSummary.updated })
              ) : (
                t('modals.upload.noSummary')
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowUploadDialog(false)} className="bg-[#00388E] hover:bg-[#002a6e] text-white">
              {t('modals.upload.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CostRegisterPage;
