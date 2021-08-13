/**
 * 管理员相关的接口写在这里
 * signEngrypt是签名加密
 */
import request from '@/utils/request'
import { signEncrypt } from '@/utils/signEncrypt'

/**
 * 管理员登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  const path = '/api/admin/login'
  data.user_name = data.username
  delete data.username
  console.log(data)
  data = signEncrypt(path, data)
  return request({
    url: path,
    method: 'post',
    data
  })
}

// 调用request.js来验证用户信息
/**
 * 登录前获取信息
 * @param data
 * @returns {AxiosPromise}
 */
export function getInfo(data) {
  const path = '/api/admin/info'
  data = signEncrypt(path, data)
  return request({
    url: path,
    method: 'post',
    data
  })
}

/**
 * 管理员退出登录，写入登出信息
 * @param data
 * @returns {AxiosPromise}
 */
export function logout(data) {
  const path = '/api/admin/logout'
  data = signEncrypt(path, data)
  return request({
    url: path,
    method: 'post',
    data
  })
}

/**
 * 管理员列表拉取; admin list
 * 打开管理员列表界面时，传递的业务参数param全为空，此时后端返回所有条目
 * 针对某个条件查询条目时，对应的param项赋值，后端比对后，返回符合条件的条目
 */
export function adminList(data) {
  const path = '/api/admin/list'
  data = signEncrypt(path, data)
  return request(
    {
      url: path,
      method: 'post',
      data
    }
  )
}

/**
 * 新增管理员账号
 *
 */
export function adminAdd(data) {
  const path = '/api/admin/add'
  data = signEncrypt(path, data)
  return request(
    {
      url: path,
      method: 'post',
      data
    }
  )
}

/**
 * 编辑管理员信息
 */
export function adminUpdate(data) {
  const path = '/api/admin/update'
  data = signEncrypt(path, data)
  return request(
    {
      url: path,
      method: 'post',
      data
    }
  )
}

/**
 * 修改管理员密码
 */
export function adminUpdatePwd(data) {
  const path = '/api/admin/update/pwd'
  data = signEncrypt(path, data)
  return request(
    {
      url: path,
      method: 'post',
      data
    }
  )
}

/**
 * 修改管理员状态
 */
export function adminUpdateStatus(data) {
  const path = '/api/admin/status'
  data = signEncrypt(path, data)
  return request(
    {
      url: path,
      method: 'post',
      data
    }
  )
}
