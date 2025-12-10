import { BuCostCode, CalcCondition, CalcFormula, CalcOperation } from "@pxa-re-management/shared";
import { BusinessException } from "../../common";


export default class CalcDisplayCodeBuilder {

  private static reservedOperands: Readonly<{
    ZERO: "0";
    MINUS: "-1";
    RATE: "100";
  }> = {
    ZERO: "0",
    MINUS: "-1",
    RATE: "100"
  };

  private readonly formulas: ReadonlyArray<CalcFormula>;
  private readonly conditions: ReadonlyArray<CalcCondition>;
  private readonly operations: ReadonlyArray<CalcOperation>;
  private readonly businessUnitsCostsCodes: ReadonlyArray<BuCostCode>;


  public static build(
    {
      formulas,
      conditions,
      operations,
      businessUnitsCostsCodes
    }: Readonly<{
      formulas: ReadonlyArray<CalcFormula>;
      conditions: ReadonlyArray<CalcCondition>;
      operations: ReadonlyArray<CalcOperation>;
      businessUnitsCostsCodes: ReadonlyArray<BuCostCode>;
    }>
  ): string {

    let rootFormula: CalcFormula | undefined;

    if (formulas.length === 1) {
      rootFormula = formulas[0];
    } else {

      const IDsOfFormulasWithParents: Set<String> = new Set();

      for (const formula of formulas) {

        /* 【 一時的 】 「nestCalcFormulaId」と「elseNestCalcFormulaId」は意図上任意ではあるが、既存のコードが空文字が入る事がある。将来的に解決するべき。 */
        if (typeof formula.nestCalcFormulaId === "string" && formula.nestCalcFormulaId.length > 0) {
          IDsOfFormulasWithParents.add(formula.nestCalcFormulaId);
        }

        if (typeof formula.elseNestCalcFormulaId === "string" && formula.elseNestCalcFormulaId.length > 0) {
          IDsOfFormulasWithParents.add(formula.elseNestCalcFormulaId);
        }

      }

      const formulasWithoutParents: ReadonlyArray<CalcFormula> = formulas.filter(
        (formula: CalcFormula): boolean => !IDsOfFormulasWithParents.has(formula.calcFormulaId)
      );

      if (formulasWithoutParents.length !== 1) {
        throw new BusinessException("親がない計算式はちょうど一個でなければいけない");
      }

      rootFormula = formulasWithoutParents[0];

    }


    if (typeof rootFormula === "undefined") {
      throw new BusinessException("最上の計算式が発見されず、すべての計算式親を持っているという予想外の状態になっている。")
    }

    const dataHoldingSelfInstance: CalcDisplayCodeBuilder = new CalcDisplayCodeBuilder({
      formulas,
      conditions,
      operations,
      businessUnitsCostsCodes
    });

    return dataHoldingSelfInstance.generateLevel({ formula: rootFormula });

  }

  private constructor(
    {
      formulas,
      conditions,
      operations,
      businessUnitsCostsCodes
    }: Readonly<{
      formulas: ReadonlyArray<CalcFormula>;
      conditions: ReadonlyArray<CalcCondition>;
      operations: ReadonlyArray<CalcOperation>;
      businessUnitsCostsCodes: ReadonlyArray<BuCostCode>;
    }>
  ) {
    this.formulas = formulas;
    this.conditions = conditions;
    this.operations = operations;
    this.businessUnitsCostsCodes = businessUnitsCostsCodes;
  }


  private generateLevel(
    {
      formula,
    }: Readonly<{
      formula: CalcFormula,
    }>
  ): string {

    const ifCondition: CalcCondition | undefined = this.conditions.find(
      (condition: CalcCondition): boolean => condition.calcConditionId === formula.calcConditionId
    );

    if (typeof ifCondition === "undefined") {
      return this.generateStatement({ targetOperationID: formula.calcOperationId })
    }


    return [
      "IF ( " +
      this.generateIfConditionExpression(ifCondition) +
      " ) { " +
      this.generateStatement({
        ...typeof formula.calcOperationId === "string" && formula.calcOperationId.length > 0 ?
            { targetOperationID: formula.calcOperationId } : null,
        ...typeof formula.nestCalcFormulaId === "string" && formula.nestCalcFormulaId.length > 0 ?
            { nestedFormulaID: formula.nestCalcFormulaId } : null
      }) +
      " } ELSE { " +
      this.generateStatement({
        ...typeof formula.elseCalcOperationId === "string" && formula.elseCalcOperationId.length > 0 ?
            { targetOperationID: formula.elseCalcOperationId } : null,
        ...typeof formula.elseNestCalcFormulaId === "string" && formula.elseNestCalcFormulaId.length > 0 ?
            { nestedFormulaID: formula.elseNestCalcFormulaId } : null
      }) +
      " }"
    ].join("");

  }

