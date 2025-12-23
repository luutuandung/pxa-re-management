import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CostPriceVersion, ERROR_CODES } from '@pxa-re-management/shared';
import { BusinessException, NotFoundException, ValidationException } from '../common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCostVersionDto } from './dto/create-cost-version.dto';
import { DuplicateCostVersionDto } from './dto/duplicate-cost-version.dto';
import { UpdateCostVersionDto } from './dto/update-cost-version.dto';

@Injectable()
export class CostVersionService {
  constructor(private readonly prisma: PrismaService) {}

  // 原価登録レコードの存在チェック
  private async hasCostRegisters(costVersionId: string): Promise<boolean> {
    const count = await this.prisma.costRegister.count({
      where: { costVersionId },
    });
    return count > 0;
  }

  // CostPriceVersionにhasCostRegistersを追加
  private async enrichWithCostRegisters(costVersion: CostPriceVersion): Promise<CostPriceVersion> {
    const hasRegisters = await this.hasCostRegisters(costVersion.costVersionId);
    return {
      ...costVersion,
      hasCostRegisters: hasRegisters,
    };
  }

  async findAll(): Promise<CostPriceVersion[]> {
    try {
      const costVersions = await this.prisma.costVersion.findMany({
        orderBy: [
          { businessUnit: { buCd: 'asc' } },
          { costVersionId: 'asc' },
        ],
      });
      // 各原価バージョンにhasCostRegistersを追加
      return Promise.all(costVersions.map((cv) => this.enrichWithCostRegisters(cv)));
    } catch (error) {
      throw new BusinessException('Failed to fetch cost versions', ERROR_CODES.COST_VERSION.FETCH_ERROR, error);
    }
  }

  async findAllByKtn(ktnCd: string): Promise<CostPriceVersion[]> {
    if (!ktnCd) {
      throw new ValidationException('KTN code is required');
    }

    try {
      const costVersions = await this.prisma.costVersion.findMany({
        where: {
          businessUnit: {
            buCd: ktnCd,
          }
        },
        orderBy: {
          costVersionId: 'asc',
        },
      });
      // 各原価バージョンにhasCostRegistersを追加
      return Promise.all(costVersions.map((cv) => this.enrichWithCostRegisters(cv)));
    } catch (error) {
      throw new BusinessException(
        `Failed to fetch cost versions for KTN ${ktnCd}`,
        ERROR_CODES.COST_VERSION.FETCH_ERROR,
        error
      );
    }
  }

  async findOne(costVersionId: string): Promise<CostPriceVersion> {
    if (!costVersionId) {
      throw new ValidationException('Cost version ID is required');
    }

    try {
      const costVersion = await this.prisma.costVersion.findUnique({
        where: { costVersionId },
      });

      if (!costVersion) {
        throw new NotFoundException('CostVersion', costVersionId);
      }

      // hasCostRegistersを追加
      return this.enrichWithCostRegisters(costVersion);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BusinessException(
        `Failed to fetch cost version with ID ${costVersionId}`,
        ERROR_CODES.COST_VERSION.FETCH_ERROR,
        error
      );
    }
  }

