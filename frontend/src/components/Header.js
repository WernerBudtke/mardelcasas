import React from "react"
import { useHistory, Link, NavLink } from "react-router-dom"
import Navbar from "./Navbar"
import { ArrowLeftCircle } from "react-bootstrap-icons"
import { connect } from "react-redux"

const Header = ({admin}) => {
  const history = useHistory()
  const {pathname} = history.location
  
  let linkValue
  
  if (pathname.startsWith("/propiedad/")) {
    linkValue = "/lista-de-propiedades"
  } else {
    linkValue = "/"
  }

  return (
    <header>
      <div>  
        {(pathname === "/") && <div className="goBackPH"></div>}
        {!(pathname === "/") &&
          <Link to={linkValue}>
            <ArrowLeftCircle
              width="2rem" height="2rem"
            />
          </Link>
        }
      
        <Link to="/">
          <img src="/assets/MARDELCASAS.png" alt="logoMarDelCasas" />
          <h1>MarDelCasas</h1>
        </Link>
      </div>

      {admin &&
        <NavLink to="/chat-soporte" id="admin">
          Chat de Soporte
        </NavLink>
      }
      {admin &&
        <NavLink to="/formulario-propiedades" id="adminForm">
          Formulario de Propiedades
        </NavLink>
      }

      <div className="nav">
        <Navbar />
      </div>
    </header>
  )
}

const mapStateToProps = (state) =>{
  return {
    admin: state.user.admin,
  } 
}

export default connect(mapStateToProps)(Header)