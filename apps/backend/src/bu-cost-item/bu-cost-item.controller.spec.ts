import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { BuCostItemController } from './bu-cost-item.controller';
import { BuCostItemService } from './bu-cost-item.service';

describe('BuCostItemController', () => {
  let controller: BuCostItemController;
  let service: BuCostItemService;

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

  const mockBuCostItems = [
    {
      buCostItemId: 'item1',
      buCostCodeId: 'code1',
      costType: 'K',
      startDate: '202401',
      endDate: '202412',
      cur: 'JPY',
      invFlg: true,
      buCostCode: mockBuCostCode,
    },
    {
      buCostItemId: 'item2',
      buCostCodeId: 'code1',
      costType: 'R',
      startDate: '202401',
      endDate: '202412',
      cur: 'JPY',
      invFlg: false,
      buCostCode: mockBuCostCode,
    },
    {
      buCostItemId: 'item3',
      buCostCodeId: 'code1',
      costType: 'G',
      startDate: '202401',
      endDate: '202412',
      cur: 'JPY',
      invFlg: true,
      buCostCode: mockBuCostCode,
    },
    {
      buCostItemId: 'item4',
      buCostCodeId: 'code2',
      costType: 'K',
      startDate: '202401',
      endDate: '202412',
      cur: 'USD',
      invFlg: false,
      buCostCode: {
        ...mockBuCostCode,
        buCostCodeId: 'code2',
        ktnCd: 'KTN002',
        buCostCd: 'BC002',
      },
    },
    {
      buCostItemId: 'item5',
      buCostCodeId: 'code2',
      costType: 'R',
      startDate: '202401',
      endDate: '202412',
      cur: 'USD',
      invFlg: true,
      buCostCode: {
        ...mockBuCostCode,
        buCostCodeId: 'code2',
        ktnCd: 'KTN002',
        buCostCd: 'BC002',
      },
    },
    {
      buCostItemId: 'item6',
      buCostCodeId: 'code2',
      costType: 'G',
      startDate: '202401',
      endDate: '202412',
      cur: 'USD',
      invFlg: false,
      buCostCode: {
        ...mockBuCostCode,
        buCostCodeId: 'code2',
        ktnCd: 'KTN002',
        buCostCd: 'BC002',
      },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuCostItemController],
      providers: [
        {
          provide: BuCostItemService,
          useValue: {
            findByKtnCd: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BuCostItemController>(BuCostItemController);
    service = module.get<BuCostItemService>(BuCostItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return grouped business cost items successfully', async () => {
      const ktnCd = 'KTN001';
      vi.spyOn(service, 'findByKtnCd').mockResolvedValue(mockBuCostItems);

      const result = await controller.findAll(ktnCd);

      expect(service.findByKtnCd).toHaveBeenCalledWith(ktnCd);
      expect(result).toEqual({
        items: [
          {
            buCostItemId: 'item1',
            buCostCodeId: 'code1',
            startDate: '202401',
            endDate: '202412',
            cur: 'JPY',
            calcurateFlag: true,
            rateFlag: false,
            amountFlag: true,
          },
          {
            buCostItemId: 'item4',
            buCostCodeId: 'code2',
            startDate: '202401',
            endDate: '202412',
            cur: 'USD',
            calcurateFlag: false,
            rateFlag: true,
            amountFlag: false,
          },
        ],
      });
    });

    it('should handle empty result from service', async () => {
      const ktnCd = 'KTN001';
      vi.spyOn(service, 'findByKtnCd').mockResolvedValue([]);

      const result = await controller.findAll(ktnCd);

      expect(service.findByKtnCd).toHaveBeenCalledWith(ktnCd);
      expect(result).toEqual({ items: [] });
    });

    it('should handle single item result', async () => {
      const ktnCd = 'KTN001';
      const singleItem = [mockBuCostItems[0]];
      vi.spyOn(service, 'findByKtnCd').mockResolvedValue(singleItem);

      const result = await controller.findAll(ktnCd);

      expect(service.findByKtnCd).toHaveBeenCalledWith(ktnCd);
      expect(result).toEqual({
        items: [
          {
            buCostItemId: 'item1',
            buCostCodeId: 'code1',
            startDate: '202401',
            endDate: '202412',
            cur: 'JPY',
            calcurateFlag: true,
            rateFlag: false,
            amountFlag: false,
          },
        ],
      });
    });
  });

  describe('groupByBuCostCodeId', () => {
    it('should group items by buCostCodeId correctly', () => {
      const result = (controller as any).groupByBuCostCodeId(mockBuCostItems);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(3); // code1 has 3 items
      expect(result[1]).toHaveLength(3); // code2 has 3 items
      expect(result[0][0].buCostCodeId).toBe('code1');
      expect(result[1][0].buCostCodeId).toBe('code2');
    });

    it('should handle empty array', () => {
      const result = (controller as any).groupByBuCostCodeId([]);
      expect(result).toEqual([]);
    });

    it('should handle single item', () => {
      const singleItem = [mockBuCostItems[0]];
      const result = (controller as any).groupByBuCostCodeId(singleItem);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].buCostCodeId).toBe('code1');
    });
  });

  describe('parseBusinessCostItemToDto', () => {
    it('should parse items with all cost types correctly', () => {
      const items = mockBuCostItems.slice(0, 3); // code1 items
      const result = (controller as any).parseBusinessCostItemToDto(items);

      expect(result).toEqual({
        buCostItemId: 'item1',
        buCostCodeId: 'code1',
        startDate: '202401',
        endDate: '202412',
        cur: 'JPY',
        calcurateFlag: true,
        rateFlag: false,
        amountFlag: true,
      });
    });

    it('should parse items with missing cost types', () => {
      const items = [mockBuCostItems[0]]; // Only K type
      const result = (controller as any).parseBusinessCostItemToDto(items);

      expect(result).toEqual({
        buCostItemId: 'item1',
        buCostCodeId: 'code1',
        startDate: '202401',
        endDate: '202412',
        cur: 'JPY',
        calcurateFlag: true,
        rateFlag: false,
        amountFlag: false,
      });
    });

    it('should handle unknown cost type', () => {
      const itemsWithUnknownType = [
        {
          ...mockBuCostItems[0],
          costType: 'X', // Unknown type
        },
      ];
      const result = (controller as any).parseBusinessCostItemToDto(itemsWithUnknownType);

      expect(result).toEqual({
        buCostItemId: 'item1',
        buCostCodeId: 'code1',
        startDate: '202401',
        endDate: '202412',
        cur: 'JPY',
        calcurateFlag: false,
        rateFlag: false,
        amountFlag: false,
      });
    });

    it('should throw NotFoundException for empty items array', () => {
      expect(() => {
        (controller as any).parseBusinessCostItemToDto([]);
      }).toThrow(NotFoundException);
    });

    it('should use first item for common properties', () => {
      const items = [
        {
          ...mockBuCostItems[0],
          startDate: '202401',
          endDate: '202412',
        },
        {
          ...mockBuCostItems[1],
          startDate: '202402', // Different start date
          endDate: '202411', // Different end date
        },
      ];
      const result = (controller as any).parseBusinessCostItemToDto(items);

      expect(result.startDate).toBe('202401'); // Should use first item's startDate
      expect(result.endDate).toBe('202412'); // Should use first item's endDate
    });
  });
});
