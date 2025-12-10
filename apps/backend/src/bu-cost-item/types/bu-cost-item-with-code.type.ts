import { BuCostCode, BuCostItem } from '@prisma/client';

export type BuCostItemWithCode = BuCostItem & {
  buCostCode: BuCostCode;
};
