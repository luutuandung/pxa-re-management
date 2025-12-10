import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CostScenarioService } from './cost-scenario.service';

describe('CostScenarioService', () => {
  let service: CostScenarioService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const prismaMock: Partial<jest.Mocked<PrismaService>> = {
      businessUnit: {
        findMany: jest.fn(),
      } as any,
      costVersion: {
        findMany: jest.fn(),
      } as any,
      rateExchange: {
        findMany: jest.fn(),
      } as any,
      aggConcat: {
        findMany: jest.fn(),
      } as any,
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CostScenarioService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CostScenarioService>(CostScenarioService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOptions', () => {
    it('returns axisOptions, costVersions, rateTypes (distinct), others empty', async () => {
      prisma.businessUnit.findMany.mockResolvedValueOnce([
        {
          businessunitId: 'id-1',
          ktnCd: 'BU001',
          name: 'N/A',
          baseCurrencyName: 'JPY',
          businessunitNameJa: '営業一部',
          productNameJa: '製品A',
          businessunitNameEn: 'Sales 1',
          productNameEn: 'Prod A',
          businessunitNameZh: '营业一部',
          productNameZh: '产品A',
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
      ] as any);
      prisma.costVersion.findMany.mockResolvedValueOnce([
        {
          costVersionId: 'cv1',
          ktnCd: 'KTN',
          costVersionName: '原価v1',
          startDate: '202401',
          endDate: '202412',
          description: '',
          registerDate: '202401',
          defaultFlg: false,
          deleteFlg: false,
        },
      ] as any);
      prisma.rateExchange.findMany.mockResolvedValueOnce([
        {
          rateExchangeId: 'r1',
          beforeCurCd: 'JPY',
          afterCurCd: 'USD',
          startDate: '202401',
          rate: 0.0091,
          rateType: 1,
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
        {
          rateExchangeId: 'r2',
          beforeCurCd: 'JPY',
          afterCurCd: 'USD',
          startDate: '202402',
          rate: 0.0092,
          rateType: 1,
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
        {
          rateExchangeId: 'r3',
          beforeCurCd: 'JPY',
          afterCurCd: 'CNY',
          startDate: '202401',
          rate: 0.051,
          rateType: 2,
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
      ] as any);

      const result = await service.getOptions();
      expect(result.axisOptions).toHaveLength(1);
      expect(result.axisOptions[0]).toMatchObject({ buCd: 'BU001', nameJa: '営業一部' });
      expect(result.costVersions).toEqual([{ id: 'cv1', name: '原価v1' }]);
      // rateType は distinct で 1,2 の2件になる
      expect(result.rateTypes).toEqual([
        { value: 1, label: 'Rate Type 1' },
        { value: 2, label: 'Rate Type 2' },
      ]);
      expect(result.scenarioTypes).toEqual([]);
      expect(result.scenarioBusinesses).toEqual([]);
      expect(result.salesVersions).toEqual([]);
    });
  });

  describe('getConcatTargets', () => {
    it('mode=parent returns children for given axis BU', async () => {
      prisma.aggConcat.findMany.mockResolvedValueOnce([
        {
          aggConcatId: 'a1',
          childKtnCd: 'BU002',
          parentKtnCd: 'BU001',
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
      ] as any);
      prisma.businessUnit.findMany.mockResolvedValueOnce([
        {
          businessunitId: 'id-2',
          ktnCd: 'BU002',
          name: 'N/A',
          baseCurrencyName: 'JPY',
          businessunitNameJa: '子BU',
          productNameJa: '',
          businessunitNameEn: 'Child BU',
          productNameEn: '',
          businessunitNameZh: '子BU zh',
          productNameZh: '',
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
      ] as any);

      const result = await service.getConcatTargets({ axisBuCd: 'BU001', mode: 'parent' });
      expect(result.targets).toEqual([{ buCd: 'BU002', nameJa: '子BU', nameEn: 'Child BU', nameZh: '子BU zh' }]);
    });

    it('mode=child returns parents for given axis BU', async () => {
      prisma.aggConcat.findMany.mockResolvedValueOnce([
        {
          aggConcatId: 'a1',
          childKtnCd: 'BU001',
          parentKtnCd: 'BU010',
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
      ] as any);
      prisma.businessUnit.findMany.mockResolvedValueOnce([
        {
          businessunitId: 'id-10',
          ktnCd: 'BU010',
          name: 'N/A',
          baseCurrencyName: 'JPY',
          businessunitNameJa: '親BU',
          productNameJa: '',
          businessunitNameEn: 'Parent BU',
          productNameEn: '',
          businessunitNameZh: '親BU zh',
          productNameZh: '',
          createdBy: 'u',
          createdOn: new Date(),
          modifiedBy: 'u',
          modifiedOn: new Date(),
        },
      ] as any);

      const result = await service.getConcatTargets({ axisBuCd: 'BU001', mode: 'child' });
      expect(result.targets).toEqual([{ buCd: 'BU010', nameJa: '親BU', nameEn: 'Parent BU', nameZh: '親BU zh' }]);
    });
  });
});
