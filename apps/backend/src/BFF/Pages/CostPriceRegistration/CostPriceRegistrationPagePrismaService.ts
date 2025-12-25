/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  TagsOfSupportedLanguages,
  CodesOfAvailableCurrencies,
  isAvailableCurrencyCode,
  CostPriceRegistration,

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPriceRegistrationPageBFF,

  /* ┅┅┅ Contracts ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPriceRegistrationPageTransactions

} from "@pxa-re-management/shared";
import { BusinessException } from "../../../common";

/* ┅┅┅ Services ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { PrismaService } from "../../../prisma/prisma.service";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";
import * as Prisma from "@prisma/client";


@NestJS.Injectable()
export default class CostPriceRegistrationPagePrismaService implements CostPriceRegistrationPageBFF {

  public constructor(
    private readonly prismaService: PrismaService
  ) {}


  /* ━━━ Interface Implementation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public async retrieveTableData(
    {
      businessUnitID,
      costPriceVersionID,
      costPricePatternID,
      languageTag
    }: CostPriceRegistrationPageBFF.TableDataRetrieving.RequestParameters
  ): Promise<CostPriceRegistrationPageBFF.TableData> {

    const primaryDataSelection: ReadonlyArray<
      CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item
    > = await this.prismaService.costRegister.findMany({
      where: {
        businessunitId: businessUnitID,
        costVersionId: costPriceVersionID
      },
      select: {
        costRegisterId: true,
        costType: true,
        buCostItem: {
          select: {
            curCd: true,
            buCostCode: {
              select: {
                buCostCd: true,
                buCostNameJa: true,
                buCostNameEn: true,
                buCostNameZh: true
              }
            }
          }
        },
        costPatternDetail: {
          select: {
            costPatternModelCategories: {
              select: {
                modelCategoryId: true
              }
            },
            costPatternDestCategories: {
              select: {
                destCategoryId: true,
                secFlg: true,
                sale: {
                  select: {
                    salesId: true,
                    salesName: true
                  }
                }
              }
            }
          }
        },
        costRegisterValues: {
          select: {
            startDate: true,
            costValue: true
          }
        },
        type: {
          ...typeof costPricePatternID === "string" ?  { where: { costPricePatternID } } : null,
          select: {
            costPricePattern: {
              select: {
                costPatternNameJa: true,
                costPatternNameEn: true,
                costPatternNameZh: true
              }
            }
          }
        }
      },
      orderBy: { buCostItemId: "asc" }
    });


    /*
     * 【 仕様書 】
     * 各「primaryDataSelectionItem.costPatternDetail.costPatternModelCategories」の「modelCategoryId」は
     *   「cost.MODEL_CATEGORY」テーブルか、「cost.MODEL」テーブルに参照している。
     *
     * 【 理論 】 【 整備性 】
     * Prismaはuniquieidentifier型の文字列を小文字で返しているが、mssqlは大文字で返している。何ケースのIDを使っているか、明確にする事。
     * */
    let actualModelsCategoriesIDs: ReadonlySet<string> = new Set(
      primaryDataSelection.flatMap(
        (
          primaryDataSelectionItem: CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item
        ): ReadonlyArray<string> =>
            primaryDataSelectionItem.costPatternDetail.costPatternModelCategories.map(
              (
                modelCategory: CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item.
                    CostPricePatternModelCategory
              ): string =>
                  modelCategory.modelCategoryId
            )
      )
    );

    const actualModelsCategoriesNamesByIDs: Map<string, string> = new Map(
      (await this.prismaService.modelCategory.findMany({
        where: {
          ID: { in: Array.from(actualModelsCategoriesIDs) }
        },
        select: {
          ID: true,
          name: true
        }
      })).
          map(({ ID, name }: Readonly<Pick<Prisma.ModelCategory, "ID" | "name">>): [ string, string ] => [ ID, name ])
    );

    actualModelsCategoriesIDs = actualModelsCategoriesIDs.
        difference(new Set(actualModelsCategoriesNamesByIDs.keys()));

    for (
      const { ID, name } of
          (await this.prismaService.model.findMany({
              where: {
                ID: { in: Array.from(actualModelsCategoriesIDs) }
              },
              select: {
                ID: true,
                name: true
              }
            })
          )
    ) {
      actualModelsCategoriesNamesByIDs.set(ID, name)
    }

    const presentPriceTypes: Set<CostPriceRegistration.CostPriceTypes> = new Set();

    const tableRowsData: Array<CostPriceRegistrationPageBFF.TableData.Row> = primaryDataSelection.map(
      (
        primaryDataSelectionItem: CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item
      ): CostPriceRegistrationPageBFF.TableData.Row => {

        const tableRowData: CostPriceRegistrationPageBFF.TableData.Row = CostPriceRegistrationPagePrismaService.
            buildTableRowData({ primaryDataSelectionItem, languageTag, actualModelsCategoriesNamesByIDs })

        presentPriceTypes.add(tableRowData.costPriceType);

        return tableRowData;

      }

    );

    return {
      rows: tableRowsData,
      presentPriceTypes: Array.from(presentPriceTypes)
    };

  }

  public async retrieveCostPricePatternsDropDownListItems(
    {
      businessUnitID,
      costPriceVersionID,
      costPricesTypes,
      languageTag
    }: CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.RequestParameters
  ): Promise<CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData> {

    /* 【 方法論 】
     * 重複が入る可能性があるの、マップを使って重複をなくす事。
     * https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/38#95618 */
    return new Map<string, CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData.Item>(
      (
        await this.prismaService.
            costPriceRegistrationPatternType.
            findMany({
              where: {
                businessUnitID,
                costPriceVersionID,
                costPriceType: { in: [ ...costPricesTypes ] }
              },
              select: {
                costPricePattern: {
                  select: {
                    costPatternId: true,
                    costPatternNameJa: true,
                    costPatternNameEn: true,
                    costPatternNameZh: true
                  }
                }
              }
            })
      ).map(
        (
          {
            costPricePattern
          }: Readonly<{
            costPricePattern: Pick<
              Prisma.CostPattern,
                  "costPatternId" |
                  "costPatternNameJa" |
                  "costPatternNameEn" |
                  "costPatternNameZh"
            >
          }>
        ): Readonly<[ string, CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData.Item ]> =>
            [
              costPricePattern.costPatternId,
              {
                costPricePatternID: costPricePattern.costPatternId,
                costPricePatternName: {
                  [TagsOfSupportedLanguages.japanese]: costPricePattern.costPatternNameJa,
                  [TagsOfSupportedLanguages.english]: costPricePattern.costPatternNameEn,
                  [TagsOfSupportedLanguages.chinese]: costPricePattern.costPatternNameZh
                }[languageTag]
              }
            ]
      )
    ).

        values().

        toArray();

  }

  public async updateCostPricesValues(
    requestData: CostPriceRegistrationPageBFF.CostPriceRegistrationValuesUpdating.RequestData
  ): Promise<void> {
    await this.prismaService.$transaction(
      async (prismaClient: Prisma.PrismaClient): Promise<void> => {
        await Promise.all(
          requestData.map(
            async (
              {
                costPriceRegistrationID,
                costPriceRegistrationValue
              }: CostPriceRegistrationPageBFF.CostPriceRegistrationValuesUpdating.RequestData.Item
            ): Promise<unknown> => {
              return prismaClient.costRegisterValue.updateMany({
                where: { costRegisterId: costPriceRegistrationID },
                data: { costValue: costPriceRegistrationValue }
              });
            }
          )
        )
      },
      { timeout: CostPriceRegistrationPageTransactions.CostPriceRegistrationValuesUpdating.TIMEOUT__MILLISECONDS }
    );

  }


  /* ━━━ Utils ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static buildTableRowData(
    {
      languageTag,
      primaryDataSelectionItem,
      actualModelsCategoriesNamesByIDs
    }: Readonly<{
      languageTag: TagsOfSupportedLanguages;
      primaryDataSelectionItem: CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item;
      actualModelsCategoriesNamesByIDs: ReadonlyMap<string, string>;
    }>
  ): CostPriceRegistrationPageBFF.TableData.Row {

    const costPriceRegisterID: string = primaryDataSelectionItem.costRegisterId;

    const costPriceType: CostPriceRegistration.CostPriceTypes =
        CostPriceRegistration.isValidCostPriceType(primaryDataSelectionItem.costType) ?
            primaryDataSelectionItem.costType :
            ((): never => {
              throw new BusinessException(
                `データベースからデータを取得中、ID「${ costPriceRegisterID }」原価登録の原価種類` +
                  `「${ primaryDataSelectionItem.costType }」は可能な値に所属していないと発見。`
              );
            })();

    const currencyCode: CodesOfAvailableCurrencies =
        isAvailableCurrencyCode(primaryDataSelectionItem.buCostItem.curCd) ?
            primaryDataSelectionItem.buCostItem.curCd :
            ((): never => {
              throw new BusinessException(
                `データベースからデータを取得中、ID「${ costPriceRegisterID }」原価登録結ぶついている原価種類` +
                    `「${ primaryDataSelectionItem.buCostItem.curCd }」は可能な値に所属していないと発見。`
              );
            })();

    const salesDestinationsCategories: Array<
      CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item.CostPatternDestinationCategory
    > = [];

    const resellingDestinationsCategories: Array<
      CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item.CostPatternDestinationCategory
    > = [];

    for (const salesDestination of primaryDataSelectionItem.costPatternDetail.costPatternDestCategories) {
      (salesDestination.secFlg ? resellingDestinationsCategories: salesDestinationsCategories).push(salesDestination)
    }

    const costRegisterValue:
        CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.Item.CostPriceRegistrationValue | null =
            primaryDataSelectionItem.costRegisterValues.length > 0 ?
                primaryDataSelectionItem.costRegisterValues[0] : null;

    return {

      costPriceRegisterID: primaryDataSelectionItem.costRegisterId,

      businessUnitCostPriceCode: primaryDataSelectionItem.buCostItem.buCostCode.buCostCd,

      businessUnitCostPriceLocalizedName: {
        [TagsOfSupportedLanguages.japanese]: primaryDataSelectionItem.buCostItem.buCostCode.buCostNameJa,
        [TagsOfSupportedLanguages.english]: primaryDataSelectionItem.buCostItem.buCostCode.buCostNameEn,
        [TagsOfSupportedLanguages.chinese]: primaryDataSelectionItem.buCostItem.buCostCode.buCostNameZh
      }[languageTag],

      costPriceType,

      currencyCode,

      ...primaryDataSelectionItem.type === null || primaryDataSelectionItem.type.costPricePattern === null ?
          null :
          {
            costPricePatternLocalizedName: {
              [TagsOfSupportedLanguages.japanese]: primaryDataSelectionItem.type.costPricePattern.costPatternNameJa,
              [TagsOfSupportedLanguages.english]: primaryDataSelectionItem.type.costPricePattern.costPatternNameEn,
              [TagsOfSupportedLanguages.chinese]: primaryDataSelectionItem.type.costPricePattern.costPatternNameZh
            }[languageTag]
          },

      formattedModelCategoriesNames: primaryDataSelectionItem.costPatternDetail.costPatternModelCategories.
          flatMap(
            (
              costPatternModelCategory: CostPriceRegistrationPagePrismaService.TableDataRetrieving.PrimaryDataSelection.
                  Item.CostPricePatternModelCategory
            ): Array<string> => {

              /* 【 仕様書 】 現在のデータだと、機種のデータがない事があり得る。 */
              const targetModelCategoryName: string | undefined =
                  actualModelsCategoriesNamesByIDs.get(costPatternModelCategory.modelCategoryId);

              return typeof targetModelCategoryName === "string" ? [ targetModelCategoryName ] : [];

            }
          ).
          join("/"),

      formattedSalesDestinations:
          salesDestinationsCategories.
              map(
                (
                  costPatternSalesDestinationCategory: CostPriceRegistrationPagePrismaService.TableDataRetrieving.
                      PrimaryDataSelection.Item.CostPatternDestinationCategory
                ): string =>
                    costPatternSalesDestinationCategory.sale.salesName
          ).
              join("/"),

      formattedResellingDestinations :
          resellingDestinationsCategories.
              map(
                (
                  costPatternSalesDestinationCategory: CostPriceRegistrationPagePrismaService.TableDataRetrieving.
                      PrimaryDataSelection.Item.CostPatternDestinationCategory
                ): string =>
                    costPatternSalesDestinationCategory.sale.salesName
          ).
              join("/"),

      ...costRegisterValue === null ?
          null :
          {
            startYearAndMonth__YYYYMM: costRegisterValue.startDate,
            costPriceAmount: costRegisterValue.costValue
          }

    };

  }

}


