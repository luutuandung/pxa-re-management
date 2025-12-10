import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuCostItemModule } from './bu-cost-item/bu-cost-item.module';
import { BusinessCostModule } from './business-cost/business-cost.module';
import { BusinessUnitModule } from './business-unit/business-unit.module';
import { CalcDisplayModule } from './calc-display/calc-display.module';
import { CalcTypeModule } from './calc-type/calc-type.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
// import { LanguageModule } from './language/language.module';
import { CostVersionModule } from './cost-version/cost-version.module';
import { GeneralCostModule } from './general-cost/general-cost.module';
import { PrismaService } from './prisma/prisma.service';
import { CostScenarioModule } from './cost-scenario/cost-scenario.module';
import { CostPatternModule } from './cost-pattern/cost-pattern.module';
import { CostRegisterModule } from './cost-register/cost-register.module';

@Module({
  imports: [
    GeneralCostModule,
    BusinessCostModule,
    BusinessUnitModule,
    BuCostItemModule,
    CostScenarioModule,
    CalcTypeModule,
    CalcDisplayModule,
    CostVersionModule,
    CostPatternModule,
    CostRegisterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
