import { Test, TestingModule } from '@nestjs/testing';
import { BusinessCostController } from './business-cost.controller';
import { BusinessCostService } from './business-cost.service';

describe('BusinessCostController', () => {
  let controller: BusinessCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessCostController],
      providers: [BusinessCostService],
    }).compile();

    controller = module.get<BusinessCostController>(BusinessCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
