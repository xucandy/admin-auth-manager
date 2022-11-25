import { Injectable } from '@nestjs/common';
import { CaptchaService } from '../captcha/captcha.service';
import { UserService } from '../user/user.service';
import { MyResponse } from '../../../common/myResponse';
import { strToMd5 } from '../../../common/utils';
import { v4 } from 'uuid';
import { setExpire } from '@/common/redis';
import { TOKEN_REDIS_PREFIX } from '../../../config/config';
import { LoginLogService } from '../loginLog/loginLog.service';
@Injectable()
export class LoginService {
  constructor(
    private captchaService: CaptchaService,
    private userService: UserService,
    private loginLogService: LoginLogService,
  ) {}
  async doLogin(
    username: string,
    password: string,
    codeKey: string,
    code: string,
    req: any,
  ) {
    const r = await this.captchaService.checkSvgCode(codeKey, code);
    if (r === 0) {
      return MyResponse.badRequest('验证码失效');
    }
    if (r == 1) {
      return MyResponse.badRequest('验证码错误');
    }
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      return MyResponse.badRequest('用户名不存在');
    }
    if (strToMd5(password) !== user.password) {
      return MyResponse.badRequest('用户密码错误');
    }
    const token = v4();
    await setExpire(TOKEN_REDIS_PREFIX + token, JSON.stringify(user), 1800);
    this.loginLogService.save(req, user);
    return MyResponse.success({ token });
  }
}
