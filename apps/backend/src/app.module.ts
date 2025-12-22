import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { BuCostItemModule } from './bu-cost-item/bu-cost-item.module';
import { BusinessCostModule } from './business-cost/business-cost.module';
import { CalcDisplayModule } from './calc-display/calc-display.module';
import { CalcTypeModule } from './calc-type/calc-type.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
// import { LanguageModule } from './language/language.module';
import { CostVersionModule } from './cost-version/cost-version.module';
import { GeneralCostModule } from './general-cost/general-cost.module';
import { PrismaService } from './prisma/prisma.service';
import { CostScenarioModule } from './cost-scenario/cost-scenario.module';
import { UserModule } from './user/user.module';

/* ━━━ Entities API ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import BusinessUnitModule from './EntitiesAPI/BusinessUnit/BusinessUnitModule';
import CostPricePatternTypeModule from "./EntitiesAPI/CostPricePatternType/CostPricePatternTypeModule";

/* ━━━ BFF ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Pages ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CostPricePatternsManagementPageModule from
    "./BFF/Pages/CostPricePatternsManagement/CostPricePatternsManagementPageModule";
import CostPriceRegistrationPageModule from "./BFF/Pages/CostPriceRegistration/CostPriceRegistrationPageModule";

/* ┅┅┅ Components ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CostPricesVersionsDropDownListModule from
    "./BFF/Components/CostPricesVersionsDropDownList/CostPricesVersionsDropDownListModule";


@Module({
  imports: [
    GeneralCostModule,
    BusinessCostModule,
    BusinessUnitModule,
    BuCostItemModule,
    CostScenarioModule,
    CalcTypeModule,
    CostPricePatternTypeModule,
    CalcDisplayModule,
    CostVersionModule,
    CostPricePatternsManagementPageModule,
    CostPriceRegistrationPageModule,
    CostPricesVersionsDropDownListModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // 全モジュールで利用可能にする
      envFilePath: '.env', // デフォルトは .env
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
