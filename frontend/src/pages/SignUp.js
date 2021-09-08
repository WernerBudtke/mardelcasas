import "../styles/Form.css";
import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/Navbar";
import { useState } from "react";
import { connect } from "react-redux";
import userActions from "../redux/action/userActions";
import GoogleLogin from "react-google-login";

const SignUp = (props) => {
  const [errors, setErrors] = useState([]);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    password: "",
    eMail: "",
    photoURL: "",
  });

  const inputNameHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const submitUser = async () => {
    if (Object.values(user).includes("")) {
      console.log("todos los campos son obligatorios");
    } else if (!user.eMail.includes("@")) {
      console.log("Por favor ingrese un mail válido");
    } else {
      try {
        let res = await props.registerUser(user);
        if (!res.success) {
          if (res.response) throw res.response;
          else setErrors(res.errors);
          console.log(res);
        } else if (res.success) {
          try {
            console.log("Usuario registrado con éxito");
            let responseSendEmail = await props.validationUserToken(
              res.response.token
            );
            if (responseSendEmail.success)
              console.log("Te enviamos un mail para que valides tu cuenta");
            else {
              console.log("Hubo un error, intente nuevamente más tarde");
            }
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const sendValidationEmail = async () => {
    try {
      let res = await props.validationUserEmail(user.eMail);
      if (res.success) {
        console.log("Te enviamos un mail para que valides tu cuenta");
      } else {
       throw res.response
      }
    } catch (e) {
      console.log(e);
    }
  };
  const responseGoogle = async (response) => {
    let user = {
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName,
      photoURL: response.profileObj.imageUrl,
      password: response.profileObj.googleId,
      eMail: response.profileObj.email,
      google: true,
    };
    try {
      let res = await props.registerUser(user);
      if (!res.success) {
        console.log("El mail ya está registrado");
        // throw res.response. Si fuerzo el error me llega desde el back en ingles ver).
      } else {
        try {
          console.log("Usuario registrado con éxito");
          let response = await props.validationUserToken(res.response.token);
          if (response.success)
            console.log("Te enviamos un mail para que valides tu cuenta");
          else {
            console.log("Hubo un error, intente nuevamente más tarde");
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (err) {
      console.log(err);
      //   console.log("Tenemos un problema, por favor intenta más tarde");
    }
  };
  const renderError = (inputName) => {
    let errorToRender = errors.find((error) => error.path[0] === inputName);
    return (
      <p className="errorInputs" style={{ opacity: errorToRender ? "1" : "0" }}>
        {errorToRender ? errorToRender.message : "&nbsp;"}
      </p>
    );
  };
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
            onChange={inputNameHandler}
          />
          {renderError("firstName")}
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            onChange={inputNameHandler}
          />
          {renderError("lastName")}
        </div>
        <div>
          <input
            type="email"
            name="eMail"
            placeholder="Email"
            onChange={inputNameHandler}
          />
          {renderError("eMail")}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={inputNameHandler}
          />
          {renderError("password")}
        </div>
        <div>
          <input
            type="text"
            name="photoURL"
            placeholder="Url de foto"
            onChange={inputNameHandler}
          />
          {renderError("photoURL")}
        </div>
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
        <button>Inicia sesion con Facebook</button>
        <GoogleLogin
          clientId="449628523643-i6mlv9530rqnelgmf3gribco7nvsi4vr.apps.googleusercontent.com"
          className="botonSub"
          buttonText="Registrarse con Google"
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
      <div className="submit">
        <p>¿No te llegó el mail de validación?</p>
        <input
          type="text"
          name="eMail"
          placeholder="Email"
          onChange={(e) => setUser({ eMail: e.target.value })}
        />
        <div className="">
          <button onClick={sendValidationEmail}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  registerUser: userActions.createUser,
  validationUserToken: userActions.validationUserToken,
  validationUserEmail: userActions.validationUserEmail,
};

export default connect(null, mapDispatchToProps)(SignUp);
