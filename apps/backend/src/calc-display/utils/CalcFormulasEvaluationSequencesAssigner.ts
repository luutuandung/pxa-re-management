import {
  CalcCondition,
  CalcFormula as LegacyCalcFormula,
  CalcOperation
} from "@pxa-re-management/shared";


class CalcFormulasEvaluationSequencesAssigner {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static readonly IS_DEBUGGING_MODE: boolean = true;

  private static reservedOperands: Readonly<{
    ZERO: "0";
    MINUS: "-1";
    RATE: "100";
  }> = {
    ZERO: "0",
    MINUS: "-1",
    RATE: "100"
  };


  /* ━━━ Instance Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Normalized Source Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly topLevelFormulasByBusinessUnitsCostsCodes: ReadonlyMap<string, CalcFormulasEvaluationSequencesAssigner.CalcFormula>;
  private readonly nestedFormulasByIDs: ReadonlyMap<string, CalcFormulasEvaluationSequencesAssigner.CalcFormula>;
  private readonly calcConditionsByIDs: ReadonlyMap<string, CalcCondition>;
  private readonly calcOperationsByIDs: ReadonlyMap<string, CalcOperation>;

  /* ┅┅┅ Interim Variables ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly interimTreeMap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
  private readonly formulasIDsByDepthLevels: CalcFormulasEvaluationSequencesAssigner.FormulasITsByDepthLevels = [];
  private readonly businessUnitsCostsCodesCorrespondingToScannedFormulas: Set<string> = new Set();
  private currentDepthLevel__numerationFrom0: number = 0;


  /* ━━━ Interface ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static assign(
    input: CalcFormulasEvaluationSequencesAssigner.Input
  ): CalcFormulasEvaluationSequencesAssigner.Output {
    return new CalcFormulasEvaluationSequencesAssigner(input).assign();
  }


  /* ━━━ Initialization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private constructor(
    {
      formulasByBusinessUnitsCodesIDs,
      calcConditions,
      calcOperations
    }: CalcFormulasEvaluationSequencesAssigner.Input
  ) {

    this.calcConditionsByIDs = new Map(
      calcConditions.map(
        (calcCondition: CalcCondition): [ string, CalcCondition ] =>
            [ calcCondition.calcConditionId, calcCondition ]
      )
    );

    this.calcOperationsByIDs = new Map(
      calcOperations.map(
        (calcOperation: CalcOperation): [ string, CalcOperation ] =>
            [ calcOperation.calcOperationId, calcOperation ]
      )
    );

    const topLevelFormulasByBusinessUnitsCostsCodes: Map<string, CalcFormulasEvaluationSequencesAssigner.CalcFormula> = new Map();
    const nestedFormulasByIDs: Map<string, CalcFormulasEvaluationSequencesAssigner.CalcFormula> = new Map();

    for (const [ businessUnitsCodesID, calcFormulas ] of formulasByBusinessUnitsCodesIDs.entries()) {

      if (calcFormulas.length === 1) {
        topLevelFormulasByBusinessUnitsCostsCodes.set(businessUnitsCodesID, calcFormulas[0]);
        continue;
      }


      const notMentionedCalcFormulasByIDs: Map<string, CalcFormulasEvaluationSequencesAssigner.CalcFormula> = new Map(
        calcFormulas.map(
         (calcFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula):
            [ string,  CalcFormulasEvaluationSequencesAssigner.CalcFormula ] =>
                [ calcFormula.calcFormulaId, calcFormula ]
        )
      );

      for (const calcFormula of calcFormulas) {

        if (calcFormula.nestCalcFormulaId !== null) {
          nestedFormulasByIDs.set(calcFormula.calcFormulaId, calcFormula);
          notMentionedCalcFormulasByIDs.delete(calcFormula.nestCalcFormulaId);
        }

        if (calcFormula.elseNestCalcFormulaId !== null) {
          notMentionedCalcFormulasByIDs.delete(calcFormula.elseNestCalcFormulaId);
        }

      }

      const topLevelFormulaID: string = Array.from(notMentionedCalcFormulasByIDs.keys())[0]
      topLevelFormulasByBusinessUnitsCostsCodes.set(
        businessUnitsCodesID, Array.from(notMentionedCalcFormulasByIDs.values())[0]
      );

      for (const calcFormula of calcFormulas) {

        if (calcFormula.calcFormulaId !== topLevelFormulaID) {
          nestedFormulasByIDs.set(calcFormula.calcFormulaId, calcFormula);
        }

      }

    }

    this.topLevelFormulasByBusinessUnitsCostsCodes = topLevelFormulasByBusinessUnitsCostsCodes;
    this.nestedFormulasByIDs = nestedFormulasByIDs;

  }


  /* ━━━ Private Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private assign(): CalcFormulasEvaluationSequencesAssigner.Output {

    for (const [ businessUnitCostCode, rootFormula ] of this.topLevelFormulasByBusinessUnitsCostsCodes.entries()) {

      const interimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
      this.interimTreeMap.set(rootFormula.calcFormulaId, interimTreeSubmap);

      if (!this.businessUnitsCostsCodesCorrespondingToScannedFormulas.has(businessUnitCostCode)) {
        this.processFormula(rootFormula, interimTreeSubmap, businessUnitCostCode);
      }

    }


    this.fillFormulasITsByDepthLevelsArray({
      interimTreeMap: this.interimTreeMap,
      depthLevel__numerationFrom0: 0
    });


    this.removeDuplicatesFromFormulasITsByDepthLevelsArray();


    const output: CalcFormulasEvaluationSequencesAssigner.Output = this.formulasIDsByDepthLevels.
        reverse().
        flatMap(
          (
            formulasIDsOfCurrentLevel: ReadonlySet<string>, index: number
          ): Array<CalcFormulasEvaluationSequencesAssigner.Output.Item> =>
              Array.from(formulasIDsOfCurrentLevel.values()).map(
                (calcFormulaID: string): CalcFormulasEvaluationSequencesAssigner.Output.Item =>
                    ({
                      calcFormulaID,
                      evaluationSequence: index + 1,
                    })
              )
        );


    return output;

  }

  private processFormula(
    targetFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula,
    correspondingInterimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap,
    businessUnitCostCode?: string
  ): void {



    /* ┅┅┅ IF-Expression ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    if (targetFormula.calcConditionId !== null) {

      const calcCondition: CalcCondition | undefined = this.calcConditionsByIDs.get(targetFormula.calcConditionId);

      if (typeof calcCondition === "undefined") {
        // Condition not found - silently continue
      } else {

        /* ╍╍╍ Left Side ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
        if (
          calcCondition.leftConCostType === "K" &&
              typeof CalcFormulasEvaluationSequencesAssigner.reservedOperands[calcCondition.leftConBuCostCd] === "undefined"
        ) {

          const nestedFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula | undefined =
              this.topLevelFormulasByBusinessUnitsCostsCodes.get(calcCondition.leftConBuCostCd);

          if (typeof nestedFormula === "undefined") {
            // Formula not found for cost code - silently continue
          } else {

            this.businessUnitsCostsCodesCorrespondingToScannedFormulas.add(calcCondition.leftConBuCostCd);

            const interimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
            correspondingInterimTreeSubmap.set(nestedFormula.calcFormulaId, interimTreeSubmap);

            this.currentDepthLevel__numerationFrom0++;
            this.processFormula(nestedFormula, interimTreeSubmap, calcCondition.leftConBuCostCd);
            this.currentDepthLevel__numerationFrom0--;

          }

        }


        /* ╍╍╍ Right Side ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
        if (
          calcCondition.rightConCostType === "K" &&
              typeof CalcFormulasEvaluationSequencesAssigner.reservedOperands[calcCondition.rightConBuCostCd] === "undefined"
        ) {

          const nestedFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula | undefined =
              this.topLevelFormulasByBusinessUnitsCostsCodes.get(calcCondition.rightConBuCostCd);

          if (typeof nestedFormula === "undefined") {
            // Formula not found for cost code - silently continue
          } else {

            this.businessUnitsCostsCodesCorrespondingToScannedFormulas.add(calcCondition.rightConBuCostCd);

            const interimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
            correspondingInterimTreeSubmap.set(nestedFormula.calcFormulaId, interimTreeSubmap);

            this.currentDepthLevel__numerationFrom0++;
            this.processFormula(nestedFormula, interimTreeSubmap, calcCondition.rightConBuCostCd);
            this.currentDepthLevel__numerationFrom0--;

          }

        }

      }

    }


    /* ┅┅┅ Plain Statements (No Nested Conditions) ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Unconditional or Parent's IF-statement ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    if (targetFormula.calcOperationId !== null) {

      const targetCalcOperation: CalcOperation | undefined = this.calcOperationsByIDs.get(targetFormula.calcOperationId);

      if (typeof targetCalcOperation === "undefined") {
        // Operation not found - silently continue
      } else {

        if (
          targetCalcOperation.opeCostType === "K" &&
              typeof CalcFormulasEvaluationSequencesAssigner.reservedOperands[targetCalcOperation.opeBuCostCd] === "undefined"
        ) {

          const nestedFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula | undefined =
              this.topLevelFormulasByBusinessUnitsCostsCodes.get(targetCalcOperation.opeBuCostCd);

          if (typeof nestedFormula === "undefined") {
            // Formula not found for cost code - silently continue
          } else {

            this.businessUnitsCostsCodesCorrespondingToScannedFormulas.add(targetCalcOperation.opeBuCostCd);

            const interimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
            correspondingInterimTreeSubmap.set(nestedFormula.calcFormulaId, interimTreeSubmap);

            this.currentDepthLevel__numerationFrom0++;
            this.processFormula(nestedFormula, interimTreeSubmap, targetCalcOperation.opeBuCostCd);
            this.currentDepthLevel__numerationFrom0--;

          }

        }

      }

      /* 【 理論 】
       * 一般的に、targetFormula.elseCalcOperationIdがnullと時、ここで「return;」しても良い。
       * でも既存のデータだと、あるべきではなくところに「calcOperationId」がはいっていることがあるので、「return;」すると、この不正のデータとの相互性がなくなる。
       * */

    }


    /* ╍╍╍ Parent's ELSE-statement ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    if (targetFormula.elseCalcOperationId　!== null) {

      const targetCalcOperation: CalcOperation | undefined = this.calcOperationsByIDs.get(targetFormula.elseCalcOperationId);

      if (typeof targetCalcOperation === "undefined") {
        // Operation not found - silently continue
      } else {

        if (
          targetCalcOperation.opeCostType === "K" &&
              typeof CalcFormulasEvaluationSequencesAssigner.reservedOperands[targetCalcOperation.opeBuCostCd] === "undefined"
        ) {

          const nestedFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula | undefined =
              this.topLevelFormulasByBusinessUnitsCostsCodes.get(targetCalcOperation.opeBuCostCd);

          if (typeof nestedFormula === "undefined") {
            // Formula not found for cost code - silently continue
          } else {

            this.businessUnitsCostsCodesCorrespondingToScannedFormulas.add(targetCalcOperation.opeBuCostCd);

            const interimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
            correspondingInterimTreeSubmap.set(nestedFormula.calcFormulaId, interimTreeSubmap);

            this.currentDepthLevel__numerationFrom0++;
            this.processFormula(nestedFormula, interimTreeSubmap, targetCalcOperation.opeBuCostCd);
            this.currentDepthLevel__numerationFrom0--;

          }

        }

      }

      /* 【 理論 】
       * 一般的に、targetFormula.elseCalcOperationIdがnullと時、ここで「return;」しても良い。
       * でも既存のデータだと、あるべきではなくところに「calcOperationId」がはいっていることがあるので、「return;」すると、この不正のデータとの相互性がなくなる。
       * */

    }


    /* ┅┅┅ Conditional Body ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ IF-statement ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    if (targetFormula.nestCalcFormulaId !== null) {

      const nestedFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula | undefined =
          this.nestedFormulasByIDs.get(targetFormula.nestCalcFormulaId);

      if (typeof nestedFormula === "undefined") {
        // Formula not found - silently continue
      } else {

        const interimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
        correspondingInterimTreeSubmap.set(nestedFormula.calcFormulaId, interimTreeSubmap);

        this.currentDepthLevel__numerationFrom0++;
        this.processFormula(nestedFormula, interimTreeSubmap);
        this.currentDepthLevel__numerationFrom0--;

      }

    }


    /* ╍╍╍ ELSE-statement ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    if (targetFormula.elseNestCalcFormulaId !== null) {

      const nestedFormula: CalcFormulasEvaluationSequencesAssigner.CalcFormula | undefined =
          this.nestedFormulasByIDs.get(targetFormula.elseNestCalcFormulaId);

      if (typeof nestedFormula === "undefined") {
        // Formula not found - silently continue
      } else {

        const interimTreeSubmap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap = new Map();
        correspondingInterimTreeSubmap.set(nestedFormula.calcFormulaId, interimTreeSubmap);

        this.currentDepthLevel__numerationFrom0++;
        this.processFormula(nestedFormula, interimTreeSubmap);
        this.currentDepthLevel__numerationFrom0--;

      }

    }

  }

  private fillFormulasITsByDepthLevelsArray(
    {
      interimTreeMap,
      depthLevel__numerationFrom0
    }: Readonly<{
      interimTreeMap: CalcFormulasEvaluationSequencesAssigner.InterimTreeMap,
      depthLevel__numerationFrom0: number
    }>
  ): void {

     for (const [ formulaID, childMap ] of interimTreeMap.entries()) {

      if (typeof this.formulasIDsByDepthLevels[depthLevel__numerationFrom0] === "undefined") {
        this.formulasIDsByDepthLevels[depthLevel__numerationFrom0] = new Set<string>();
      }

      this.formulasIDsByDepthLevels[depthLevel__numerationFrom0].add(formulaID);

      this.fillFormulasITsByDepthLevelsArray({
        interimTreeMap: childMap,
        depthLevel__numerationFrom0: depthLevel__numerationFrom0 + 1
      });

    }

  }


  private removeDuplicatesFromFormulasITsByDepthLevelsArray(): void {

    let checkedFormulasIDs: Set<string> = new Set();

    /* 【 理論 】 重複があった場合、一番深いものを残す。 */
    for (
      let level__numerationFrom0: number = this.formulasIDsByDepthLevels.length - 1;
      level__numerationFrom0 >= 0;
      level__numerationFrom0--
    ) {

      const formulaIDsForTargetLevel: Set<string> = this.formulasIDsByDepthLevels[level__numerationFrom0];

      for (const formulaIDsForCurrentLevel of this.formulasIDsByDepthLevels[level__numerationFrom0]) {
        if (checkedFormulasIDs.has(formulaIDsForCurrentLevel)) {
          formulaIDsForTargetLevel.delete(formulaIDsForCurrentLevel);
        } else {
          checkedFormulasIDs.add(formulaIDsForCurrentLevel);
        }

      }

    }

  }


  /* ┅┅┅ Routines ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private get normalIndentationForLogging(): string {
    return " ".repeat(this.currentDepthLevel__numerationFrom0 * 4);
  }

  private get increasedIndentationForLogging(): string {
    return " ".repeat(this.currentDepthLevel__numerationFrom0 * 4 + 2);
  }

}


namespace CalcFormulasEvaluationSequencesAssigner {

  /* ━━━ Input ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Input = Readonly<{
    formulasByBusinessUnitsCodesIDs: ReadonlyMap<string, ReadonlyArray<CalcFormula>>;
    calcConditions: ReadonlyArray<CalcCondition>;
    calcOperations: ReadonlyArray<CalcOperation>;
  }>;

  export type CalcFormula = Readonly<
    Omit<
      LegacyCalcFormula,
        "calcConditionId" |
        "calcOperationId" |
        "elseCalcOperationId" |
        "nestCalcFormulaId" |
        "elseNestCalcFormulaId"
    > &
    {
      calcConditionId: string | null;
      calcOperationId: string | null;
      elseCalcOperationId: string | null;
      nestCalcFormulaId: string | null;
      elseNestCalcFormulaId: string | null;
    }
  >;


  /* ━━━ Output ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Output = Array<Output.Item>;

  export namespace Output {
    export type Item = {
      calcFormulaID: string;
      evaluationSequence: number;
    };
  }


  /* ━━━ Worktypes ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type BusinessCostCode = string;
  export type CalcFormulaID = string;

  export type InterimTreeMap = Map<CalcFormulaID, InterimTreeMap>;

  export type FormulasITsByDepthLevels = Array<Set<string>>;

}


export default CalcFormulasEvaluationSequencesAssigner;