namespace CostPriceRegistrationPagePrismaService {

  export namespace TableDataRetrieving {

    export namespace PrimaryDataSelection {

      export type Item = Readonly<

        Pick<
          Prisma.CostRegister,
            "costRegisterId" |
            "costType"
        > &

        {

          buCostItem: Readonly<

            Pick<
              Prisma.BuCostItem,
                "curCd"
            > &

            {
              buCostCode: Readonly<
                Pick<
                  Prisma.BuCostCode,
                    "buCostCd" |
                    "buCostNameJa" |
                    "buCostNameEn" |
                    "buCostNameZh"
                >
              >
            }

          >;

          /* 【 仕様書 】
           * もし「costPatternDetail」が「null」になったせいでエラーが起きても、不正データのせいだから、修正不要。実データだと、costPatternDetailが必須。 */
          costPatternDetail: Readonly<{
            costPatternModelCategories: ReadonlyArray<Item.CostPricePatternModelCategory>;
            costPatternDestCategories: ReadonlyArray<Item.CostPatternDestinationCategory>;
          }>;

          costRegisterValues: ReadonlyArray<Item.CostPriceRegistrationValue>;

          type:

              Readonly<{

                costPricePattern:

                    Readonly<
                      Pick<
                        Prisma.CostPattern,
                          "costPatternNameJa" |
                          "costPatternNameEn" |
                          "costPatternNameZh"
                      >
                    > |

                    null

              }> |

              null

        }
      >;

      export namespace Item {

        export type CostPricePatternModelCategory = Readonly<
          Pick<
            Prisma.CostPatternModelCategory,
              "modelCategoryId"
          >
        >;

        export type CostPriceRegistrationValue = Readonly<
          Pick<
            Prisma.CostRegisterValue,
              "startDate" |
              "costValue"
          >
        >;

        export type CostPatternDestinationCategory = Readonly<
          Pick<
            Prisma.CostPatternDestCategory,
              "destCategoryId" |
              "secFlg"
          > &
          {
            sale: Pick<
              Prisma.Sales,
                "salesId" |
                "salesName"
            >
          }>;

      }

    }

  }

}
