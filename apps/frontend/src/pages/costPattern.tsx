import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocationSelectField from '@/components/molecules/LocationSelectField';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStickyMessageActions } from '@/store/stickyMessage';
import {
  bulkAssignPattern,
  createPatternDetail,
  fetchBuCostItems,
  fetchCostVersions,
  fetchPatternDetails,
  getCategoryOptions,
} from '../utils/costPattern.api';
import type {
  BusinessUnitItem,
  CostPatternCostVersion,
  CostPatternDetail,
  CostPatternBuCostItemRow,
  CostPatternCategoryOptionsResponse,
  GetBusinessUnitListResponse,
} from '@pxa-re-management/shared';
import { api as API } from "@/utils/api-client.ts";


const CostPatternPage = () => {

  const { t } = useTranslation('costPattern');
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();
  const [costVersions, setCostVersions] = useState<CostPatternCostVersion[]>([]);
  const [patternDetails, setPatternDetails] = useState<CostPatternDetail[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CostPatternCategoryOptionsResponse | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<null | string>(null);
  const [locations, setLocations] = useState<ReadonlyArray<BusinessUnitItem>>([]);
  const [selectedCostVersionId, setSelectedCostVersionId] = useState<string>('');
  const [selectedPatternDetailId, setSelectedPatternDetailId] = useState<string>('');

  const [rows, setRows] = useState<CostPatternBuCostItemRow[]>([]);
  const [checkedCostRegisterIds, setCheckedCostRegisterIds] = useState<Record<string, boolean>>({});

  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [newPatternName, setNewPatternName] = useState('');
  const [modelRows, setModelRows] = useState<{ selected: boolean; seq: number; id?: string; modelCategoryId?: string }[]>([]);
  const [destRows, setDestRows] = useState<{ selected: boolean; seq: number; id?: string; destCategoryId?: string }[]>([]);
  const [secondDestRows, setSecondDestRows] = useState<{ selected: boolean; seq: number; id?: string; destCategoryId?: string }[]>([]);

  const computedPatternCd = useMemo(() => {
    const hasModel = modelRows.length > 0;
    const hasSecondDest = secondDestRows.length > 0;
    const hasDest = destRows.length > 0;
    if (hasModel && !hasSecondDest && !hasDest) return 'A';
    if (!hasModel && hasSecondDest && !hasDest) return 'B';
    if (!hasModel && !hasSecondDest && hasDest) return 'C';
    if (hasModel && hasSecondDest && !hasDest) return 'D';
    if (hasModel && !hasSecondDest && hasDest) return 'E';
    if (!hasModel && hasSecondDest && hasDest) return 'F';
    if (hasModel && hasSecondDest && hasDest) return 'G';
    return 'A';
  }, [modelRows, secondDestRows, destRows]);

  useEffect(
    () => {

      getCategoryOptions().
          then(setCategoryOptions).
          catch((error: unknown): void => { console.error(error); });

      (
        async (): Promise<void> => {
          setLocations((await API.get<GetBusinessUnitListResponse>('business-unit').json()).businessUnits)
        }
      )().catch((error: unknown): void => { console.error(error); });

    },
    []
  );

  useEffect(() => {
    if (!selectedLocation) {
      setCostVersions([]);
      setPatternDetails([]);
      setRows([]);
      return;
    }
    fetchCostVersions(selectedLocation).then((list) => {
      setCostVersions(list);
      // keep selected if still exists
      if (list.every((v) => v.costVersionId !== selectedCostVersionId)) {
        setSelectedCostVersionId('');
      }
    });
    fetchPatternDetails(selectedLocation).then(setPatternDetails);
  }, [selectedLocation]);

  useEffect(() => {
    if (!selectedLocation) {
      setRows([]);
      return;
    }
    fetchBuCostItems(selectedLocation, selectedCostVersionId || undefined).then((data) => {
      setRows(data);
      setCheckedCostRegisterIds({});
    });
  }, [selectedLocation, selectedCostVersionId]);

  const allChecked = useMemo(() => {
    const ids = rows.map((r) => r.costRegisterId).filter(Boolean) as string[];
    return ids.length > 0 && ids.every((id) => checkedCostRegisterIds[id]);
  }, [rows, checkedCostRegisterIds]);

  const toggleAll = () => {
    const ids = rows.map((r) => r.costRegisterId).filter(Boolean) as string[];
    const next: Record<string, boolean> = {};
    const target = !allChecked;
    for (const id of ids) next[id] = target;
    setCheckedCostRegisterIds(next);
  };

  const toggleRow = (id?: string | null) => {
    if (!id) return;
    setCheckedCostRegisterIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBulkAssign = async () => {
    if (!selectedLocation || !selectedCostVersionId || !selectedPatternDetailId) return;
    const targetIds = Object.entries(checkedCostRegisterIds)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (targetIds.length === 0) return;
    const res = await bulkAssignPattern({
      costRegisterIds: targetIds,
      costPatternDetailId: selectedPatternDetailId,
    });
    if (res.updated > 0) {
      const updated = await fetchBuCostItems(selectedLocation, selectedCostVersionId);
      setRows(updated);
      setCheckedCostRegisterIds({});
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    // デフォルトは既存があれば先頭を選択、なければ新規
    if (patternDetails.length > 0) {
      const first = patternDetails[0];
      setIsCreatingNew(false);
      setSelectedDetailId(first.costPatternDetailId);
      setNewPatternName(first.costPatternName);
      setModelRows(
        first.costPatternModelCategories
          .map((m, i) => ({ selected: i === 0, seq: m.seq ?? i + 1, id: m.costPatternModelCategoryId, modelCategoryId: m.modelCategoryId }))
          .sort((a, b) => a.seq - b.seq),
      );
      const firstDest = first.costPatternDestCategories.filter((d) => !d.secFlg);
      const firstSecond = first.costPatternDestCategories.filter((d) => d.secFlg);
      setDestRows(firstDest.map((d, i) => ({ selected: i === 0, seq: d.seq ?? i + 1, id: d.costPatternDestCategoryId, destCategoryId: d.destCategoryId })).sort((a, b) => a.seq - b.seq));
      setSecondDestRows(firstSecond.map((d, i) => ({ selected: i === 0, seq: d.seq ?? i + 1, id: d.costPatternDestCategoryId, destCategoryId: d.destCategoryId })).sort((a, b) => a.seq - b.seq));
    } else {
      // 新規
      setIsCreatingNew(true);
      setSelectedDetailId(null);
      setNewPatternName('');
      setModelRows([{ selected: true, seq: 1 }]);
      setDestRows([{ selected: true, seq: 1 }]);
      setSecondDestRows([{ selected: true, seq: 1 }]);
    }
  };


  const handleCreatePattern = async () => {
    if (!selectedLocation || !newPatternName) return;
    const detail = await createPatternDetail({
      costPatternName: newPatternName,
      businessunitId: selectedLocation,
      costPatternModelCategories: modelRows.map((r) => ({ modelCategoryId: r.modelCategoryId!, seq: r.seq })).sort((a, b) => a.seq - b.seq),
      costPatternDestCategories: [
        ...destRows.map((r) => ({ destCategoryId: r.destCategoryId!, secFlg: false, seq: r.seq })),
        ...secondDestRows.map((r) => ({ destCategoryId: r.destCategoryId!, secFlg: true, seq: r.seq })),
      ].sort((a, b) => a.seq - b.seq),
    });
    if (detail.costPatternDetailId) {
      const list = await fetchPatternDetails(selectedLocation);
      setPatternDetails(list);
      // 追加された明細を選択状態にして詳細（読み取り専用）を表示
      const added = list.find((p) => p.costPatternDetailId === detail.costPatternDetailId);
      if (added) {
        setIsCreatingNew(false);
        setSelectedDetailId(added.costPatternDetailId);
        setNewPatternName(added.costPatternName);
        setModelRows(
          added.costPatternModelCategories
            .map((m, i) => ({ selected: i === 0, seq: m.seq ?? i + 1, id: m.costPatternModelCategoryId, modelCategoryId: m.modelCategoryId }))
            .sort((a, b) => a.seq - b.seq),
        );
        const d1 = added.costPatternDestCategories.filter((d) => !d.secFlg);
        const d2 = added.costPatternDestCategories.filter((d) => d.secFlg);
        setDestRows(d1.map((d, i) => ({ selected: i === 0, seq: d.seq ?? i + 1, id: d.costPatternDestCategoryId, destCategoryId: d.destCategoryId })).sort((a, b) => a.seq - b.seq));
        setSecondDestRows(d2.map((d, i) => ({ selected: i === 0, seq: d.seq ?? i + 1, id: d.costPatternDestCategoryId, destCategoryId: d.destCategoryId })).sort((a, b) => a.seq - b.seq));
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div>
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <div className="h-0.5 bg-blue-600 w-full"></div>
          </div>

          <div className="p-6">
            {/* フィルタ行 */}
            <div className="flex items-end gap-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{t('labels.location')}</span>
                <LocationSelectField
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                  locations={locations}
                  selectClassName="w-[240px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{t('labels.costVersion')}</span>
                <select
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm min-w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCostVersionId}
                  onChange={(e) => setSelectedCostVersionId(e.target.value)}
                  disabled={!selectedLocation}
                >
                  <option value="">{''}</option>
                  {costVersions.map((v) => (
                    <option key={v.costVersionId} value={v.costVersionId}>
                      {v.costVersionName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ml-auto">
                <Button type="button" onClick={openModal} disabled={!selectedLocation}>
                  {t('buttons.openPatternDialog')}
                </Button>
              </div>
            </div>

            {/* パターン明細選択 + 設定 */}
            <div className="flex items-end gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{t('labels.patternDetail')}</span>
                <select
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm min-w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedPatternDetailId}
                  onChange={(e) => setSelectedPatternDetailId(e.target.value)}
                  disabled={!selectedLocation}
                >
                  <option value="">{''}</option>
                  {patternDetails.map((p) => (
                    <option key={p.costPatternDetailId} value={p.costPatternDetailId}>
                      {p.costPatternName}（{p.costPatternCd}）
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    await handleBulkAssign();
                    addSuccessMessage(t('messages.assignSuccess'));
                  } catch (_e) {
                    addErrorMessage(t('messages.assignError'));
                  }
                }}
                disabled={!selectedPatternDetailId}
              >
                {t('buttons.assign')}
              </Button>
            </div>

            {/* テーブル */}
            <div className="mb-6 border border-gray-200 rounded-lg bg-white">
              <Table>
                <TableHeader className="bg-[#00388E] text-white">
                  <TableRow>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium w-12">
                      <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      {t('table.headers.buCostCode')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      {t('table.headers.buCostName')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium w-20">
                      {t('table.headers.costType')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium w-20">
                      {t('table.headers.currency')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      {t('table.headers.patternName')}
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium w-28">
                      {t('table.headers.patternCd')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {t('table.empty')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r) => (
                      <TableRow key={`${r.buCostItemId}-${r.costType}`} className="bg-white">
                        <TableCell className="border-r border-gray-200 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={!!(r.costRegisterId && checkedCostRegisterIds[r.costRegisterId])}
                            onChange={() => toggleRow(r.costRegisterId)}
                            disabled={!r.costRegisterId}
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.buCostCode}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.buCostName}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.costType === 'G' ? '額' : 'レート'}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.curCd}</TableCell>
                        <TableCell className="border-r border-gray-200 px-4 py-3 text-sm text-gray-800">{r.costPatternName ?? ''}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-800">{r.costPatternCd ?? ''}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* モーダル */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.pattern.title')}</DialogTitle>
            <DialogDescription> {t('labels.patternCode')}: {computedPatternCd}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{t('labels.patternDetail')}</div>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsCreatingNew(true);
                    setSelectedDetailId(null);
                    setNewPatternName('');
                    setModelRows([{ selected: true, seq: 1 }]);
                    setDestRows([{ selected: true, seq: 1 }]);
                    setSecondDestRows([{ selected: true, seq: 1 }]);
                  }}
                >
                  {t('buttons.add')}
                </Button>
              </div>
              <div className="max-h-[360px] overflow-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium">
                        {t('table.headers.patternName')}
                      </TableHead>
                      <TableHead className="px-3 py-2 text-left text-sm font-medium">
                        {t('table.headers.patternCd')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isCreatingNew && (
                      <TableRow className="bg-blue-50">
                        <TableCell className="border-r border-gray-200 px-3 py-2 text-sm">
                          {newPatternName || '新規（編集中）'}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-sm">{computedPatternCd}</TableCell>
                      </TableRow>
                    )}
                    {patternDetails.map((p) => (
                      <TableRow
                        key={p.costPatternDetailId}
                        className={`cursor-pointer ${!isCreatingNew && selectedDetailId === p.costPatternDetailId ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setIsCreatingNew(false);
                          setSelectedDetailId(p.costPatternDetailId);
                          setNewPatternName(p.costPatternName);
                          setModelRows(
                            p.costPatternModelCategories
                              .map((m, i) => ({ selected: i === 0, seq: m.seq ?? i + 1, id: m.costPatternModelCategoryId, modelCategoryId: m.modelCategoryId }))
                              .sort((a, b) => a.seq - b.seq),
                          );
                          const d1 = p.costPatternDestCategories.filter((d) => !d.secFlg);
                          const d2 = p.costPatternDestCategories.filter((d) => d.secFlg);
                          setDestRows(d1.map((d, i) => ({ selected: i === 0, seq: d.seq ?? i + 1, id: d.costPatternDestCategoryId, destCategoryId: d.destCategoryId })).sort((a, b) => a.seq - b.seq));
                          setSecondDestRows(d2.map((d, i) => ({ selected: i === 0, seq: d.seq ?? i + 1, id: d.costPatternDestCategoryId, destCategoryId: d.destCategoryId })).sort((a, b) => a.seq - b.seq));
                        }}
                      >
                        <TableCell className="border-r border-gray-200 px-3 py-2 text-sm">{p.costPatternName}</TableCell>
                        <TableCell className="px-3 py-2 text-sm">{p.costPatternCd}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="border rounded p-3">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">{t('modals.pattern.name')}</label>
                {isCreatingNew ? (
                  <input
                    className="bg-white border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPatternName}
                    onChange={(e) => setNewPatternName(e.target.value)}
                    placeholder="新規登録時のみ入力可能"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded">{newPatternName || '-'}</div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <CategoryTable title="機種カテゴリ" type="model" options={categoryOptions} rows={modelRows} setRows={setModelRows} readOnly={!isCreatingNew} />
                <CategoryTable title="販売先カテゴリ" type="dest" options={categoryOptions} rows={destRows} setRows={setDestRows} readOnly={!isCreatingNew} />
                <CategoryTable title="2次販売先カテゴリ" type="secondDest" options={categoryOptions} rows={secondDestRows} setRows={setSecondDestRows} readOnly={!isCreatingNew} />
              </div>

              <DialogFooter>
                <div className="flex w-full justify-between items-center pt-2">
                  <div className="text-sm text-gray-600">{t('labels.patternCode')}: {computedPatternCd}</div>
                  <div className="flex gap-2">
                    {isCreatingNew ? (
                      <Button onClick={handleCreatePattern} disabled={!newPatternName}>
                        {t('buttons.register')}
                      </Button>
                    ) : (
                      <div className="text-sm text-gray-500">{t('modals.pattern.readonly')}</div>
                    )}
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t('buttons.close')}</Button>
                  </div>
                </div>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CostPatternPage;

type CategoryTableProps = {
  title: string;
  type: 'model' | 'dest' | 'secondDest';
  options: CostPatternCategoryOptionsResponse | null;
  rows: { selected: boolean; seq: number; id?: string; modelCategoryId?: string; destCategoryId?: string }[];
  setRows: (
    next:
      | { selected: boolean; seq: number; id?: string; modelCategoryId?: string; destCategoryId?: string }[]
      | ((prev:
          | { selected: boolean; seq: number; id?: string; modelCategoryId?: string; destCategoryId?: string }[],
        ) => { selected: boolean; seq: number; id?: string; modelCategoryId?: string; destCategoryId?: string }[]),
  ) => void;
  readOnly?: boolean;
};

const CategoryTable = ({ title, type, options, rows, setRows, readOnly = false }: CategoryTableProps) => {
  const addRow = () => {
    const nextSeq = rows.length === 0 ? 1 : Math.max(...rows.map((r) => r.seq)) + 1;
    setRows([...rows, { selected: rows.length === 0, seq: nextSeq }]);
  };
  const removeRow = (seq: number) => {
    const filtered = rows.filter((r) => r.seq !== seq).sort((a, b) => a.seq - b.seq);
    // 項順を詰めて再採番
    const reseq = filtered.map((r, idx) => ({ ...r, seq: idx + 1 }));
    // 先頭行を選択状態にする（選択が消えるのを避ける）
    const withSelection = reseq.map((r, idx) => ({ ...r, selected: idx === 0 }));
    setRows(withSelection);
  };
  const toggleSelect = (seq: number) =>
    setRows(rows.map((r) => (r.seq === seq ? { ...r, selected: !r.selected } : r)));
  const moveUp = () => {
    const idx = rows.findIndex((r) => r.selected);
    if (idx <= 0) return;
    const copy = [...rows];
    [copy[idx - 1].seq, copy[idx].seq] = [copy[idx].seq, copy[idx - 1].seq];
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
    setRows(copy);
  };
  const moveDown = () => {
    const idx = rows.findIndex((r) => r.selected);
    if (idx === -1 || idx >= rows.length - 1) return;
    const copy = [...rows];
    [copy[idx + 1].seq, copy[idx].seq] = [copy[idx].seq, copy[idx + 1].seq];
    [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
    setRows(copy);
  };
  const onChangeOption = (seq: number, value: string) => {
    setRows(
      rows.map((r) =>
        r.seq === seq
          ? type === 'model'
            ? { ...r, modelCategoryId: value }
            : { ...r, destCategoryId: value }
          : r,
      ),
    );
  };

  const availableOptions =
    type === 'model' ? options?.modelCategories ?? [] : options?.destCategories ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{title}</div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
            onClick={moveUp}
            disabled={readOnly}
          >
            ▲
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
            onClick={moveDown}
            disabled={readOnly}
          >
            ▼
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
            onClick={addRow}
            disabled={readOnly}
          >
            追加
          </button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border-r border-gray-200 px-2 py-2 text-left text-sm font-medium text-gray-700 w-16">
              選択
            </th>
            <th className="border-r border-gray-200 px-2 py-2 text-left text-sm font-medium text-gray-700 w-16">
              項順
            </th>
            <th className="border-r border-gray-200 px-2 py-2 text-left text-sm font-medium text-gray-700">
              カテゴリ
            </th>
            <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 w-16">削除</th>
          </tr>
        </thead>
        <tbody>
          {rows.sort((a, b) => a.seq - b.seq).map((r) => (
            <tr key={r.seq} className="border-b border-gray-200">
              <td className="border-r border-gray-200 px-2 py-2">
                <input
                  type="radio"
                  checked={r.selected}
                  onChange={() => toggleSelect(r.seq)}
                  className="text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="border-r border-gray-200 px-2 py-2 text-sm">{r.seq}</td>
              <td className="border-r border-gray-200 px-2 py-2">
                <select
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={type === 'model' ? r.modelCategoryId ?? '' : r.destCategoryId ?? ''}
                  onChange={(e) => onChangeOption(r.seq, e.target.value)}
                  disabled={readOnly}
                >
                  <option value="">選択してください</option>
                  {availableOptions.map((op) => (
                    <option
                      key={type === 'model' ? (op as any).modelCategoryId : (op as any).destCategoryId}
                      value={type === 'model' ? (op as any).modelCategoryId : (op as any).destCategoryId}
                    >
                      {type === 'model' ? (op as any).modelCategoryName : (op as any).destCategoryName}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-2">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                  onClick={() => removeRow(r.seq)}
                  disabled={readOnly}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


