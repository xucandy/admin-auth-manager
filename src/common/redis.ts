import * as Redis from 'ioredis';
import redisConfig from '../config/redisConfig';

const redis = new Redis(redisConfig);
/**
 *
 * @param key
 * @param value
 * @param seconds 过期时间 秒
 */
export async function setExpire(key: string, value: string, seconds: number) {
  try {
    await redis.setex(key, seconds, value);
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function getObject<T>(key: string) {
  try {
    const value: any = await redis.get(key);
    const object = JSON.parse(value);
    return object as T;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
export default redis;
