import { pathToRegexp } from 'path-to-regexp';
export const TOKEN_REDIS_PREFIX = 'token:' as const;
export const AUTH = true;
export const CHECK_IP = false;
export const AUTH_WHITE = [
  pathToRegexp('/login'),
  // pathToRegexp('/hello'),
  pathToRegexp('/captcha:query(.*)?'),
  pathToRegexp('/loginLog:query(.*)?', [], { end: false }),
] as const;
export const WHITE_IP = ['127.0.0.1'];
export const SWAGGER = true;
