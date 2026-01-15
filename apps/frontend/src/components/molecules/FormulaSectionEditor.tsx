import type { CalcCondition } from '@pxa-re-management/shared';
import ConditionEditor from '@/components/molecules/ConditionEditor';
import OperationEditor from '@/components/molecules/OperationEditor';
import { Button } from '@/components/ui/button';
import { useCalcRegisterActions, useCalcRegisterSelectors } from '@/store/calcRegister';

type Props = {
  condition?: CalcCondition;
  onChangeCondition: (partial: Partial<CalcCondition> | null) => void;
  // 選択肢
  buCostCodes: Array<{ buCostCodeId: string; buCostCd: string; buCostNameJa: string }>;
  buCostItems: Array<{ buCostItemId: string; buCostCodeId: string; costType: 'G' | 'R' | 'K' }>;
  // 子分岐があるかどうか
  hasElseChildren?: boolean;
  hasIfChildren?: boolean;
};

const FormulaSectionEditor = ({ condition, onChangeCondition, buCostCodes, buCostItems, hasElseChildren = false, hasIfChildren = false }: Props) => {
  const { editorIfOperations, editorElseOperations } = useCalcRegisterSelectors();
  const {
    addIfOperation,
    updateIfOperation,
    removeIfOperation,
    addElseOperation,
    updateElseOperation,
    removeElseOperation,
    persistSelectedBranchFromEditor,
  } = useCalcRegisterActions();

  return (
    <div className="space-y-2">
      <div className="font-medium">条件</div>

      {/* 条件式 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <ConditionEditor
            buCostCodes={buCostCodes}
            buCostItems={buCostItems}
            condition={condition}
            onChange={(p) => {
              onChangeCondition(p);
              persistSelectedBranchFromEditor();
            }}
          />
        </div>
        {condition && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onChangeCondition(null);
              persistSelectedBranchFromEditor();
            }}
          >
            削除
          </Button>
        )}
      </div>

      {/* IF 演算配列 */}
      {!hasIfChildren && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-600">IF 演算</div>
          </div>
          <div className="space-y-2">
            {editorIfOperations.map((o, index) => (
              <div key={o.calcOperationId} className="flex justify-between">
                <OperationEditor
                  key={o.calcOperationId}
                  label="IF 要素"
                  buCostCodes={buCostCodes}
                  buCostItems={buCostItems}
                  value={o}
                  opeSeq={index + 1}
                  onChange={(p) => {
                    updateIfOperation(o.calcOperationId, p);
                    persistSelectedBranchFromEditor();
                  }}
                />
                <div key={o.calcOperationId + '-actions'} className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removeIfOperation(o.calcOperationId);
                      persistSelectedBranchFromEditor();
                    }}
                  >
                    削除
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const isFirst = editorIfOperations.length === 0;
                const defaultOperator = isFirst ? 'S' : '+';
                addIfOperation(defaultOperator, buCostCodes[0]?.buCostCd ?? '', 'G');
                persistSelectedBranchFromEditor();
              }}
            >
              + 式を追加
            </Button>
          </div>
        </div>
      )}

      {/* ELSE 演算配列 */}
      {!hasElseChildren && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-600">ELSE 演算</div>
          </div>
          <div className="space-y-2">
            {editorElseOperations.map((o) => (
              <div key={o.calcOperationId} className="flex justify-between">
                <OperationEditor
                  key={o.calcOperationId}
                  label="ELSE 要素"
                  buCostCodes={buCostCodes}
                  buCostItems={buCostItems}
                  value={o}
                  onChange={(p) => {
                    updateElseOperation(o.calcOperationId, p);
                    persistSelectedBranchFromEditor();
                  }}
                />
                <div key={o.calcOperationId + '-actions'} className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      removeElseOperation(o.calcOperationId);
                      persistSelectedBranchFromEditor();
                    }}
                  >
                    削除
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              disabled={!condition}
              onClick={() => {
                if (!condition) return;
                const isFirst = editorElseOperations.length === 0;
                const defaultOperator = isFirst ? 'S' : '+';
                addElseOperation(defaultOperator, buCostCodes[0]?.buCostCd ?? '', 'G');
                persistSelectedBranchFromEditor();
              }}
            >
              + 式を追加
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaSectionEditor;
