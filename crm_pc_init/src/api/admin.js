// 管理员相关的接口写在这里面
import request from '@/utils/request'
import { signEncrypt } from '@/utils/signEncrypt'

/**
 * 管理员登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  const path = '/admin/login'
  // data.path = path
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
  const path = '/admin/info'
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
  const path = '/admin/logout'
  data = signEncrypt(path, data)
  return request({
    url: path,
    method: 'post',
    data
  })
}

// 只写接口；请求成功之后的处理不在这里；

/**
 * 管理员列表拉取queryAdmin
 * 打开管理员列表界面时，传递的业务参数param全为空，此时后端返回所有条目
 * 针对某个条件查询条目时，对应的param项赋值，后端比对后，返回符合条件的条目
 */
export function queryAdmin(data) {
  const path = '/admin/query'
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
 * 增加管理员addAdmin
 *
 */
export function addAdmin(data) {
  const path = '/admin/add'
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
 * 删除管理员deleteAdmin
 */
export function deleteAdmin(data) {
  const path = '/admin/delete'
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
 * 修改管理员信息updateAdmin
 */
export function updateAdmin(data) {
  const path = '/admin/update'
  data = signEncrypt(path, data)
  return request(
    {
      url: path,
      method: 'post',
      data
    }
  )
}
