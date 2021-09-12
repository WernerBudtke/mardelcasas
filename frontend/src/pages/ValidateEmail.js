import "../styles/App.css"
import React from "react"
import { useEffect } from "react"
import userActions from "../redux/action/userActions"
import { connect } from "react-redux"
import Swal from "sweetalert2"

const ValidateEmail = (props) => {
  useEffect(() => {
    const sendIdforValidation = async () => {
      try {
        let res = await props.sendIdValidation(props.match.params.id)
        if (res.success) {
          renderToast("Tu cuenta se validó con éxito", "success")
          return props.history.push("/")
        } else {
          throw new Error()
        }
      } catch {
        renderToast("Hubo un error, intente nuevamente más tarde", "warning")
      }
    }
    sendIdforValidation()
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

  return (
    <div
      className="validation"
      style={{ backgroundImage: `url("/assets/ciudades/mardel.jpg")` }}
    ></div>
  )
}

const mapDispatchToProps = {
  sendIdValidation: userActions.sendIdValidation,
}
export default connect(null, mapDispatchToProps)(ValidateEmail)