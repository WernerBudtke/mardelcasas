const initState = {
    token: null,
    admin: false,
}
const userReducer = (state = initState, action) => {
    switch (action.type) {
        case "LOG_IN":
            return {
                token: action.payload.token,
                admin: action.payload.admin,
            }
        case "LOG_OUT": 
            return initState
        default: 
            return state
    }
}

export default userReducer;