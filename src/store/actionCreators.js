export function setLoginState(username, login_status) {
    return {
        type: 'SETNAME',
        username,
        login_status
    }
}

export function setSoreId(id) {
    return {
        type: 'SETNAV',
        id
    }
}

export function setShopCartNum(num) {
    return {
        type: 'SETSHOPCARTNUM',
        num
    }
}