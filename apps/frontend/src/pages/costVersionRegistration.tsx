import type { CostPriceVersion } from '@pxa-re-management/shared';
import LocationSelectField from "@/components/atoms/LocationSelectField.tsx";
import { useBusinessUnitActions, useBusinessUnitSelectors } from '@/store/businessUnit';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStickyMessageActions } from '@/store/stickyMessage';
import deleteIcon from '../assets/btn_delete.svg';
import { useCostVersionActions, useCostVersionSelectors } from '../store/costVersion';

const CostVersionRegistration: FC = () => {
  const { t } = useTranslation('costVersionRegistration');
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedCostVersion, setSelectedCostVersion] = useState<string | null>(null);
  const [reportType, setReportType] = useState('製造原価');
  const [costCopy, setCostCopy] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  // Form states for create/edit modal
  const [formData, setFormData] = useState({
    costVersionId: '',
    businessunitId: '',
    costVersionName: '',
    startDate: '',
    endDate: '',
    description: '',
    defaultFlg: false,
  });

  // Duplicate modal state
  const [duplicateData, setDuplicateData] = useState({
    newCostVersionName: '',
    ktnCd: '',
  });

  const { fetchCostVersions, createCostVersion, updateCostVersion, deleteCostVersion, duplicateCostVersion } =
    useCostVersionActions();

  const { costVersions } = useCostVersionSelectors();
  const { fetchBusinessUnit } = useBusinessUnitActions();
  const { businessUnits } = useBusinessUnitSelectors();

  useEffect(() => {
    fetchCostVersions();
    fetchBusinessUnit();
  }, [fetchCostVersions, fetchBusinessUnit]);

  const handleCreate = () => {
    setFormData({
      costVersionId: '',
      businessunitId: businessUnits[0]?.businessunitId ?? '',
      costVersionName: '',
      startDate: '',
      endDate: '',
      description: '',
      defaultFlg: false,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (costVersion: CostPriceVersion) => {
    setFormData({
      costVersionId: costVersion.costVersionId,
      businessunitId: costVersion.businessunitId,
      costVersionName: costVersion.costVersionName,
      startDate: costVersion.startDate,
      endDate: costVersion.endDate,
      description: costVersion.description,
      defaultFlg: false,
    });
    setShowEditModal(true);
  };

  const handleDelete = (costVersionId: string) => {
    setSelectedCostVersion(costVersionId);
    setShowDeleteModal(true);
  };

  const handleDuplicate = () => {
    if (!selectedCostVersion) {
      addErrorMessage(t('messages.selectBeforeDuplicate'));
      return;
    }
    const selected = costVersions.find((cv) => cv.costVersionId === selectedCostVersion);
    if (selected) {
      setDuplicateData({
        newCostVersionName: '',
        ktnCd: selected.businessunitId,
      });
      setShowDuplicateModal(true);
    }
  };

  const normalizeYm = (v: string) => (v || '').replaceAll('/', '').replaceAll('-', '').slice(0, 6);

  const confirmCreate = async () => {
    try {
      await createCostVersion({
        ...formData,
        startDate: normalizeYm(formData.startDate),
        endDate: normalizeYm(formData.endDate),
      });
      addSuccessMessage(t('messages.createSuccess'));
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create cost version:', error);
      addErrorMessage(t('messages.fetchError'));
    }
  };

  const confirmEdit = async () => {
    try {
      const { costVersionId, ...updateData } = formData;
      await updateCostVersion(costVersionId, {
        ...updateData,
        startDate: normalizeYm(updateData.startDate),
        endDate: normalizeYm(updateData.endDate),
      });
      addSuccessMessage(t('messages.updateSuccess'));
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update cost version:', error);
      addErrorMessage(t('messages.fetchError'));
    }
  };

  const confirmDelete = async () => {
    if (!selectedCostVersion) return;
    try {
      await deleteCostVersion(selectedCostVersion);
      addSuccessMessage(t('messages.deleteSuccess'));
      setShowDeleteModal(false);
      setSelectedCostVersion(null);
    } catch (error) {
      console.error('Failed to delete cost version:', error);
      addErrorMessage(t('messages.fetchError'));
    }
  };

  const confirmDuplicate = async () => {
    if (!selectedCostVersion || isDuplicating) return;
    
    setIsDuplicating(true);
    try {
      const payload: Readonly<{
        sourceCostVersionId: string;
        newCostVersionName: string;
        ktnCd: string;
      }> = {
        sourceCostVersionId: selectedCostVersion,
        newCostVersionName: duplicateData.newCostVersionName,
        ktnCd: duplicateData.ktnCd,
      };
      
      await duplicateCostVersion(payload);
      setShowDuplicateModal(false);
    } catch (error) {
      console.error('Failed to duplicate cost version:', error);
      addErrorMessage(t('messages.fetchError'));
    } finally {
      setIsDuplicating(false);
    }
  };

  const formatDateForDisplay = (date: string) => {
    // Convert YYYYMM to YYYY/MM for display
    if (!date || date.length !== 6) return '';
    return `${date.substring(0, 4)}/${date.substring(4, 6)}`;
  };

  const formatDateTimeForDisplay = (value: unknown) => {
    if (!value) return '';
    const d = new Date(value as any);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <div className="h-0.5 bg-blue-600 w-full"></div>
        </div>

        <div className="px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              {t('controls.create')}
            </button>
            <button
              type="button"
              onClick={handleDuplicate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              disabled={!selectedCostVersion}
              title={!selectedCostVersion ? t('messages.selectBeforeDuplicate') : ''}
            >
              {t('controls.duplicate')}
            </button>

            <div className="flex items-center gap-2 ml-6">
              <label className="text-sm text-gray-700">{t('controls.reportType')}</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="製造原価">{t('reportType.manufacturing')}</option>
                <option value="個別原価">{t('reportType.individual')}</option>
                <option value="製版連結収支">{t('reportType.consolidated')}</option>
              </select>
            </div>

            <label className="flex items-center gap-2 ml-4">
              <input
                type="checkbox"
                checked={costCopy}
                onChange={(e) => setCostCopy(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('controls.costCopy')}</span>
            </label>
          </div>

          <div className="mb-6 border border-gray-200 rounded-lg bg-white">
            <Table>
              <TableHeader className="bg-[#00388E] text-white">
                <TableRow>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                    {t('table.headers.select')}
                  </TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                    {t('table.headers.version')}
                  </TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-center text-sm font-medium w-24">
                    {t('table.headers.start')}
                  </TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-center text-sm font-medium w-24">
                    {t('table.headers.end')}
                  </TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-center text-sm font-medium w-28">
                    {t('table.headers.registeredAt')}
                  </TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                    {t('table.headers.description')}
                  </TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-center text-sm font-medium w-20">
                    {t('table.headers.edit')}
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center text-sm font-medium w-20">
                    {t('table.headers.delete')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costVersions.map((costVersion) => (
                  <TableRow key={costVersion.costVersionId} className="border-b border-gray-200">
                    <TableCell className="border-r border-gray-200 px-4 py-3 text-center">
                      <input
                        type="radio"
                        name="costVersionSelect"
                        value={costVersion.costVersionId}
                        checked={selectedCostVersion === costVersion.costVersionId}
                        onChange={(e) => setSelectedCostVersion(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell className="border-r border-gray-200 px-4 py-3">
                      <span className="text-sm text-gray-800">{costVersion.costVersionName}</span>
                    </TableCell>
                    <TableCell className="border-r border-gray-200 px-4 py-3 text-center text-sm">
                      {formatDateForDisplay(costVersion.startDate)}
                    </TableCell>
                    <TableCell className="border-r border-gray-200 px-4 py-3 text-center text-sm">
                      {formatDateForDisplay(costVersion.endDate)}
                    </TableCell>
                    <TableCell className="border-r border-gray-200 px-4 py-3 text-center text-sm">
                      {formatDateTimeForDisplay(costVersion.createdOn)}
                    </TableCell>
                    <TableCell className="border-r border-gray-200 px-4 py-3 text-sm">{costVersion.description}</TableCell>
                    <TableCell className="border-r border-gray-200 px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleEdit(costVersion)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        {t('table.headers.edit')}
                      </button>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(costVersion.costVersionId)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <img src={deleteIcon} alt={t('buttons.deleteAlt')} className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.create.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.id')}</label>
              <input
                type="text"
                value={formData.costVersionId}
                onChange={(e) => setFormData({ ...formData, costVersionId: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholders.costVersionId')}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.businessUnit')}</label>
              <LocationSelectField
                value={formData.businessunitId}
                onValueChange={(v) => setFormData({ ...formData, businessunitId: v })}
                locations={businessUnits}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.name')}</label>
              <input
                type="text"
                value={formData.costVersionName}
                onChange={(e) => setFormData({ ...formData, costVersionName: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholders.costVersionName')}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.start')}</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholders.startDate')}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.end')}</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholders.endDate')}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.desc')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder={t('placeholders.description')}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.default')}</label>
              <input
                type="checkbox"
                checked={formData.defaultFlg}
                onChange={(e) => setFormData({ ...formData, defaultFlg: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{t('fields.defaultHint')}</span>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={confirmCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('controls.create')}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              {t('modals.delete.cancel', { defaultValue: 'キャンセル' })}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.edit.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.id')}</label>
              <input
                type="text"
                value={formData.costVersionId}
                disabled
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.businessUnit')}</label>
              <LocationSelectField
                value={formData.businessunitId}
                onValueChange={(v) => setFormData({ ...formData, businessunitId: v })}
                locations={businessUnits}
                className="w-full"
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.name')}</label>
              <input
                type="text"
                value={formData.costVersionName}
                onChange={(e) => setFormData({ ...formData, costVersionName: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.start')}</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.end')}</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.desc')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.default')}</label>
              <input
                type="checkbox"
                checked={formData.defaultFlg}
                onChange={(e) => setFormData({ ...formData, defaultFlg: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{t('fields.defaultHint')}</span>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={confirmEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('buttons.save')}
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              {t('modals.delete.cancel', { defaultValue: 'キャンセル' })}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.delete.title')}</DialogTitle>
            <DialogDescription>{t('modals.delete.message')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {t('modals.delete.ok')}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              {t('modals.delete.cancel', { defaultValue: 'キャンセル' })}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Modal */}
      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.duplicate.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium">{t('fields.name')}</label>
              <input
                type="text"
                value={duplicateData.newCostVersionName}
                onChange={(e) => setDuplicateData({ ...duplicateData, newCostVersionName: e.target.value })}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholders.duplicateName')}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={confirmDuplicate}
              disabled={isDuplicating || !duplicateData.newCostVersionName.trim() || !duplicateData.ktnCd}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDuplicating ? t('controls.saving') : t('controls.duplicate')}
            </button>
            <button
              type="button"
              onClick={() => setShowDuplicateModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              {t('modals.delete.cancel', { defaultValue: 'キャンセル' })}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CostVersionRegistration;
