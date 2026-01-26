import type { CalcCondition, CalcOperation, Calculation } from '@pxa-re-management/shared';
import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { useTranslation } from 'react-i18next';
import type { EditorBranchNode } from '@/store/calcRegister';
import { useLanguage } from '@/store/languageSettings';

export type BuCostCodeLike = { buCostCd: string; buCostNameJa: string; buCostNameEn: string; buCostNameZh: string };

export const CostItemLabel = ({
  buCostCd,
  costType,
  buCostCodes,
}: {
  buCostCd: string;
  costType: 'G' | 'R' | 'K';
  buCostCodes: BuCostCodeLike[];
}) => {
  const { t } = useTranslation('calcRegister');
  const { currentLanguage } = useLanguage();
  const code = buCostCodes.find((b) => b.buCostCd === buCostCd);
  // 特別コードは見た目の表記を置換
  const special = buCostCd === 'ZERO' ? '0' : buCostCd === 'MINUS' ? '-1' : buCostCd === 'RATE' ? '100' : null;
  const name = special ?? (
    currentLanguage === TagsOfSupportedLanguages.english ? code?.buCostNameEn :
    currentLanguage === TagsOfSupportedLanguages.chinese ? code?.buCostNameZh :
    code?.buCostNameJa
  ) ?? buCostCd;
  // 種別の色分け: 特別コードはK扱い（緑）で統一
  const typeForColor = special ? 'K' : costType;
  const color =
    typeForColor === 'G'
      ? 'bg-yellow-100 text-yellow-900'
      : typeForColor === 'R'
        ? 'bg-pink-100 text-pink-900'
        : 'bg-green-100 text-green-900';
  const typeLabel = typeForColor === 'G' ? t('labels.costTypeAmount') : typeForColor === 'R' ? t('labels.costTypeRate') : t('labels.costTypeFormula');
  return (
    <span className={`px-1 rounded ${color}`}>
      {name}
      <span className="ml-1 text-xs text-gray-700">{typeLabel}</span>
    </span>
  );
};

export const renderCondition = (cond: CalcCondition | undefined, buCostCodes: BuCostCodeLike[], t: (key: string) => string) => {
  if (!cond) return <span className="text-gray-500">{t('labels.conditionUnset')}</span>;
  return (
    <span className="space-x-1">
      <CostItemLabel
        buCostCd={cond.leftConBuCostCd}
        costType={cond.leftConCostType as 'G' | 'R' | 'K'}
        buCostCodes={buCostCodes}
      />
      <span>{cond.conOperator}</span>
      <CostItemLabel
        buCostCd={cond.rightConBuCostCd}
        costType={cond.rightConCostType as 'G' | 'R' | 'K'}
        buCostCodes={buCostCodes}
      />
    </span>
  );
};

export const renderOpsExpr = (ops: CalcOperation[], buCostCodes: BuCostCodeLike[], t: (key: string) => string) => {
  if (ops.length === 0) return <span className="text-gray-500">{t('labels.unset')}</span>;
  
  // Calculate depth for each operation at runtime
  const sorted = [...ops].sort((a, b) => a.opeSeq - b.opeSeq);
  const depthMap = new Map<number, number>();
  let currentDepth = 0;
  
  for (const op of sorted) {
    if (op.opeOperator === '(') {
      depthMap.set(op.opeSeq, currentDepth);
      currentDepth++;
    } else if (op.opeOperator === ')') {
      currentDepth--;
      depthMap.set(op.opeSeq, currentDepth);
    } else {
      depthMap.set(op.opeSeq, currentDepth);
    }
  }
  
  return (
    <span className="space-x-1">
      {ops.map((o, idx) => {
        const depth = depthMap.get(o.opeSeq) ?? 0;
        const color = depth > 0 
          ? `hsl(${(depth * 60) % 360}, 70%, 50%)`
          : 'inherit';

        // Render parentheses
        if (o.opeOperator === '(' || o.opeOperator === ')') {
          return (
            <span 
              key={`${o.calcOperationId}-${o.opeSeq}-${idx}`}
              className="font-bold text-xl"
              style={{ color }}
            >
              {o.opeOperator}
            </span>
          );
        }

        // Render regular operations
        return (
          <span key={`${o.calcOperationId}-${o.opeSeq}-${idx}`} className="space-x-1">
            {o.opeOperator !== 'S' ? <span>{o.opeOperator}</span> : null}
            <CostItemLabel
              buCostCd={o.opeBuCostCd}
              costType={o.opeCostType as 'G' | 'R' | 'K'}
              buCostCodes={buCostCodes}
            />
          </span>
        );
      })}
    </span>
  );
};

export const splitIfElseOps = (
  ops: CalcOperation[],
  calc: Calculation
): { ifOps: CalcOperation[]; elseOps: CalcOperation[] } => {
  const f0 = calc.calcFormulas?.[0];
  if (!f0) return { ifOps: [], elseOps: [] };
  const ifOps = ops.filter((o) => o.calcOperationId === f0.calcOperationId).sort((a, b) => a.opeSeq - b.opeSeq);
  const elseOps = ops.filter((o) => o.calcOperationId === f0.elseCalcOperationId).sort((a, b) => a.opeSeq - b.opeSeq);
  return { ifOps, elseOps };
};

