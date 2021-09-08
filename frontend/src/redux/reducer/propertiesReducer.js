const initState = {
    properties: [],
    filterObj: {},
}
const propertiesReducer = (state = initState, action) => {
    switch (action.type) {
        case "GET_PROPERTIES_FILTERED":
            return {
                ...state,
                properties: action.payload.response,
                filterObj: action.payload.filterObj,
            }
            
        case "SET_FILTER":
            return{
                filterObj: action.payload,
            }

        case "RESET": 
            return initState
            
        default: 
            return state
    }
}

export default propertiesReducer;
