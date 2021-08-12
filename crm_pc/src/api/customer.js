/**
 * 客户相关的接口写在这里
 * signEngrypt是签名加密
 */
 import request from '@/utils/request'
 import { signEncrypt } from '@/utils/signEncrypt'
 
 /**
  * 获取客户列表
  */
 export function customerList(data) {
   const path = '/api/customer/list'
   data = signEncrypt(path, data)
   return request({
     url: path,
     method: 'post',
     data
   })
 }

 /**
  * 添加客户
  */
  export function customerAdd(data) {
    const path = '/api/customer/add'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }

  /**
   * 添加客户咨询接口
   */
   export function logConsultAdd(data) {
    const path = '/api/log/consult/add'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }
  
  /**
   * 客户详情
   */
   export function customerDetail(data) {
    const path = '/api/customer/detail'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }

  /**
   * 删除客户的联系人
   * 企业客户的联系人能删，但至少留一个联系人
   * 个人客户的联系人，不能删除
   */
   export function linkDelete(data) {
    const path = '/api/link/delete'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }

  /**
   * 修改客户联系人接口
   */
   export function customerUpdateLink(data) {
    const path = '/api/customer/update/link'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }

  /**
   * 获取客户咨询列表
   */
   export function customerLinkList(data) {
    const path = '/api/customer/link/list'
    data = signEncrypt(path, data)
    return request({
      url: path,
      method: 'post',
      data
    })
  }
  