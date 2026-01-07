import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { CalcDisplayController } from './calc-display.controller';
import { CalcDisplayService } from './calc-display.service';

@Module({
  providers: [CalcDisplayService],
  controllers: [CalcDisplayController],
  exports: [CalcDisplayService],
  imports: [PrismaModule, UserModule],
})
export class CalcDisplayModule {}
