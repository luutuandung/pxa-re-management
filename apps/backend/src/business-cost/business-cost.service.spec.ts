import { Test, TestingModule } from '@nestjs/testing';
import { BusinessCostService } from './business-cost.service';

describe('BusinessCostService', () => {
  let service: BusinessCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessCostService],
    }).compile();

    service = module.get<BusinessCostService>(BusinessCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