  private generateIfConditionExpression(condition: CalcCondition): string {

    let leftOperand: string;
    let isReservedLeftOperand: boolean;

    if (typeof CalcDisplayCodeBuilder.reservedOperands[condition.leftConBuCostCd] !== "undefined") {

      leftOperand = CalcDisplayCodeBuilder.reservedOperands[condition.leftConBuCostCd];
      isReservedLeftOperand = true;

    } else {

      leftOperand = this.businessUnitsCostsCodes.
          find(
            (businessUnitCostCode: BuCostCode): boolean => businessUnitCostCode.buCostCd === condition.leftConBuCostCd
          )?.buCostCd ??
          condition.leftConBuCostCd;

      isReservedLeftOperand = false;

    }

    let rightOperand: string;
    let isReservedRightOperand: boolean;

    if (typeof CalcDisplayCodeBuilder.reservedOperands[condition.rightConBuCostCd] !== "undefined") {

      rightOperand = CalcDisplayCodeBuilder.reservedOperands[condition.rightConBuCostCd];
      isReservedRightOperand = true;

    } else {

      rightOperand = this.businessUnitsCostsCodes.
          find(
            (businessUnitCostCode: BuCostCode): boolean => businessUnitCostCode.buCostCd === condition.rightConBuCostCd
          )?.buCostCd ??
          condition.rightConBuCostCd;

      isReservedRightOperand = false;

    }

    return [
      leftOperand,
      ...isReservedLeftOperand ? [] : [ `[${ condition.leftConCostType }]` ],
      ` ${ condition.conOperator } `,
      rightOperand,
      ...isReservedRightOperand ? [] : [ `[${ condition.rightConCostType }]` ]
    ].join("")

  }

  private generateStatement(
    {
      targetOperationID,
      nestedFormulaID
    }: Readonly<{
      targetOperationID?: string;
      nestedFormulaID?: string;
    }>
  ): string {

    let targetOperation: CalcOperation | undefined;

    if (typeof targetOperationID !== "undefined") {

      targetOperation = this.operations.find(
        (operation: CalcOperation): boolean => operation.calcOperationId === targetOperationID
      );

      if (typeof targetOperation === "undefined") {
        console.warn(`ID「${ targetOperationID }」オペレーションが発見されなかった`);
      }

    }


    /* 【 一時的 】 「nestCalcFormulaId」と「elseNestCalcFormulaId」は意図上任意ではあるが、既存のコードが空文字が入る事がある。将来的に解決するべき。 */
    if (typeof targetOperation !== "undefined" && (typeof nestedFormulaID === "undefined" || nestedFormulaID === "")) {

      if (typeof CalcDisplayCodeBuilder.reservedOperands[targetOperation.opeBuCostCd] !== "undefined") {
        return CalcDisplayCodeBuilder.reservedOperands[targetOperation.opeBuCostCd];
      }


      return `${ targetOperation.opeBuCostCd }[${ targetOperation.opeCostType }]`;

    }


    if (typeof nestedFormulaID === "undefined") {
      throw new Error("targetOperationID、nestedFormulaID、どちらでも不明。");
    }

    const nestedFormula: CalcFormula | undefined = this.formulas.find(
      (formula: CalcFormula): boolean => formula.calcFormulaId === nestedFormulaID
    );

    if (typeof nestedFormula === "undefined") {
      throw new BusinessException(`ID「${ nestedFormulaID }」の計算式が渡された配列の計算式の中にはなかった。`);
    }


    return this.generateLevel({ formula: nestedFormula });

  }

}
