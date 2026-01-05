import { BusinessUnitCostPriceItem, BusinessUnitCostPriceItemGateway } from "@pxa-re-management/shared";
import { PrismaService } from "../../prisma/prisma.service";
import * as NestJS from "@nestjs/common";
import * as Prisma from "@prisma/client";


@NestJS.Injectable()
export default class BusinessUnitCostPriceItemPrismaService implements BusinessUnitCostPriceItemGateway {

  /*
   * TODO
   * 一時的な定数。既存のデータから重複がなくなったら、この定数「false」にするのではなく、削除する事。
   *  【 関連課題 】 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/84
   */
  private static readonly IS_DUPLICATION_CHECKING_DISABLED: boolean = true;

  public constructor(
    private readonly prismaService: PrismaService
  ) {}


  /* ━━━ Interface Implementation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public async updateMultiple(
    requestData: BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData
  ): Promise<void> {

    await this.checkBusinessUnitCostPriceItemsForDuplicationsBeforeUpdate(requestData);

    await this.prismaService.$transaction(
      async (prismaClient: Prisma.PrismaClient): Promise<void> => {
        await Promise.all(
          requestData.map(
            async (
              {
                businessUnitCostPriceItemID,
                startingYearAndMonth__YYYYMM,
                endingYearAndMonth__YYYYMM,
                currencyCode,
                isAmountValid,
                isRateValid,
                isCalculationValid,
                isDataLinkageAvailable
              }: BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item
            ): Promise<unknown> =>
                prismaClient.buCostItem.update({
                  where: { buCostItemId: businessUnitCostPriceItemID },
                  data: {
                    startDate: startingYearAndMonth__YYYYMM,
                    endDate: endingYearAndMonth__YYYYMM ?? "",
                    curCd: currencyCode,
                    amountValidFlg: isAmountValid,
                    rateValidFlg: isRateValid,
                    calcValidFlg: isCalculationValid,
                    autoCreateValidFlg: isDataLinkageAvailable,
                    // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/
                    modifiedBy: "00000000-0000-0000-0000-000000000000",
                    // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  }
                })
          )
        );
      }
    );

  }

  public async manageMultiple(
    {
      updatedItems,
      newItems,
      businessUnitID
    }: BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData
  ): Promise<void> {

    if (BusinessUnitCostPriceItemPrismaService.IS_DUPLICATION_CHECKING_DISABLED) {
      await Promise.all([
        this.checkBusinessUnitCostPriceItemsForDuplicationsBeforeUpdate(updatedItems),
        this.checkNewBusinessUnitCostPriceItemForDuplicationsBeforeCreate(newItems)
      ]);
    }

    await this.prismaService.$transaction(
      async (prismaClient: Prisma.PrismaClient): Promise<void> => {
        await Promise.all([

          ...updatedItems.map(
            async (
              {
                businessUnitCostPriceItemID,
                startingYearAndMonth__YYYYMM,
                endingYearAndMonth__YYYYMM,
                currencyCode,
                isAmountValid,
                isRateValid,
                isCalculationValid,
                isDataLinkageAvailable
              }: BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.UpdatedItem
            ): Promise<unknown> =>
                prismaClient.buCostItem.update({
                  where: { buCostItemId: businessUnitCostPriceItemID },
                  data: {
                    startDate: startingYearAndMonth__YYYYMM,
                    endDate: endingYearAndMonth__YYYYMM ?? "",
                    curCd: currencyCode,
                    amountValidFlg: isAmountValid,
                    rateValidFlg: isRateValid,
                    calcValidFlg: isCalculationValid,
                    autoCreateValidFlg: isDataLinkageAvailable,
                    // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/
                    createdBy: "00000000-0000-0000-0000-000000000000",
                    modifiedBy: "00000000-0000-0000-0000-000000000000",
                    // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  }
                })
          ),

          prismaClient.buCostItem.createMany({
            data: newItems.map(
              (
                {
                  businessUnitCostPriceCodeID,
                  startingYearAndMonth__YYYYMM,
                  endingYearAndMonth__YYYYMM,
                  currencyCode,
                  isAmountValid,
                  isRateValid,
                  isCalculationValid,
                  isDataLinkageAvailable
                }: BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.NewItem
              ): Prisma.Prisma.BuCostItemCreateManyInput =>
                  ({
                    buCostCodeId: businessUnitCostPriceCodeID,
                    startDate: startingYearAndMonth__YYYYMM,
                    endDate: endingYearAndMonth__YYYYMM ?? "",
                    curCd: currencyCode,
                    amountValidFlg: isAmountValid,
                    rateValidFlg: isRateValid,
                    calcValidFlg: isCalculationValid,
                    autoCreateValidFlg: isDataLinkageAvailable,
                    // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/
                    createdBy: "00000000-0000-0000-0000-000000000000",
                    modifiedBy: "00000000-0000-0000-0000-000000000000",
                    // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    businessunitId: businessUnitID
                  })
            )
          })

        ]);
      }
    );

  }


  /* ━━━ Auxiliaries ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private async checkBusinessUnitCostPriceItemsForDuplicationsBeforeUpdate(
    requestData: ReadonlyArray<BusinessUnitCostPriceItemGateway.UpdatingOfOne.RequestData>
  ): Promise<void> {

    const dataSelectionIncludingBusinessUnitCostPriceCodeID: ReadonlyArray<
      Readonly<{
        businessUnitCostPriceItemID: string;
        businessUnitCostPriceCodeID: string;
        currencyCode: string;
      }>
    > =
        (
          await this.prismaService.buCostItem.findMany({
            where: {
              buCostItemId: {
                in: requestData.map(
                  (
                    { businessUnitCostPriceItemID }: BusinessUnitCostPriceItemGateway.UpdatingOfOne.RequestData
                  ): string =>
                      businessUnitCostPriceItemID
                )
              }
            },
            select: {
              buCostItemId: true,
              buCostCodeId: true,
              curCd: true
            }
          })
        ).
            map(
              (
                {
                  buCostItemId: businessUnitCostPriceItemID,
                  buCostCodeId: businessUnitCostPriceCodeID,
                  curCd: currencyCode
                }: Readonly<
                  Pick<
                    Prisma.BuCostItem,
                      "buCostItemId" |
                      "buCostCodeId" |
                      "curCd"
                  >
                >
              ):
                Readonly<{
                  businessUnitCostPriceItemID: string
                  businessUnitCostPriceCodeID: string;
                  currencyCode: string;
                }> =>
                    ({
                      businessUnitCostPriceItemID,
                      businessUnitCostPriceCodeID,
                      currencyCode
                    })
            );

    this.checkBusinessUnitCostPriceItemForDuplicationsAmongRequestData(dataSelectionIncludingBusinessUnitCostPriceCodeID);

    const duplicatesBusinessCostPriceItemsDataAmongPreviouslyCreatedData:
        ReadonlyArray<
          Readonly<{
            businessUnitCostPriceItemID: string;
            businessUnitCostPriceCodeID: string;
            currencyCode: string;
          }>
        > =
            (
              await this.prismaService.buCostItem.findMany({
                where: {
                  OR: dataSelectionIncludingBusinessUnitCostPriceCodeID.
                      map(
                        (
                          {
                            businessUnitCostPriceItemID,
                            businessUnitCostPriceCodeID,
                            currencyCode
                          }: Readonly<{
                            businessUnitCostPriceItemID: string;
                            businessUnitCostPriceCodeID: string;
                            currencyCode: string;
                          }>
                        ): Prisma.Prisma.BuCostItemWhereInput =>
                            ({
                              buCostItemId: { not: businessUnitCostPriceItemID },
                              buCostCodeId: businessUnitCostPriceCodeID,
                              curCd: currencyCode
                            })
                      )
                },
                select: {
                  buCostItemId: true,
                  buCostCodeId: true,
                  curCd: true
                }
              })
            ).
                map(
                  (
                    {
                      buCostItemId: businessUnitCostPriceItemID,
                      buCostCodeId: businessUnitCostPriceCodeID ,
                      curCd: currencyCode
                    }: Readonly<
                      Pick<
                        Prisma.BuCostItem,
                          "buCostItemId" |
                          "buCostCodeId" |
                          "curCd"
                      >
                    >
                  ):
                      Readonly<{
                        businessUnitCostPriceItemID: string;
                        businessUnitCostPriceCodeID: string;
                        currencyCode: string;
                      }> =>
                          ({
                            businessUnitCostPriceItemID,
                            businessUnitCostPriceCodeID,
                            currencyCode
                          })
                );

    if (duplicatesBusinessCostPriceItemsDataAmongPreviouslyCreatedData.length > 0) {
      throw new NestJS.ConflictException(
        "更新の結果リクエストデータの中にある原価項目は原価項目ID・通貨コード組み合わせで下記の原価項目と重複しているようになった。\n" +
        duplicatesBusinessCostPriceItemsDataAmongPreviouslyCreatedData.
            map(
              (
                {
                  businessUnitCostPriceItemID,
                  businessUnitCostPriceCodeID,
                  currencyCode
                }: Readonly<{
                  businessUnitCostPriceItemID: string;
                  businessUnitCostPriceCodeID: string;
                  currencyCode: string;
                }>
              ): string =>
                  `●  原価項目ID：${ businessUnitCostPriceItemID }、` +
                      `原価項目コードID：${ businessUnitCostPriceCodeID }、` +
                      `通貨コード：${ currencyCode }`
            ).
            join("\n")
      );
    }

  }

  private async checkNewBusinessUnitCostPriceItemForDuplicationsBeforeCreate(
    requestData: ReadonlyArray<BusinessUnitCostPriceItemGateway.CreatingOfOne.RequestData>
  ): Promise<void> {

    this.checkBusinessUnitCostPriceItemForDuplicationsAmongRequestData(requestData);

    const duplicatesBusinessCostPriceItemsDataAmongPreviouslyCreatedData:
        ReadonlyArray<
          Readonly<{
            businessUnitCostPriceItemID: string;
            businessUnitCostPriceCodeID: string;
            currencyCode: string;
          }>
        > =
            (
              await this.prismaService.buCostItem.findMany({
                where: {
                  OR: requestData.
                      map(
                        (
                          {
                            businessUnitCostPriceCodeID,
                            currencyCode
                          }: BusinessUnitCostPriceItemGateway.CreatingOfOne.RequestData
                        ): Prisma.Prisma.BuCostItemWhereInput =>
                            ({
                              buCostCodeId: businessUnitCostPriceCodeID,
                              curCd: currencyCode
                            })
                      )
                },
                select: {
                  buCostItemId: true,
                  buCostCodeId: true,
                  curCd: true
                }
              })
            ).
                map(
                  (
                    {
                      buCostItemId: businessUnitCostPriceItemID,
                      buCostCodeId: businessUnitCostPriceCodeID ,
                      curCd: currencyCode
                    }: Readonly<
                      Pick<
                        Prisma.BuCostItem,
                          "buCostItemId" |
                          "buCostCodeId" |
                          "curCd"
                      >
                    >
                  ):
                      Readonly<{
                        businessUnitCostPriceItemID: string;
                        businessUnitCostPriceCodeID: string;
                        currencyCode: string;
                      }> =>
                          ({
                            businessUnitCostPriceItemID,
                            businessUnitCostPriceCodeID,
                            currencyCode
                          })
                );

    if (duplicatesBusinessCostPriceItemsDataAmongPreviouslyCreatedData.length > 0) {
      throw new NestJS.ConflictException(
        "新しい原価項目はID・通貨コード組み合わせで下記の既存の原価項目と重複している。\n" +
        duplicatesBusinessCostPriceItemsDataAmongPreviouslyCreatedData.
            map(
              (
                {
                  businessUnitCostPriceItemID,
                  businessUnitCostPriceCodeID,
                  currencyCode
                }: Readonly<{
                  businessUnitCostPriceItemID: string;
                  businessUnitCostPriceCodeID: string;
                  currencyCode: string;
                }>
              ): string =>
                  `●  原価項目ID：${ businessUnitCostPriceItemID }、` +
                      `原価項目コードID：${ businessUnitCostPriceCodeID }、` +
                      `通貨コード：${ currencyCode }`
            ).
            join("\n")
      );
    }

  }

  private checkBusinessUnitCostPriceItemForDuplicationsAmongRequestData(
    requestData: ReadonlyArray<
      Readonly<{
        businessUnitCostPriceCodeID: string;
        currencyCode: string;
      }>
    >
  ): void {

    const checkedBusinessCostPriceItemsData:
        BusinessUnitCostPriceItemPrismaService.DuplicationChecking.CheckedBusinessCostPriceItemsData =
            new Map();

    const duplicatesBusinessCostPriceItemsDataAmongRequestData:
        BusinessUnitCostPriceItemPrismaService.DuplicationChecking.CheckedBusinessCostPriceItemsData =
            new Map();

    for (const { businessUnitCostPriceCodeID, currencyCode } of requestData) {

      const businessCostPriceItemsCodeID_AndCurrencyCodeCombination: string =
          BusinessUnitCostPriceItem.generateCompoundKeyWhichMustBeUnique({
            businessUnitCostPriceCodeID,
            currencyCode
          });

      if (checkedBusinessCostPriceItemsData.has(businessCostPriceItemsCodeID_AndCurrencyCodeCombination)) {
        duplicatesBusinessCostPriceItemsDataAmongRequestData.set(
          businessCostPriceItemsCodeID_AndCurrencyCodeCombination,
          {
            businessUnitCostPriceCodeID,
            currencyCode
          }
        );
      } else {
        checkedBusinessCostPriceItemsData.set(
          businessCostPriceItemsCodeID_AndCurrencyCodeCombination,
          {
            businessUnitCostPriceCodeID,
            currencyCode
          }
        )
      }

    }

    if (duplicatesBusinessCostPriceItemsDataAmongRequestData.size > 0) {
      throw new NestJS.ConflictException(
        "リクエストデータの中に原価項目ID・通貨コード組み合わせが重複している項目が発見。\n" +
        Array.from(duplicatesBusinessCostPriceItemsDataAmongRequestData.values()).
            map(
              (
                {
                  businessUnitCostPriceCodeID,
                  currencyCode
                }: Readonly<{ businessUnitCostPriceCodeID: string; currencyCode: string; }>
              ): string =>
                  `● 原価項目ID：${ businessUnitCostPriceCodeID }、通貨コード：${ currencyCode }`
            ).
            join("\n")
      );
    }

  }

}


namespace BusinessUnitCostPriceItemPrismaService {

  export namespace DuplicationChecking {

    export type BusinessCostPriceItemCodeID_AndCurrencyCodeCombinationKey = string;

    export type CheckedBusinessCostPriceItemsData = Map<
      BusinessCostPriceItemCodeID_AndCurrencyCodeCombinationKey,
      DuplicationChecking.CheckedBusinessCostPriceItemsData.Item
    >;

    export namespace CheckedBusinessCostPriceItemsData {
      export type Item = Readonly<{
        businessUnitCostPriceCodeID: string;
        currencyCode: string;
      }>;
    }

  }

}
