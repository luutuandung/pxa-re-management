/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  TagsOfSupportedLanguages,
  CostPriceRegistration,
  CostPricesPatternsCategoriesDataTypes,
  isAvailableCostPricePatternCategoryDataType,
  computeCostPricePatternCode,

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternsManagementPageBFF,

  /* ┅┅┅ Constants ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  PRODUCT_NUMBER_CATEGORY_TYPE_ID

} from "@pxa-re-management/shared";

/* ┅┅┅ Contracts ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { BusinessException } from "../../../common";

/* ┅┅┅ Services ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { PrismaService } from "../../../prisma/prisma.service";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";
import * as Prisma from "@prisma/client";


@NestJS.Injectable()
export default class CostPricePatternsManagementPagePrismaService implements CostPricePatternsManagementPageBFF {

  public constructor(
    private readonly prismaService: PrismaService
  ) {}


  /* ━━━ Interface Implementation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public async retrieveTableData(
    {
      businessUnitID,
      costPriceVersionID,
      languageTag
    }: CostPricePatternsManagementPageBFF.TableDataRetrieving.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.TableDataRetrieving.ResponseData> {

    return (
      await this.prismaService.buCostItem.findMany({
        where: { businessunitId: businessUnitID },
        select: {
          buCostItemId: true,
          curCd: true,
          amountValidFlg: true,
          rateValidFlg: true,
          buCostCode: {
            select: {
              buCostCd: true,
              buCostNameJa: true,
              buCostNameEn: true,
              buCostNameZh: true
            }
          },
          costRegisters: {
            where: {
              costVersionId: costPriceVersionID
            },
            select: {
              costRegisterId: true,
              costType: true,
              type: {
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
            }
          }
        },
        orderBy: { buCostItemId: "asc" }
      })
    ).

        flatMap(

          (
            dataSelection: CostPricePatternsManagementPagePrismaService.TableDataRetrieving.DataSelectin.Item
          ): Array<CostPricePatternsManagementPageBFF.TableData.Row> =>

              Object.values(CostPriceRegistration.CostPriceTypes).flatMap(
                (
                  costPriceType: CostPriceRegistration.CostPriceTypes
                ): Array<CostPricePatternsManagementPageBFF.TableData.Row> => {

                  switch (costPriceType) {

                    case CostPriceRegistration.CostPriceTypes.amount: {

                      if (!dataSelection.amountValidFlg) {
                        return [];
                      }


                      break;

                    }

                    case CostPriceRegistration.CostPriceTypes.rate: {
                      if (!dataSelection.rateValidFlg) {
                        return [];
                      }
                    }

                  }

                  /* 【 仕様書 】
                   * 実際のデータ上、一件の事業部と関連している原価種類で一致している原価登録が一件しかあり得ないが、テスト専用のデータだと、複数存在する事がある。
                   * その時、一件目だけ良い。 */
                  const costPricePattern:
                      CostPricePatternsManagementPagePrismaService.TableDataRetrieving.DataSelectin.Item.CostPricePattern |
                      undefined |
                      null =
                          dataSelection.costRegisters.find(
                            (
                              costPriceRegistration:
                                  CostPricePatternsManagementPagePrismaService.TableDataRetrieving.DataSelectin.Item.
                                      CostPriceRegistration
                            ): boolean =>
                                costPriceRegistration.costType === costPriceType
                          )?.
                          type?.
                          costPricePattern;

                  return [
                    {
                      businessUnitCostItemID: dataSelection.buCostItemId,
                      businessUnitCode: dataSelection.buCostCode.buCostCd,
                      businessUnitLocalizedName: {
                        [TagsOfSupportedLanguages.japanese]: dataSelection.buCostCode.buCostNameJa,
                        [TagsOfSupportedLanguages.english]: dataSelection.buCostCode.buCostNameEn,
                        [TagsOfSupportedLanguages.chinese]: dataSelection.buCostCode.buCostNameZh
                      }[languageTag],
                      costPriceType,
                      currencyCode: dataSelection.curCd,
                      ...typeof costPricePattern === "undefined" || costPricePattern === null ?
                          null :
                          {
                            costPricePatternLocalizedName: {
                              [TagsOfSupportedLanguages.japanese]: costPricePattern.costPatternNameJa,
                              [TagsOfSupportedLanguages.english]: costPricePattern.costPatternNameEn,
                              [TagsOfSupportedLanguages.chinese]: costPricePattern.costPatternNameZh
                            }
                          }[languageTag]
                    }
                  ];

                }
              )

        );

  }

  public async retrieveCostPricesPatternsTypesListItems(
    { businessUnitID }: CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData> {

    type CostPricePatternCategoryInterimData =
        CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item.
          OrderedPricesPatternsCategoriesData.Item &
        Readonly<{
          sequenceNumber: number;
        }>;

    function convertCostPricesPatternsCategoriesInterimDataToFinalOnes(
      { costPricePatternCategoryID, costPricePatternCategoryTypeID }: CostPricePatternCategoryInterimData
    ): CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item.
        OrderedPricesPatternsCategoriesData.Item
    {
      return ({
        costPricePatternCategoryID,
        costPricePatternCategoryTypeID
      });
    }

    return(
      await this.prismaService.
          costPattern.
          findMany({
            where: { businessUnitID },
            select: {
              costPatternId: true,
              costPatternNameJa: true,
              costPatternNameEn: true,
              costPatternNameZh: true,
              costPriceRegistrationPatternTypes: {
                select: {
                  ID: true
                }
              },
              costPatternCategories: {
                select: {
                  costPatternCategoryId: true,
                  categoryTypeId: true,
                  categoryDataType: true,
                  seq: true
                }
              }
            }
          })
    ).map(
      (
        {
          costPatternId: costPricePatternID,
          costPatternNameJa,
          costPatternNameEn,
          costPatternNameZh,
          costPatternCategories,
          costPriceRegistrationPatternTypes
        }: CostPricePatternsManagementPagePrismaService.ModelCategoriesTypesListItemsRetrieving.DataSelection.Item
      ): CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item => {

        const modelsCategoriesData: Array<CostPricePatternCategoryInterimData> = [];
        const salesCategoriesData: Array<CostPricePatternCategoryInterimData> = [];
        const retailCategoriesData: Array<CostPricePatternCategoryInterimData> = [];

        const sortedCostPricesPatternsCategoriesInterimData = new Map<number, Array<CostPricePatternCategoryInterimData>>([
          [ CostPricesPatternsCategoriesDataTypes.model, modelsCategoriesData ],
          [ CostPricesPatternsCategoriesDataTypes.sales, salesCategoriesData ],
          [ CostPricesPatternsCategoriesDataTypes.retail, retailCategoriesData ]
        ]);

        for (
          const {
            costPatternCategoryId: costPricePatternCategoryID,
            categoryTypeId: costPricePatternCategoryTypeID,
            categoryDataType,
            seq: sequenceNumber
          } of costPatternCategories
        ) {

          const costPricesPatternsCategoriesInterimData = sortedCostPricesPatternsCategoriesInterimData.get(categoryDataType);

          if (typeof costPricesPatternsCategoriesInterimData === "undefined") {
            throw new BusinessException(
              `ID「${ costPricePatternCategoryID }」原価パターンカテゴリーは不明なデータ種類「${ categoryDataType }」を持っている。`
            );
          }


          costPricesPatternsCategoriesInterimData.push({
            costPricePatternCategoryID,
            costPricePatternCategoryTypeID,
            sequenceNumber: sequenceNumber
          });

        }

        for (const costPricesPatternsCategoriesInterimData of sortedCostPricesPatternsCategoriesInterimData.values()) {
          costPricesPatternsCategoriesInterimData.sort(
            (
              oneCostPricesPatternsCategory: CostPricePatternCategoryInterimData,
              anotherCostPricesPatternsCategory: CostPricePatternCategoryInterimData
            ): number =>
                oneCostPricesPatternsCategory.sequenceNumber - anotherCostPricesPatternsCategory.sequenceNumber
          );
        }

        return {
          costPricePatternID,
          costPricePatternNames: {
            japanese: costPatternNameJa,
            english: costPatternNameEn,
            chinese: costPatternNameZh
          },
          orderedPricesPatternsCategories: {
            model: modelsCategoriesData.map(convertCostPricesPatternsCategoriesInterimDataToFinalOnes),
            sales: salesCategoriesData.map(convertCostPricesPatternsCategoriesInterimDataToFinalOnes),
            retail: retailCategoriesData.map(convertCostPricesPatternsCategoriesInterimDataToFinalOnes)
          },
          costPriceRegistrationPatternTypesIDs: costPriceRegistrationPatternTypes.map(
            (
              costPriceRegistrationPatternType: CostPricePatternsManagementPagePrismaService.
                ModelCategoriesTypesListItemsRetrieving.DataSelection.Item.CostPriceRegistrationPatternType
            ): string =>
                costPriceRegistrationPatternType.ID
          )
        };

      }
    );

  }

  public async retrieveModelCategoriesTypesDropDownListItems(
    {
      businessUnitID
    }: CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData> {
    return (
      await this.prismaService.modelCategoryType.findMany({
        where: { businessUnitID },
        select: {
          ID: true,
          name: true
        }
      })
    ).
        map(
          (
            {
              ID: modelCategoryTypeID,
              name: modelCategoryLocalizedName
            }: Pick<Prisma.ModelCategoryType, "ID" | "name">
          ): CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData.Item =>
              ({
                modelCategoryTypeID,
                modelCategoryLocalizedName
              })
        );
  }

  public async retrieveSalesCategoriesDropDownListItems(
    {
      languageTag
    }: CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData> {
    return (
      await this.prismaService.salesCategory.findMany({
        select: {
          salesCategoryId: true,
          salesCategoryNameJa: true,
          salesCategoryNameEn: true,
          salesCategoryNameZh: true
        }
      })
    ).
        map(
          (
            {
              salesCategoryId,
              salesCategoryNameJa,
              salesCategoryNameEn,
              salesCategoryNameZh
            }: Readonly<
              Pick<
                Prisma.SalesCategory,
                  "salesCategoryId" |
                  "salesCategoryNameJa" |
                  "salesCategoryNameEn" |
                  "salesCategoryNameZh"
              >
            >
          ): CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData.Item =>
              ({
                salesCategoryTypeID: salesCategoryId,
                salesCategoryLocalizedName: {
                  [TagsOfSupportedLanguages.japanese]: salesCategoryNameJa,
                  [TagsOfSupportedLanguages.english]: salesCategoryNameEn,
                  [TagsOfSupportedLanguages.chinese]: salesCategoryNameZh
                }[languageTag]
              })
    );
  }

  public async registerCostPricesForAllPairwiseCategoriesCombinations(
    {
      businessUnitID,
      costPriceVersionID,
      businessUnitsCostItems,
      costPricePatternID
    }: CostPricePatternsManagementPageBFF.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.RequestData
  ): Promise<void> {

    type CostPatternCategorySelection = Readonly<
      Pick<
        Prisma.CostPatternCategory,
          "costPatternCategoryId" |
          "categoryTypeId" |
          "categoryDataType" |
          "seq"
      >
    >;

    const [
      costPatternCategories,
      {
        startDate: costVersionStartingYearMonth__YYYYMM,
        endDate: costVersionEndingYearMonth__YYYYMM
      }
    ]: Readonly<[

      ReadonlyArray<CostPatternCategorySelection>,

      Readonly<
        Pick<
          Prisma.CostVersion,
            "startDate" |
            "endDate"
          >
      >

    ]> = await Promise.all([

      this.prismaService.costPattern.findUniqueOrThrow({
        where: { costPatternId: costPricePatternID },
        select: {
          costPatternCategories: {
            select: {
              costPatternCategoryId: true,
              categoryTypeId: true,
              categoryDataType: true,
              seq: true
            }
          }
        }
      }).
          then(
            (
              { costPatternCategories }: Readonly<{ costPatternCategories: ReadonlyArray<CostPatternCategorySelection>; }>
            ): ReadonlyArray<CostPatternCategorySelection> =>
                costPatternCategories
          ),

      this.prismaService.costVersion.findFirstOrThrow({
        where: { costVersionId: costPriceVersionID, deleteFlg: false },
        select: {
          startDate: true,
          endDate: true
        }
      })

    ]);

    const modelsCategoriesTypesIDsAndSequenceNumbersCorrespondence: Map<string, number> = new Map();
    const wholesaleCategoriesIDsAndSequencesCorrespondence: Map<string, number> = new Map();
    const retailCategoriesIDsAndSequencesCorrespondence: Map<string, number> = new Map();

    for (const costPatternCategory of costPatternCategories) {
      if (isAvailableCostPricePatternCategoryDataType(costPatternCategory.categoryDataType)) {

        (
          {
            [CostPricesPatternsCategoriesDataTypes.model]: modelsCategoriesTypesIDsAndSequenceNumbersCorrespondence,
            [CostPricesPatternsCategoriesDataTypes.sales]: wholesaleCategoriesIDsAndSequencesCorrespondence,
            [CostPricesPatternsCategoriesDataTypes.retail]: retailCategoriesIDsAndSequencesCorrespondence
          }[costPatternCategory.categoryDataType]
        ).set(costPatternCategory.categoryTypeId, costPatternCategory.seq)

      } else {

        throw new NestJS.InternalServerErrorException(
          "データベースからのデータ取得の際不正なデータが発見された。" +
          `ID「${ costPatternCategory.costPatternCategoryId }」原価パターンカテゴリーのデータ種類` +
            `「${ costPatternCategory.categoryDataType }」は可能な値に所属していない。`
        );

      }
    }


    const wholesalesIDsAndSequenceNumbersCorrespondence: Map<string, number> = new Map();
    const retailIDsAndSequenceNumbersCorrespondence: Map<string, number> = new Map();

    /* 【 仕様書 】 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/72 */
    const hasProductNumberCategoryType: boolean = modelsCategoriesTypesIDsAndSequenceNumbersCorrespondence.
        has(PRODUCT_NUMBER_CATEGORY_TYPE_ID);

    const modelsCategoriesTypesIDsAndModelsCategoriesIDsCorrespondence: Map<string, Set<string>> = new Map();
    const wholesalesCategoriesIDsAndWholesalesIDsCorrespondence: Map<string, Set<string>> = new Map();
    const retailCategoriesIDsAndRetailIDsCorrespondence: Map<string, Set<string>> = new Map();

    const startingYear: number = Number(costVersionStartingYearMonth__YYYYMM.slice(0, 4));
    const startingMonth__numerationFrom1: number = Number(costVersionStartingYearMonth__YYYYMM.slice(4, 6))
    const endingYear: number = Number(costVersionEndingYearMonth__YYYYMM.slice(0, 4));
    const endingMonth__numerationFrom1: number = Number(costVersionEndingYearMonth__YYYYMM.slice(4, 6));
    const startingMoment: Date = new Date(startingYear, startingMonth__numerationFrom1 - 1);
    const endingMoment: Date = new Date(endingYear, endingMonth__numerationFrom1 - 1);

    if (endingMoment.getTime() < startingMoment.getTime()) {
      throw new NestJS.InternalServerErrorException(
        `原価バージョンの終了年月「${ costVersionEndingYearMonth__YYYYMM }」は開始年月「${ costVersionStartingYearMonth__YYYYMM }」` +
          "より早なっている。"
      );
    }


    const [
      modelsCategoriesIDsAndSequenceNumbersCorrespondence,
      modelsCategoriesIDsForProductNumber = []
    ]: Readonly<[ Map<string, number>, ReadonlyArray<string> | undefined, void ]> = await Promise.all([

      new Map(

        (
          await this.prismaService.modelCategoryType.findMany({
            where: {
              ID: {
                in: ((): Array<string> => {

                  const targetModelsCategoriesTypesIDs: Set<string> =
                      new Set(modelsCategoriesTypesIDsAndSequenceNumbersCorrespondence.keys());

                  targetModelsCategoriesTypesIDs.delete(PRODUCT_NUMBER_CATEGORY_TYPE_ID)

                  return Array.from(targetModelsCategoriesTypesIDs);

                })()
              }
            },
            select: {
              ID: true,
              modelCategories: {
                select: {
                  ID: true
                }
              }
            }
          })
        ).
            flatMap(
              (
                {
                  ID: modelCategoryTypeID,
                  modelCategories
                }: Readonly<
                  Pick<Prisma.ModelCategoryType, "ID"> &
                  { modelCategories: ReadonlyArray<Pick<Prisma.ModelCategory, "ID">>; }
                >
              ): Array<[ string, number ]> => {

                const sequenceNumber: number | undefined = modelsCategoriesTypesIDsAndSequenceNumbersCorrespondence.
                    get(modelCategoryTypeID);

                if (typeof sequenceNumber === "undefined") {
                  throw new NestJS.InternalServerErrorException(
                    `意図に反し、「modelsCategoriesTypesIDsAndSequencesCorrespondence」マップはID「${ modelCategoryTypeID }」の` +
                      "モデルカテゴリーデータを含めていない。"
                  );
                }


                modelsCategoriesTypesIDsAndModelsCategoriesIDsCorrespondence.set(
                  modelCategoryTypeID,
                  new Set(modelCategories.map((modelCategory: Pick<Prisma.ModelCategory, "ID">): string => modelCategory.ID))
                );

                return modelCategories.map(
                  (modelCategory: Pick<Prisma.ModelCategory, "ID">): [ string, number ] => [ modelCategory.ID, sequenceNumber ]
                );

              }
            )
        ),

        hasProductNumberCategoryType ?
            (
              await this.prismaService.quantity.findMany({
                where: {
                  businessUnitID,
                  date: {
                    gte: startingMoment,
                    lte: endingMoment
                  }
                },
                select: {
                  modelID: true
                }
              })
            ).map(({ modelID }: Readonly<Pick<Prisma.Quantity, "modelID">>): string => modelID) :
            void 0,

        (
          await this.prismaService.salesCategory.findMany({
            where: {
              salesCategoryId: {
                in: Array.from(wholesaleCategoriesIDsAndSequencesCorrespondence.keys()).
                    concat(Array.from(retailCategoriesIDsAndSequencesCorrespondence.keys()))
              }
            },
            select: {
              salesCategoryId: true,
              sales: {
                select: {
                  salesId: true
                }
              }
            }
          })
        ).
            forEach(
              (
                { salesCategoryId: salesCategoryID, sales }: Readonly<
                  Pick<Prisma.SalesCategory, "salesCategoryId"> &
                  { sales: ReadonlyArray<Pick<Prisma.Sales, "salesId">> }
                >
              ): void => {

                const wholesalesIDs: Set<string> = new Set();
                const retailIDs: Set<string> = new Set();

                for (const sale of sales) {

                  retailCategoriesIDsAndRetailIDsCorrespondence

                  let sequenceNumber: number | undefined =
                      wholesaleCategoriesIDsAndSequencesCorrespondence.get(salesCategoryID);

                  if (typeof sequenceNumber === "number") {
                    wholesalesIDsAndSequenceNumbersCorrespondence.set(sale.salesId, sequenceNumber);
                    wholesalesIDs.add(sale.salesId);
                    continue;
                  }


                  sequenceNumber = retailCategoriesIDsAndSequencesCorrespondence.get(salesCategoryID);

                  if (typeof sequenceNumber === "number") {
                    retailIDsAndSequenceNumbersCorrespondence.set(sale.salesId, sequenceNumber);
                    retailIDs.add(sale.salesId);
                    continue;
                  }


                  throw new NestJS.InternalServerErrorException(
                    `意図に反し、ID「${ salesCategoryID }」の販売カテゴリーに該当している値は` +
                      "「wholesaleCategoriesIDsAndSequencesCorrespondence」にもなく、" +
                      "「retailCategoriesIDsAndSequencesCorrespondence」にもない"
                  );

                }

                if (wholesalesIDs.size > 0) {
                  wholesalesCategoriesIDsAndWholesalesIDsCorrespondence.set(salesCategoryID, wholesalesIDs);
                } else {
                  retailCategoriesIDsAndRetailIDsCorrespondence.set(salesCategoryID, retailIDs);
                }

              }

            )

    ]);


    const modelsCategoriesByTypesCombinationsNumberWithoutRepetitions: number =
        Array.from(modelsCategoriesTypesIDsAndModelsCategoriesIDsCorrespondence.values()).
            reduce(
              (interimProduct: number, modelsCategoriesIDs: ReadonlySet<string>): number =>
                  interimProduct * modelsCategoriesIDs.size,
              1
            );

    const wholesalesCategoriesBySalesCombinationsNumberWithoutRepetitions: number =
        Array.from(wholesalesCategoriesIDsAndWholesalesIDsCorrespondence.values()).
            reduce(
              (interimProduct: number, wholesalesIDs: ReadonlySet<string>): number =>
                  interimProduct * wholesalesIDs.size,
              1
            );

    const retailCategoriesBySalesCombinationsNumberWithoutRepetitions: number =
        Array.from(retailCategoriesIDsAndRetailIDsCorrespondence.values()).
            reduce(
              (interimProduct: number, retailIDs: ReadonlySet<string>): number =>
                  interimProduct * retailIDs.size,
              1
            );

    const targetYearsAndMonthsForCostPriceRegistrationValues:
        Array<Readonly<{ year: number; month__2digits__numerationFrom1: string; }>> = [];

    let currentlyIteratedMonthNumber__numerationFrom1: number = startingMonth__numerationFrom1;

    for (let currentlyIteratedYear: number = startingYear; currentlyIteratedYear <= endingYear; currentlyIteratedYear++) {

      do {

        targetYearsAndMonthsForCostPriceRegistrationValues.push({
          year: currentlyIteratedYear,
          month__2digits__numerationFrom1: String(currentlyIteratedMonthNumber__numerationFrom1).padStart(2, "0")
        });

        if (
          currentlyIteratedYear === endingYear &&
              currentlyIteratedMonthNumber__numerationFrom1 === endingMonth__numerationFrom1
        ) {
          break;
        }


        currentlyIteratedMonthNumber__numerationFrom1++;

      } while (currentlyIteratedMonthNumber__numerationFrom1 <= 12)

      currentlyIteratedMonthNumber__numerationFrom1 = 1;

    }

    /* 【 理論 】 組み合わせ数学、数え上げの積の法則 */
    const totalCostPatternDetailsCount: number =
        modelsCategoriesByTypesCombinationsNumberWithoutRepetitions *
        wholesalesCategoriesBySalesCombinationsNumberWithoutRepetitions *
        retailCategoriesBySalesCombinationsNumberWithoutRepetitions;

    await this.prismaService.$transaction(
      async (prismaClient: Prisma.PrismaClient): Promise<void> => {
        await Promise.all(

          businessUnitsCostItems.flatMap(

            (
              {
                ID: businessUnitCostItemID,
                costPriceType
              }: CostPricePatternsManagementPageBFF.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.
                  RequestData.BusinessUnitCostItem
            ): Array<Promise<Prisma.CostRegister>> =>

                Array.from(new Array(totalCostPatternDetailsCount).keys()).map(
                  async (): Promise<Prisma.CostRegister> =>
                      prismaClient.costRegister.create({
                        data: {

                          businessUnit: {
                            connect: {
                              businessunitId: businessUnitID
                            }
                          },

                          costPatternDetail: {
                            create: {
                              costPatternCd: computeCostPricePatternCode({
                                hasAtLeastOneModelCategoryType:
                                    modelsCategoriesTypesIDsAndModelsCategoriesIDsCorrespondence.size > 0,
                                hasAtLeastOneWholesalesCategory:
                                    wholesalesCategoriesIDsAndWholesalesIDsCorrespondence.size > 0,
                                hasAtLeastOneRetailCategory:
                                    retailCategoriesIDsAndRetailIDsCorrespondence.size > 0
                              }),
                              costPatternName: "",
                              costPatternModelCategories: {
                                createMany: {
                                  data:
                                      modelsCategoriesIDsAndSequenceNumbersCorrespondence.entries().toArray().
                                          map(
                                            (
                                              [ modelCategoryID, sequenceNumber ]: Readonly<[ string, number ]>
                                            ): Prisma.Prisma.CostPatternModelCategoryCreateManyCostPatternDetailInput =>
                                                ({
                                                  modelCategoryId: modelCategoryID,
                                                  seq: sequenceNumber
                                                })
                                          ).
                                          concat(
                                            modelsCategoriesIDsForProductNumber.map(
                                              (
                                                modelCategoryID: string
                                              ): Prisma.Prisma.CostPatternModelCategoryCreateManyCostPatternDetailInput =>
                                                ({
                                                  modelCategoryId: modelCategoryID,
                                                  seq:
                                                      modelsCategoriesTypesIDsAndSequenceNumbersCorrespondence.
                                                          get(PRODUCT_NUMBER_CATEGORY_TYPE_ID) ??
                                                      ((): never => {
                                                        throw new NestJS.InternalServerErrorException(
                                                          `意図に反し、「modelsCategoriesTypesIDsAndSequenceNumbersCorrespondence」` +
                                                            "から品番の順番データがない。"
                                                        );
                                                      })()
                                                })
                                            )
                                          )
                                }
                              },
                              costPatternDestCategories: {
                                createMany: {
                                  data: [
                                    ...wholesalesIDsAndSequenceNumbersCorrespondence.entries().toArray().map(
                                      (
                                        [ saleID, sequenceNumber ]: Readonly<[ string, number ]>
                                      ): Prisma.Prisma.CostPatternDestCategoryCreateManyCostPatternDetailInput =>
                                          ({
                                            destCategoryId: saleID,
                                            secFlg: false,
                                            seq: sequenceNumber
                                          })
                                    ),
                                    ...retailIDsAndSequenceNumbersCorrespondence.entries().toArray().map(
                                      (
                                        [ saleID, sequenceNumber ]: Readonly<[ string, number ]>
                                      ): Prisma.Prisma.CostPatternDestCategoryCreateManyCostPatternDetailInput =>
                                          ({
                                            destCategoryId: saleID,
                                            secFlg: true,
                                            seq: sequenceNumber
                                          })
                                    )
                                  ]
                                }
                              }
                            }
                          },

                          buCostItem: {
                            connect: {
                              buCostItemId: businessUnitCostItemID
                            }
                          },

                          costVersion: {
                            connect: {
                              costVersionId: costPriceVersionID
                            }
                          },

                          costRegisterValues: {
                            createMany: {
                              data: targetYearsAndMonthsForCostPriceRegistrationValues.map(
                                (
                                  {
                                    year,
                                    month__2digits__numerationFrom1
                                  }: Readonly<{ year: number; month__2digits__numerationFrom1: string; }>
                                ): Prisma.Prisma.CostRegisterValueCreateManyCostRegisterInput =>
                                    ({
                                      startDate: `${ year }${ month__2digits__numerationFrom1 }`,
                                      costValue: 0,
                                      // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/
                                      createdBy: "00000000-0000-0000-0000-000000000000",
                                      modifiedBy: "00000000-0000-0000-0000-000000000000",
                                      // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                      businessUnitId: businessUnitID
                                    })
                              )
                            }
                          },

                          type: {
                            create: {
                              businessUnitCostItemID,
                              costPriceType,
                              costPriceVersionID,

                              // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━━━━━
                              creatorUserID: "00000000-0000-0000-0000-000000000000",
                              updaterUserID: "00000000-0000-0000-0000-000000000000",
                              // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                              businessUnitID,

                              costPricePattern: {
                                connect: {
                                  costPatternId: costPricePatternID
                                }
                              }

                            }
                          },

                          // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━━━━━━━━━
                          createdBy: "00000000-0000-0000-0000-000000000000",
                          modifiedBy: "00000000-0000-0000-0000-000000000000"
                          // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        }
                      })
                )

          )
        );
      }
    );

  }

}


namespace CostPricePatternsManagementPagePrismaService {

  export namespace TableDataRetrieving {

    export namespace DataSelectin {

      export type Item = Readonly<

        Pick<
          Prisma.BuCostItem,
            "buCostItemId" |
            "curCd" |
            "amountValidFlg" |
            "rateValidFlg"
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
          >;

          costRegisters: ReadonlyArray<Item.CostPriceRegistration>;
        }

      >;

      export namespace Item {

        export type CostPriceRegistration = Readonly<

          Pick<
            Prisma.CostRegister,
              "costRegisterId" |
              "costType"
          > &

          {
            type:
              Readonly<{ costPricePattern: CostPricePattern | null; }> |
              null
          }

        >;

        export type CostPricePattern = Readonly<
          Pick<
            Prisma.CostPattern,
                "costPatternNameJa" |
                "costPatternNameEn" |
                "costPatternNameZh"
          >
        >;

      }

    }

  }


  export namespace ModelCategoriesTypesListItemsRetrieving {

    export namespace DataSelection {

      export type Item = Readonly<
        Pick<
          Prisma.CostPattern,
            "costPatternId" |
            "costPatternNameJa" |
            "costPatternNameEn" |
            "costPatternNameZh"
        > &
        {
          costPatternCategories: ReadonlyArray<Item.Category>;
          costPriceRegistrationPatternTypes: ReadonlyArray<Item.CostPriceRegistrationPatternType>;
        }
      >;

      export namespace Item {

        export type Category = Readonly<
          Pick<
            Prisma.CostPatternCategory,
              "costPatternCategoryId" |
              "categoryTypeId" |
              "categoryDataType" |
              "seq"
          >
        >;

        export type CostPriceRegistrationPatternType = Readonly<{
          ID: string;
        }>;

      }

    }

  }

}
