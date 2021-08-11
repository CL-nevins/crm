import Cookies from 'js-cookie' // js-cookie库

// auth.js 只对cookie进行操作；

// 这是自定义了一个token name
// 定义了Guid，默认token和guid与后台统一，通用签名
const TokenKey = 'admin_token'
const GuidKey = 'admin_guid'

// 读取TokenKey对应的cookie
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置cookie
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除cookie
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取guid
export function getGuid() {
  return Cookies.get(GuidKey)
}

// 设置guid
export function setGuid(guid) {
  return Cookies.set(GuidKey, guid)
}

// 删除guid
export function removeGuid() {
  return Cookies.remove(GuidKey)
}

