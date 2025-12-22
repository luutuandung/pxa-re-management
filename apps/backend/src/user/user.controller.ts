import { Controller, Get, HttpStatus, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@pxa-re-management/shared';
import { UserService } from './user.service';
import { UnauthorizedException } from '../common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private configService: ConfigService) {}

  @Get('login-user')
  async getLoginUser(@Headers('iv-user') globalId: string | undefined): Promise<User> {
    const mockGlobalId = this.configService.get<string>('MOCK_USER_GLOBAL_ID');
    if(mockGlobalId) {
      // モックユーザが設定されている場合はグローバルIDを上書き
      globalId = mockGlobalId;
    }

    if(!globalId) {
      throw new UnauthorizedException();
    }

    return await this.userService.getUserByGlobalId(globalId);
  }

}
