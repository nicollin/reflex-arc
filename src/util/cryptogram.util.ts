import * as crypto from 'crypto';

/**
 * 生成随机盐
 * @returns {*} salt
 */
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * 根据随机盐和密码生成加密字符串
 * @param password 密码
 * @param salt 加密盐
 * @returns {*} 加密字符串
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  // 10000 代表迭代次数 16代表长度
  return crypto
    .pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1')
    .toString('base64');
}
