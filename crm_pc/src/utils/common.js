import crypto from 'crypto'
import { getToken } from './auth'

export const defaultGuid = '-'
export const defaultToken = 'abcdef0123456789abcdef0123456789'
export const hashRule = [
  [0,6,9,15,22,28],
  [2,8,17,25,30,31],
  [20,28,31,3,4,8],
  [25,31,4,9,13,17],
  [29,2,11,27,21,26],
  [10,15,18,21,2,3],
  [5,10,15,17,11,22],
  [8,20,22,27,19,27],
]
// 不需要签名验证的接口
export const noCryptTokenApi = [
  '/api/admin/login'
]
// 需要签名验证的接口
export const signApi = [
  '/api/admin/info',
  '/api/admin/logout',
  '/api/admin/list',
  '/api/admin/add',
  '/api/admin/update',
  '/api/admin/update/pwd',
  '/api/admin/update/status'
]

/**
 * 生成 start~end直接的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min = 100000, max = 999999) {
  return parseInt(Math.random() * (max - min + 1) + min, 10)
}
