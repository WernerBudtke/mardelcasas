import "../styles/App.css"
import React from "react"
import userActions from "../redux/action/userActions"
import { connect } from "react-redux"
import { useState } from "react"
import Swal from "sweetalert2"

const ResetPassword = (props) => {
  const [user, setUser] = useState({})
  const submitPassword = async () => {
    try {
      let res = await props.sendIdPassword(props.match.params.id, user)
      if (res.success) {
        renderToast("Tu contraseña se cambió con éxito", "success")
        return props.history.push("/")
      } else {
        throw new Error()
      }
    } catch {
      renderToast("Hubo un error, intente nuevamente más tarde", "warning")
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
    <div className="formSign">
      <form>
        <h1>Restablece tu contraseña</h1>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => setUser({password: e.target.value})}
          />
        </div>
      </form>
      <div className="submit">
        <button onClick={submitPassword}>Enviar</button>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  sendIdPassword: userActions.sendIdPassword,
}

export default connect(null, mapDispatchToProps)(ResetPassword)