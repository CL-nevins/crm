import crypto from 'crypto'
import { getToken } from './auth'

export const defaultGuid = '-'
export const defaultToken = 'abcdef0123456789abcdef0123456789'
export const hashRule = [
  [0, 5, 9, 15, 22, 28],
  [2, 8, 19, 25, 30, 31],
  [20, 25, 31, 3, 4, 8],
  [25, 31, 0, 9, 13, 17],
  [29, 2, 11, 17, 21, 26],
  [10, 15, 18, 29, 2, 3],
  [5, 10, 15, 17, 18, 22],
  [8, 20, 22, 27, 19, 21]
]
// 不需要签名验证的接口
export const noCryptTokenApi = [
  '/admin/login'
]
// 需要签名验证的接口
export const signApi = [
  '/admin/info',
  '/admin/logout',
  '/admin/query',
  '/admin/add',
  '/admin/delete'
]

/**
 * 生成 start~end直接的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min = 1, max = 50000) {
  return parseInt(Math.random() * (max - min + 1) + min, 10)
}
