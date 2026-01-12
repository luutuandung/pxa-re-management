import {
  BuCostItem,
  BuCostItemWithCalcDisplay,
  BusinessCostWithCalcDisplay,
  CalcCondition,
  CalcFormula,
  CalcOperation,
  UpdateCalcDatasDto
} from '@pxa-re-management/shared';
import { PrismaService } from '../prisma/prisma.service';
import { GetCostItemsResponse } from './dto/get-cost-items.dto';
import { BusinessException, NotFoundException } from "../common";
import * as Prisma from '@prisma/client';
import { Injectable } from '@nestjs/common';
import CalcDisplayCodeBuilder from "./utils/CalcDisplayCodeBuilder";
import CalcFormulasEvaluationSequencesAssigner from "./utils/CalcFormulasEvaluationSequencesAssigner";


@Injectable()
export class CalcDisplayService {

  public constructor(private readonly prisma: PrismaService) {}

  public async getBusinessUnitCostCodesSelection(
    {
      businessUnitID,
      calcTypeID,
      currencyCode = 'JPY'
    }: Readonly<{
      businessUnitID: string;
      calcTypeID: string;
      currencyCode?: string;
    }>,
    prismaClient?: Pick<Prisma.PrismaClient, "buCostCode">
  ): Promise<Array<BusinessCostWithCalcDisplay>> {

    const businessCostCodes = await (prismaClient ?? this.prisma).buCostCode.findMany({
      where: {
        businessunitId: businessUnitID,
        deleteFlg: false,
        buCostItems: {
          some: {
            calcValidFlg: true,
          },
        },
      },
      include: {
        buCostItems: {
          include: {
            calcDisplays: {
              include: {
                calcFormulas: true,
              },
              where: {
                calcTypeId: calcTypeID,
              },
            },
          },
        },
      },
    });

    return businessCostCodes.map((businessUnitCode) => {

      const targetBusinessCostItem =
          businessUnitCode.buCostItems.length > 1 ?
              businessUnitCode.buCostItems.find((item) => item.curCd === currencyCode) :
              businessUnitCode.buCostItems[0];

      if (!targetBusinessCostItem) {
        throw new BusinessException(
          "原価コードの標本の中に原価項目が一個以上存在するか、通貨が合っているものが存在と期待されたが、どちらでもの条件が満たされていない。"
        )
      }


      const buCostItem =
          targetBusinessCostItem.calcDisplays.length > 0 ?
              ({
                ...(targetBusinessCostItem as BuCostItem),
                calcDisplay: targetBusinessCostItem.calcDisplays[0],
              } as BuCostItemWithCalcDisplay) :
              ({ ...(targetBusinessCostItem as BuCostItem) });

      return { ...businessUnitCode, buCostItem };

    });

  }

  /**
   * @description ConditionとOperationを取得
   * @param conditionIds 条件式ID
   * @param operationIds 演算式ID
   */
  async getConditionsAndOperations(
    conditionIds: string[],
    operationIds: string[]
  ): Promise<{
    conditions: CalcCondition[];
    operations: CalcOperation[];
  }> {
    const conditions = await this.prisma.calcCondition.findMany({
      where: { calcConditionId: { in: conditionIds } },
    });
    const operations = await this.prisma.calcOperation.findMany({
      where: { calcOperationId: { in: operationIds } },
    });
    return { conditions, operations };
  }


