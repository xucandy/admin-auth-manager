import { Request, Response } from 'express';
import {
  AUTH_WHITE,
  TOKEN_REDIS_PREFIX,
  WHITE_IP,
  CHECK_IP,
} from '../config/config';
import { MyResponse } from '../common/myResponse';
import redis, { getObject } from '@/common/redis';
import { UserEntity } from '../entitys/user.entity';
import { getIp } from '../common/utils';

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: () => void,
) {
  let url = req.url;
  if (url.includes('swagger-ui')) {
    next();
    return;
  }
  url = url.replace('/api', '');
  if (AUTH_WHITE.some((regx) => regx.test(url))) {
    next();
    return;
  }
  if (CHECK_IP) {
    const ip = getIp(req);
    if (
      !WHITE_IP.includes(ip.trim()) &&
      req.method.toLocaleLowerCase() !== 'get'
    ) {
      res.statusCode = 200;
      res.json(MyResponse.badRequest('当前演示环境，没有权限！！！'));
      return;
    }
  }
  let token = req.headers['authorization'] ?? '';
  token = (token as string).replace('Bearer ', '').trim();
  if (token === '') {
    res.statusCode = 401;
    res.json(new MyResponse(401, '当前用户没有登录', ''));
    return;
  }
  console.log(TOKEN_REDIS_PREFIX + token);

  const user = await getObject<UserEntity>(TOKEN_REDIS_PREFIX + token);
  if (!user) {
    res.statusCode = 401;
    res.json(new MyResponse(401, '当前用户登录已经过期', ''));
    return;
  }
  await redis.expire(TOKEN_REDIS_PREFIX + token, 1800);
  (req as any).user = user;
  (req as any).token = token;
  next();
}
