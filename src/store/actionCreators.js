// 设置用户名
export function setLoginState(username, login_status) {
    return {
        type: 'SETNAME',
        username,
        login_status
    }
}

// 设置商店id
export function setSoreId(id) {
    return {
        type: 'SETNAV',
        id
    }
}

// 设置购物车数量
export function setShopCartNum(num) {
    return {
        type: 'SETSHOPCARTNUM',
        num
    }
}

// 设置当前页标题
export function setPageName(name) {
    return {
        type: 'SETPAGENAME',
        name
    }
}