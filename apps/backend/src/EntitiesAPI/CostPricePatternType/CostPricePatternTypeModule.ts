import CostPricePatternTypeController from "./CostPricePatternTypeController";
import CostPricePatternTypePrismaService from "./CostPricePatternTypePrismaService";
import { PrismaService } from "../../prisma/prisma.service";
import * as NestJS from "@nestjs/common";


@NestJS.Module({
  controllers: [ CostPricePatternTypeController ],
  providers: [
    {
      /* 【 方法論 】 全インターフェースの名前は唯一なので、Symbolの利用に必要はない。 */
      provide: "CostPricePatternTypeGateway",
      useClass: CostPricePatternTypePrismaService
    },
    PrismaService
  ]
})
export default class CostPricePatternTypeModule {}