  async create(createCostVersionDto: CreateCostVersionDto): Promise<CostPriceVersion> {
    const { businessunitId, ...rest } = createCostVersionDto as any;
    const { defaultFlg: _ignoredDefaultFlg, ...restSansDefault } = rest;

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // デフォルトフラグの処理
        // if (defaultFlg) {
        //   await prisma.costVersion.updateMany({
        //     where: {
        //       ktnCd,
        //       deleteFlg: false,
        //     },
        //     data: {
        //       defaultFlg: false,
        //     },
        //   });
        // }

        // 新規作成 - costVersionIdはPrismaが自動生成
        const data: any = {
          ...restSansDefault,
          businessunitId,
          createdOn: new Date(),
          createdBy: '00000000-0000-0000-0000-000000000000',
          modifiedOn: new Date(),
          modifiedBy: '00000000-0000-0000-0000-000000000000',
        };

        const costVersion = await prisma.costVersion.create({
          data,
        });

        return costVersion;
      });
    } catch (error) {
      throw new BusinessException('Failed to create cost version', ERROR_CODES.COST_VERSION.CREATE_ERROR, error);
    }
  }

  async update(costVersionId: string, updateCostVersionDto: UpdateCostVersionDto): Promise<CostPriceVersion> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // 存在チェック
        const existingVersion = await prisma.costVersion.findUnique({
          where: { costVersionId },
        });

        if (!existingVersion) {
          throw new NotFoundException('CostVersion', costVersionId);
        }

        // 原価登録レコードの存在チェック
        const hasRegisters = await this.hasCostRegisters(costVersionId);

        // 更新 - Prisma用の有効なフィールドのみを含める
        const { ktnCd, defaultFlg, ...rest } = updateCostVersionDto as any;
        
        // 原価登録レコードが存在する場合、適用開始・終了は編集不可
        if (hasRegisters && (rest.startDate !== undefined || rest.endDate !== undefined)) {
          throw new ValidationException(
            '原価登録レコードが存在するため、適用開始・終了年月は編集できません'
          );
        }
        
        const updateData: any = {};
        if (rest.costVersionName !== undefined) updateData.costVersionName = rest.costVersionName;
        if (rest.startDate !== undefined) updateData.startDate = rest.startDate;
        if (rest.endDate !== undefined) updateData.endDate = rest.endDate;
        if (rest.description !== undefined) updateData.description = rest.description;
        
        updateData.modifiedBy = '00000000-0000-0000-0000-000000000000';
        updateData.modifiedOn = new Date();

        const updatedVersion = await prisma.costVersion.update({
          where: { costVersionId },
          data: updateData,
        });

        // hasCostRegistersを追加
        return this.enrichWithCostRegisters(updatedVersion);
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ValidationException) {
        throw error;
      }
      throw new BusinessException(
        `Failed to update cost version with ID ${costVersionId}`,
        ERROR_CODES.COST_VERSION.UPDATE_ERROR,
        error
      );
    }
  }

  async remove(costVersionId: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        // 存在チェック
        const existingVersion = await prisma.costVersion.findUnique({
          where: { costVersionId },
        });

        if (!existingVersion) {
          throw new NotFoundException('CostVersion', costVersionId);
        }

        // 論理削除
        await prisma.costVersion.update({
          where: { costVersionId },
          data: { modifiedBy: '00000000-0000-0000-0000-000000000000', modifiedOn: new Date() },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BusinessException(
        `Failed to delete cost version with ID ${costVersionId}`,
        ERROR_CODES.COST_VERSION.DELETE_ERROR,
        error
      );
    }
  }

  async duplicate(duplicateCostVersionDto: DuplicateCostVersionDto): Promise<CostPriceVersion> {
    const { sourceCostVersionId, newCostVersionId, newCostVersionName, ktnCd } = duplicateCostVersionDto;
    const isUuid = (v?: string) => typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);

    try {
      return await this.prisma.$transaction(async (prisma) => {
        // ソースの存在チェック
        const sourceVersion = await prisma.costVersion.findUnique({
          where: { costVersionId: sourceCostVersionId },
        });

        if (!sourceVersion) {
          throw new NotFoundException('Source CostVersion', sourceCostVersionId);
        }

        // 新IDの重複チェック
        const targetId = isUuid(newCostVersionId) ? newCostVersionId : randomUUID();
        const existing = await prisma.costVersion.findUnique({
          where: { costVersionId: targetId },
        });

        if (existing) {
          throw new BusinessException(
            `Cost version with ID ${newCostVersionId} already exists`,
            ERROR_CODES.COST_VERSION.DUPLICATE_ID,
            { costVersionId: newCostVersionId }
          );
        }

        // 複製して新規作成
        const newVersion = await prisma.costVersion.create({
          data: {
            costVersionId: targetId,
            businessunitId: ktnCd,
            costVersionName: newCostVersionName,
            startDate: sourceVersion.startDate,
            endDate: sourceVersion.endDate,
            description: sourceVersion.description,
            createdOn: new Date(),
            createdBy: '00000000-0000-0000-0000-000000000000',
            modifiedOn: new Date(),
            modifiedBy: '00000000-0000-0000-0000-000000000000',
          },
        });

        return newVersion;
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BusinessException) {
        throw error;
      }
      throw new BusinessException('Failed to duplicate cost version', ERROR_CODES.COST_VERSION.DUPLICATE_ERROR, error);
    }
  }

  async updateDefaultFlag(costVersionId: string, defaultFlg: boolean): Promise<CostPriceVersion> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // 存在チェック
        const existingVersion = await prisma.costVersion.findUnique({
          where: { costVersionId },
        });

        if (!existingVersion) {
          throw new NotFoundException('CostVersion', costVersionId);
        }

        // デフォルトフラグの処理
        if (defaultFlg) {
          await prisma.costVersion.updateMany({
            where: {
              businessunitId: existingVersion.businessunitId,
              NOT: {
                costVersionId,
              },
            },
            data: {
              modifiedBy: '00000000-0000-0000-0000-000000000000',
              modifiedOn: new Date(),
            },
          });
        }

        // 更新
        const updatedVersion = await prisma.costVersion.update({
          where: { costVersionId },
          data: { modifiedBy: '00000000-0000-0000-0000-000000000000', modifiedOn: new Date() },
        });

        return updatedVersion;
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BusinessException(
        `Failed to update default flag for cost version ${costVersionId}`,
        ERROR_CODES.COST_VERSION.DEFAULT_UPDATE_ERROR,
        error
      );
    }
  }
}
