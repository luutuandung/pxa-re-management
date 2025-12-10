import { Injectable } from '@nestjs/common';
import {
  BuCostCode,
  BuCostCodeCreateInput,
  BuCostCodeUpdateInput,
  BusinessCostSaveRequest,
  ERROR_CODES,
} from '@pxa-re-management/shared';
import { v4 as uuidv4 } from 'uuid';
import { BusinessException, NotFoundException, ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BusinessCostService {
  constructor(private readonly prisma: PrismaService) {}

  // 事業部原価項目一覧取得
  async getBusinessCostNames(businessUnitID: string): Promise<BuCostCode[]> {
    try {
      return await this.prisma.buCostCode.findMany({
        where: {
          businessunitId: businessUnitID,
        },
        include: {
          generalCostCode: true,
        },
        orderBy: {
          modifiedOn: 'desc',
        },
      });
    } catch (error) {
      throw new BusinessException('Failed to fetch business cost names', ERROR_CODES.BUSINESS_COST.FETCH_ERROR, error);
    }
  }

  // 事業部原価項目詳細取得
  async findOne(buCostCodeId: string): Promise<BuCostCode> {
    if (!buCostCodeId) {
      throw new ValidationException('Business cost code ID is required');
    }

    try {
      const buCostCode = await this.prisma.buCostCode.findUnique({
        where: { buCostCodeId },
        include: {
          generalCostCode: true,
        },
      });

      if (!buCostCode) {
        throw new NotFoundException(`Business cost with ID ${buCostCodeId} not found`);
      }

      return buCostCode;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BusinessException(
        `Failed to fetch business cost with ID ${buCostCodeId}`,
        ERROR_CODES.BUSINESS_COST.FETCH_ERROR,
        error
      );
    }
  }

  // 事業部原価項目作成
  async create(createData: BuCostCodeCreateInput, _userId: string): Promise<BuCostCode> {
    const {
      businessunitId,
      generalCostCd,
      buCostCd,
      buCostNameJa,
      buCostNameEn,
      buCostNameZh,
      deleteFlg = false,
    } = createData;
    const uid = uuidv4();
    const timestamp = new Date();
    // 重複チェック
    const existing = await this.prisma.buCostCode.findFirst({
      where: {
        businessunitId,
        buCostCd,
      },
    });

    if (existing) {
      throw new BusinessException(
        `Business cost code ${buCostCd} already exists for KTN ${businessunitId}`,
        'DUPLICATE_CODE',
        {
          businessunitId,
          buCostCd,
        }
      );
    }

    // GeneralCostCodeの存在確認（空文字の場合はスキップ）
    if (generalCostCd && generalCostCd.trim() !== '') {
      const generalCostCode = await this.prisma.generalCostCode.findFirst({
        where: { generalCostCd },
      });

      if (!generalCostCode) {
        throw new ValidationException(`General cost code ${generalCostCd} does not exist`);
      }
    }

    try {
      return await this.prisma.buCostCode.create({
        data: {
          businessunitId,
          generalCostCd: generalCostCd ?? '',
          buCostCd,
          buCostNameJa,
          buCostNameEn,
          buCostNameZh,
          deleteFlg,
          createdBy: uid,
          createdOn: timestamp,
          modifiedBy: uid,
          modifiedOn: timestamp,
        },
        include: {
          generalCostCode: true,
        },
      });
    } catch (error) {
      throw new BusinessException('Failed to create business cost', ERROR_CODES.BUSINESS_COST.CREATE_ERROR, error);
    }
  }

  // 事業部原価項目更新
  async update(buCostCodeId: string, updateData: BuCostCodeUpdateInput, _userId: string): Promise<BuCostCode> {
    const uid = uuidv4();
    const timestamp = new Date();

    if (!buCostCodeId) {
      throw new ValidationException('Business cost code ID is required');
    }

    // 存在チェック
    const existing = await this.prisma.buCostCode.findUnique({
      where: { buCostCodeId },
    });

    if (!existing) {
      throw new NotFoundException(`Business cost with ID ${buCostCodeId} not found`);
    }

    // buCostCdが変更される場合の重複チェック
    if (updateData.buCostCd && updateData.buCostCd !== existing.buCostCd) {
      const duplicate = await this.prisma.buCostCode.findFirst({
        where: {
          businessunitId: updateData.businessunitId || existing.businessunitId,
          buCostCd: updateData.buCostCd,
          buCostCodeId: { not: buCostCodeId },
        },
      });

      if (duplicate) {
        throw new BusinessException(`Business cost code ${updateData.buCostCd} already exists`, 'DUPLICATE_CODE', {
          buCostCd: updateData.buCostCd,
        });
      }
    }

    // GeneralCostCodeの存在確認（変更される場合、空文字の場合はスキップ）
    if (
      updateData.generalCostCd &&
      updateData.generalCostCd.trim() !== '' &&
      updateData.generalCostCd !== existing.generalCostCd
    ) {
      const generalCostCode = await this.prisma.generalCostCode.findFirst({
        where: { generalCostCd: updateData.generalCostCd },
      });

      if (!generalCostCode) {
        throw new ValidationException(`General cost code ${updateData.generalCostCd} does not exist`);
      }
    }

    try {
      const { generalCostCd: rawGeneralCostCd, buCostCodeId: _omitId, ...rest } = updateData as Record<string, unknown>;
      const data: Prisma.BuCostCodeUpdateInput = {
        ...(rest as Prisma.BuCostCodeUpdateInput),
        ...(rawGeneralCostCd !== undefined ? { generalCostCd: (rawGeneralCostCd as string | null) ?? '' } : {}),
        modifiedBy: uid,
        modifiedOn: timestamp,
      };

      return await this.prisma.buCostCode.update({
        where: { buCostCodeId },
        data,
        include: {
          generalCostCode: true,
        },
      });
    } catch (error) {
      throw new BusinessException(
        `Failed to update business cost with ID ${buCostCodeId}`,
        ERROR_CODES.BUSINESS_COST.UPDATE_ERROR,
        error
      );
    }
  }

  // 事業部原価項目削除（論理削除）
  async remove(buCostCodeId: string, _userId: string): Promise<BuCostCode> {
    const uid = uuidv4();
    const timestamp = new Date();
    if (!buCostCodeId) {
      throw new ValidationException('Business cost code ID is required');
    }

    // 存在チェック
    const existing = await this.prisma.buCostCode.findUnique({
      where: { buCostCodeId },
    });

    if (!existing) {
      throw new NotFoundException(`Business cost with ID ${buCostCodeId} not found`);
    }

    try {
      return await this.prisma.buCostCode.update({
        where: { buCostCodeId },
        data: {
          deleteFlg: true,
          modifiedBy: uid,
          modifiedOn: timestamp,
        },
        include: {
          generalCostCode: true,
        },
      });
    } catch (error) {
      throw new BusinessException(
        `Failed to delete business cost with ID ${buCostCodeId}`,
        ERROR_CODES.BUSINESS_COST.DELETE_ERROR,
        error
      );
    }
  }

  // 事業部原価項目有効化
  async reactivate(buCostCodeId: string, _userId: string): Promise<BuCostCode> {
    const uid = uuidv4();
    const timestamp = new Date();
    if (!buCostCodeId) {
      throw new ValidationException('Business cost code ID is required');
    }

    // 存在チェック
    const existing = await this.prisma.buCostCode.findUnique({
      where: { buCostCodeId },
    });

    if (!existing) {
      throw new NotFoundException(`Business cost with ID ${buCostCodeId} not found`);
    }

    try {
      return await this.prisma.buCostCode.update({
        where: { buCostCodeId },
        data: {
          deleteFlg: false,
          modifiedBy: uid,
          modifiedOn: timestamp,
        },
        include: {
          generalCostCode: true,
        },
      });
    } catch (error) {
      throw new BusinessException(
        `Failed to reactivate business cost with ID ${buCostCodeId}`,
        ERROR_CODES.BUSINESS_COST.UPDATE_ERROR,
        error
      );
    }
  }

  // 一括保存（新しいスキーマ構造に対応）
  async saveBusinessCostItems(request: BusinessCostSaveRequest, _userId: string): Promise<void> {
    if (!request.businessCostItems || request.businessCostItems.length === 0) {
      throw new ValidationException('Business cost items are required');
    }

    try {
      // トランザクション内で一括保存
      await this.prisma.$transaction(async (tx) => {
        for (const item of request.businessCostItems) {
          if (item.buCostCodeId) {
            /* 【 仕様書 】 「generalCostCd」の更新は禁止。「https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/16」参照。 */
            await tx.buCostCode.update({
              where: {
                buCostCodeId: item.buCostCodeId,
              },
              data: {
                businessunitId: item.businessunitId,
                buCostCd: item.buCostCd,
                buCostNameJa: item.buCostNameJa,
                buCostNameEn: item.buCostNameEn,
                buCostNameZh: item.buCostNameZh,
                deleteFlg: item.deleteFlg ?? false,
                modifiedBy: uuidv4(),
                modifiedOn: new Date(),
              },
            });
          } else {
            await tx.buCostCode.create({
              data: {
                businessunitId: item.businessunitId,
                generalCostCd: item.generalCostCd || '',
                buCostCd: item.buCostCd,
                buCostNameJa: item.buCostNameJa,
                buCostNameEn: item.buCostNameEn,
                buCostNameZh: item.buCostNameZh,
                deleteFlg: item.deleteFlg ?? false,
                createdBy: uuidv4(),
                modifiedBy: uuidv4(),
              },
            });
          }
        }
      });
    } catch (error) {
      throw new BusinessException('Failed to save business cost items', ERROR_CODES.BUSINESS_COST.CREATE_ERROR, error);
    }
  }
}