  /** @description 保存入口: calcDisplayId が無ければ (calcTypeId, buCostItemId) で表示を検索/作成してから完全置換 */
  public async updateCalcDatas(updateCalcDatasDto: UpdateCalcDatasDto, userId: string | null = null): Promise<void> {

    /* 【 意図 】 渡されたcalcDisplayIDに該当している項目がDBに存在しない場合は、(calcTypeId, buCostItemId) で検索し、なければ新規作成 */
    let calcDisplayId: string = updateCalcDatasDto.calcDisplayId;

    const existingCalcDisplay = await this.prisma.calcDisplay.findUnique({ where: { calcDisplayId } });
    let businessUnitCostCodesSelection: ReadonlyArray<BusinessCostWithCalcDisplay> = [];

    if (existingCalcDisplay === null) {

      if (!updateCalcDatasDto.calcTypeId || !updateCalcDatasDto.buCostItemId) {
        throw new Error('指定されたcalcDisplayIdが不存在。新規作成には (calcTypeId, buCostItemId) が必要。');
      }


      const existingCalcDisplayWithSameCalcTypeAndBusinessUnitCostItemIDs = await this.prisma.calcDisplay.findFirst({
        where: { calcTypeId: updateCalcDatasDto.calcTypeId, buCostItemId: updateCalcDatasDto.buCostItemId }
      });

      if (existingCalcDisplayWithSameCalcTypeAndBusinessUnitCostItemIDs) {

        calcDisplayId = existingCalcDisplayWithSameCalcTypeAndBusinessUnitCostItemIDs.calcDisplayId;

      } else {

        const { businessunitId: businessUnitID } = await this.prisma.buCostItem.findUniqueOrThrow({
          where: { buCostItemId: updateCalcDatasDto.buCostItemId },
          select: { businessunitId: true },
        });

        businessUnitCostCodesSelection = await this.getBusinessUnitCostCodesSelection({
          businessUnitID,
          calcTypeID: updateCalcDatasDto.calcTypeId
        });

        const newCalcDisplay = await this.prisma.calcDisplay.create({
          data: {
            calcTypeId: updateCalcDatasDto.calcTypeId,
            buCostItemId: updateCalcDatasDto.buCostItemId,
            calcDisplayCode: CalcDisplayCodeBuilder.build({
              formulas: updateCalcDatasDto.calcFormulas,
              conditions: updateCalcDatasDto.calcConditions,
              operations: updateCalcDatasDto.calcOperations,
              businessUnitsCostsCodes: businessUnitCostCodesSelection
            }),
            calcDisplayNameJa: '',
            calcDisplayNameEn: '',
            calcDisplayNameZh: '',
            createdBy: userId ?? '00000000-0000-0000-0000-000000000000',
            modifiedBy: userId ?? '00000000-0000-0000-0000-000000000000',
            businessunitId: businessUnitID
          },
        });

        calcDisplayId = newCalcDisplay.calcDisplayId;

      }

    }

    const targetCalcDisplayData = await this.prisma.calcDisplay.findUnique({
      where: { calcDisplayId },
      select: { businessunitId: true, calcTypeId: true }
    });

    if (!targetCalcDisplayData) {
      throw new NotFoundException('calcDisplay', calcDisplayId);
    }

    if (businessUnitCostCodesSelection.length === 0) {
      businessUnitCostCodesSelection = await this.getBusinessUnitCostCodesSelection({
        businessUnitID: targetCalcDisplayData.businessunitId,
        calcTypeID: targetCalcDisplayData.calcTypeId
      });
    }

    const calcDisplayCode = CalcDisplayCodeBuilder.build({
      formulas: updateCalcDatasDto.calcFormulas,
      conditions: updateCalcDatasDto.calcConditions,
      operations: updateCalcDatasDto.calcOperations,
      businessUnitsCostsCodes: businessUnitCostCodesSelection
    });

    try {
      await this.prisma.$transaction(async (prismaClient) => {
        const { _max: { evalSeq: evaluationSequence } } = await prismaClient.calcFormula.aggregate({
          _max: { evalSeq: true },
          where: {
            calcDisplay: {
              businessunitId: targetCalcDisplayData.businessunitId,
              calcTypeId: targetCalcDisplayData.calcTypeId
            }
          }
        });

        // ツリー復元用に参照集合を構築
        const formulasByIDs: Map<string, CalcFormula> = new Map();
        const referenced = new Set<string>();

        for (const formula of updateCalcDatasDto.calcFormulas) {

          formulasByIDs.set(formula.calcFormulaId, formula);

          if (formula.nestCalcFormulaId) {
            referenced.add(formula.nestCalcFormulaId);
          }

          if (formula.elseNestCalcFormulaId) {
            referenced.add(formula.elseNestCalcFormulaId);
          }

        }

        const roots: Array<CalcFormula> = updateCalcDatasDto.calcFormulas.
            filter((formula: CalcFormula): boolean => !referenced.has(formula.calcFormulaId));

        const orderedFormulas: Array<CalcFormula> = [];

        const visit = (id: string): void => {

          const f = formulasByIDs.get(id);

          if (!f) return;

          if (f.nestCalcFormulaId) visit(f.nestCalcFormulaId);
          if (f.elseNestCalcFormulaId) visit(f.elseNestCalcFormulaId);

          orderedFormulas.push({ ...f, evalSeq: (evaluationSequence ?? 0) + 1 });

        };

        for (const r of roots) visit(r.calcFormulaId);

        const formulas = await prismaClient.calcFormula.findMany({
          where: { calcDisplayId },
          include: { calcCondition: true },
        });

        const conditionIds = formulas.map((f: any) => f.calcConditionId).filter((id: string) => !!id);

        const operationIds = [
          ...formulas.map((f: any) => f.calcOperationId),
          ...formulas.map((f: any) => f.elseCalcOperationId),
        ].filter((id: string) => !!id);

        await prismaClient.calcFormula.deleteMany({ where: { calcDisplayId } });

        if (conditionIds.length > 0) {
          await prismaClient.calcCondition.deleteMany({ where: { calcConditionId: { in: conditionIds } } });
        }

        if (operationIds.length > 0) {
          await prismaClient.calcOperation.deleteMany({ where: { calcOperationId: { in: operationIds } } });
        }

        if (updateCalcDatasDto.calcOperations.length > 0) {
          await prismaClient.calcOperation.createMany({
            data: updateCalcDatasDto.calcOperations.map((o) => ({
              calcOperationId: o.calcOperationId,
              opeOperator: o.opeOperator,
              opeBuCostCd: o.opeBuCostCd,
              opeCostType: o.opeCostType,
              opeSeq: o.opeSeq,
            })),
          });
        }

        if (updateCalcDatasDto.calcConditions.length > 0) {
          await prismaClient.calcCondition.createMany({
            data: updateCalcDatasDto.calcConditions.map((c) => ({
              calcConditionId: c.calcConditionId,
              leftConBuCostCd: c.leftConBuCostCd,
              leftConCostType: c.leftConCostType,
              conOperator: c.conOperator,
              rightConBuCostCd: c.rightConBuCostCd,
              rightConCostType: c.rightConCostType,
            })),
          });
        }

        if (orderedFormulas.length > 0) {
          await prismaClient.calcFormula.createMany({
            data: orderedFormulas.map((f) => ({

              calcFormulaId: f.calcFormulaId,
              calcDisplayId,
              calcConditionId: f.calcConditionId && f.calcConditionId !== '' ? f.calcConditionId : null,
              calcOperationId: f.calcOperationId,
              elseCalcOperationId: f.elseCalcOperationId && f.elseCalcOperationId !== '' ? f.elseCalcOperationId : null,
              nestCalcFormulaId: f.nestCalcFormulaId && f.nestCalcFormulaId !== '' ? f.nestCalcFormulaId : null,
              elseNestCalcFormulaId:
                f.elseNestCalcFormulaId && f.elseNestCalcFormulaId !== '' ? f.elseNestCalcFormulaId : null,

              /* 【 方法論 】 算出の順番を別当に設定 */
              evalSeq: 0

            })),
          });
        }

        if (existingCalcDisplay !== null) {
          await prismaClient.calcDisplay.update({
            where: { calcDisplayId },
            data: {
              calcDisplayCode,
              modifiedBy: userId ?? '00000000-0000-0000-0000-000000000000',
              modifiedOn: new Date()
            }
          });
        }

      }, { timeout: 10000 });
    } catch (error) {
      throw error;
    }

    // フロントエンドのタイムアウトを避けるため、非同期で再割り当てを実行
    this.reassignCalcFormulasEvaluationSequences(businessUnitCostCodesSelection).catch((error) => {
      console.error('Failed to reassign evaluation sequences:', error);
    });
  }

