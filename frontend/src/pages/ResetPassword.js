import "../styles/App.css";
import React from "react";
import userActions from "../redux/action/userActions";
import { connect } from "react-redux";
import { useState } from "react";
const ResetPassword = (props) => {
  const [user, setUser] = useState({});
  const submitPassword = async () => {
    try {
      let res = await props.sendIdPassword(props.match.params.id, user);
      if (res.success) {
        alert("Tu contraseña se cambió con éxito");
        return props.history.push("/");
      }
      if (!res.success) throw res;
    } catch (e) {
      console.log(e);
    }
  };
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
  );
};

const mapDispatchToProps = {
  sendIdPassword: userActions.sendIdPassword,
};
export default connect(null, mapDispatchToProps)(ResetPassword);
