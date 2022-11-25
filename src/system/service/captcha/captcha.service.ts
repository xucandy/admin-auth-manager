import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { v4 } from 'uuid';
import redis, { setExpire } from '../../../common/redis';
@Injectable()
export class CaptchaService {
  async createSvgCode(width: number, height: number, type = 'math') {
    const codeKey = v4();
    let captaha: svgCaptcha.CaptchaObj;
    if (type == 'math') {
      captaha = svgCaptcha.createMathExpr({
        size: 6, // 验证码长度
        width: width,
        height: height,
        fontSize: 50,
        ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#eee', // 验证码图片背景颜色)
      });
    } else {
      captaha = svgCaptcha.create({
        size: 6, // 验证码长度
        width: width,
        height: height,
        fontSize: 50,
        ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#eee', // 验证码图片背景颜色)
      });
    }
    await setExpire(codeKey, captaha.text, 300);
    return { key: codeKey, svg: captaha.data };
  }
  /**
   *
   * @param codeKey
   * @param code
   * @returns 0 已失效  1 验证失败 2验证成功
   */
  async checkSvgCode(codeKey: string, code: string): Promise<number> {
    const redisCode = await redis.get(codeKey);
    if (!redisCode) {
      return 0;
    }
    if (redisCode != code) {
      return 1;
    }
    return 2;
  }
}
