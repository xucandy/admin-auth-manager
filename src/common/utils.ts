import * as crypto from 'crypto';
import { BaseModel } from '../entitys/Base';
export function strToMd5(str: string): string {
  const md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
}
export const clone = <T extends BaseModel, S, K extends keyof T>(
  target: T,
  source: S,
  exclude?: K[],
): T => {
  if (!exclude) {
    exclude = exclude
      ? exclude.push(...(['createTime', 'updateTime'] as any))
      : (['createTime', 'updateTime'] as any);
  }
  for (const key of Object.keys(source)) {
    if (exclude?.includes(key as any)) continue;
    const val = source[key];
    target[key] = val ?? target[key];
  }
  return target;
};
export const YYYY_MM_DD_HH_MM_SS = 'YYYY-MM-DD HH:mm:ss';
export const YYYY_MM_DD = 'YYYY-MM-DD';
export function isArray(arr: any): arr is Array<any> {
  return (
    arr instanceof Array &&
    Object.prototype.toString.call(arr) === '[object Array]'
  );
}
export function isObject(obj: any): obj is object {
  return (
    obj instanceof Object &&
    Object.prototype.toString.call(obj) === '[object Object]'
  );
}
export const getIp = function (req: any): string {
  let ip =
    req.headers['x-forwarded-for'] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }

  ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
  return ip;
};
