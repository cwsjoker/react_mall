const initState = {
    storeId: 0,
}

const nav = (state = initState, action) => {
    switch (action.type) {
        case 'SETNAV':
            return Object.assign({}, state, {
                storeId : action.id,
            });
        default:
            return state;
    }
}

export default nav;