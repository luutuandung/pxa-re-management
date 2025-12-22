import BusinessUnitController from "./BusinessUnitController";
import BusinessUnitPrismaService from "./BusinessUnitPrismaService";
import { PrismaService } from "../../prisma/prisma.service";
import * as NestJS from "@nestjs/common";


@NestJS.Module({
  controllers: [ BusinessUnitController ],
  providers: [
    {
      /* 【 方法論 】 全インターフェースの名前は唯一なので、Symbolの利用に必要はない。 */
      provide: "BusinessUnitGateway",
      useClass: BusinessUnitPrismaService
    },
    PrismaService
  ]
})
export default class BusinessUnitModule {}
