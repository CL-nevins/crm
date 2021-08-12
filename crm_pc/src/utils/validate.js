/**
 * 表单验证的规则写在这里面
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
 export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 登录时，用户名不能为空
 * @param str
 * @returns {Error}
 */
export function validLoginUsername(str) {
  const name = str.trim()
  if (name.length < 1) {
    return new Error('用户名不能为空！')
  }
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 登录时，密码不能为空
 * @param str
 * @returns {Error}
 */
export function validLoginPwd(str) {
  const pwd = str.trim()
  if (pwd.length < 1) {
    return new Error('密码不能为空！')
  }
}

/**
 * 登录时，验证码表单验证；不能为空，切位数限定为5
 * @param {*} str 
 * @returns 
 */
export function validVerifyCode(str) {
  const code = str.trim()
  if (code.length < 1) {
    return new Error('验证码不能为空！')
  } else if (!/^[A-z0-9]{5}$/.test(code)) {
    return new Error('请输入5位验证码')
  }
}
