const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD':
            return state + 1;
        case 'DELETE':
            return state - 1;
        default:
            return state;
    }
}

export default todos;