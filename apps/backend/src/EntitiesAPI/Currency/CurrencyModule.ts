import CurrencyController from "./CurrencyController";
import CurrencyPrismaService from "./CurrencyPrismaService";
import { PrismaService } from "../../prisma/prisma.service";
import * as NestJS from "@nestjs/common";


@NestJS.Module({
  controllers: [ CurrencyController ],
  providers: [
    {
      /* 【 方法論 】 全インターフェースの名前は唯一なので、Symbolの利用に必要はない。 */
      provide: "CurrencyGateway",
      useClass: CurrencyPrismaService
    },
    PrismaService
  ],
  exports: [
    {
      /* 【 方法論 】 全インターフェースの名前は唯一なので、Symbolの利用に必要はない。 */
      provide: "CurrencyGateway",
      useClass: CurrencyPrismaService
    }
  ]
})
export default class CurrencyModule {}
