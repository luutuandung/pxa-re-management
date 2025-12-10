import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service';
import { GeneralCostService } from './general-cost.service';

describe('GeneralCostService', () => {
  let service: GeneralCostService;

  const mockPrismaService = {
    generalCostCode: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneralCostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GeneralCostService>(GeneralCostService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findAllCostCode', async () => {
    const mockResult = [{ generalCostCodeId: '1', generalCostCd: 'A001', deleteFlg: false }];
    mockPrismaService.generalCostCode.findMany.mockResolvedValue(mockResult);

    const result = await service.findAllCostCode();

    expect(result).toBe(mockResult);
    expect(mockPrismaService.generalCostCode.findMany).toHaveBeenCalledTimes(1);
  });
});
