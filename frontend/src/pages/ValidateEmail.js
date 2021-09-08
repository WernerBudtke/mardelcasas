import "../styles/App.css";
import React from "react";
import { useEffect } from "react";
import userActions from "../redux/action/userActions";
import { connect } from "react-redux";
const ValidateEmail = (props) => {
  useEffect(() => {
    const sendIdforValidation = async () => {
      try {
        let res = await props.sendIdValidation(props.match.params.id);
        if (res.success) {
          alert("Tu cuenta se validó con éxito");
          return props.history.push("/");
        }
        !res.success && console.log("Hubo un problema, intente más tarde");
      } catch (e) {
        console.log(e);
      }
    };
    sendIdforValidation();
  }, []);
  return (
    <div
      className="validation"
      style={{ backgroundImage: `url("/assets/ciudades/mardel.jpg")` }}
    ></div>
  );
};

const mapDispatchToProps = {
  sendIdValidation: userActions.sendIdValidation,
};
export default connect(null, mapDispatchToProps)(ValidateEmail);
