const initState = {
    name: '商城'
}

const home = (state = initState, action) => {
    switch (action.type) {
        case 'SETPAGENAME':
            return Object.assign({}, state, {
                name : action.name,
            });
        default:
            return state;
    }
}
export default home;