  async getCostItems(businessunitId: string, curCode: string = 'JPY'): Promise<GetCostItemsResponse> {
    const codes = await this.prisma.buCostCode.findMany({
      where: { 
        businessunitId,
        deleteFlg: false,
      },
      select: { buCostCodeId: true, buCostCd: true, buCostNameJa: true },
    });
    const items = await this.prisma.buCostItem.findMany({
      where: { 
        businessunitId,
        buCostCode: {
          deleteFlg: false,
        },
      },
      select: {
        buCostItemId: true,
        buCostCodeId: true,
        amountValidFlg: true,
        rateValidFlg: true,
        calcValidFlg: true,
        curCd: true,
      },
    });
    // console.log('items', items);
    // 現在スキーマでは原価種類はフラグで表現されているため展開する
    const expanded = items
      .filter((i) => i.curCd === curCode || !i.curCd)
      .flatMap((i) => {
        const result: { buCostItemId: string; buCostCodeId: string; costType: 'G' | 'R' | 'K' }[] = [];
        if (i.amountValidFlg)
          result.push({ buCostItemId: `${i.buCostItemId}-G`, buCostCodeId: i.buCostCodeId, costType: 'G' });
        if (i.rateValidFlg)
          result.push({ buCostItemId: `${i.buCostItemId}-R`, buCostCodeId: i.buCostCodeId, costType: 'R' });
        if (i.calcValidFlg)
          result.push({ buCostItemId: `${i.buCostItemId}-K`, buCostCodeId: i.buCostCodeId, costType: 'K' });
        return result;
      });
    // 定数（ZERO/MINUS/RATE）は全てKとして擬似項目を追加
    const sysCodes = [
      { buCostCodeId: 'sys-zero', buCostCd: 'ZERO', buCostNameJa: '0' },
      { buCostCodeId: 'sys-minus', buCostCd: 'MINUS', buCostNameJa: '-1' },
      { buCostCodeId: 'sys-rate', buCostCd: 'RATE', buCostNameJa: '100' },
    ];
    const sysItems = [
      { buCostItemId: 'sys-zero-K', buCostCodeId: 'sys-zero', costType: 'K' as const },
      { buCostItemId: 'sys-minus-K', buCostCodeId: 'sys-minus', costType: 'K' as const },
      { buCostItemId: 'sys-rate-K', buCostCodeId: 'sys-rate', costType: 'K' as const },
    ];
    return { buCostCodes: [...sysCodes, ...codes], buCostItems: [...sysItems, ...expanded] };
  }

