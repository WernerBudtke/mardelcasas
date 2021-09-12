import "../styles/BanAnAccount.css";
import React, { useState } from 'react';
import { connect } from 'react-redux';
import userActions from "../redux/action/userActions";
import { Link } from "react-router-dom";

const BanAnAccount = (props) => {
    
    const [banMessage, setBanMessage] = useState(false)
    const [userData, setUserData] = useState()

    console.log(props)

    const noClickHandler = () => {
        console.log("no gracias")
        props.history.push("/")
    }

    const siClickHandler = async () => {
        console.log("si, deshabilitar")
        try {
            let res = await props.disableUser(props.match.params.id)
            if (!res.success) {
                throw res.response
            } else {
                console.log(res.response)
                setUserData(res.response)
                setBanMessage(!banMessage)
            }
         } catch (err) {
             console.log(err)
         }
    }

    return (
        <div className="banAnAccount">
            <div className="banAnAccountText">
                <h3>Estás seguro que quieres deshabilitar tu cuenta?</h3>
            </div>    
            <div className="banAnAccountButton">
                <button onClick={noClickHandler} className="">No, gracias</button>
                <button onClick={siClickHandler} className="">Si, deshabilitar</button>
            </div>
            <div className="banAnAccountMessage">
                {banMessage && 
                    <div>
                        <h3>La cuenta <span>{userData.userEmail}</span> ha sido deshabilitada exitosamente.</h3>
                        <h3>Escribenos a <a href="mailto: mardelcasas@gmail.com">mardelcasas@gmail.com</a> para rehabilitarla o puedes volver a <Link to="/">home</Link> y registrarte con otro correo electrónico</h3>
                    </div>}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = {
    disableUser: userActions.disableUser
}

export default connect(mapStateToProps, mapDispatchToProps)(BanAnAccount)
