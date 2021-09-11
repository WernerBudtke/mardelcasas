import "../styles/CardCity.css" //css contiene main y cardCity
import React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import propertiesActions from "../redux/action/propertiesActions"
import Swal from "sweetalert2"

const CardCity = (props) => {
  const [numberProperties, setNumberPropierties] = useState()
  const { cityName, photoURL, _id } = props.city
  useEffect(() => {
    const numberProperties = async () => {
      try {
        var res = await props.getNumberOfProperties(_id)
        if (!res.success) {
          throw new Error()
        } else {
          setNumberPropierties(res.response)
        }
      } catch {
        renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
      }
    }
    numberProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const searchInPropertiesList = async () => {
    try {
      let res = await props.getPropertiesFiltered({ city: _id })
      if (!res.success) {
        throw new Error()
      } else {
        props.history.push("/lista-de-propiedades") 
      }
    } catch {
      renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
    }
  }

  const renderToast = (message, type) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer)
        toast.addEventListener("mouseleave", Swal.resumeTimer)
      },
    })
    Toast.fire({
      icon: type,
      title: message,
    })
  }

  return (
    <div className="divCard">
      <div>
          <div
            className="cardCity"
            style={{ backgroundImage: `url(${photoURL})` }}
            onClick={searchInPropertiesList}
          >
            <h1>{cityName}</h1>
            <p>({numberProperties} propiedades)</p>
          </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  getNumberOfProperties: propertiesActions.getNumberOfProperties,
  getPropertiesFiltered: propertiesActions.getPropertiesFiltered
}

export default connect(null, mapDispatchToProps)(CardCity)