  private async reassignCalcFormulasEvaluationSequences(
    businessUnitCostCodesSelection: ReadonlyArray<BusinessCostWithCalcDisplay>
  ): Promise<void> {

    const calcConditionIDs: Array<string> = businessUnitCostCodesSelection.flatMap(
      (businessUnitCostCode: BusinessCostWithCalcDisplay): Array<string> =>
          (businessUnitCostCode.buCostItem.calcDisplay?.calcFormulas ?? []).flatMap(
            (calcFormula: CalcFormula): Array<string> =>
                /* 【 従来コード欠陥 】
                 * CalcFormulaのアノテーションが間違っている。「calcConditionId」はnull可。
                 * 計算式登録画面の全体リファクタリング中修正予定。 */
                calcFormula.calcConditionId === null ? [] : [ calcFormula.calcConditionId ]
          )
    );

    const calcOperationIDs: Array<string> = businessUnitCostCodesSelection.flatMap(
        (businessUnitCostCode: BusinessCostWithCalcDisplay): Array<string> =>
            (businessUnitCostCode.buCostItem.calcDisplay?.calcFormulas ?? []).flatMap(
                /* 【 従来コード欠陥 】
                 * CalcFormulaのアノテーションが間違っている。「calcOperationId」と「elseCalcOperationId」はnull可。
                 * 計算式登録画面の全体リファクタリング中修正予定。 */
                (calcFormula: CalcFormula): Array<string> => [
                  ...calcFormula.calcOperationId === null ? [] : [ calcFormula.calcOperationId ],
                  ...calcFormula.elseCalcOperationId === null ? [] : [ calcFormula.elseCalcOperationId ]
            ])
        );

    const {
      conditions,
      operations
    }: Readonly<{
      conditions: ReadonlyArray<CalcCondition>;
      operations: ReadonlyArray<CalcOperation>;
    }> = await this.getConditionsAndOperations(calcConditionIDs, calcOperationIDs);

    const calcFormulasEvaluationSequencesAssigningResult: CalcFormulasEvaluationSequencesAssigner.Output =
        CalcFormulasEvaluationSequencesAssigner.assign({
          formulasByBusinessUnitsCodesIDs: new Map(
            businessUnitCostCodesSelection.flatMap(
              (
                businessUnitCostCode: BusinessCostWithCalcDisplay
              ): Array<[ string, Array<CalcFormula> ]> =>
                  typeof businessUnitCostCode.buCostItem.calcDisplay === "undefined" ?
                      [] :
                      [
                        [
                          businessUnitCostCode.buCostCd,
                          businessUnitCostCode.buCostItem.calcDisplay.calcFormulas
                        ]
                      ]
            )
          ),
          calcConditions: conditions,
          calcOperations: operations
        });

    try {
      await this.prisma.$transaction(
        async (prismaClient): Promise<void> => {
          const existingFormulaIds = new Set(
            (await prismaClient.calcFormula.findMany({
              where: {
                calcFormulaId: {
                  in: calcFormulasEvaluationSequencesAssigningResult.map(item => item.calcFormulaID)
                }
              },
              select: { calcFormulaId: true }
            })).map(f => f.calcFormulaId)
          );

          const validUpdates = calcFormulasEvaluationSequencesAssigningResult.filter(
            item => existingFormulaIds.has(item.calcFormulaID)
          );

          if (validUpdates.length === 0) {
            return;
          }

          for (const { calcFormulaID, evaluationSequence } of validUpdates) {
            await prismaClient.calcFormula.update({
              where: { calcFormulaId: calcFormulaID },
              data: { evalSeq: evaluationSequence }
            });
          }
        },
        { timeout: 60000 }
      );
    } catch (error) {
        throw error;
    }

  }

}
