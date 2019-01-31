const initState = {
    name: '',
    login: false
}

const login = (state = initState, action) => {
    switch (action.type) {
        case 'SETNAME':
        return Object.assign({}, state, {
            name : action.username,
            login: action.login_status
        });
        default:
            return state;
    }
}
export default login;