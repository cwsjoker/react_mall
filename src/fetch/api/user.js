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
}