import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { CalcTypeService } from './calc-type.service';
import { CalcTypeResponseDto } from './dto/calc-type-response.dto';
import { CreateCalcTypeDto } from './dto/create-calc-type.dto';
import { UpdateCalcTypeDto } from './dto/update-calc-type.dto';

@ApiTags('calcType')
@Controller('calc-type')
export class CalcTypeController {
  constructor(private readonly calcTypeService: CalcTypeService) {}

  @Get()
  @ApiOperation({
    summary: '計算種類一覧取得',
    description: '計算種類の一覧を取得します',
  })
  @ApiQuery({
    name: 'businessunitId',
    required: false,
    type: String,
    description: '事業部ID（指定しない場合は全事業部）',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [CalcTypeResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async findAll(@Query('businessunitId') businessunitId: string): Promise<CalcTypeResponseDto[]> {
    if (!businessunitId) {
      throw new BadRequestException('businessunitId is required');
    }

    const calcTypes = await this.calcTypeService.getCalcTypes(businessunitId);
    return calcTypes.map((calcType) => this.parseToDto(calcType));
  }

  @Get(':id')
  @ApiOperation({
    summary: '計算種類詳細取得',
    description: '指定されたIDの計算種類詳細を取得します',
  })
  @ApiParam({
    name: 'id',
    description: '計算種類ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: CalcTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '計算種類が見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CalcTypeResponseDto> {
    const calcType = await this.calcTypeService.findOne(id);
    if (!calcType) {
      throw new Error('計算種類が見つかりません');
    }
    return this.parseToDto(calcType);
  }

  @Post()
  @ApiOperation({
    summary: '計算種類作成',
    description: '新しい計算種類を作成します',
  })
  @ApiBody({ type: CreateCalcTypeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '作成成功',
    type: CalcTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'バリデーションエラー',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async create(@Body() createDto: CreateCalcTypeDto): Promise<CalcTypeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = '00000000-0000-0000-0000-000000000000'; // 仮のユーザーID (GUID)

    const calcType = await this.calcTypeService.create(createDto, userId);
    return this.parseToDto(calcType);
  }

  @Put(':id')
  @ApiOperation({
    summary: '計算種類更新',
    description: '指定されたIDの計算種類を更新します',
  })
  @ApiParam({
    name: 'id',
    description: '計算種類ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCalcTypeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: CalcTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '計算種類が見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'バリデーションエラー',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCalcTypeDto): Promise<CalcTypeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = '00000000-0000-0000-0000-000000000000'; // 仮のユーザーID (GUID)

    const calcType = await this.calcTypeService.update(id, updateDto, userId);
    return this.parseToDto(calcType);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '計算種類削除',
    description: '指定されたIDの計算種類を削除します（論理削除）',
  })
  @ApiParam({
    name: 'id',
    description: '計算種類ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '削除成功',
    type: CalcTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '計算種類が見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async delete(@Param('id') id: string): Promise<CalcTypeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = '00000000-0000-0000-0000-000000000000'; // 仮のユーザーID (GUID)

    const calcType = await this.calcTypeService.delete(id, userId);
    return this.parseToDto(calcType);
  }

  @Put(':id/reactivate')
  @ApiOperation({
    summary: '計算種類有効化',
    description: '指定されたIDの計算種類を有効化します',
  })
  @ApiParam({
    name: 'id',
    description: '計算種類ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '有効化成功',
    type: CalcTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '計算種類が見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async reactivate(@Param('id') id: string): Promise<CalcTypeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = '00000000-0000-0000-0000-000000000000'; // 仮のユーザーID (GUID)

    const calcType = await this.calcTypeService.reactivate(id, userId);
    return this.parseToDto(calcType);
  }

  private parseToDto(calcType: any): CalcTypeResponseDto {
    return {
      calcTypeId: calcType.calcTypeId,
      calcTypeNameJa: calcType.calcTypeNameJa,
      calcTypeNameEn: calcType.calcTypeNameEn,
      calcTypeNameZh: calcType.calcTypeNameZh,
      defaultFlg: calcType.defaultFlg,
      deleteFlg: calcType.deleteFlg,
      createdBy: calcType.createdBy,
      createdOn: calcType.createdOn.toISOString(),
      modifiedBy: calcType.modifiedBy,
      modifiedOn: calcType.modifiedOn.toISOString(),
      businessunitId: calcType.businessunitId,
    };
  }
}
