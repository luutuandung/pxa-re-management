import type {
  CalcCondition,
  CalcDisplay,
  CalcFormula,
  CalcOperation,
  Calculation,
  GetCalcDisplayResponse,
  GetCostItemsResponse,
  UpdateCalcDatasDto,
} from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom, useStore } from 'jotai';
import { useCallback } from 'react';
import { api } from '@/utils/api-client';
import {
  generateOperationId,
  generateConditionId,
  generateFormulaId,
  generateBranchId,
  generateOperationGroupId,
} from '@/utils/id-generators';

// モック: 事業部原価項目コード（1つの原価項目を表す）
export type BuCostCodeMock = {
  buCostCodeId: string;
  buCostCd: string;
  buCostNameJa: string;
};

// モック: 事業部原価項目設定（原価種類）
export type BuCostItemMock = {
  buCostItemId: string;
  buCostCodeId: string;
  costType: 'G' | 'R' | 'K';
};

// 編集用の条件分岐ブランチ（簡易）
export type EditorBranchNode = {
  id: string;
  label: string;
  condition: CalcCondition | null;
  ifOps: CalcOperation[];
  elseOps: CalcOperation[];
  ifOperationGroupId?: string;
  elseOperationGroupId?: string;
  parentId?: string;
  side?: 'IF' | 'ELSE';
};

// Atoms
const selectedBusinessUnitIdAtom = atom<string>('');
const selectedCalcTypeIdAtom = atom<string>('');

const calcTypesAtom = atom(
  [] as Array<{ calcTypeId: string; calcTypeNameJa: string; defaultFlg?: boolean; businessunitId: string }>
);
const buCostCodesAtom = atom<BuCostCodeMock[]>([]);
const buCostItemsAtom = atom<BuCostItemMock[]>([]);
const calculationListAtom = atom<Calculation[]>([]);
// buCostItemId → { buCostCd, buCostNameJa } のマップ（一覧表示用）
const buItemIdToCodeMapAtom = atom<Record<string, { buCostCd: string; buCostNameJa: string }>>({});
// CostCode → CostItem → Calculations のグルーピング
export type GroupedCalculations = Record<
  string,
  {
    buCostCodeId: string;
    buCostCd: string;
    buCostNameJa: string;
    items: Record<string, { buCostItemId: string; calculations: Calculation[] }>;
  }
>;
const calculationsByCostCodeAtom = atom<GroupedCalculations>({});

const editorOpenAtom = atom<boolean>(false);
const editorTargetDisplayAtom = atom<CalcDisplay | null>(null);
const editorConditionsAtom = atom<CalcCondition[]>([]);
const editorOperationsAtom = atom<CalcOperation[]>([]);
const editorFormulasAtom = atom<CalcFormula[]>([]);
// 単一ユニット（条件1つ、IF演算N件、ELSE演算N件）
const editorConditionAtom = atom<CalcCondition | null>(null);
const editorIfOperationsAtom = atom<CalcOperation[]>([]);
const editorElseOperationsAtom = atom<CalcOperation[]>([]);

// 左カラム用: ブランチ一覧と選択
const editorBranchesAtom = atom<EditorBranchNode[]>([]);
const selectedBranchIdAtom = atom<string | null>(null);
// 保存したツリー（display単位で永続化・再編集用）
const editorTreesByDisplayAtom = atom<Record<string, EditorBranchNode[]>>({});

export const useCalcRegisterSelectors = () => {
  const selectedBusinessUnitId = useAtomValue(selectedBusinessUnitIdAtom);
  const selectedCalcTypeId = useAtomValue(selectedCalcTypeIdAtom);
  const calcTypes = useAtomValue(calcTypesAtom);
  const buCostCodes = useAtomValue(buCostCodesAtom);
  const buCostItems = useAtomValue(buCostItemsAtom);
  const calculations = useAtomValue(calculationListAtom);
  const editorOpen = useAtomValue(editorOpenAtom);
  const editorTargetDisplay = useAtomValue(editorTargetDisplayAtom);
  const editorConditions = useAtomValue(editorConditionsAtom);
  const editorOperations = useAtomValue(editorOperationsAtom);
  const editorFormulas = useAtomValue(editorFormulasAtom);
  const editorCondition = useAtomValue(editorConditionAtom);
  const editorIfOperations = useAtomValue(editorIfOperationsAtom);
  const editorElseOperations = useAtomValue(editorElseOperationsAtom);
  const editorBranches = useAtomValue(editorBranchesAtom);
  const selectedBranchId = useAtomValue(selectedBranchIdAtom);
  const editorTreesByDisplay = useAtomValue(editorTreesByDisplayAtom);
  const buItemIdToCodeMap = useAtomValue(buItemIdToCodeMapAtom);
  const calculationsByCostCode = useAtomValue(calculationsByCostCodeAtom);

  return {
    selectedBusinessUnitId,
    selectedCalcTypeId,
    calcTypes,
    buCostCodes,
    buCostItems,
    calculations,
    calculationsByCostCode,
    buItemIdToCodeMap,
    editorOpen,
    editorTargetDisplay,
    editorConditions,
    editorOperations,
    editorFormulas,
    editorCondition,
    editorIfOperations,
    editorElseOperations,
    editorBranches,
    selectedBranchId,
    editorTreesByDisplay,
  };
};

