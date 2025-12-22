/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { CostPricesVersionsDropDownListBFF } from "@pxa-re-management/shared";

/* ┅┅┅ Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as Prisma from "@prisma/client";

/* ┅┅┅ Services ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { PrismaService } from "../../../prisma/prisma.service";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";


@NestJS.Injectable()
export default class CostPricesVersionsDropDownListPrismaService implements CostPricesVersionsDropDownListBFF {

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async retrieveItems(
    { businessUnitID }: CostPricesVersionsDropDownListBFF.ItemsRetrieving.RequestParameters
  ): Promise<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData> {
    return (
      await this.prismaService.costVersion.findMany({
        where: { businessunitId: businessUnitID },
        select: {
          costVersionId: true,
          costVersionName: true
        },
        orderBy: { costVersionName: "asc" }
      })
    ).map(
      (
        prismaCostPriceVersion: Pick<Prisma.CostVersion, "costVersionId" | "costVersionName">
      ): CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData.Item =>
          ({
            costPriceVersionID: prismaCostPriceVersion.costVersionId,
            costPriceVersionName: prismaCostPriceVersion.costVersionName
          })
    );
  }

}
