import { CostPricePatternTypeGateway } from "@pxa-re-management/shared";
import { PrismaService } from "../../prisma/prisma.service";
import * as  NestJS from "@nestjs/common";
import * as Prisma from "@prisma/client";


@NestJS.Injectable()
export default class CostPricePatternTypePrismaService implements CostPricePatternTypeGateway {

  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async addOne(
    {
      costPricePatternNames,
      costPricePatternCategories,
      businessUnitID
    }: CostPricePatternTypeGateway.AddingOfOne.RequestData
  ): Promise<void> {
    await this.prismaService.costPattern.create({
      data: {
        costPatternNameJa: costPricePatternNames.japanese,
        costPatternNameEn: costPricePatternNames.english,
        costPatternNameZh: costPricePatternNames.chinese,

        // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        createdBy: "00000000-0000-0000-0000-000000000000",
        modifiedBy: "00000000-0000-0000-0000-000000000000",
        // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        costPatternCategories: {
          createMany: {
            data: costPricePatternCategories.map(
              (
                costPricePatternCategoryType: CostPricePatternTypeGateway.AddingOfOne.RequestData.CostPricePatternCategory
              ): Prisma.Prisma.CostPatternCategoryCreateWithoutCostPatternInput =>
                  ({
                    categoryTypeId: costPricePatternCategoryType.typeID,
                    categoryDataType: costPricePatternCategoryType.dataType,
                    seq: costPricePatternCategoryType.sequenceNumber
                  })
            )
          }
        },
        businessUnitID
      }
    });
  }

  public async updateOne(
    { costPricePatternID, costPricePatternNames }: CostPricePatternTypeGateway.UpdatingOfOne.RequestData
  ): Promise<void> {
    await this.prismaService.costPattern.update({
      where: { costPatternId: costPricePatternID },
      data: {

        costPatternNameJa: costPricePatternNames.japanese,
        costPatternNameEn: costPricePatternNames.english,
        costPatternNameZh: costPricePatternNames.chinese,

        // ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        createdBy: "00000000-0000-0000-0000-000000000000",
        modifiedBy: "00000000-0000-0000-0000-000000000000"
        // ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      }
    });
  }

}
