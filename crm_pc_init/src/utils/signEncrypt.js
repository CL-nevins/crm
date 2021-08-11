import crypto from 'crypto'
import store from '@/store'
import { noCryptTokenApi } from "@/utils/constant";

/**
 * 加密token，算法与后端加密算法一致
 * @param {*} params
 * @returns
 */
export function getCryptToken(params = 'abcdef0123456789abcdef0123456789') {
  // 取出token中的369位（从0开始）
  const hex_str = params.charAt(2) + params.charAt(5) + params.charAt(8)
  const flag = (parseInt(hex_str, 16)) % 8
  const hash = [
    [0, 5, 9, 15, 22, 28],
    [2, 8, 19, 25, 30, 31],
    [20, 25, 31, 3, 4, 8],
    [25, 31, 0, 9, 13, 17],
    [29, 2, 11, 17, 21, 26],
    [10, 15, 18, 29, 2, 3],
    [5, 10, 15, 17, 18, 22],
    [8, 20, 22, 27, 19, 21]
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
export function signEncrypt(path,param) {
  // time,path,guid是通用签名和业务签名都需要传递的参数
  const time = Date.parse(new Date()) / 1000
  let guid = ''
  let token = ''
  let cryptoken = ''
  if(noCryptTokenApi.indexOf(path) !== -1 ){
    // 判断是否是通用接口，通用接口：cryptoken约定好是'abc',无需加密,guid约定是'-'
    cryptoken = 'abc'
    guid = '-'
  }else {
    guid = store.getters.guid
    token = store.getters.token
    cryptoken = getCryptToken(token)
  }
  //统一在这里拼接
  param = JSON.stringify(param)
  const sign = crypto.createHash('md5').update(path + time + guid + param + cryptoken).digest('hex')
  const query = {
    'time': time,
    'guid': guid,
    'path': path,
    'param': param,
    'sign': sign
  }
  return query
}
