import axios from "axios"
const citiesActions = {
  getCities: () => {
    return async (dispatch) => {
      try {
        let res = await axios.get("https://mardelcasas.herokuapp.com/api/cities");
        if(res.data.response) {
          dispatch({ type: "GET_CITIES", payload: res.data.response });
          return {success: true, response: res.data.response}
        } else {
          throw new Error()
        }
      } catch {
        return {success: false, error: "Error de conexión. Intente mas tarde"}
      }
    }
  },
}

export default citiesActions