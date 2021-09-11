import "../styles/Form.css"
import React from "react"
import { Link } from "react-router-dom"
import NavBar from "../components/Navbar"
import { useState } from "react"
import { connect } from "react-redux"
import userActions from "../redux/action/userActions"
import GoogleLogin from "react-google-login"
import Swal from "sweetalert2"

const SignIn = (props) => {
  const [openPassword, setOpenPassword] = useState(false)
  const [user, setUser] = useState({
    password: "",
    eMail: "",
    google: false,
    facebook: false
  })

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

  const inputNameHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  const submitUser = async () => {
    if (Object.values(user).includes("")) {
      renderToast("Todos los campos son obligatorios", "warning")
    } else {
      try {
        let res = await props.logUser(user)
        !res.success ?
        renderToast(res.error, "warning") :
        renderToast("¡Bienvenido de nuevo!", "success")
      } catch {
        renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
      }
    }
  }

  const sendChangePassword = async () => {
    try {
      let res = await props.sendChangePasswordEmail(user.eMail)
      if (res.success) {
        renderToast("Te enviamos un mail para que puedas cambiar tu clave", "success")
      } else {
        renderToast(res.error, "warning")
      }
    } catch {
      renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
    }
  }

  const responseGoogle = async (response) => {
    let user = {
      password: response.profileObj.googleId,
      eMail: response.profileObj.email,
      google: true,
    }
    try {
      let res = await props.logUser(user)
      if (!res.success) {
        renderToast("No tienes una cuenta registrada con Google", "warning")
      } else {
        renderToast("¡Bienvenido de nuevo!", "success")
      }
    } catch {
      renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
    }
  }

  const submitWithEnter = (e) => {
    e.key === "Enter" && submitUser()
  }

  return (
    <div className="formSign">
      <NavBar />
      <form>
        <h1>Inicia Sesión</h1>
        <div>
          <input
            type="email"
            name="eMail"
            placeholder="Email"
            onChange={inputNameHandler}
            onKeyDown={submitWithEnter}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={inputNameHandler}
            onKeyDown={submitWithEnter}
          />
        </div>
      </form>
      <div className="submit">
        <button onClick={submitUser}>Enviar</button>
      </div>
      <div className="submit">
        <p>
          ¿No tienes una cuenta?
          <Link to="/registrarse">
            <span> Registrate</span>
          </Link>
        </p>
      </div>
      <div className="logGoogle">
        <GoogleLogin
          clientId="449628523643-i6mlv9530rqnelgmf3gribco7nvsi4vr.apps.googleusercontent.com"
          className="botonSub"
          buttonText="Ingresa con Google"
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
      <div className="submit">
        <Link to="#" onClick={() => setOpenPassword(!openPassword)}>
          ¿Olvidaste la clave?
        </Link>
        {openPassword && (
          <>
            <input
              type="text"
              name="eMail"
              placeholder="Email"
              onChange={(e) => setUser({ eMail: e.target.value })}
            />
            <div className="">
              <button onClick={sendChangePassword}>Enviar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  logUser: userActions.logIn,
  sendChangePasswordEmail: userActions.changePassword,
}
export default connect(null, mapDispatchToProps)(SignIn)