export const renderTreeInline = (node: EditorBranchNode, tree: EditorBranchNode[], buCostCodes: BuCostCodeLike[], t: (key: string) => string): React.ReactNode => {
  const ifChildren = tree.filter((b) => b.parentId === node.id && b.side === 'IF');
  const elseChildren = tree.filter((b) => b.parentId === node.id && b.side === 'ELSE');
  // 条件なし・ELSEなしの場合は演算式のみ
  if (!node.condition && (node.elseOps?.length ?? 0) === 0 && ifChildren.length === 0 && elseChildren.length === 0) {
    return <>{renderOpsExpr(node.ifOps, buCostCodes, t)}</>;
  }
  return (
    <>
      <span>IF(</span>
      {renderCondition(node.condition ?? undefined, buCostCodes, t)}
      <span>)</span>
      <span>{'{'} </span>
      {renderOpsExpr(node.ifOps, buCostCodes, t)}
      <span> {'}'} </span>
      {ifChildren.length > 0
        ? ifChildren.map((ch) => (
            <span key={ch.id}>
              <span> </span>
              {renderTreeInline(ch, tree, buCostCodes, t)}
            </span>
          ))
        : null}
      <span> ELSE </span>
      <span>{'{'}</span>
      <span> </span>
      {renderOpsExpr(node.elseOps, buCostCodes, t)}
      <span> {'}'}</span>
      {elseChildren.length > 0
        ? elseChildren.map((ch) => (
            <span key={ch.id}>
              <span> </span>
              {renderTreeInline(ch, tree, buCostCodes, t)}
            </span>
          ))
        : null}
    </>
  );
};

export const renderCalculationInline = (
  calculation: Calculation,
  treeForDisplay: EditorBranchNode[] | undefined,
  buCostCodes: BuCostCodeLike[],
  t: (key: string) => string
) => {
  if (treeForDisplay && treeForDisplay.length > 0) {
    const root = treeForDisplay.find((b) => b.id === 'root') ?? treeForDisplay.find((b) => !b.parentId);
    if (root) return <span className="whitespace-nowrap">{renderTreeInline(root, treeForDisplay, buCostCodes, t)}</span>;
  }
  // ツリーが無い場合: CalcFormula のネスト構造から再帰的に全体式を描画
  const formulas = calculation.calcFormulas ?? [];
  if (formulas.length === 0) {
    return <span className="whitespace-nowrap">{renderOpsExpr(calculation.calcOperations ?? [], buCostCodes, t)}</span>;
  }
  const byId = new Map(formulas.map((f) => [f.calcFormulaId, f]));
  const referenced = new Set<string>();
  formulas.forEach((f) => {
    if (f.nestCalcFormulaId) referenced.add(f.nestCalcFormulaId);
    if (f.elseNestCalcFormulaId) referenced.add(f.elseNestCalcFormulaId);
  });
  const roots = formulas.filter((f) => !referenced.has(f.calcFormulaId));

  const operations = calculation.calcOperations ?? [];
  const conditions = calculation.calcConditions ?? [];
  const opsByGroup = new Map<string, CalcOperation[]>(
    Array.from(
      operations.reduce((m, o) => {
        const list = m.get(o.calcOperationId) ?? [];
        list.push(o);
        m.set(o.calcOperationId, list);
        return m;
      }, new Map<string, CalcOperation[]>())
    ).map(([k, list]) => [k, list.sort((a, b) => a.opeSeq - b.opeSeq)])
  );
  const condById = new Map(conditions.map((c) => [c.calcConditionId, c]));

  const renderFormulaInline = (f: typeof formulas[number]): React.ReactNode => {
    const cond = f.calcConditionId ? condById.get(f.calcConditionId) : undefined;
    const ifOps = opsByGroup.get(f.calcOperationId) ?? [];
    const elseOps = f.elseCalcOperationId ? opsByGroup.get(f.elseCalcOperationId) ?? [] : [];
    return (
      <>
        <span>IF(</span>
        {renderCondition(cond, buCostCodes, t)}
        <span>)</span>
        <span>{'{'} </span>
        {renderOpsExpr(ifOps, buCostCodes, t)}
        {f.nestCalcFormulaId && byId.get(f.nestCalcFormulaId) ? (
          <>
            <span> </span>
            {renderFormulaInline(byId.get(f.nestCalcFormulaId)!)}
          </>
        ) : null}
        <span> {'}'} </span>
        <span>ELSE</span>
        <span>{' {'} </span>
        {renderOpsExpr(elseOps, buCostCodes, t)}
        {f.elseNestCalcFormulaId && byId.get(f.elseNestCalcFormulaId) ? (
          <>
            <span> </span>
            {renderFormulaInline(byId.get(f.elseNestCalcFormulaId)!)}
          </>
        ) : null}
        <span> {'}'}</span>
      </>
    );
  };

  const content = roots.length > 0 ? roots.map((r, i) => <span key={r.calcFormulaId}>{i > 0 ? ' ' : ''}{renderFormulaInline(r)}</span>) : renderFormulaInline(formulas[0]!);
  return <span className="whitespace-nowrap">{content}</span>;
};
