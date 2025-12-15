import type { CalcCondition, CalcDisplay, CalcOperation, Calculation } from '@pxa-re-management/shared';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormulaSectionEditor from '@/components/molecules/FormulaSectionEditor';
import { renderCalculationInline } from '@/components/shared/calculation-renderer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBusinessUnitActions, useBusinessUnitSelectors } from '@/store/businessUnit';
import type { EditorBranchNode } from '@/store/calcRegister';
import { useCalcRegisterActions, useCalcRegisterSelectors } from '@/store/calcRegister';
import { useCalcTypeActions, useCalcTypeSelectors } from '@/store/calcType';
import LocationSelectField from '@/components/molecules/LocationSelectField';

const CalcRegister = () => {
  const { t } = useTranslation('calcRegister');
  const { businessUnits } = useBusinessUnitSelectors();
  const { fetchBusinessUnit } = useBusinessUnitActions();
  const { fetchCalcType, clearCalcType } = useCalcTypeActions();
  const { calcTypes } = useCalcTypeSelectors();
  // const { fetchBusinessCostForCalculation } = useBusinessCostActions();
  const {
    selectedBusinessUnitId,
    selectedCalcTypeId,
    buCostCodes,
    buCostItems,
    buItemIdToCodeMap,
    calculations,
    editorOpen,
    editorTargetDisplay,
    editorCondition,
    editorBranches,
    selectedBranchId,
    editorTreesByDisplay,
  } = useCalcRegisterSelectors();

  const {
    initForBusinessUnit,
    updateSelectedCalcType,
    openEditor,
    closeEditor,
    setCondition,
    resetEdit,
    // 左カラム操作
    selectBranch,
    addChildBranch,
    persistSelectedBranchFromEditor,
    deleteBranch,
    fetchBusinessCostForCalculation,
    saveCalculation,
  } = useCalcRegisterActions();

  const [keyword, setKeyword] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    updateSelectedCalcType('');
    clearCalcType();
    fetchBusinessUnit();
  }, [fetchBusinessUnit]);

  useEffect(() => {
    if (selectedBusinessUnitId) {
      fetchCalcType(selectedBusinessUnitId);
    }
  }, [selectedBusinessUnitId, fetchCalcType]);

  // 拠点変更
  const handleChangeBusinessUnit = (buId: string) => {
    console.log('[page] change BU:', buId);
    initForBusinessUnit(buId);
  };

  // 計算種類変更
  const handleChangeCalcType = (ctId: string) => {
    console.log('[page] change calcType:', ctId);
    updateSelectedCalcType(ctId);
  };

  // 検索（キーワードは現時点ダミー）
  const handleSearch = () => {
    fetchBusinessCostForCalculation(selectedBusinessUnitId, selectedCalcTypeId);
    console.log('[page] search clicked:', { selectedBusinessUnitId, selectedCalcTypeId, keyword });
  };

  const filtered = useMemo(() => {
    return calculations.filter((c) => {
      // calcDisplay がnull想定だった箇所をガード
      const d = c.calcDisplay as CalcDisplay | null;
      if (!d) return true; // 未設定は一覧残す
      return d.businessunitId === selectedBusinessUnitId && d.calcTypeId === selectedCalcTypeId;
    });
  }, [calculations, selectedBusinessUnitId, selectedCalcTypeId]);

  const CostItemLabel = ({ buCostCd, costType }: { buCostCd: string; costType: 'G' | 'R' | 'K' }) => {
    const code = buCostCodes.find((b) => b.buCostCd === buCostCd);
    const name = code?.buCostNameJa ?? buCostCd;
    const color =
      costType === 'G'
        ? 'bg-yellow-100 text-yellow-900'
        : costType === 'R'
          ? 'bg-pink-100 text-pink-900'
          : 'bg-green-100 text-green-900';
    return <span className={`px-1 rounded ${color}`}>{name}</span>;
  };

  const renderCondition = (cond?: CalcCondition) => {
    if (!cond) return <span className="text-gray-500">{t('labels.conditionUnset')}</span>;
    return (
      <span className="space-x-1">
        <CostItemLabel buCostCd={cond.leftConBuCostCd} costType={cond.leftConCostType as 'G' | 'R' | 'K'} />
        <span>{cond.conOperator}</span>
        <CostItemLabel buCostCd={cond.rightConBuCostCd} costType={cond.rightConCostType as 'G' | 'R' | 'K'} />
      </span>
    );
  };

  // splitIfElseOps は共有化済み

  const renderOpsExpr = (ops: CalcOperation[]) => {
    if (ops.length === 0) return <span className="text-gray-500">{t('labels.unset')}</span>;
    return (
      <span className="space-x-1">
        {ops.map((o, idx) => (
          <span key={`${o.calcOperationId}-${o.opeSeq}-${idx}`} className="space-x-1">
            {o.opeOperator !== 'S' ? <span>{o.opeOperator}</span> : null}
            <CostItemLabel buCostCd={o.opeBuCostCd} costType={o.opeCostType as 'G' | 'R' | 'K'} />
          </span>
        ))}
      </span>
    );
  };

  const CalculationExpression = ({ calculation }: { calculation: Calculation }) => {
    const tree = editorTreesByDisplay[calculation.calcDisplay.calcDisplayId] as EditorBranchNode[] | undefined;
    return renderCalculationInline(calculation, tree, buCostCodes);
  };

  // モーダル左カラム用: 現在編集中の計算式データ
  // 左カラム用: ツリーを再帰表示（editorBranches は flat のため parentId/side で構築）
  const rootBranch = useMemo(() => {
    return editorBranches.find((b) => b.id === 'root') ?? editorBranches.find((b) => !b.parentId) ?? null;
  }, [editorBranches]);

  const BranchView = ({ node, depth }: { node: EditorBranchNode; depth: number }) => {
    const ifChildren = editorBranches.filter((b) => b.parentId === node.id && b.side === 'IF');
    const elseChildren = editorBranches.filter((b) => b.parentId === node.id && b.side === 'ELSE');
    const isSelected = selectedBranchId === node.id;
    return (
      <div
        className={`rounded border p-2 bg-white ${isSelected ? 'border-blue-400' : ''}`}
        style={{ marginLeft: depth * 12 }}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{node.label}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => selectBranch(node.id)}>
              {t('buttons.edit')}
            </Button>
            {node.id !== 'root' ? (
              <Button size="sm" variant="ghost" onClick={() => deleteBranch(node.id)}>
                {t('buttons.delete')}
              </Button>
            ) : null}
          </div>
        </div>
        {/* IF セクション */}
        <div className="mt-2">
          <div className="flex items-baseline">
            <div className="mt-2 text-600">IF (</div>
            <div className="mt-1">{renderCondition(node.condition ?? undefined)}</div>
            <div className="mt-2 text-m text-600 justify-start">)</div>
          </div>
          { ifChildren.length === 0 ? <div className="ml-2">{renderOpsExpr(node.ifOps)}</div> : null }
          {
            node.ifOps.length === 0 && ifChildren.length === 0 ?
                (
                  <div className="mt-2 ml-6">
                    <Button size="sm" variant="secondary" onClick={() => addChildBranch(node.id, 'IF')}>
                      {t('buttons.addBranch')}
                    </Button>
                  </div>
                ) :
                null
          }
          {/* IF 側 子分岐 */}
          <div className="mt-2 space-y-2">
            {ifChildren.map((child) => (
              <BranchView key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </div>
        {/* ELSE セクション */}
        <div className="mt-3">
          <div className="flex items-baseline">
            <div className="mt-2 text-600">ELSE</div>
            { elseChildren.length === 0 ? <div className="mt-1 ml-2">{renderOpsExpr(node.elseOps)}</div> : null }
          </div>
          {
            node.elseOps.length === 0 && elseChildren.length === 0 ?
              (
                <div className="mt-2 ml-6">
                  <Button size="sm" variant="secondary" onClick={() => addChildBranch(node.id, 'ELSE')}>
                    + 条件分岐を追加
                  </Button>
                </div>
              ) :
              null
          }
          {/* ELSE 側 子分岐 */}
          <div className="mt-2 space-y-2">
            {elseChildren.map((child) => (
              <BranchView key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <div className="h-0.5 bg-blue-600 w-full"></div>
        </div>

        {/* 検索行 */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{t('labels.location')}</span>
                <LocationSelectField
                  value={selectedBusinessUnitId}
                  onValueChange={handleChangeBusinessUnit}
                  locations={businessUnits}
                  selectClassName="w-64"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="ct-select" className="text-sm font-medium text-gray-700">
                  {t('labels.calcType')}
                </label>
                <Select value={selectedCalcTypeId} onValueChange={handleChangeCalcType} disabled={calcTypes.length === 0}>
                  <SelectTrigger id="ct-select" className="w-64">
                    <SelectValue placeholder={t('placeholders.calcType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {calcTypes.map((ct) => (
                      <SelectItem key={ct.calcTypeId} value={ct.calcTypeId}>
                        {ct.calcTypeNameJa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="keyword" className="text-sm font-medium text-gray-700">
                  {t('labels.keyword')}
                </label>
                <Input id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t('placeholders.keyword')} />
              </div>
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 text-white hover:bg-blue-700">
              {t('buttons.search')}
            </Button>
          </div>
        </div>

        {/* 一覧 */}
        <div className="p-6">
          <div className="border border-gray-200 rounded-lg bg-white">
            <Table>
              <TableHeader className="bg-[#00388E] text-white">
                <TableRow>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.costItemCd')}</TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.costItemName')}</TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.expression')}</TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.validation')}</TableHead>
                  <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">{t('table.headers.judgement')}</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium">{t('table.headers.message')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
            {filtered.map((c) => (
              <TableRow key={`${c.calcDisplay.calcDisplayId}-${c.calcDisplay.buCostItemId}`} className="hover:bg-gray-50">
                <TableCell className="border-r border-gray-200 px-4 py-3">
                  {(() => {
                    const baseId = c.calcDisplay?.buCostItemId;
                    if (!baseId) return '';
                    const mapped = buItemIdToCodeMap[baseId];
                    if (mapped) return mapped.buCostCd;
                    const fallbackKey = Object.keys(buItemIdToCodeMap).find((k) => k.startsWith(`${baseId}-`));
                    return fallbackKey ? buItemIdToCodeMap[fallbackKey].buCostCd : '';
                  })()}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-3">
                  {(() => {
                    const baseId = c.calcDisplay?.buCostItemId;
                    if (!baseId) return '';
                    const mapped = buItemIdToCodeMap[baseId];
                    if (mapped) return mapped.buCostNameJa;
                    const fallbackKey = Object.keys(buItemIdToCodeMap).find((k) => k.startsWith(`${baseId}-`));
                    return fallbackKey ? buItemIdToCodeMap[fallbackKey].buCostNameJa : '';
                  })()}
                </TableCell>
                <TableCell
                  className={`border-r border-gray-200 px-4 py-3 ${c.calcDisplay ? 'cursor-pointer' : ''}`}
                  onDoubleClick={() => (c.calcDisplay ? openEditor(c) : undefined)}
                  title={c.calcDisplay ? t('hints.dblclickToEdit') : ''}
                >
                  {c.calcDisplay ? (
                    <CalculationExpression calculation={c} />
                  ) : (
                    <span className="text-gray-500">{t('labels.unset')}</span>
                  )}
                </TableCell>
                <TableCell className="border-r border-gray-200 px-4 py-3" />
                <TableCell className="border-r border-gray-200 px-4 py-3" />
                <TableCell className="px-4 py-3" />
              </TableRow>
            ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* モーダル */}
        <Dialog open={editorOpen} onOpenChange={(v) => (v ? null : closeEditor())}>
          <DialogContent showCloseButton={false} className="bg-white max-w-5xl">
            <DialogHeader>
              <DialogTitle>{t('dialogs.editor.title')}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 左: 条件分岐リスト（簡易） */}
            <div className="min-w-0 space-y-3">
              {/* <div className="text-sm text-gray-600">対象: {editorTargetDisplay?.calcDisplayNameJa}</div> */}
              <div className="rounded border p-3 bg-white">
                <div className="font-medium mb-2">{t('dialogs.editor.sections.conditionBranch')}</div>
                <div className="space-y-2">{rootBranch ? <BranchView node={rootBranch} depth={0} /> : null}</div>
              </div>
            </div>

            {/* 右: 詳細エディタ */}
            <div className="min-w-0">
              {editorTargetDisplay ? (
                <FormulaSectionEditor
                  condition={editorCondition ?? undefined}
                  onChangeCondition={(p) => {
                    setCondition(p);
                    persistSelectedBranchFromEditor();
                  }}
                  buCostCodes={buCostCodes}
                  buCostItems={buCostItems}
                />
              ) : null}
            </div>
            </div>

            <DialogFooter>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  persistSelectedBranchFromEditor();
                  setShowSaveConfirm(true);
                }}
              >
                {t('buttons.save')}
              </Button>
              <Button variant="outline" onClick={resetEdit}>
                {t('buttons.cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 保存確認ダイアログ */}
        <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
          <DialogContent showCloseButton={false} className="bg-white">
            <DialogHeader>
              <DialogTitle>{t('modals.save.title')}</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveConfirm(false)}>
                {t('modals.save.cancel')}
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={async () => {
                  setShowSaveConfirm(false);
                  await saveCalculation();
                  fetchBusinessCostForCalculation(selectedBusinessUnitId, selectedCalcTypeId);
                }}
              >
                {t('modals.save.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CalcRegister;
