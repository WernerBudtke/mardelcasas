import React from "react"
import { useHistory ,Link } from "react-router-dom"
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
          <h1>MarDelCasas</h1>
        </Link>
      </div>

      {admin &&
        <Link to="/admin" id="admin">
          Panel Admin
        </Link>
      }
      {admin &&
        <Link to="/addprop" id="adminForm">
          Admin Form
        </Link>
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