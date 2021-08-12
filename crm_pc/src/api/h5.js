/**
 * h5界面相关的接口写在这里
 * signEngrypt是签名加密
 */
 import request from '@/utils/request'
 import { signEncrypt } from '@/utils/signEncrypt'
 
 /**
  * h5管理员登录
  */
 export function hAdminLogin(data) {
   const path = '/h5/admin/login'
   data = signEncrypt(path, data)
   return request({
     url: path,
     method: 'post',
     data
   })
 }

 /**
  * h5客户详情页面接口
  */
  export function hCustomerDetail(data) {
    const path = '/h5/customer/detail'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }

  /**
   * H5获取客户咨询列表
   */
   export function hCustomerLinkList(data) {
    const path = '/h5/customer/link/list'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }
  