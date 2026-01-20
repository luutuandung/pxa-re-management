import { Injectable } from '@nestjs/common';
import {
  ERROR_CODES,
  GeneralCostCode,
  GeneralCostCodeCreateInput,
  GeneralCostCodeUpdateInput,
} from '@pxa-re-management/shared';
import { v4 as uuidv4 } from 'uuid';
import { BusinessException, NotFoundException, ValidationException } from '../common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class GeneralCostService {
  constructor(private readonly prisma: PrismaService) {}

  // 統一原価コード一覧取得（コードのみ）
  async findAllCostCode(): Promise<GeneralCostCode[]> {
    try {
      return await this.prisma.generalCostCode.findMany({
        orderBy: {
          modifiedOn: 'desc',
        },
      });
    } catch (error) {
      throw new BusinessException('Failed to fetch general cost codes', ERROR_CODES.GENERAL_COST.FETCH_ERROR, error);
    }
  }

  // 統一原価項目一覧取得
  async findAll(includeDeleted = false): Promise<GeneralCostCode[]> {
    try {
      const where = includeDeleted ? {} : { deleteFlg: false };

      return await this.prisma.generalCostCode.findMany({
        where,
        orderBy: {
          modifiedOn: 'desc',
        },
      });
    } catch (error) {
      throw new BusinessException('Failed to fetch general costs', ERROR_CODES.GENERAL_COST.FETCH_ERROR, error);
    }
  }

  // 統一原価項目詳細取得
  async findOne(generalCostCodeId: string): Promise<GeneralCostCode> {
    if (!generalCostCodeId) {
      throw new ValidationException('General cost code ID is required');
    }

    try {
      const generalCost = await this.prisma.generalCostCode.findUnique({
        where: { generalCostCodeId },
      });

      if (!generalCost) {
        throw new NotFoundException(`General cost with ID ${generalCostCodeId} not found`);
      }

      return generalCost;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BusinessException(
        `Failed to fetch general cost with ID ${generalCostCodeId}`,
        ERROR_CODES.GENERAL_COST.FETCH_ERROR,
        error
      );
    }
  }

  // 統一原価項目作成
  async create(createData: GeneralCostCodeCreateInput, _userId: string): Promise<GeneralCostCode> {
    const { generalCostCd, generalCostNameJa, generalCostNameEn, generalCostNameZh, deleteFlg = false } = createData;
    const uid = uuidv4();
    // 重複チェック
    const existing = await this.prisma.generalCostCode.findFirst({
      where: { generalCostCd },
    });

    if (existing) {
      throw new BusinessException(`General cost code ${generalCostCd} already exists`, 'DUPLICATE_CODE', {
        generalCostCd,
      });
    }

    try {
      const generalCostCode = await this.prisma.generalCostCode.create({
        data: {
          generalCostCd,
          generalCostNameJa,
          generalCostNameEn,
          generalCostNameZh,
          deleteFlg,
          createdBy: uid,
          modifiedBy: uid,
        },
      });

      const businessUnits = await this.prisma.businessUnit.findMany();
      const businessunitIds = businessUnits.map((item) => item.businessunitId);

      const startDate = `${(new Date()).getFullYear() - 1}04`; // 開始年月は1年前の4月とする

      await this.prisma.$transaction(async (transaction) => {
        for (const businessunitId of businessunitIds) {
          const data: Prisma.BuCostItemCreateInput = {
            startDate: startDate, 
            endDate: '', 
            curCd: 'JPY',
            amountValidFlg: false,
            rateValidFlg: false,
            calcValidFlg: false,
            autoCreateValidFlg: false,
// ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━
            createdBy: uid,
            modifiedBy: uid,
// ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            businessUnit: {
              connect: { businessunitId }, // PK（ユニーク）での接続
            },
            buCostCode: {
              create: {
                businessunitId,
                generalCostCd,
                buCostCd: generalCostCd,
                buCostNameJa: generalCostNameJa,
                buCostNameEn: generalCostNameEn,
                buCostNameZh: generalCostNameZh,
                deleteFlg: false,
// ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━
                createdBy: uid,
                modifiedBy: uid,
// ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              }
            }
          };

          await transaction.buCostItem.create({ data });
        }
      });
      return generalCostCode;
    } catch (error) {
      throw new BusinessException('Failed to create general cost', ERROR_CODES.GENERAL_COST.CREATE_ERROR, error);
    }
  }

  // 統一原価項目更新
  async update(
    generalCostCodeId: string,
    updateData: GeneralCostCodeUpdateInput,
    _userId: string
  ): Promise<GeneralCostCode> {
    if (!generalCostCodeId) {
      throw new ValidationException('General cost code ID is required');
    }

    // 存在チェック
    const existing = await this.prisma.generalCostCode.findUnique({
      where: { generalCostCodeId },
    });

    if (!existing) {
      throw new NotFoundException(`General cost with ID ${generalCostCodeId} not found`);
    }

    // generalCostCdが変更される場合の重複チェック
    if (updateData.generalCostCd && updateData.generalCostCd !== existing.generalCostCd) {
      const duplicate = await this.prisma.generalCostCode.findFirst({
        where: {
          generalCostCd: updateData.generalCostCd,
          generalCostCodeId: { not: generalCostCodeId },
        },
      });

      if (duplicate) {
        throw new BusinessException(`General cost code ${updateData.generalCostCd} already exists`, 'DUPLICATE_CODE', {
          generalCostCd: updateData.generalCostCd,
        });
      }
    }

    const modifier = uuidv4();
    const modifiedOn = new Date();

    /* 【 仕様書 】 `buCostCodes`の更新は不要。 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/14 */
    try {
      return await this.prisma.generalCostCode.update({
        where: { generalCostCodeId },
        data: {
          ...updateData,
          modifiedBy: modifier,
          modifiedOn: modifiedOn,
        },
      });
    } catch (error) {
      throw new BusinessException(
        `Failed to update general cost with ID ${generalCostCodeId}`,
        ERROR_CODES.GENERAL_COST.UPDATE_ERROR,
        error
      );
    }
  }

  // 統一原価項目削除（論理削除）
  async remove(generalCostCodeId: string, _userId: string): Promise<GeneralCostCode> {
    const modifier = uuidv4();
    const modifiedOn = new Date();
    if (!generalCostCodeId) {
      throw new ValidationException('General cost code ID is required');
    }

    // 存在チェック
    const existing = await this.prisma.generalCostCode.findUnique({
      where: { generalCostCodeId },
    });

    if (!existing) {
      throw new NotFoundException(`General cost with ID ${generalCostCodeId} not found`);
    }

    try {
      return await this.prisma.generalCostCode.update({
        where: { generalCostCodeId },
        data: {
          deleteFlg: true,
          modifiedBy: modifier,
          modifiedOn: modifiedOn,
          buCostCodes: {
            updateMany: {
              where: {
                generalCostCd: existing.generalCostCd,
              },
              data: {
                deleteFlg: true,
                modifiedBy: modifier,
                modifiedOn: modifiedOn,
              },
            },
          },
        },
      });
    } catch (error) {
      throw new BusinessException(
        `Failed to delete general cost with ID ${generalCostCodeId}`,
        ERROR_CODES.GENERAL_COST.DELETE_ERROR,
        error
      );
    }
  }

  // 統一原価項目有効化
  async reactivate(generalCostCodeId: string, _userId: string): Promise<GeneralCostCode> {
    const modifier = uuidv4();
    const modifiedOn = new Date();
    if (!generalCostCodeId) {
      throw new ValidationException('General cost code ID is required');
    }

    // 存在チェック
    const existing = await this.prisma.generalCostCode.findUnique({
      where: { generalCostCodeId },
    });

    if (!existing) {
      throw new NotFoundException(`General cost with ID ${generalCostCodeId} not found`);
    }

    try {
      return await this.prisma.generalCostCode.update({
        where: { generalCostCodeId },
        data: {
          deleteFlg: false,
          modifiedBy: modifier,
          modifiedOn: modifiedOn,
          buCostCodes: {
            updateMany: {
              where: {
                generalCostCd: existing.generalCostCd,
              },
              data: {
                deleteFlg: false,
                modifiedBy: modifier,
                modifiedOn: modifiedOn,
              },
            },
          },
        },
      });
    } catch (error) {
      throw new BusinessException(
        `Failed to reactivate general cost with ID ${generalCostCodeId}`,
        ERROR_CODES.GENERAL_COST.UPDATE_ERROR,
        error
      );
    }
  }

  // 一括作成
  async bulkCreate(createDataList: GeneralCostCodeCreateInput[], _userId: string): Promise<GeneralCostCode[]> {
    if (!createDataList || createDataList.length === 0) {
      throw new ValidationException('Create data list is required and cannot be empty');
    }

    // 重複チェック（リクエスト内での重複）
    const codes = createDataList.map((item) => item.generalCostCd);
    const duplicatesInRequest = codes.filter((code, index) => codes.indexOf(code) !== index);
    if (duplicatesInRequest.length > 0) {
      throw new BusinessException(`Duplicate codes in request: ${duplicatesInRequest.join(', ')}`, 'DUPLICATE_CODE');
    }

    // 既存データとの重複チェック
    const existingCodes = await this.prisma.generalCostCode.findMany({
      where: {
        generalCostCd: { in: codes },
      },
      select: { generalCostCd: true },
    });

    if (existingCodes.length > 0) {
      const duplicateCodes = existingCodes.map((item) => item.generalCostCd);
      throw new BusinessException(`General cost codes already exist: ${duplicateCodes.join(', ')}`, 'DUPLICATE_CODE');
    }

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const results: GeneralCostCode[] = [];

        // 全事業部データを取得（一度だけ）
        const businessUnits = await transaction.businessUnit.findMany();
        const businessUnitsIDs = businessUnits.map((item) => item.businessunitId);

        if (businessUnitsIDs.length === 0) {
          throw new BusinessException('No business units found', ERROR_CODES.GENERAL_COST.CREATE_ERROR);
        }

        // 1. まず全てのGeneralCostCodeを作成
        for (const createData of createDataList) {
          const uid = uuidv4();

          const result = await transaction.generalCostCode.create({
            data: {
              generalCostCd: createData.generalCostCd,
              generalCostNameJa: createData.generalCostNameJa,
              generalCostNameEn: createData.generalCostNameEn,
              generalCostNameZh: createData.generalCostNameZh,
              deleteFlg: createData.deleteFlg ?? false,
// ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━
              createdBy: uid,
              createdOn: new Date(),
              modifiedBy: uid,
// ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              modifiedOn: new Date(),
            },
          });

          results.push(result);
        }

        const startDate = `${(new Date()).getFullYear() - 1}04`; // 開始年月は1年前の4月とする

        // 2. 全てのGeneralCostCodeが作成された後、BuCostCodeを作成
        for (const createData of createDataList) {
          const uid = uuidv4();

          for (const businessunitId of businessUnitsIDs) {
            const data: Prisma.BuCostItemCreateInput = {
              startDate: startDate, 
              endDate: '', 
              curCd: 'JPY',
              amountValidFlg: false,
              rateValidFlg: false,
              calcValidFlg: false,
              autoCreateValidFlg: false,
// ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━
              createdBy: uid,
              modifiedBy: uid,
// ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              businessUnit: {
                connect: { businessunitId }, // PK（ユニーク）での接続
              },
              buCostCode: {
                create: {
                  businessunitId: businessunitId,
                  generalCostCd: createData.generalCostCd,
                  buCostCd: createData.generalCostCd,
                  buCostNameJa: createData.generalCostNameJa,
                  buCostNameEn: createData.generalCostNameEn,
                  buCostNameZh: createData.generalCostNameZh,
                  deleteFlg: false,
// ━━━ TODO < 対応予定 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/44/ ━━━
                  createdBy: uid,
                  modifiedBy: uid,
// ━━━ TODO > ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                }
              }
            };

            await transaction.buCostItem.create({ data });
          }
        }

        return results;
      }, {
        timeout: 20000, // 20秒に延長
      });
    } catch (error) {
      throw new BusinessException('Failed to bulk create general costs', ERROR_CODES.GENERAL_COST.CREATE_ERROR, error);
    }
  }
}