export const useCalcRegisterActions = () => {
  const setCalculations = useSetAtom(calculationListAtom);
  const setSelectedBusinessUnitId = useSetAtom(selectedBusinessUnitIdAtom);
  const setSelectedCalcTypeId = useSetAtom(selectedCalcTypeIdAtom);
  const setCalcTypes = useSetAtom(calcTypesAtom);
  const setBuCostCodes = useSetAtom(buCostCodesAtom);
  const setBuCostItems = useSetAtom(buCostItemsAtom);
  const setBuItemIdToCodeMap = useSetAtom(buItemIdToCodeMapAtom);
  const setCalculationsByCostCode = useSetAtom(calculationsByCostCodeAtom);
  const setEditorOpen = useSetAtom(editorOpenAtom);
  const setEditorTargetDisplay = useSetAtom(editorTargetDisplayAtom);
  const setEditorConditions = useSetAtom(editorConditionsAtom);
  const setEditorOperations = useSetAtom(editorOperationsAtom);
  const setEditorFormulas = useSetAtom(editorFormulasAtom);
  const setEditorCondition = useSetAtom(editorConditionAtom);
  const setEditorIfOperations = useSetAtom(editorIfOperationsAtom);
  const setEditorElseOperations = useSetAtom(editorElseOperationsAtom);
  const setEditorBranches = useSetAtom(editorBranchesAtom);
  const setSelectedBranchId = useSetAtom(selectedBranchIdAtom);
  const setEditorTreesByDisplay = useSetAtom(editorTreesByDisplayAtom);
  const store = useStore();

  // flat(API) → EditorBranchNode[] 構築
  const buildEditorBranchesFromCalculation = useCallback((calculation: Calculation): EditorBranchNode[] => {
    const formulas = calculation.calcFormulas ?? [];
    if (formulas.length === 0) return [];
    const byId = new Map<string, CalcFormula>();
    formulas.forEach((f) => byId.set(f.calcFormulaId, f));
    const referenced = new Set<string>();
    formulas.forEach((f) => {
      if (f.nestCalcFormulaId) referenced.add(f.nestCalcFormulaId);
      if (f.elseNestCalcFormulaId) referenced.add(f.elseNestCalcFormulaId);
    });
    const roots = formulas.filter((f) => !referenced.has(f.calcFormulaId));
    const rootFormula = (roots.length > 0 ? roots : formulas).sort((a, b) => a.evalSeq - b.evalSeq)[0];
    let labelCounter = 1;
    const nodes: EditorBranchNode[] = [];

    const findCondition = (condId?: string | null): CalcCondition | null => {
      if (!condId) return null;
      return calculation.calcConditions.find((c) => c.calcConditionId === condId) ?? null;
    };
    const findOps = (opGroupId?: string | null): CalcOperation[] => {
      if (!opGroupId) return [];
      return calculation.calcOperations
        .filter((o) => o.calcOperationId === opGroupId)
        .sort((a, b) => a.opeSeq - b.opeSeq)
        .map((o) => ({
          ...o,
          calcOperationId: generateOperationId(),
        }));
    };

    const walk = (f: CalcFormula, parentId?: string, side?: 'IF' | 'ELSE') => {
      const id = parentId ? `br-${f.calcFormulaId}` : 'root';
      const node: EditorBranchNode = {
        id,
        label: `条件分岐${labelCounter++}`,
        condition: findCondition(f.calcConditionId),
        ifOps: findOps(f.calcOperationId),
        elseOps: findOps(f.elseCalcOperationId),
        ifOperationGroupId: f.calcOperationId || undefined,
        elseOperationGroupId: f.elseCalcOperationId || undefined,
        parentId,
        side,
      };
      nodes.push(node);
      if (f.nestCalcFormulaId) {
        const child = byId.get(f.nestCalcFormulaId);
        if (child) walk(child, id, 'IF');
      }
      if (f.elseNestCalcFormulaId) {
        const childElse = byId.get(f.elseNestCalcFormulaId);
        if (childElse) walk(childElse, id, 'ELSE');
      }
    };

    walk(rootFormula);
    return nodes;
  }, []);

  const fetchBusinessCostForCalculation = async (buCd: string, calcTypeId?: string) => {
    const response = await api
      .get<GetCalcDisplayResponse>('calc-display', {
        searchParams: {
          calcTypeId: calcTypeId ?? '',
          businessunitId: buCd,
          curCode: 'JPY',
        },
      })
      .json();
    console.log('fetchBusinessCostForCalculation response:', response);
    const calculations: Calculation[] = response.buCostCodes.map((r) => {
      const display =
        r.buCostItem.calcDisplay ??
        ({
          calcDisplayId: crypto.randomUUID(),
          calcTypeId: calcTypeId ?? '',
          buCostItemId: r.buCostItem.buCostItemId,
          calcDisplayCode: '',
          calcDisplayNameJa: '',
          calcDisplayNameEn: '',
          calcDisplayNameZh: '',
          createdBy: '',
          createdOn: new Date(),
          modifiedBy: '',
          modifiedOn: new Date(),
          businessunitId: buCd,
        } as CalcDisplay);
      return {
        calcDisplay: display,
        calcFormulas: r.buCostItem.calcFormulas,
        calcConditions: r.buCostItem.calcConditions,
        calcOperations: r.buCostItem.calcOperations,
      } as Calculation;
    });
    console.log('[calcRegister] fetchBusinessCostForCalculation calculations:', calculations);
    setCalculations(calculations);
    // 一覧表示用マップも calc-display 応答から直接補完しておく（キー不一致時のフォールバック）
    try {
      const directMap: Record<string, { buCostCd: string; buCostNameJa: string }> = {};
      const list: any[] = (response as any)?.buCostCodes ?? [];
      for (const r of list) {
        const itemId = r?.buCostItem?.buCostItemId as string | undefined;
        const cd = r?.buCostCd as string | undefined;
        const name = r?.buCostNameJa as string | undefined;
        if (itemId && cd) {
          directMap[itemId] = { buCostCd: cd, buCostNameJa: name ?? cd };
        }
      }
      if (Object.keys(directMap).length > 0) {
        setBuItemIdToCodeMap(directMap);
      }
    } catch (_e) {
      // ignore mapping supplement errors
    }
    // グルーピング: CostCode → CostItem → Calculations
    const buItems = store.get(buCostItemsAtom);
    const buCodes = store.get(buCostCodesAtom);
    const codeById = new Map(buCodes.map((c) => [c.buCostCodeId, c]));
    const itemById = new Map(buItems.map((i) => [i.buCostItemId, i]));
    const grouped: GroupedCalculations = {};
    for (const calc of calculations) {
      const baseItemId = calc.calcDisplay.buCostItemId;
      let item = itemById.get(baseItemId);
      if (!item) {
        const fallback = buItems.find((i) => i.buCostItemId.startsWith(`${baseItemId}-`));
        if (fallback) item = fallback;
      }
      if (!item) continue;
      const code = codeById.get(item.buCostCodeId);
      if (!code) continue;
      if (!grouped[code.buCostCodeId]) {
        grouped[code.buCostCodeId] = {
          buCostCodeId: code.buCostCodeId,
          buCostCd: code.buCostCd,
          buCostNameJa: code.buCostNameJa,
          items: {},
        };
      }
      const items = grouped[code.buCostCodeId].items;
      if (!items[item.buCostItemId]) items[item.buCostItemId] = { buCostItemId: item.buCostItemId, calculations: [] };
      items[item.buCostItemId].calculations.push(calc);
    }
    setCalculationsByCostCode(grouped);
  };

  const fetchCostItemsForBusinessUnit = async (businessunitId: string) => {
    const response = await api
      .get<GetCostItemsResponse>('calc-display/cost-items', {
        searchParams: { businessunitId },
      })
      .json();
    console.log('[calcRegister] fetchCostItemsForBusinessUnit response:', response);
    setBuCostCodes(response.buCostCodes as any);
    setBuCostItems(response.buCostItems as any);
    // 一覧表示用に buCostItemId → buCostCode 情報の逆引きを保持
    const map: Record<string, { buCostCd: string; buCostNameJa: string }> = {};
    for (const item of response.buCostItems) {
      const code = response.buCostCodes.find((c) => c.buCostCodeId === item.buCostCodeId);
      if (code) {
        map[item.buCostItemId] = { buCostCd: code.buCostCd, buCostNameJa: code.buCostNameJa };
      }
    }
    setBuItemIdToCodeMap(map as any);
  };

  // モックデータ
  const buildMockData = useCallback((businessunitId: string) => {
    console.log('[calcRegister] buildMockData for BU:', businessunitId);

    const mockCalcTypes = [
      { calcTypeId: 'ct-1', calcTypeNameJa: '計算種類1', defaultFlg: true, businessunitId },
      { calcTypeId: 'ct-2', calcTypeNameJa: '計算種類2', defaultFlg: false, businessunitId },
    ];

    const mockBuCostCodes: BuCostCodeMock[] = [
      { buCostCodeId: 'code-1', buCostCd: 'MAT', buCostNameJa: '材料費' },
      { buCostCodeId: 'code-2', buCostCd: 'LAB', buCostNameJa: '労務費' },
      { buCostCodeId: 'code-3', buCostCd: 'OPR', buCostNameJa: '製造経費' },
    ];

    const mockBuCostItems: BuCostItemMock[] = [
      { buCostItemId: 'item-1', buCostCodeId: 'code-1', costType: 'G' },
      { buCostItemId: 'item-2', buCostCodeId: 'code-1', costType: 'R' },
      { buCostItemId: 'item-3', buCostCodeId: 'code-2', costType: 'G' },
      { buCostItemId: 'item-4', buCostCodeId: 'code-3', costType: 'G' },
      { buCostItemId: 'item-5', buCostCodeId: 'code-3', costType: 'K' },
    ];

    const conditions: CalcCondition[] = [
      {
        calcConditionId: 'con-1',
        leftConBuCostCd: 'MAT',
        leftConCostType: 'G',
        conOperator: '>=',
        rightConBuCostCd: 'LAB',
        rightConCostType: 'G',
      },
    ];

    const ifOps: CalcOperation[] = [
      { calcOperationId: 'op-1', opeOperator: 'S', opeBuCostCd: 'MAT', opeCostType: 'G', opeSeq: 1 },
      { calcOperationId: 'op-2', opeOperator: '+', opeBuCostCd: 'LAB', opeCostType: 'G', opeSeq: 2 },
    ];
    const elseOps: CalcOperation[] = [
      { calcOperationId: 'op-3', opeOperator: 'S', opeBuCostCd: 'OPR', opeCostType: 'G', opeSeq: 1 },
    ];

    const formulas: CalcFormula[] = [
      {
        calcFormulaId: 'for-1',
        calcDisplayId: 'cdsp-1',
        calcConditionId: 'con-1',
        calcOperationId: 'op-1',
        elseCalcOperationId: 'op-3',
        nestCalcFormulaId: '',
        elseNestCalcFormulaId: '',
        evalSeq: 1,
      },
    ];

    const displays: CalcDisplay[] = [
      {
        calcDisplayId: 'cdsp-1',
        calcTypeId: 'ct-1',
        buCostItemId: 'item-1',
        calcDisplayCode: 'DSP001',
        calcDisplayNameJa: '材料費計算',
        calcDisplayNameEn: 'Material Calculation',
        calcDisplayNameZh: '材料费计算',
        createdBy: 'tester',
        createdOn: new Date(),
        modifiedBy: 'tester',
        modifiedOn: new Date(),
        businessunitId,
      },
    ];

    const calculations: Calculation[] = [
      {
        calcDisplay: displays[0],
        calcFormulas: formulas,
        calcConditions: conditions,
        calcOperations: [...ifOps, ...elseOps],
      },
    ];

    return { mockCalcTypes, mockBuCostCodes, mockBuCostItems, calculations };
  }, []);

  const initForBusinessUnit = useCallback(
    (businessunitId: string) => {
      console.log('[calcRegister] initForBusinessUnit called with:', businessunitId);
      setSelectedBusinessUnitId(businessunitId);
      const calculations: Calculation[] = [];
      const { mockCalcTypes /*, mockBuCostCodes, mockBuCostItems, calculations*/ } = buildMockData(businessunitId);
      setCalcTypes(mockCalcTypes);
      setSelectedCalcTypeId(mockCalcTypes[0]?.calcTypeId ?? '');
      // buCostCodes/items はAPIから取得
      fetchCostItemsForBusinessUnit(businessunitId);
      setCalculations(calculations);
    },
    [
      buildMockData,
      fetchCostItemsForBusinessUnit,
      setBuCostCodes,
      setBuCostItems,
      setCalcTypes,
      setCalculations,
      setSelectedBusinessUnitId,
      setSelectedCalcTypeId,
    ]
  );

  const updateSelectedCalcType = useCallback(
    (calcTypeId: string) => {
      console.log('[calcRegister] updateSelectedCalcType:', calcTypeId);
      setSelectedCalcTypeId(calcTypeId);
    },
    [setSelectedCalcTypeId]
  );

  const openEditor = useCallback(
    (calculation: Calculation) => {
      console.log('[calcRegister] openEditor for calcDisplayId:', calculation.calcDisplay.calcDisplayId);
      setEditorTargetDisplay(calculation.calcDisplay);
      setEditorConditions(calculation.calcConditions);
      setEditorOperations(calculation.calcOperations);
      setEditorFormulas(calculation.calcFormulas ?? []);
      // 既存ツリーがあれば読み込み、なければcalcから初期化
      const trees = store.get(editorTreesByDisplayAtom);
      const saved = trees[calculation.calcDisplay.calcDisplayId];
      if (saved && saved.length > 0) {
        setEditorBranches(saved);
        const root = saved.find((b) => b.id === 'root') ?? saved[0];
        setSelectedBranchId(root.id);
        setEditorCondition(root.condition);
        setEditorIfOperations(root.ifOps);
        setEditorElseOperations(root.elseOps);
      } else {
        const built = buildEditorBranchesFromCalculation(calculation);
        if (built.length === 0) {
          const root: EditorBranchNode = {
            id: 'root',
            label: '条件分岐1',
            condition: null,
            ifOps: [],
            elseOps: [],
          };
          setEditorBranches([root]);
          setSelectedBranchId('root');
          setEditorCondition(null);
          setEditorIfOperations([]);
          setEditorElseOperations([]);
        } else {
          setEditorBranches(built);
          const root = built.find((b) => b.id === 'root') ?? built[0];
          setSelectedBranchId(root?.id ?? null);
          setEditorCondition(root?.condition ?? null);
          setEditorIfOperations(root?.ifOps ?? []);
          setEditorElseOperations(root?.elseOps ?? []);
        }
      }
      setEditorOpen(true);
    },
    [
      setEditorConditions,
      setEditorFormulas,
      setEditorOpen,
      setEditorOperations,
      setEditorTargetDisplay,
      setEditorCondition,
      setEditorIfOperations,
      setEditorElseOperations,
      buildEditorBranchesFromCalculation,
    ]
  );

  const closeEditor = useCallback(() => {
    console.log('[calcRegister] closeEditor');
    setEditorOpen(false);
  }, [setEditorOpen]);

  const addOperation = useCallback(
    (operator: 'S' | '+' | '-' | '*' | '/' | '(' | ')', buCostCd: string, costType: 'G' | 'R' | 'K') => {
      setEditorOperations((prev) => {
        const seq = (prev?.length ?? 0) + 1;
        const newOp: CalcOperation = {
          calcOperationId: generateOperationId(),
          opeOperator: operator,
          opeBuCostCd: buCostCd,
          opeCostType: costType,
          opeSeq: seq,
        };
        console.log('[calcRegister] addOperation:', newOp);
        return [...prev, newOp];
      });
    },
    [setEditorOperations]
  );

  const removeOperation = useCallback(
    (calcOperationId: string) => {
      console.log('[calcRegister] removeOperation:', calcOperationId);
      setEditorOperations((prev) => prev.filter((o) => o.calcOperationId !== calcOperationId));
    },
    [setEditorOperations]
  );

  const updateOperation = useCallback(
    (calcOperationId: string, partial: Partial<Pick<CalcOperation, 'opeBuCostCd' | 'opeCostType' | 'opeOperator'>>) => {
      console.log('[calcRegister] updateOperation:', calcOperationId, partial);
      setEditorOperations((prev) =>
        prev.map((o) => (o.calcOperationId === calcOperationId ? { ...o, ...partial } : o))
      );
    },
    [setEditorOperations]
  );

  const setCondition = useCallback(
    (partial: Partial<CalcCondition> | null) => {
      if (partial === null) {
        setEditorConditions([]);
        setEditorCondition(null);
        return;
      }
      setEditorConditions((prev) => {
        const base =
          prev[0] ??
          ({
            calcConditionId: generateConditionId(),
            leftConBuCostCd: '',
            leftConCostType: 'G',
            conOperator: '>=',
            rightConBuCostCd: '',
            rightConCostType: 'G',
          } satisfies CalcCondition);
        const updated = [{ ...base, ...partial }];
        console.log('[calcRegister] setCondition:', updated[0]);
        return updated;
      });
      setEditorCondition((prev) => {
        const next: CalcCondition = {
          calcConditionId: prev?.calcConditionId ?? generateConditionId(),
          leftConBuCostCd: partial.leftConBuCostCd ?? prev?.leftConBuCostCd ?? '',
          leftConCostType: partial.leftConCostType ?? prev?.leftConCostType ?? 'G',
          conOperator: partial.conOperator ?? prev?.conOperator ?? '>=',
          rightConBuCostCd: partial.rightConBuCostCd ?? prev?.rightConBuCostCd ?? '',
          rightConCostType: partial.rightConCostType ?? prev?.rightConCostType ?? 'G',
        };
        console.log('[calcRegister] setCondition(single):', next);
        return next;
      });
    },
    [setEditorConditions, setEditorCondition]
  );

  const addNestedFormula = useCallback(() => {
    setEditorFormulas((prev) => {
      const target = prev[0];
      if (!target) return prev;
      const nested: CalcFormula = {
        calcFormulaId: generateFormulaId(),
        calcDisplayId: target.calcDisplayId,
        calcConditionId: target.calcConditionId,
        calcOperationId: target.calcOperationId,
        elseCalcOperationId: target.elseCalcOperationId,
        nestCalcFormulaId: '',
        elseNestCalcFormulaId: '',
        evalSeq: (target.evalSeq ?? 0) + 1,
      };
      console.log('[calcRegister] addNestedFormula:', nested);
      return [...prev, nested];
    });
  }, [setEditorFormulas]);

  const setFormulaLinks = useCallback(
    (partial: Partial<Pick<CalcFormula, 'calcConditionId' | 'calcOperationId' | 'elseCalcOperationId'>>) => {
      setEditorFormulas((prev) => {
        if (prev.length === 0) return prev;
        const updated = [{ ...prev[0], ...partial }, ...prev.slice(1)];
        console.log('[calcRegister] setFormulaLinks:', updated[0]);
        return updated;
      });
    },
    [setEditorFormulas]
  );

  const applyEditToList = useCallback(() => {
    console.log('[calcRegister] applyEditToList (tree→flat)');
    const display = store.get(editorTargetDisplayAtom);
    const branches = store.get(editorBranchesAtom);
    if (!display || branches.length === 0) {
      setEditorOpen(false);
      return;
    }

    // 1) ツリー構築（flat → childrenIf/childrenElse）
    type TreeNode = EditorBranchNode & { childrenIf: TreeNode[]; childrenElse: TreeNode[] };
    const byId = new Map<string, TreeNode>();
    branches.forEach((b) => byId.set(b.id, { ...b, childrenIf: [], childrenElse: [] }));
    let root: TreeNode | null = null;
    byId.forEach((node) => {
      if (node.parentId) {
        const parent = byId.get(node.parentId);
        if (parent) {
          if (node.side === 'IF') parent.childrenIf.push(node);
          else parent.childrenElse.push(node);
        }
      } else if (!root) {
        root = node;
      }
    });
    if (!root) root = byId.get('root') ?? null;
    if (!root) {
      setEditorOpen(false);
      return;
    }

    // 2) 収集用配列
    const conditions: CalcCondition[] = [];
    const operations: CalcOperation[] = [];
    const formulas: CalcFormula[] = [];

    // ノードID→フォーミュラID
    const nodeIdToFormulaId = new Map<string, string>();
    // evalSeqはサーバ側採番に変更

    // 3) 先に各ノードのフォーミュラIDを割り当て
    const assignFormulaIds = (n: TreeNode) => {
      const fId = `for-${n.id}`;
      nodeIdToFormulaId.set(n.id, fId);
      n.childrenIf.forEach(assignFormulaIds);
      n.childrenElse.forEach(assignFormulaIds);
    };
    assignFormulaIds(root);

    // 4) DFSでflatten
    const walk = (n: TreeNode) => {
      // 条件
      if (n.condition) {
        conditions.push(n.condition);
      }
      // IF/ELSE 演算（グループIDを統一し、opeSeqは配列順で再採番）
      const ifGroupId = n.ifOperationGroupId || generateOperationGroupId(n.id, 'IF');
      const elseGroupId = n.elseOperationGroupId || generateOperationGroupId(n.id, 'ELSE');
      const ifOpsSeq = n.ifOps.map((o, idx) => ({ ...o, calcOperationId: ifGroupId, opeSeq: idx + 1 }));
      const elseOpsSeq = n.elseOps.map((o, idx) => ({ ...o, calcOperationId: elseGroupId, opeSeq: idx + 1 }));
      operations.push(...ifOpsSeq, ...elseOpsSeq);

      const formulaId = nodeIdToFormulaId.get(n.id) ?? `for-${n.id}`;
      const nestId = n.childrenIf[0] ? (nodeIdToFormulaId.get(n.childrenIf[0].id) ?? '') : '';
      const elseNestId = n.childrenElse[0] ? (nodeIdToFormulaId.get(n.childrenElse[0].id) ?? '') : '';
      const f: CalcFormula = {
        calcFormulaId: formulaId,
        calcDisplayId: display.calcDisplayId,
        calcConditionId: n.condition?.calcConditionId ?? '',
        calcOperationId: ifGroupId || '',
        elseCalcOperationId: elseGroupId || '',
        nestCalcFormulaId: nestId,
        elseNestCalcFormulaId: elseNestId,
        // evalSeqはサーバ側で一元採番する
        evalSeq: 0,
      };
      formulas.push(f);

      n.childrenIf.forEach(walk);
      n.childrenElse.forEach(walk);
    };
    walk(root);

    // 5) 計算式リストへ適用（対象displayのみ）
    setCalculations((prev) =>
      prev.map((c) =>
        c.calcDisplay.calcDisplayId === display.calcDisplayId
          ? {
              ...c,
              calcConditions: conditions,
              calcOperations: operations,
              calcFormulas: formulas,
            }
          : c
      )
    );
    // 6) ツリーをdisplay単位で保存（再編集時に復元）
    setEditorTreesByDisplay((prev) => ({ ...prev, [display.calcDisplayId]: branches }));
    console.log('[calcRegister] tree->flat applied', { conditions, operations, formulas });
    setEditorOpen(false);
  }, [setCalculations, setEditorOpen, store]);

  const saveCalculation = useCallback(async () => {
    console.log('[calcRegister] saveCalculation');
    const display = store.get(editorTargetDisplayAtom);
    const branches = store.get(editorBranchesAtom);
    if (!display || branches.length === 0) {
      setEditorOpen(false);
      return;
    }
    // GUID 正規化ユーティリティ
    const isGuid = (v: string | undefined | null): boolean =>
      !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
    const ensureGuid = (map: Map<string, string>, key: string): string => {
      if (!key) return '';
      if (isGuid(key)) return key;
      const hit = map.get(key);
      if (hit) return hit;
      const gen = crypto.randomUUID();
      map.set(key, gen);
      return gen;
    };

    type TreeNode = EditorBranchNode & { childrenIf: TreeNode[]; childrenElse: TreeNode[] };
    const byId = new Map<string, TreeNode>();
    branches.forEach((b) => byId.set(b.id, { ...b, childrenIf: [], childrenElse: [] }));
    let root: TreeNode | null = null;
    byId.forEach((node) => {
      if (node.parentId) {
        const parent = byId.get(node.parentId);
        if (parent) {
          if (node.side === 'IF') parent.childrenIf.push(node);
          else parent.childrenElse.push(node);
        }
      } else if (!root) {
        root = node;
      }
    });
    if (!root) root = byId.get('root') ?? null;
    if (!root) return;
    const conditions: CalcCondition[] = [];
    const operations: CalcOperation[] = [];
    const formulas: CalcFormula[] = [];
    const nodeIdToFormulaId = new Map<string, string>();
    const opGroupIdMap = new Map<string, string>();
    const condIdMap = new Map<string, string>();
    const formulaIdMap = new Map<string, string>();
    // evalSeqはサーバ側採番に変更
    const assignFormulaIds = (n: TreeNode) => {
      const rawId = `for-${n.id}`;
      const fId = ensureGuid(formulaIdMap, rawId);
      nodeIdToFormulaId.set(n.id, fId);
      n.childrenIf.forEach(assignFormulaIds);
      n.childrenElse.forEach(assignFormulaIds);
    };
    assignFormulaIds(root);
    const walk = (n: TreeNode) => {
      // 条件のGUID化
      if (n.condition) {
        const cidRaw = n.condition.calcConditionId || `con-${n.id}`;
        const cid = ensureGuid(condIdMap, cidRaw);
        conditions.push({ ...n.condition, calcConditionId: cid });
      }
      // 演算グループIDのGUID化
      const ifGroupRaw = n.ifOperationGroupId || n.ifOps[0]?.calcOperationId || generateOperationGroupId(n.id, 'IF');
      const elseGroupRaw = n.elseOperationGroupId || n.elseOps[0]?.calcOperationId || generateOperationGroupId(n.id, 'ELSE');
      const ifGroupId = ensureGuid(opGroupIdMap, ifGroupRaw);
      const elseGroupId = n.elseOps.length > 0 ? ensureGuid(opGroupIdMap, elseGroupRaw) : '';
      const ifOpsSeq = n.ifOps.map((o, idx) => ({
        ...o,
        calcOperationId: ifGroupId,
        opeSeq: idx + 1,
      }));
      const elseOpsSeq = n.elseOps.map((o, idx) => ({
        ...o,
        calcOperationId: elseGroupId,
        opeSeq: idx + 1,
      }));
      operations.push(...ifOpsSeq, ...elseOpsSeq);
      // フォーミュラIDとネストのGUID化
      const formulaId = nodeIdToFormulaId.get(n.id) as string;
      const nestId = n.childrenIf[0] ? (nodeIdToFormulaId.get(n.childrenIf[0].id) as string) : '';
      const elseNestId = n.childrenElse[0] ? (nodeIdToFormulaId.get(n.childrenElse[0].id) as string) : '';
      const f: CalcFormula = {
        calcFormulaId: formulaId,
        calcDisplayId: display.calcDisplayId,
        calcConditionId: n.condition ? ensureGuid(condIdMap, n.condition.calcConditionId || `con-${n.id}`) : '',
        calcOperationId: ifGroupId,
        elseCalcOperationId: elseGroupId || '',
        nestCalcFormulaId: nestId || '',
        elseNestCalcFormulaId: elseNestId || '',
        // evalSeqはサーバ側で一元採番する
        evalSeq: 0,
      };
      formulas.push(f);
      n.childrenIf.forEach(walk);
      n.childrenElse.forEach(walk);
    };
    walk(root);
    const payload: UpdateCalcDatasDto = {
      calcDisplayId: display.calcDisplayId,
      calcTypeId: store.get(selectedCalcTypeIdAtom) || display.calcTypeId,
      buCostItemId: display.buCostItemId,
      calcFormulas: formulas,
      calcConditions: conditions,
      calcOperations: operations,
    };
    try {
      await api.post('calc-display', { json: payload }).json();
    } catch (e) {
      console.error('[calcRegister] saveCalculation error', e);
    }
    setCalculations((prev) =>
      prev.map((c) =>
        c.calcDisplay.calcDisplayId === display.calcDisplayId
          ? { ...c, calcConditions: conditions, calcOperations: operations, calcFormulas: formulas }
          : c
      )
    );
    setEditorTreesByDisplay((prev) => ({ ...prev, [display.calcDisplayId]: branches }));
    setEditorOpen(false);
  }, [setCalculations, setEditorOpen, setEditorTreesByDisplay, store]);

  const resetEdit = useCallback(() => {
    console.log('[calcRegister] resetEdit');
    setEditorOpen(false);
    setEditorTargetDisplay(null);
    setEditorConditions([]);
    setEditorOperations([]);
    setEditorFormulas([]);
    setEditorCondition(null);
    setEditorIfOperations([]);
    setEditorElseOperations([]);
    setEditorBranches([]);
    setSelectedBranchId(null);
  }, [
    setEditorConditions,
    setEditorFormulas,
    setEditorOpen,
    setEditorOperations,
    setEditorTargetDisplay,
    setEditorCondition,
    setEditorIfOperations,
    setEditorElseOperations,
    setEditorBranches,
    setSelectedBranchId,
  ]);

  return {
    fetchBusinessCostForCalculation,
    fetchCostItemsForBusinessUnit,
    // selections
    initForBusinessUnit,
    updateSelectedCalcType,
    // editor
    openEditor,
    closeEditor,
    addOperation,
    removeOperation,
    updateOperation,
    setCondition,
    // IF操作
    addIfOperation: (operator: 'S' | '+' | '-' | '*' | '/' | '(' | ')', buCostCd: string, costType: 'G' | 'R' | 'K') =>
      setEditorIfOperations((prev) => [
        ...prev,
        {
          calcOperationId: generateOperationId(),
          opeOperator: operator,
          opeBuCostCd: buCostCd,
          opeCostType: costType,
          opeSeq: prev.length + 1,
        },
      ]),
    updateIfOperation: (
      calcOperationId: string,
      partial: Partial<Pick<CalcOperation, 'opeOperator' | 'opeBuCostCd' | 'opeCostType'>>
    ) =>
      setEditorIfOperations((prev) =>
        prev.map((o) => (o.calcOperationId === calcOperationId ? { ...o, ...partial } : o))
      ),
    removeIfOperation: (calcOperationId: string) =>
      setEditorIfOperations((prev) => prev.filter((o) => o.calcOperationId !== calcOperationId)),
    // ELSE操作
    addElseOperation: (operator: 'S' | '+' | '-' | '*' | '/' | '(' | ')', buCostCd: string, costType: 'G' | 'R' | 'K') =>
      setEditorElseOperations((prev) => [
        ...prev,
        {
          calcOperationId: generateOperationId(),
          opeOperator: operator,
          opeBuCostCd: buCostCd,
          opeCostType: costType,
          opeSeq: prev.length + 1,
        },
      ]),
    updateElseOperation: (
      calcOperationId: string,
      partial: Partial<Pick<CalcOperation, 'opeOperator' | 'opeBuCostCd' | 'opeCostType'>>
    ) =>
      setEditorElseOperations((prev) =>
        prev.map((o) => (o.calcOperationId === calcOperationId ? { ...o, ...partial } : o))
      ),
    removeElseOperation: (calcOperationId: string) =>
      setEditorElseOperations((prev) => prev.filter((o) => o.calcOperationId !== calcOperationId)),
    // ブランチ（左カラム）
    initBranchesFromCurrent: () => {
      const cond = store.get(editorConditionAtom);
      const ifOps = store.get(editorIfOperationsAtom);
      const elseOps = store.get(editorElseOperationsAtom);
      const root: EditorBranchNode = {
        id: 'root',
        label: '条件分岐1',
        condition: cond,
        ifOps: ifOps ?? [],
        elseOps: elseOps ?? [],
      };
      setEditorBranches([root]);
      setSelectedBranchId('root');
      console.log('[calcRegister] initBranchesFromCurrent');
    },
    addBranch: () =>
      setEditorBranches((prev) => {
        const id = generateBranchId();
        const node: EditorBranchNode = {
          id,
          label: `条件分岐${prev.length + 1}`,
          condition: null,
          ifOps: [],
          elseOps: [],
        };
        setSelectedBranchId(id);
        // 右編集領域を空で開始
        setEditorCondition(null);
        setEditorIfOperations([]);
        setEditorElseOperations([]);
        console.log('[calcRegister] addBranch:', id);
        return [...prev, node];
      }),
    addChildBranch: (parentId: string, side: 'IF' | 'ELSE') =>
      setEditorBranches((prev) => {
        const id = generateBranchId();
        const node: EditorBranchNode = {
          id,
          label: `条件分岐${prev.length + 1}`,
          condition: null,
          ifOps: [],
          elseOps: [],
          parentId,
          side,
        };
        setSelectedBranchId(id);
        setEditorCondition(null);
        setEditorIfOperations([]);
        setEditorElseOperations([]);
        console.log('[calcRegister] addChildBranch:', parentId, side, id);
        return [...prev, node];
      }),
    selectBranch: (branchId: string) => {
      setSelectedBranchId(branchId);
      setEditorBranches((prev) => {
        const found = prev.find((b) => b.id === branchId);
        if (found) {
          setEditorCondition(found.condition);
          setEditorIfOperations(found.ifOps);
          setEditorElseOperations(found.elseOps);
          console.log('[calcRegister] selectBranch:', branchId);
        }
        return prev;
      });
    },
    persistSelectedBranchFromEditor: () => {
      const branchId = store.get(selectedBranchIdAtom);
      if (!branchId) return;
      const cond = store.get(editorConditionAtom);
      const ifOps = store.get(editorIfOperationsAtom);
      const elseOps = store.get(editorElseOperationsAtom);
      // グループIDは既存値を維持し、未設定なら先頭のcalcOperationIdまたは新規採番
      setEditorBranches((prev) =>
        prev.map((b) => {
          if (b.id !== branchId) return b;
          const nextIfGroupId = b.ifOperationGroupId || ifOps?.[0]?.calcOperationId || generateOperationGroupId(b.id, 'IF');
          const nextElseGroupId = b.elseOperationGroupId || elseOps?.[0]?.calcOperationId || generateOperationGroupId(b.id, 'ELSE');
          const nextIf = (ifOps ?? []).map((o, idx) => ({ ...o, calcOperationId: nextIfGroupId, opeSeq: idx + 1 }));
          const nextElse = (elseOps ?? []).map((o, idx) => ({
            ...o,
            calcOperationId: nextElseGroupId,
            opeSeq: idx + 1,
          }));
          return {
            ...b,
            condition: cond ?? null,
            ifOps: nextIf,
            elseOps: nextElse,
            ifOperationGroupId: nextIfGroupId,
            elseOperationGroupId: nextElseGroupId,
          };
        })
      );
      console.log('[calcRegister] persistSelectedBranchFromEditor:', branchId);
    },
    deleteBranch: (branchId: string) => {
      const branches = store.get(editorBranchesAtom);
      const selectedId = store.get(selectedBranchIdAtom);
      const toDelete = new Set<string>();
      const collect = (id: string) => {
        toDelete.add(id);
        branches.filter((b) => b.parentId === id).forEach((child) => collect(child.id));
      };
      collect(branchId);
      const target = branches.find((b) => b.id === branchId);
      const parentId = target?.parentId ?? null;
      const nextBranches = branches.filter((b) => !toDelete.has(b.id));
      setEditorBranches(nextBranches);
      let nextSelectedId = selectedId;
      if (!nextBranches.find((b) => b.id === nextSelectedId)) {
        nextSelectedId = parentId ?? nextBranches.find((b) => b.id === 'root')?.id ?? nextBranches[0]?.id ?? null;
      }
      setSelectedBranchId(nextSelectedId ?? null);
      const sel = nextSelectedId ? nextBranches.find((b) => b.id === nextSelectedId) : undefined;
      setEditorCondition(sel?.condition ?? null);
      setEditorIfOperations(sel?.ifOps ?? []);
      setEditorElseOperations(sel?.elseOps ?? []);
      console.log('[calcRegister] deleteBranch:', branchId, { deleted: Array.from(toDelete), nextSelectedId });
    },
    addNestedFormula,
    setFormulaLinks,
    applyEditToList,
    saveCalculation,
    resetEdit,
  };
};
