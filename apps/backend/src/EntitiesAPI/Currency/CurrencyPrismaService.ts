import type { CurrencyGateway } from "@pxa-re-management/shared";
import { PrismaService } from "../../prisma/prisma.service";
import * as  NestJS from "@nestjs/common";
import * as Prisma from "@prisma/client";


@NestJS.Injectable()
export default class CurrencyPrismaService implements CurrencyGateway {

  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async retrieveCodesOfAvailableOnes(): Promise<Array<string>> {
    return Array.from(
      new Set(
        (await this.prismaService.rateExchange.findMany({ select: { afterCurCd: true } })).map(
          ({ afterCurCd }: Pick<Prisma.RateExchange, "afterCurCd">): string => afterCurCd
        )
      )
    );
  }

}
