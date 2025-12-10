import { Body, Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CostRegisterService } from './cost-register.service';
import type { Response } from 'express';

@Controller('cost-register')
export class CostRegisterController {
  constructor(private readonly service: CostRegisterService) {}

  @Get('pattern-details')
  getPatternDetails() {
    return this.service.getPatternDetails();
  }

  @Get('list')
  getList(@Query('costPatternDetailId') costPatternDetailId: string) {
    return this.service.getList(costPatternDetailId);
  }

  @Get('excel')
  async downloadExcel(@Query('costPatternDetailId') costPatternDetailId: string, @Res() res: Response) {
    const buffer = await this.service.generateExcelBuffer(costPatternDetailId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="cost_register.xlsx"');
    return res.send(buffer);
  }

  // 便宜上: 本手順ではモックのためダウンロードは未実装（手順7で実装）

  @Post('excel-upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadExcel(@UploadedFile() file: { buffer: Buffer }, @Body('costPatternDetailId') costPatternDetailId: string) {
    return this.service.upload(file.buffer, costPatternDetailId);
  }
}
