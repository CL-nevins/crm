/**
 * auth.js
 * 引入了js-cookie
 * cookie, guid, token的相关操作
 */
import Cookies from 'js-cookie' // js-cookie库

// 这是自定义了一个token name
// 定义了Guid，默认token和guid与后台统一，通用签名
const TokenKey = 'admin_token'
const GuidKey = 'admin_guid'

/**
 *
 * @returns
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 *
 * @param {*} token
 * @returns
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 *
 * @returns
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 *
 * @returns
 */
export function getGuid() {
  return Cookies.get(GuidKey)
}

/**
 *
 * @param {*} guid
 * @returns
 */
export function setGuid(guid) {
  return Cookies.set(GuidKey, guid)
}

/**
 *
 * @returns
 */
export function removeGuid() {
  return Cookies.remove(GuidKey)
}
