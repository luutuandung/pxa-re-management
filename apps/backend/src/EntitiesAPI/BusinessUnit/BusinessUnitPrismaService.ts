import type { BusinessUnit, BusinessUnitGateway } from "@pxa-re-management/shared";
import { PrismaService } from "../../prisma/prisma.service";
import * as  NestJS from "@nestjs/common";
import * as Prisma from "@prisma/client";


@NestJS.Injectable()
export default class BusinessUnitPrismaService implements BusinessUnitGateway {

  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async retrieveAll(): Promise<Array<BusinessUnit>> {
    return (
      await this.prismaService.businessUnit.findMany({
        orderBy: { buCd: "asc" }
      })
    ).map(
      (prismaBusinessUnit: Prisma.BusinessUnit): BusinessUnit =>
          ({
            businessunitId: prismaBusinessUnit.businessunitId,
            buCd: prismaBusinessUnit.buCd,
            name: prismaBusinessUnit.name,
            baseCurrencyName: prismaBusinessUnit.baseCurrencyName,
            businessunitNameJa: prismaBusinessUnit.businessunitNameJa,
            productNameJa: prismaBusinessUnit.productNameJa,
            businessunitNameEn: prismaBusinessUnit.businessunitNameEn,
            productNameEn: prismaBusinessUnit.productNameEn,
            businessunitNameZh: prismaBusinessUnit.businessunitNameZh,
            productNameZh: prismaBusinessUnit.productNameZh,
            createdBy: prismaBusinessUnit.createdBy,
            createdOn: prismaBusinessUnit.createdOn.toISOString(),
            modifiedBy: prismaBusinessUnit.modifiedBy,
            modifiedOn: prismaBusinessUnit.modifiedOn.toISOString()
          })
    );
  }

}
