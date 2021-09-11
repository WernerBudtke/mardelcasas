const initState = {
    token: null,
    photoURL: null,
    admin: false,
    wishList: [],
    userId: null

}
const userReducer = (state = initState, action) => {
    switch (action.type) {
        case "LOG_IN":
            return {
                token: action.payload.token,
                photoURL: action.payload.photoURL,
                admin: action.payload.admin,
                userId: action.payload.userId
            }
        case "UPDATE_WISHLIST":
            return {
                ...state,
                wishList: action.payload,
            }
        case "LOG_OUT": 
            return initState
        case "GET_USERS_FAVOURITES":
            return {
                ...state,
                wishList: action.payload
            }
        default: 
            return state
    }
}

export default userReducer;