const citiesReducer = (state = { cities: [] }, action) => {
  switch (action.type) {
    case "GET_CITIES":
      return {
        ...state,
        cities: action.payload,
      };
    default:
      return state;
  }
};

export default citiesReducer;
