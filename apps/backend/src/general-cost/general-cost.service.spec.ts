import { Test, TestingModule } from '@nestjs/testing';
import { GeneralCostCode, GeneralCostName, GeneralCostWithNames } from '@pxa-re-management/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BusinessException, NotFoundException, ValidationException } from '../common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGeneralCostDto } from './dto/create-general-cost.dto';
import { UpdateGeneralCostDto } from './dto/update-general-cost.dto';
import { GeneralCostService } from './general-cost.service';

describe('GeneralCostService', () => {
  let service: GeneralCostService;
  let prismaService: PrismaService;

  const mockGeneralCostCode: GeneralCostCode = {
    generalCostCodeId: 'gcc_001',
    generalCostCd: 'A001',
    deleteFlg: false,
  };

  const mockLanguageMaster = {
    languageMasterId: 'lang_001',
    languageCd: 'ja',
    languageName: '日本語',
  };

  const mockGeneralCostName: GeneralCostName = {
    generalCostNameId: 'gcn_001',
    generalCostCodeId: 'gcc_001',
    languageMasterId: 'lang_001',
    generalCostName: '材料費',
  };

  const mockGeneralCostWithNames: GeneralCostWithNames = {
    generalCostCodeId: 'gcc_001',
    generalCostCd: 'A001',
    deleteFlg: false,
    generalCostNames: [
      {
        ...mockGeneralCostName,
        languageMaster: mockLanguageMaster,
      },
    ],
  };

  const mockPrismaService = {
    generalCostCode: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    generalCostName: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrismaService)),
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
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findAllCostCode', () => {
    it('should return an array of general cost codes', async () => {
      const expectedResult: GeneralCostCode[] = [mockGeneralCostCode];
      mockPrismaService.generalCostCode.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAllCostCode();

      expect(result).toBe(expectedResult);
      expect(prismaService.generalCostCode.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw BusinessException when database error occurs', async () => {
      const databaseError = new Error('Database error');
      mockPrismaService.generalCostCode.findMany.mockRejectedValue(databaseError);

      await expect(service.findAllCostCode()).rejects.toThrow(BusinessException);
    });
  });

  describe('findAll', () => {
    it('should return an array of general costs with names', async () => {
      const expectedResult: GeneralCostWithNames[] = [mockGeneralCostWithNames];
      mockPrismaService.generalCostCode.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toBe(expectedResult);
      expect(prismaService.generalCostCode.findMany).toHaveBeenCalledWith({
        include: {
          generalCostNames: {
            include: {
              languageMaster: true,
            },
          },
        },
      });
    });

    it('should throw BusinessException when database error occurs', async () => {
      const databaseError = new Error('Database error');
      mockPrismaService.generalCostCode.findMany.mockRejectedValue(databaseError);

      await expect(service.findAll()).rejects.toThrow(BusinessException);
    });
  });

  describe('findAllByLanguage', () => {
    it('should return general costs filtered by language', async () => {
      const expectedResult: GeneralCostWithNames[] = [mockGeneralCostWithNames];
      mockPrismaService.generalCostCode.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAllByLanguage('ja');

      expect(result).toBe(expectedResult);
      expect(prismaService.generalCostCode.findMany).toHaveBeenCalledWith({
        include: {
          generalCostNames: {
            include: {
              languageMaster: true,
            },
            where: {
              languageMaster: {
                languageCd: 'ja',
              },
            },
          },
        },
      });
    });

    it('should throw ValidationException when language code is empty', async () => {
      await expect(service.findAllByLanguage('')).rejects.toThrow(ValidationException);
      expect(prismaService.generalCostCode.findMany).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when language code is null', async () => {
      await expect(service.findAllByLanguage(null as any)).rejects.toThrow(ValidationException);
      expect(prismaService.generalCostCode.findMany).not.toHaveBeenCalled();
    });

    it('should throw BusinessException when database error occurs', async () => {
      const databaseError = new Error('Database error');
      mockPrismaService.generalCostCode.findMany.mockRejectedValue(databaseError);

      await expect(service.findAllByLanguage('ja')).rejects.toThrow(BusinessException);
    });
  });

  describe('create', () => {
    const createDto: CreateGeneralCostDto = {
      generalCostCd: 'A001',
      deleteFlg: false,
      generalCostNames: [
        {
          languageMasterId: 'lang_001',
          generalCostName: '材料費',
        },
      ],
    };

    it('should create a general cost successfully', async () => {
      mockPrismaService.generalCostCode.findFirst.mockResolvedValue(null);
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(mockGeneralCostWithNames);

      const result = await service.create(createDto);

      expect(result).toBe(mockGeneralCostWithNames);
      expect(prismaService.generalCostCode.findFirst).toHaveBeenCalledWith({
        where: { generalCostCd: createDto.generalCostCd },
      });
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw BusinessException when general cost code already exists', async () => {
      mockPrismaService.generalCostCode.findFirst.mockResolvedValue(mockGeneralCostCode);

      await expect(service.create(createDto)).rejects.toThrow(BusinessException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BusinessException when database error occurs during create', async () => {
      mockPrismaService.generalCostCode.findFirst.mockResolvedValue(null);
      const databaseError = new Error('Database error');
      mockPrismaService.$transaction.mockRejectedValue(databaseError);

      await expect(service.create(createDto)).rejects.toThrow(BusinessException);
    });

    it('should throw ValidationException when generalCostCd is empty', async () => {
      const invalidDto = { ...createDto, generalCostCd: '' };

      await expect(service.create(invalidDto)).rejects.toThrow(BusinessException);
    });
  });

  describe('findOne', () => {
    it('should return a general cost with names', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(mockGeneralCostWithNames);

      const result = await service.findOne('gcc_001');

      expect(result).toBe(mockGeneralCostWithNames);
      expect(prismaService.generalCostCode.findUnique).toHaveBeenCalledWith({
        where: { generalCostCodeId: 'gcc_001' },
        include: {
          generalCostNames: {
            include: {
              languageMaster: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException when general cost not found', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(null);

      await expect(service.findOne('gcc_001')).rejects.toThrow(NotFoundException);
    });

    it('should throw ValidationException when generalCostCodeId is empty', async () => {
      await expect(service.findOne('')).rejects.toThrow(ValidationException);
      expect(prismaService.generalCostCode.findUnique).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when generalCostCodeId is null', async () => {
      await expect(service.findOne(null as any)).rejects.toThrow(ValidationException);
      expect(prismaService.generalCostCode.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BusinessException when database error occurs', async () => {
      const databaseError = new Error('Database error');
      mockPrismaService.generalCostCode.findUnique.mockRejectedValue(databaseError);

      await expect(service.findOne('gcc_001')).rejects.toThrow(BusinessException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateGeneralCostDto = {
      deleteFlg: true,
      generalCostNames: [
        {
          languageMasterId: 'lang_001',
          generalCostName: '更新された材料費',
        },
      ],
    };

    it('should update a general cost successfully', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(mockGeneralCostCode);

      const result = await service.update('gcc_001', updateDto);

      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when general cost not found', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(null);

      await expect(service.update('gcc_001', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ValidationException when generalCostCodeId is empty', async () => {
      await expect(service.update('', updateDto)).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BusinessException when database error occurs', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(mockGeneralCostCode);
      const databaseError = new Error('Database error');
      mockPrismaService.$transaction.mockRejectedValue(databaseError);

      await expect(service.update('gcc_001', updateDto)).rejects.toThrow(BusinessException);
    });
  });

  describe('remove', () => {
    it('should remove a general cost successfully', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(mockGeneralCostCode);
      mockPrismaService.generalCostCode.update.mockResolvedValue({
        ...mockGeneralCostCode,
        deleteFlg: true,
      });

      await service.remove('gcc_001');

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when general cost not found', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(null);

      await expect(service.remove('gcc_001')).rejects.toThrow(NotFoundException);
    });

    it('should throw ValidationException when generalCostCodeId is empty', async () => {
      await expect(service.remove('')).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when generalCostCodeId is null', async () => {
      await expect(service.remove(null as any)).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BusinessException when database error occurs', async () => {
      mockPrismaService.generalCostCode.findUnique.mockResolvedValue(mockGeneralCostCode);
      const databaseError = new Error('Database error');
      mockPrismaService.$transaction.mockRejectedValue(databaseError);

      await expect(service.remove('gcc_001')).rejects.toThrow(BusinessException);
    });
  });

  describe('removeGeneralCostName', () => {
    it('should remove a general cost name successfully', async () => {
      mockPrismaService.generalCostName.findFirst.mockResolvedValue(mockGeneralCostName);

      await service.removeGeneralCostName('gcc_001', 'lang_001', '材料費');

      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when general cost name not found', async () => {
      mockPrismaService.generalCostName.findFirst.mockResolvedValue(null);

      await expect(service.removeGeneralCostName('gcc_001', 'lang_001', '材料費')).rejects.toThrow(NotFoundException);
    });

    it('should throw ValidationException when generalCostCodeId is empty', async () => {
      await expect(service.removeGeneralCostName('', 'lang_001', '材料費')).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when languageMasterId is empty', async () => {
      await expect(service.removeGeneralCostName('gcc_001', '', '材料費')).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when generalCostName is empty', async () => {
      await expect(service.removeGeneralCostName('gcc_001', 'lang_001', '')).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BusinessException when database error occurs', async () => {
      mockPrismaService.generalCostName.findFirst.mockResolvedValue(mockGeneralCostName);
      const databaseError = new Error('Database error');
      mockPrismaService.$transaction.mockRejectedValue(databaseError);

      await expect(service.removeGeneralCostName('gcc_001', 'lang_001', '材料費')).rejects.toThrow(BusinessException);
    });
  });

  describe('updateName', () => {
    it('should update an existing general cost name', async () => {
      mockPrismaService.generalCostName.findFirst.mockResolvedValue(mockGeneralCostName);

      const result = await service.updateName('gcc_001', 'lang_001', '更新された材料費');

      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when general cost name not found', async () => {
      mockPrismaService.generalCostName.findFirst.mockResolvedValue(null);

      await expect(service.updateName('gcc_001', 'lang_001', '更新された材料費')).rejects.toThrow(NotFoundException);
    });

    it('should throw ValidationException when generalCostCodeId is empty', async () => {
      await expect(service.updateName('', 'lang_001', '更新された材料費')).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when languageMasterId is empty', async () => {
      await expect(service.updateName('gcc_001', '', '更新された材料費')).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when generalCostName is empty', async () => {
      await expect(service.updateName('gcc_001', 'lang_001', '')).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw ValidationException when all parameters are null', async () => {
      await expect(service.updateName(null as any, null as any, null as any)).rejects.toThrow(ValidationException);
      expect(prismaService.$transaction).not.toHaveBeenCalled();
    });

    it('should throw BusinessException when database error occurs', async () => {
      mockPrismaService.generalCostName.findFirst.mockResolvedValue(mockGeneralCostName);
      const databaseError = new Error('Database error');
      mockPrismaService.$transaction.mockRejectedValue(databaseError);

      await expect(service.updateName('gcc_001', 'lang_001', '更新された材料費')).rejects.toThrow(BusinessException);
    });
  });

  describe('bulkSave', () => {
    const bulkSaveData: CreateGeneralCostDto[] = [
      {
        generalCostCd: 'A001',
        deleteFlg: false,
        generalCostNames: [
          {
            languageMasterId: 'lang_001',
            generalCostName: '材料費',
          },
        ],
      },
      {
        generalCostCd: 'A002',
        deleteFlg: false,
        generalCostNames: [
          {
            languageMasterId: 'lang_001',
            generalCostName: '労務費',
          },
        ],
      },
    ];

    it('should bulk save general costs (create and update)', async () => {
      const result = await service.bulkSave(bulkSaveData);

      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should rollback on error', async () => {
      const databaseError = new Error('Database error');
      mockPrismaService.$transaction.mockRejectedValue(databaseError);

      await expect(service.bulkSave(bulkSaveData)).rejects.toThrow(BusinessException);
    });

    it('should handle empty array without error', async () => {
      const result = await service.bulkSave([]);

      expect(result).toEqual([]);
      expect(prismaService.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
