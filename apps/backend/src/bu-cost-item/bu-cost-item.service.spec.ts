import { Test, TestingModule } from '@nestjs/testing';
import { BuCostItem } from '@prisma/client';
import { vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service';
import { BuCostItemService } from './bu-cost-item.service';

describe('BuCostItemService', () => {
  let service: BuCostItemService;
  let prismaService: PrismaService;

  const mockBuCostItems: BuCostItem[] = [
    {
      buCostItemId: 'item1',
      buCostCodeId: 'code1',
      costType: 'K',
      startDate: '202401',
      endDate: '202412',
      cur: 'JPY',
      invFlg: true,
    },
    {
      buCostItemId: 'item2',
      buCostCodeId: 'code1',
      costType: 'R',
      startDate: '202401',
      endDate: '202412',
      cur: 'JPY',
      invFlg: false,
    },
  ];

  const mockBuCostCode = {
    buCostCodeId: 'code1',
    ktnCd: 'KTN001',
    generalCostCd: 'GC001',
    buCostCd: 'BC001',
    buCostNameJa: 'テスト原価項目',
    buCostNameEn: 'Test Cost Item',
    buCostNameZh: '测试成本项目',
    deleteFlg: false,
    createdBy: 'user1',
    createdOn: new Date('2024-01-01'),
    modifiedBy: 'user1',
    modifiedOn: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuCostItemService,
        {
          provide: PrismaService,
          useValue: {
            buCostItem: {
              findMany: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BuCostItemService>(BuCostItemService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByKtnCd', () => {
    it('should return business cost items for given KTN code', async () => {
      const ktnCd = 'KTN001';
      const expectedResult = mockBuCostItems.map((item) => ({
        ...item,
        buCostCode: mockBuCostCode,
      }));

      vi.spyOn(prismaService.buCostItem, 'findMany').mockResolvedValue(expectedResult);

      const result = await service.findByKtnCd(ktnCd);

      expect(prismaService.buCostItem.findMany).toHaveBeenCalledWith({
        where: {
          buCostCode: {
            ktnCd,
            deleteFlg: false,
          },
        },
        include: {
          buCostCode: true,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no items found', async () => {
      const ktnCd = 'KTN999';
      vi.spyOn(prismaService.buCostItem, 'findMany').mockResolvedValue([]);

      const result = await service.findByKtnCd(ktnCd);

      expect(prismaService.buCostItem.findMany).toHaveBeenCalledWith({
        where: {
          buCostCode: {
            ktnCd,
            deleteFlg: false,
          },
        },
        include: {
          buCostCode: true,
        },
      });
      expect(result).toEqual([]);
    });

    it('should filter by deleteFlg false', async () => {
      const ktnCd = 'KTN001';
      vi.spyOn(prismaService.buCostItem, 'findMany').mockResolvedValue([]);

      await service.findByKtnCd(ktnCd);

      expect(prismaService.buCostItem.findMany).toHaveBeenCalledWith({
        where: {
          buCostCode: {
            ktnCd,
            deleteFlg: false,
          },
        },
        include: {
          buCostCode: true,
        },
      });
    });

    it('should include buCostCode relation', async () => {
      const ktnCd = 'KTN001';
      vi.spyOn(prismaService.buCostItem, 'findMany').mockResolvedValue([]);

      await service.findByKtnCd(ktnCd);

      expect(prismaService.buCostItem.findMany).toHaveBeenCalledWith({
        where: {
          buCostCode: {
            ktnCd,
            deleteFlg: false,
          },
        },
        include: {
          buCostCode: true,
        },
      });
    });
  });
});
