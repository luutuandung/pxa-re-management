import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CostScenarioController } from './cost-scenario.controller';
import { CostScenarioService } from './cost-scenario.service';

describe('CostScenarioController', () => {
  let controller: CostScenarioController;
  let service: jest.Mocked<CostScenarioService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<CostScenarioService>> = {
      getOptions: jest.fn(),
      getConcatTargets: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostScenarioController],
      providers: [{ provide: CostScenarioService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CostScenarioController>(CostScenarioController);
    service = module.get(CostScenarioService) as jest.Mocked<CostScenarioService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /options', () => {
    it('returns options payload', async () => {
      service.getOptions.mockResolvedValueOnce({
        axisOptions: [],
        scenarioTypes: [],
        scenarioBusinesses: [],
        costVersions: [],
        rateTypes: [],
        salesVersions: [],
      });
      const result = await controller.getOptions();
      expect(result).toEqual({
        axisOptions: [],
        scenarioTypes: [],
        scenarioBusinesses: [],
        costVersions: [],
        rateTypes: [],
        salesVersions: [],
      });
    });
  });

  describe('GET /concat-targets', () => {
    it('calls service with valid query', async () => {
      service.getConcatTargets.mockResolvedValueOnce({ targets: [] });
      const res = await controller.getConcatTargets('BU001', 'parent');
      expect(service.getConcatTargets).toHaveBeenCalledWith({ axisBuCd: 'BU001', mode: 'parent' });
      expect(res).toEqual({ targets: [] });
    });

    it('throws 400 for invalid axisBuCd', async () => {
      await expect(controller.getConcatTargets('', 'parent')).rejects.toBeInstanceOf(BadRequestException);
      await expect(controller.getConcatTargets('@@@@', 'parent')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws 400 for invalid mode', async () => {
      await expect(controller.getConcatTargets('BU001', 'xxx' as any)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('GET /rate-type-options', () => {
    it('returns unique, sorted currency options by afterCurCd', async () => {
      // @ts-expect-error - augment mock method for this test
      service.getCurrencies = jest
        .fn()
        .mockResolvedValue([{ afterCurCd: 'USD' }, { afterCurCd: 'JPY' }, { afterCurCd: 'USD' }]);

      const result = await controller.rateTypeOptions();
      expect(result).toEqual([
        { value: 'JPY', label: 'JPY' },
        { value: 'USD', label: 'USD' },
      ]);
    });
  });
});
