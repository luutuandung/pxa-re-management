/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  TagsOfSupportedLanguages,

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  BusinessUnitsCostPricesItemsSettingsPageBFF

} from "@pxa-re-management/shared";

/* ┅┅┅ Services ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { PrismaService } from "../../../prisma/prisma.service";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";
import * as Prisma from "@prisma/client";


@NestJS.Injectable()
export default class BusinessUnitsCostPricesItemsSettingsPrismaService implements BusinessUnitsCostPricesItemsSettingsPageBFF {

  public constructor(
    private readonly prismaService: PrismaService
  ) {}


  /* ━━━ Interface Implementation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public async retrieveTableData(
    {
      businessUnitID,
      languageTag,
      searchingByFullOrPartialBusinessUnitCostPriceName
    }: BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.RequestParameters
  ): Promise<BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.ResponseData> {
    return (
      await this.prismaService.buCostItem.findMany({
        where: {
          buCostCode: {
            businessunitId: businessUnitID,
            deleteFlg: false,
            ...(
              typeof searchingByFullOrPartialBusinessUnitCostPriceName === "string" &&
                  searchingByFullOrPartialBusinessUnitCostPriceName.length > 0
            ) ?
                {
                  ...languageTag === TagsOfSupportedLanguages.japanese ?
                      { buCostNameJa: { contains: searchingByFullOrPartialBusinessUnitCostPriceName } } : null,
                  ...languageTag === TagsOfSupportedLanguages.english ?
                      { buCostNameEn: { contains: searchingByFullOrPartialBusinessUnitCostPriceName } } : null,
                  ...languageTag === TagsOfSupportedLanguages.chinese ?
                      { buCostNameZh: { contains: searchingByFullOrPartialBusinessUnitCostPriceName } } : null,
                } :
                null
          }
        },
        select: {
          buCostItemId: true,
          buCostCodeId: true,
          startDate: true,
          endDate: true,
          curCd: true,
          amountValidFlg: true,
          rateValidFlg: true,
          calcValidFlg: true,
          autoCreateValidFlg: true,
          buCostCode: {
            select: {
              buCostCd: true,
              buCostNameJa: true,
              buCostNameEn: true,
              buCostNameZh: true
            }
          }
        }
      })
    ).

        map(
          (
            dataSelection: Readonly<
              Pick<
                Prisma.BuCostItem,
                  "buCostItemId" |
                  "buCostCodeId" |
                  "startDate" |
                  "endDate" |
                  "curCd" |
                  "amountValidFlg" |
                  "rateValidFlg" |
                  "calcValidFlg" |
                  "autoCreateValidFlg"
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
              }
            >
          ): BusinessUnitsCostPricesItemsSettingsPageBFF.TableData.Row => {

            const startingMonthNumber__numerationFrom1__always2Digits: string = dataSelection.startDate.slice(4);
            const endingMonthNumber__numerationFrom1__always2Digits: string = dataSelection.endDate.slice(4);

            return {

              businessUnitCostPriceItemID: dataSelection.buCostItemId,
              businessUnitCostPriceCodeID: dataSelection.buCostCodeId,
              businessUnitCostPriceItemCode: dataSelection.buCostCode.buCostCd,
              businessUnitCostPriceItemLocalizedName: {
                [TagsOfSupportedLanguages.japanese]: dataSelection.buCostCode.buCostNameJa,
                [TagsOfSupportedLanguages.english]: dataSelection.buCostCode.buCostNameEn,
                [TagsOfSupportedLanguages.chinese]: dataSelection.buCostCode.buCostNameZh
              }[languageTag],
              yearAndMonthOfActualityStarting: {
                year: Number(dataSelection.startDate.slice(0, 4)),
                monthNumber__numerationFrom1: Number.parseInt(startingMonthNumber__numerationFrom1__always2Digits),
                monthNumber__numerationFrom1__always2Digits: startingMonthNumber__numerationFrom1__always2Digits
              },

              /* 【 制限 】 データベース上必須になっているので、nullを受ける事はないが、空文字が入っている事がある。 */
              yearAndMonthOfActualityEnding:
                  dataSelection.endDate.length > 0 ?
                    {
                      year: Number(dataSelection.endDate.slice(0, 4)),
                      monthNumber__numerationFrom1: Number.parseInt(endingMonthNumber__numerationFrom1__always2Digits),
                      monthNumber__numerationFrom1__always2Digits: endingMonthNumber__numerationFrom1__always2Digits
                    } :
                    null,

              currencyCode: dataSelection.curCd,
              isAmountValid: dataSelection.amountValidFlg,
              isRateValid: dataSelection.rateValidFlg,
              isCalculationValid: dataSelection.calcValidFlg,
              isDataLinkageAvailable: dataSelection.autoCreateValidFlg

            };

          }
        );
  }

}
