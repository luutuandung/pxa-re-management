import { Injectable } from '@nestjs/common';
import { CalcType } from '@prisma/client';
import { ERROR_CODES } from '@pxa-re-management/shared';
import { BusinessException } from '../common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalcTypeDto } from './dto/create-calc-type.dto';
import { UpdateCalcTypeDto } from './dto/update-calc-type.dto';

@Injectable()
export class CalcTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async getCalcTypes(businessunitId: string): Promise<CalcType[]> {
    try {
      return this.prisma.calcType.findMany({
        where: {
          businessunitId,
          deleteFlg: false,
        },
      });
    } catch (error) {
      // TODO: 専用のエラーコードを追加
      throw new BusinessException('Failed to fetch calc types', ERROR_CODES.NOT_FOUND, error);
    }
  }

  async findAll(businessunitId?: string, includeDeleted = false): Promise<CalcType[]> {
    const where: any = {};

    if (businessunitId) {
      where.businessunitId = businessunitId;
    }

    if (!includeDeleted) {
      where.deleteFlg = false;
    }

    return this.prisma.calcType.findMany({
      where,
      orderBy: {
        createdOn: 'asc',
      },
    });
  }

  async findOne(calcTypeId: string): Promise<CalcType | null> {
    return this.prisma.calcType.findUnique({
      where: { calcTypeId },
    });
  }

  async create(createDto: CreateCalcTypeDto, userId: string): Promise<CalcType> {
    const { defaultFlg = false, ...data } = createDto;

    // デフォルトフラグがtrueの場合、同じ拠点の他の計算種類のデフォルトフラグをfalseにする
    if (defaultFlg) {
      await this.prisma.calcType.updateMany({
        where: {
          businessunitId: data.businessunitId,
          deleteFlg: false,
        },
        data: {
          defaultFlg: false,
          modifiedBy: userId,
          modifiedOn: new Date(),
        },
      });
    }

    return this.prisma.calcType.create({
      data: {
        ...data,
        defaultFlg,
        deleteFlg: false,
        createdBy: userId,
        modifiedBy: userId,
      },
    });
  }

  async update(calcTypeId: string, updateDto: UpdateCalcTypeDto, userId: string): Promise<CalcType> {
    const { defaultFlg, ...data } = updateDto;

    // デフォルトフラグがtrueの場合、同じ拠点の他の計算種類のデフォルトフラグをfalseにする
    if (defaultFlg) {
      const currentCalcType = await this.findOne(calcTypeId);
      if (currentCalcType) {
        await this.prisma.calcType.updateMany({
          where: {
            businessunitId: currentCalcType.businessunitId,
            calcTypeId: { not: calcTypeId },
            deleteFlg: false,
          },
          data: {
            defaultFlg: false,
            modifiedBy: userId,
            modifiedOn: new Date(),
          },
        });
      }
    }

    return this.prisma.calcType.update({
      where: { calcTypeId },
      data: {
        ...data,
        ...(defaultFlg !== undefined && { defaultFlg }),
        modifiedBy: userId,
        modifiedOn: new Date(),
      },
    });
  }

  async delete(calcTypeId: string, userId: string): Promise<CalcType> {
    return this.prisma.calcType.update({
      where: { calcTypeId },
      data: {
        deleteFlg: true,
        modifiedBy: userId,
        modifiedOn: new Date(),
      },
    });
  }

  async reactivate(calcTypeId: string, userId: string): Promise<CalcType> {
    return this.prisma.calcType.update({
      where: { calcTypeId },
      data: {
        deleteFlg: false,
        modifiedBy: userId,
        modifiedOn: new Date(),
      },
    });
  }
}
