import { Fetch } from '../fetch.js'

// 

export default class user {
    // 验证登录权限
    static queryUserByToken() {
        return Fetch.post('/mall/backend/user/queryUserByToken');
    }

    // 获取用户余额
    static getUserFinance(data) {
        return Fetch.post('/mall/backend/user/queryUserFinanceData', data)
    }

    // 获取用户收货地址
    static queryCustomerAllAddress() {
        return Fetch.post('/mall/backend/customer/address/queryCustomerAllAddress')
    }

    // 增加收货地址
    static createNewCustomerAddress(data) {
        return Fetch.post('/mall/backend/customer/address/createNewCustomerAddress', data)
    }
    
    // 设置为默认地址
    static modifyCustomerAddressDefault(data) {
        return Fetch.post('/mall/backend/customer/address/modifyCustomerAddressDefault', data)
    }

    // 删除收货地址
    static removeCustomerAddress(data) {
        return Fetch.post('/mall/backend/customer/address/removeCustomerAddress', data)
    }
}