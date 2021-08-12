import crypto from 'crypto'
import store from '@/store'
import { noCryptTokenApi } from '@/utils/common'

/**
 * 加密token，算法与后端加密算法一致
 * @param {*} params
 * @returns
 */
export function getCryptToken(params) {
  // 取出token中的369位（从0开始）156
  const hex_str = params.charAt(1) + params.charAt(5) + params.charAt(6)
  const flag = (parseInt(hex_str, 16)) % 8
  const hash = [
    [0, 6, 9, 15, 22, 28],
    [2, 8, 17, 25, 30, 31],
    [20, 28, 31, 3, 4, 8],
    [25, 31, 4, 9, 13, 17],
    [29, 2, 11, 27, 21, 26],
    [10, 15, 18, 21, 2, 3],
    [5, 10, 15, 17, 11, 22],
    [8, 20, 22, 27, 19, 27]
  ]
  var arr = hash[flag]
  var cryptToken = ''
  for (let j = 0; j < arr.length; j++) {
    cryptToken += params.charAt(arr[j])
  }
  return cryptToken
}

/**
 * 通用签名和业务签名，通用签名不需要加密，业务签名需要加密
 * 根据token来判断
 * @param {*} data
 * @returns
 */
export function signEncrypt(path, param) {
  // time,path,guid是通用签名和业务签名都需要传递的参数
  const time = Date.parse(new Date()) / 1000
  let guid = ''
  let token = ''
  let cryptoken = ''
  if (noCryptTokenApi.indexOf(path) !== -1) {
    // 判断是否是通用接口，通用接口：cryptoken约定好是'abc',无需加密,guid约定是'-'
    cryptoken = 'CRMPublicToken2021'
    guid = 'CRM2021080808'
  } else {
    guid = store.getters.guid
    token = store.getters.token
    cryptoken = getCryptToken(token)
  }
  // 统一在这里拼接
  param = JSON.stringify(param)
  const signatures = crypto.createHash('md5').update(guid + param + time + cryptoken + path).digest('hex')
  const query = {
    'time': time,
    'guid': guid,
    'param': param,
    'signatures': signatures,
    'version': 1
  }
  return query
}
