import "../styles/Form.css"
import React from "react"
import { Link } from "react-router-dom"
import NavBar from "../components/Navbar"
import { useState } from "react"
import { connect } from "react-redux"
import userActions from "../redux/action/userActions"
import GoogleLogin from "react-google-login"
import Swal from "sweetalert2"

const SignUp = (props) => {
  const [openValidation, setOpenValidation] = useState(false)
  const [errors, setErrors] = useState([])
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    password: "",
    eMail: "",
    photoURL: "",
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

  const inputHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  const submitUser = async () => {
    if (Object.values(user).includes("")) {
      setErrors([
        { message: "Todos los campos son obligatorios", path: ["extra"] },
      ])
    } else if (!user.eMail.includes("@")) {
      setErrors([
        { message: "Por favor ingrese un mail válido", path: ["extra"] },
      ])
    } else {
      try {
        let res = await props.registerUser(user)
        console.log(res)
        if (!res.success) {
          typeof res.errors !== "string" ?
          setErrors(res.errors) :
          renderToast("Hubo un error, intente nuevamente más tarde", "warning")
        } else {
          try {
            renderToast("Usuario registrado con éxito", "success")
            let responseSendEmail = await props.validationUserToken(
              res.response.token
            )
            if (responseSendEmail.success)
              renderToast("Te enviamos un mail para que valides tu cuenta", "success")
            else {
              setErrors([
                {
                  message: "Hubo un error, intente nuevamente más tarde",
                  path: ["extra"],
                },
              ])
            }
          } catch {
            renderToast("Hubo un error, intente nuevamente más tarde", "warning")
          }
        }
      } catch {
        renderToast("Hubo un error, intente nuevamente más tarde", "warning")
      }
    }
  }

  const sendValidationEmail = async () => {
    try {
      let res = await props.validationUserEmail(user.eMail)
      console.log(res)
      if (res.success) {
        renderToast("Te enviamos un mail para que valides tu cuenta", "success")
      } else {
        throw new Error()
      }
    } catch {
      renderToast("Usuario no válido", "warning")
    }
  }

  const responseGoogle = async (response) => {
    let user = {
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName,
      photoURL: response.profileObj.imageUrl,
      password: response.profileObj.googleId,
      eMail: response.profileObj.email,
      google: true,
    }
    try {
      let res = await props.registerUser(user)
      if (!res.success) {
        renderToast("El mail ya está registrado", "warning")
      } else {
        try {
          renderToast("Usuario registrado con éxito", "success")
          let response = await props.validationUserToken(res.response.token)
          if (response.success)
            renderToast("Te enviamos un mail para que valides tu cuenta", "success")
          else {
            renderToast("Hubo un error, intente nuevamente más tarde", "warning")
          }
        } catch {
          renderToast("Hubo un error, intente nuevamente más tarde", "warning")
        }
      }
    } catch {
      renderToast("Hubo un error, intente nuevamente más tarde", "warning")
    }
  }

  const renderError = (inputName) => {
    let errorToRender = errors.find((error) => error.path[0] === inputName)
    return (
      <p className="errorInputs" style={{ opacity: errorToRender ? "1" : "0" }}>
        {errorToRender ? errorToRender.message : "&nbsp;"}
      </p>
    )
  }

  const submitWithEnter = (e) => {
    e.key === "Enter" && submitUser()
  }

  return (
    <div className="formSign">
      <NavBar />
      <form>
        <h1>Crea una cuenta</h1>
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            onChange={inputHandler}
            onKeyDown={submitWithEnter}
          />
          {renderError("firstName")}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            onChange={inputHandler}
            onKeyDown={submitWithEnter}
          />
          {renderError("lastName")}
        </div>
        <div>
          <input
            type="email"
            name="eMail"
            placeholder="Email"
            onChange={inputHandler}
            onKeyDown={submitWithEnter}
          />
          {renderError("eMail")}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={inputHandler}
            onKeyDown={submitWithEnter}
          />
          {renderError("password")}
        </div>
        <div>
          <input
            type="text"
            name="photoURL"
            placeholder="Url de foto"
            onChange={inputHandler}
            onKeyDown={submitWithEnter}
          />
          {renderError("photoURL")}
        </div>
        {renderError("extra")}
      </form>
      <div className="submit">
        <button onClick={submitUser}>Enviar</button>
      </div>
      <div className="submit">
        <p>
          ¿Tenés una cuenta?
          <Link to="/iniciar-sesion">
            <span> Inicia Sesión</span>
          </Link>
        </p>
      </div>
      <div className="submit">
        <Link to="/">Volver a Home</Link>
      </div>
      <div className="logGoogle">
        <GoogleLogin
          clientId="449628523643-i6mlv9530rqnelgmf3gribco7nvsi4vr.apps.googleusercontent.com"
          className="botonSub"
          buttonText="Registrarse con Google"
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
      <div className="submit">
        <Link to="#" onClick={() => setOpenValidation(!openValidation)}>
          ¿No te llegó el mail de validación? Hacé click aquí
        </Link>
        {openValidation && (
          <>
            <input
              type="text"
              name="eMail"
              placeholder="Email"
              onChange={(e) => setUser({ eMail: e.target.value })}
            />
            <div className="">
              <button onClick={sendValidationEmail}>Enviar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  registerUser: userActions.createUser,
  validationUserToken: userActions.validationUserToken,
  validationUserEmail: userActions.validationUserEmail,
}

export default connect(null, mapDispatchToProps)(SignUp)