import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaptchaService } from '../../service/captcha/captcha.service';
import { MyResponse } from '../../../common/myResponse';
@ApiTags('验证码')
@Controller('captcha')
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}
  @ApiOperation({
    summary: '验证码接口',
  })
  @Get()
  @ApiBearerAuth()
  async getImage(
    @Query('w') width?: string,
    @Query('h') height?: string,
    @Query('type') type?: string,
  ) {
    let w = Number(width);
    let h = Number(height);
    w = Number.isNaN(w) ? 100 : w;
    h = Number.isNaN(h) ? 40 : h;
    const res = await this.captchaService.createSvgCode(w, h, type);
    return MyResponse.success(res);
  }
}
