import { Injectable } from '@nestjs/common';
import { User } from "@prisma/client";
import { User as UserDto } from '@pxa-re-management/shared';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '../common';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

   async getUserByGlobalId(globalId: string): Promise<UserDto> {
      const user = await this.prisma.user.findUnique({
         where: { globalId },
         include: {
            language: true,
         },
      });

      if (!user) {
         throw new NotFoundException(`User with ID ${globalId} not found`);
      }

      return this.parseUserToDto(user);
   }

   private parseUserToDto(user: User & { language?: any }): UserDto {
    return {
      id: user.id,
      name: user.name,
      emailAddress: user.emailAddress,
      globalId: user.globalId,
      languageName: user.language?.name,
      languageCode: user.language?.code,
    };
  }

}
