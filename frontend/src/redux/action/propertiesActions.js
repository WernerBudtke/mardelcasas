import axios from "axios"

const propertiesActions = {
  getPropertiesFiltered: (filter) => {
    console.log("filter que se aplica al endpoint en redux", filter)
    return async (dispatch) => {
      try {
        let res = await axios.put("https://mardelcasas.herokuapp.com/api/properties", {filter: filter})
        if (res.data.response) {
          console.log("array de propiedades en action getProperties")
          console.log(res.data.response)
          dispatch({ type: "GET_PROPERTIES_FILTERED", payload:{ filterObj: filter, response: res.data.response }})
          return {success: true, response: res.data.response}
        } else {
          throw new Error()
        }
      } catch {
        return {success: false, error: "Error de conexión. Intente mas tarde"}
      }
    }
  },

  getProperty: (id) => {
    return async () => {
      try {
        let res = await axios.get(`https://mardelcasas.herokuapp.com/api/property/${id}`)
        if (res.data.success) {
          return {success: true, response: res.data.response}
        } else {
          throw new Error()
        }
      } catch {
        return {success: false, error: "Error de conexión. Intente mas tarde"}
      }
    }
  },

  getNumberOfProperties: (id) => {
    return async () => {
      try {
        let res = await axios.get(
          `https://mardelcasas.herokuapp.com/api/getnumberofprops/${id}`
        )
        if (res.data.response) {
          return {success: true, response: res.data.response}
        } else {
          throw new Error()
        }
      } catch {
        return {success: false, error: "Error de conexión. Intente mas tarde"}
      }
    }
  },

  setFilter: (filter) => {
    return (dispatch) => {
      dispatch({ type: "SET_FILTER", payload: filter})
    }
  }, //este setFilter creo que no se usa. Confirmar. Escrito por Diego :)

  postNewProperty: (newProperty, token) =>{
    return async () => {
      try{
        let res = await axios.post("https://mardelcasas.herokuapp.com/property", {...newProperty},{
          headers:{
            Authorization: 'Bearer ' + token
          }
        })
        if(res.data.success){
          return {success: true}
        }else{
          throw new Error('No se pudo agregar la propiedad')
        }
      }catch(err){
        return {success: false, response: err.message}
      }
    }
  }
}

export default propertiesActions