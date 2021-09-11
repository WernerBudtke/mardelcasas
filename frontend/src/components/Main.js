import "../styles/CardCity.css" //css contiene main y cardCity
import React from "react"
import CardCity from "./CardCity"
import { connect } from "react-redux"
import { useEffect } from "react"
import citiesActions from "../redux/action/citiesActions"
import Swal from "sweetalert2"

const Main = (props) => {
  useEffect(() => {
    const getCities = async () => {
      try {
        let res = await props.allCities()
        if (!res.success) {
          throw new Error()
        }
        if (!res.response.length) throw res.response
      } catch {
        renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
      }
    }
    getCities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const city = props.cities.map((city) => (
    <CardCity {...props} key={city._id} city={city} />
  ))

  return (
    <main>
      <div className="mainTitle">
        <h1>Buscá en alguna de estas localidades</h1>
      </div>
      <div className="mainCityCarBox">
        {city}
      </div>
    </main>
  )
}

const mapDispatchToProps = {
  allCities: citiesActions.getCities,
}

const mapStateToProps = (state) => {
  return {
    cities: state.allCities.cities,
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)