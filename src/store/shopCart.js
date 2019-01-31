const initState = {
    num: 0
}

const shopCart = (state = initState, action) => {
    switch (action.type) {
        case 'SETSHOPCARTNUM':
            return Object.assign({}, state, {
                num : action.num,
            });
        default:
            return state;
    }
}

export default shopCart;