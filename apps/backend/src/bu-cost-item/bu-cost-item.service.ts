import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import {
  BusinessCostItemBulkSaveRequest,
  NewBusinessCostItemRequestData,
  UpdatedBusinessCostItemRequestData,
} from '@pxa-re-management/shared';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { BuCostItemWithCode } from './types/bu-cost-item-with-code.type';

@Injectable()
export class BuCostItemService {

  constructor(private readonly prisma: PrismaService) {}

  async findByBusinessUnitID(businessUnitID: string): Promise<BuCostItemWithCode[]> {
    return this.prisma.buCostItem.findMany({
      where: {
        buCostCode: {
          businessunitId: businessUnitID,
          deleteFlg: false,
        },
      },
      include: {
        buCostCode: true,
      },
    });
  }

  /* 【 日本語名 】 一個を作成 */
  async createOne(data: NewBusinessCostItemRequestData): Promise<void> {
    const userId = uuidv4();
    const buCostItemId = uuidv4();

    // 重複チェック
    const existing = await this.findByBuCostCodeIdAndCurrency(data.buCostCodeId, data.curCd);
    if (existing.length > 0) {
      throw new ConflictException('同じbuCostCodeIdと通貨の組み合わせが既に存在します');
    }

    // バリデーション
    this.validateBusinessCostItem(data);

    await this.prisma.buCostItem.create({
      data: {
        buCostItemId,
        buCostCodeId: data.buCostCodeId,
        startDate: data.startDate,
        endDate: data.endDate,
        curCd: data.curCd,
        amountValidFlg: data.amountValidFlg,
        rateValidFlg: data.rateValidFlg,
        calcValidFlg: data.calcValidFlg,
        autoCreateValidFlg: data.autoCreateValidFlg,
        createdBy: userId,
        modifiedBy: userId,
        businessunitId: data.buCostCodeId, // 実際の実装では適切な値を設定
      },
    });
  }

  /* 【 日本語名 】 一個を更新 */
  async updateOne(updatedBusinessCostItemRequestData: UpdatedBusinessCostItemRequestData): Promise<void> {
    const userId = uuidv4();

    const existing = await this.prisma.buCostItem.findUnique({
      where: { buCostItemId: updatedBusinessCostItemRequestData.buCostItemId },
    });

    if (!existing) {
      throw new BadRequestException(`buCostItemId ${ updatedBusinessCostItemRequestData.buCostItemId } が見つかりません`);
    }


    await this.prisma.buCostItem.update({
      where: { buCostItemId: updatedBusinessCostItemRequestData.buCostItemId },
      data: {
        startDate: updatedBusinessCostItemRequestData.startDate,
        endDate: updatedBusinessCostItemRequestData.endDate,
        curCd: updatedBusinessCostItemRequestData.curCd,
        amountValidFlg: updatedBusinessCostItemRequestData.amountValidFlg,
        rateValidFlg: updatedBusinessCostItemRequestData.rateValidFlg,
        calcValidFlg: updatedBusinessCostItemRequestData.calcValidFlg,
        autoCreateValidFlg: updatedBusinessCostItemRequestData.autoCreateValidFlg,
        modifiedBy: userId,
        modifiedOn: new Date()
      },
    });

  }

  /* 【 日本語名 】 複数を更新 */
  async updateMultiple(updatedItems: ReadonlyArray<UpdatedBusinessCostItemRequestData>): Promise<void> {
    await this.prisma.$transaction(
      async (): Promise<void> => {
        for (const updatedItem of updatedItems) {
          await this.updateOne(updatedItem);
        }
      }
    );
  }

  /* 【 日本語名 】 複数を追加・更新 */
  async createAndUpdateMultiple(data: BusinessCostItemBulkSaveRequest): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. 新規作成前の重複チェック
      if (data.newItems.length > 0) {
        const duplicateChecks = await Promise.all(
          data.newItems.map(async (item) => {
            const existing = await tx.buCostItem.findMany({
              where: {
                buCostCodeId: item.buCostCodeId,
                curCd: item.curCd,
              },
            });
            return {
              item,
              isDuplicate: existing.length > 0,
              existingCount: existing.length,
            };
          })
        );

        // 2. 重複がある場合はエラーを投げる
        const duplicates = duplicateChecks.filter((check) => check.isDuplicate);
        if (duplicates.length > 0) {
          const duplicateMessages = duplicates.map(
            (dup) => `buCostCodeId: ${dup.item.buCostCodeId}, 通貨: ${dup.item.curCd}`
          );
          throw new ConflictException(`重複するデータが見つかりました: ${duplicateMessages.join(', ')}`);
        }

        // 3. 新規作成アイテム内での重複チェック
        const newItemKeys = new Set<string>();
        for (const item of data.newItems) {
          const key = `${item.buCostCodeId}_${item.curCd}`;
          if (newItemKeys.has(key)) {
            throw new ConflictException(
              `アップロードデータ内で重複が検出されました: buCostCodeId: ${item.buCostCodeId}, 通貨: ${item.curCd}`
            );
          }
          newItemKeys.add(key);
        }

        // 4. 新規作成
        for (const newItem of data.newItems) {
          await this.createBusinessCostItemInTransaction(newItem, tx);
        }
      }

      // 5. 更新
      if (data.updates.length > 0) {
        await this.updateMultiple(data.updates);
      }
    });
  }

  // 重複チェック用
  async findByBuCostCodeIdAndCurrency(buCostCodeId: string, curCd: string): Promise<BuCostItemWithCode[]> {
    return this.prisma.buCostItem.findMany({
      where: {
        buCostCodeId,
        curCd,
      },
      include: {
        buCostCode: true,
      },
    });
  }

  // 個別のbuCostCodeIdで検索
  async findByBuCostCodeId(buCostCodeId: string): Promise<BuCostItemWithCode[]> {
    return this.prisma.buCostItem.findMany({
      where: { buCostCodeId },
      include: {
        buCostCode: true,
      },
    });
  }

  // バリデーション
  private validateBusinessCostItem(data: NewBusinessCostItemRequestData): void {
    if (!data.startDate || !data.endDate) {
      throw new BadRequestException('開始日と終了日は必須です');
    }

    if (data.startDate >= data.endDate) {
      throw new BadRequestException('開始日は終了日より前である必要があります');
    }

    if (!data.curCd) {
      throw new BadRequestException('通貨は必須です');
    }

    // 日付形式のバリデーション（YYYYMM形式）
    const dateRegex = /^\d{6}$/;
    if (!dateRegex.test(data.startDate) || !dateRegex.test(data.endDate)) {
      throw new BadRequestException('日付はYYYYMM形式で入力してください');
    }
  }

  // トランザクション内での作成処理
  private async createBusinessCostItemInTransaction(data: NewBusinessCostItemRequestData, tx: any): Promise<void> {
    const userId = uuidv4();
    const buCostItemId = uuidv4();

    // バリデーション
    this.validateBusinessCostItem(data);

    await tx.buCostItem.create({
      data: {
        buCostItemId,
        buCostCodeId: data.buCostCodeId,
        startDate: data.startDate,
        endDate: data.endDate,
        curCd: data.curCd,
        amountValidFlg: data.amountValidFlg,
        rateValidFlg: data.rateValidFlg,
        calcValidFlg: data.calcValidFlg,
        autoCreateValidFlg: data.autoCreateValidFlg,
        createdBy: userId,
        modifiedBy: userId,
        businessunitId: data.buCostCodeId, // 実際の実装では適切な値を設定
      },
    });
  }

  // ID生成（実際の実装では適切なID生成ロジックを使用）
  private generateBuCostItemId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
