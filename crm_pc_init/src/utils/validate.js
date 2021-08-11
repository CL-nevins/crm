/**
 * Created by PanJiaChen on 16/11/18.
 * 
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 用户名检查
 * @param str
 * @returns {Error}
 */
// 用户名非空检查
export function validUsername(str) {
  const name = str.trim()
  if (name.length < 1) {
    return new Error('用户名不能为空！')
  }
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 密码非空检查
 * @param str
 * @returns {Error}
 */
// 密码非空检查
export function validPwd(str) {
  const pwd = str.trim()
  if (pwd.length < 1) {
    return new Error('密码不能为空！')
  }
}

// 验证码位数校验
export function validCode(str) {
  const code = str.trim()
  if (code.length < 1) {
    return new Error('验证码不能为空！')
  } else if (!/^[A-z0-9]{5}$/.test(code)) {
    return new Error('请输入5位验证码')
  }
}
