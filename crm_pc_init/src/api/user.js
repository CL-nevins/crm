// 用户管理相关接口
import request from '@/utils/request'
import { signEncrypt } from '@/utils/signEncrypt'

/**
 * 获取用户列表
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function getUserList(data) {
  const path = '/user/query'
  data = signEncrypt(path, data)
  return request({
    url: path,
    method: 'post',
    data
  })
}

/**
 * 根据条件查询用户
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function getUserById(data) {
  const path = '/user/query'
  data = signEncrypt(path, data)
  return request({
    url: path,
    method: 'post',
    data
  })
}

/**
 * 添加用户
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function addUser(data) {
  console.log(data)
  const path = 'user/add'
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
 * 删除用户
 * @param data
 * @returns {AxiosPromise}
 * @author tah
 */
export function deleteUser(data) {
  const path = '/user/delete'
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
 * 更新用户信息
 * @param data
 * @returns {AxiosPromise}
 */
export function updateUser(data) {
  const path = '/user/update'
  data = signEncrypt(path, data)
  return request(
    {
      url: path,
      method: 'post',
      data
    }
  )
}
