import redis from '@/common/redis';
import { Body, Controller, Post, Query, Req, Get } from '@nestjs/common';
import { LoginDto } from '../../dto/login/login';
import { LoginService } from '../../service/login/login.service';
import { TOKEN_REDIS_PREFIX } from '../../../config/config';
import { MyResponse } from '../../../common/myResponse';
import { LoginLogService } from '../../service/loginLog/loginLog.service';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class LoginController {
  constructor(
    private loginService: LoginService,
    private loginLogService: LoginLogService,
  ) {}
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    return await this.loginService.doLogin(
      loginDto.username,
      loginDto.password,
      loginDto.codeKey,
      loginDto.code,
      req,
    );
  }
  @Post('/loginOut')
  async loginOut(@Req() req: any) {
    await redis.del(TOKEN_REDIS_PREFIX + req.token);
    return MyResponse.success();
  }
  @Get('/loginLog')
  async getLog(
    @Query('page') pageNum: number,
    @Query('pageSize') pageSize: number,
  ) {
    const result = await this.loginLogService.getLoginLogList({
      pageNum,
      pageSize,
    });
    return MyResponse.success(result);
  }
}
