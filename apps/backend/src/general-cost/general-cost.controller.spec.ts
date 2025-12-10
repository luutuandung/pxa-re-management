import { Test, TestingModule } from '@nestjs/testing';
import { GeneralCostCode, GeneralCostWithNames } from '@pxa-re-management/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateGeneralCostArrayDto } from './dto/create-general-cost.dto';
import { DeleteGeneralCostNameDto } from './dto/delete-general-cost-name.dto';
import { UpdateGeneralCostDto } from './dto/update-general-cost.dto';
import { GeneralCostController } from './general-cost.controller';
import { GeneralCostService } from './general-cost.service';

describe('GeneralCostController', () => {
  let controller: GeneralCostController;
  let service: GeneralCostService;

  const mockGeneralCostCode: GeneralCostCode = {
    generalCostCd: 'A001',
    invFlg: true,
  };

  const mockGeneralCostWithNames: GeneralCostWithNames = {
    generalCostCd: 'A001',
    invFlg: true,
    generalCostNames: [
      {
        generalCostCd: 'A001',
        languageCd: 'ja',
        generalCostName: '材料費',
        languageMaster: {
          languageCd: 'ja',
          languageName: '日本語',
        },
      },
    ],
  };

  const mockGeneralCostService = {
    findAllCostCode: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    removeGeneralCostName: vi.fn(),
    bulkSave: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralCostController],
      providers: [
        {
          provide: GeneralCostService,
          useValue: mockGeneralCostService,
        },
      ],
    }).compile();

    controller = module.get<GeneralCostController>(GeneralCostController);
    service = module.get<GeneralCostService>(GeneralCostService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllCostCode', () => {
    it('should return an array of general cost codes', async () => {
      const expectedResult: GeneralCostCode[] = [mockGeneralCostCode];
      mockGeneralCostService.findAllCostCode.mockResolvedValue(expectedResult);

      const result = await controller.findAllCostCode();

      expect(result).toBe(expectedResult);
      expect(service.findAllCostCode).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create general costs and return parsed DTOs', async () => {
      const createDto: CreateGeneralCostArrayDto = {
        generalCosts: [
          {
            generalCostCd: 'A001',
            invFlg: true,
            generalCostNames: [
              {
                languageCd: 'ja',
                generalCostName: '材料費',
              },
            ],
          },
        ],
      };

      mockGeneralCostService.create.mockResolvedValue(mockGeneralCostWithNames);

      const result = await controller.create(createDto);

      expect(result).toEqual([
        {
          generalCostCd: 'A001',
          invFlg: true,
          generalCostNames: [
            {
              generalCostCd: 'A001',
              languageCd: 'ja',
              generalCostName: '材料費',
              languageMaster: {
                languageCd: 'ja',
                languageName: '日本語',
              },
            },
          ],
        },
      ]);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto.generalCosts[0]);
    });

    it('should create multiple general costs and return parsed DTOs', async () => {
      const createDto: CreateGeneralCostArrayDto = {
        generalCosts: [
          {
            generalCostCd: 'A001',
            invFlg: true,
            generalCostNames: [
              {
                languageCd: 'ja',
                generalCostName: '材料費',
              },
            ],
          },
          {
            generalCostCd: 'A002',
            invFlg: false,
            generalCostNames: [
              {
                languageCd: 'ja',
                generalCostName: '労務費',
              },
            ],
          },
        ],
      };

      const mockGeneralCostWithNames2: GeneralCostWithNames = {
        generalCostCd: 'A002',
        invFlg: false,
        generalCostNames: [
          {
            generalCostCd: 'A002',
            languageCd: 'ja',
            generalCostName: '労務費',
            languageMaster: {
              languageCd: 'ja',
              languageName: '日本語',
            },
          },
        ],
      };

      mockGeneralCostService.create
        .mockResolvedValueOnce(mockGeneralCostWithNames)
        .mockResolvedValueOnce(mockGeneralCostWithNames2);

      const result = await controller.create(createDto);

      expect(result).toEqual([
        {
          generalCostCd: 'A001',
          invFlg: true,
          generalCostNames: [
            {
              generalCostCd: 'A001',
              languageCd: 'ja',
              generalCostName: '材料費',
              languageMaster: {
                languageCd: 'ja',
                languageName: '日本語',
              },
            },
          ],
        },
        {
          generalCostCd: 'A002',
          invFlg: false,
          generalCostNames: [
            {
              generalCostCd: 'A002',
              languageCd: 'ja',
              generalCostName: '労務費',
              languageMaster: {
                languageCd: 'ja',
                languageName: '日本語',
              },
            },
          ],
        },
      ]);
      expect(service.create).toHaveBeenCalledTimes(2);
      expect(service.create).toHaveBeenNthCalledWith(1, createDto.generalCosts[0]);
      expect(service.create).toHaveBeenNthCalledWith(2, createDto.generalCosts[1]);
    });
  });

  describe('findAll', () => {
    it('should return an array of general costs with names', async () => {
      const expectedResult: GeneralCostWithNames[] = [mockGeneralCostWithNames];
      mockGeneralCostService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual([
        {
          generalCostCd: 'A001',
          invFlg: true,
          generalCostNames: [
            {
              generalCostCd: 'A001',
              languageCd: 'ja',
              generalCostName: '材料費',
              languageMaster: {
                languageCd: 'ja',
                languageName: '日本語',
              },
            },
          ],
        },
      ]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a general cost with names', async () => {
      const id = 'A001';
      mockGeneralCostService.findOne.mockResolvedValue(mockGeneralCostWithNames);

      const result = await controller.findOne(id);

      expect(result).toEqual({
        generalCostCd: 'A001',
        invFlg: true,
        generalCostNames: [
          {
            generalCostCd: 'A001',
            languageCd: 'ja',
            generalCostName: '材料費',
            languageMaster: {
              languageCd: 'ja',
              languageName: '日本語',
            },
          },
        ],
      });
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update and return a general cost with names', async () => {
      const id = 'A001';
      const updateDto: UpdateGeneralCostDto = {
        invFlg: false,
        generalCostNames: [
          {
            languageCd: 'ja',
            generalCostName: '更新された材料費',
          },
        ],
      };

      const updatedGeneralCost: GeneralCostWithNames = {
        ...mockGeneralCostWithNames,
        invFlg: false,
        generalCostNames: [
          {
            generalCostCd: 'A001',
            languageCd: 'ja',
            generalCostName: '更新された材料費',
            languageMaster: {
              languageCd: 'ja',
              languageName: '日本語',
            },
          },
        ],
      };

      mockGeneralCostService.update.mockResolvedValue(updatedGeneralCost);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual({
        generalCostCd: 'A001',
        invFlg: false,
        generalCostNames: [
          {
            generalCostCd: 'A001',
            languageCd: 'ja',
            generalCostName: '更新された材料費',
            languageMaster: {
              languageCd: 'ja',
              languageName: '日本語',
            },
          },
        ],
      });
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a general cost', async () => {
      const id = 'A001';
      mockGeneralCostService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('removeGeneralCostName', () => {
    it('should remove a general cost name', async () => {
      const generalCostCd = 'A001';
      const deleteDto: DeleteGeneralCostNameDto = {
        languageCd: 'jp',
        generalCostName: 'テスト項目',
      };

      mockGeneralCostService.removeGeneralCostName.mockResolvedValue(undefined);

      const result = await controller.removeGeneralCostName(generalCostCd, deleteDto);

      expect(result).toBeUndefined();
      expect(service.removeGeneralCostName).toHaveBeenCalledTimes(1);
      expect(service.removeGeneralCostName).toHaveBeenCalledWith(
        generalCostCd,
        deleteDto.languageCd,
        deleteDto.generalCostName
      );
    });
  });

  describe('bulkSave', () => {
    it('should bulk save general costs and return parsed DTOs', async () => {
      const bulkSaveDto: CreateGeneralCostArrayDto = {
        generalCosts: [
          {
            generalCostCd: 'A001',
            invFlg: false,
            generalCostNames: [
              {
                languageCd: 'jp',
                generalCostName: '既存更新項目',
              },
            ],
          },
          {
            generalCostCd: 'A002',
            invFlg: false,
            generalCostNames: [
              {
                languageCd: 'jp',
                generalCostName: '新規項目',
              },
            ],
          },
        ],
      };

      const mockResults = [
        mockGeneralCostWithNames,
        {
          ...mockGeneralCostWithNames,
          generalCostCd: 'A002',
          generalCostNames: [
            {
              generalCostCd: 'A002',
              languageCd: 'jp',
              generalCostName: '新規項目',
              languageMaster: {
                languageCd: 'jp',
                languageName: '日本語',
              },
            },
          ],
        },
      ];

      mockGeneralCostService.bulkSave.mockResolvedValue(mockResults);

      const result = await controller.bulkSave(bulkSaveDto);

      expect(result).toHaveLength(2);
      expect(service.bulkSave).toHaveBeenCalledWith(bulkSaveDto.generalCosts);
    });
  });

  describe('parseToDto', () => {
    it('should correctly parse GeneralCostWithNames to DTO', () => {
      const result = controller.parseToDto(mockGeneralCostWithNames);

      expect(result).toEqual({
        generalCostCd: 'A001',
        invFlg: true,
        generalCostNames: [
          {
            generalCostCd: 'A001',
            languageCd: 'ja',
            generalCostName: '材料費',
            languageMaster: {
              languageCd: 'ja',
              languageName: '日本語',
            },
          },
        ],
      });
    });
  });
});
