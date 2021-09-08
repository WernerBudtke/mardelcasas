import axios from "axios";
const citiesActions = {
  getCities: () => {
    return async (dispatch, getState) => {
        let res = await axios.get("http://localhost:4000/api/cities");
        dispatch({ type: "GET_CITIES", payload: res.data.response });
        return res
    };
  },
};

export default citiesActions;
