import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BuCostItemController } from './bu-cost-item.controller';
import { BuCostItemService } from './bu-cost-item.service';

@Module({
  controllers: [BuCostItemController],
  providers: [BuCostItemService, PrismaService],
})
export class BuCostItemModule {}
