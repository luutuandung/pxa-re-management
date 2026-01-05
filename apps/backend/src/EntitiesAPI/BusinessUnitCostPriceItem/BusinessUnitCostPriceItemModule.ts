import BusinessUnitCostPriceItemController from "./BusinessUnitCostPriceItemController";
import BusinessUnitCostPriceItemPrismaService from "./BusinessUnitCostPriceItemPrismaService";
import CurrencyPrismaService from "../Currency/CurrencyPrismaService";
import CurrencyModule from "../Currency/CurrencyModule";
import { PrismaService } from "../../prisma/prisma.service";
import * as NestJS from "@nestjs/common";


@NestJS.Module({
  controllers: [ BusinessUnitCostPriceItemController ],
  providers: [
    {
      /* 【 方法論 】 全インターフェースの名前は唯一なので、Symbolの利用に必要はない。 */
      provide: "BusinessUnitCostPriceItemGateway",
      useClass: BusinessUnitCostPriceItemPrismaService
    },
     {
      provide: "CurrencyGateway",
      useClass: CurrencyPrismaService
    },
    PrismaService
  ],
  imports: [ CurrencyModule ]
})
export default class BusinessUnitCostPriceItemModule {}
