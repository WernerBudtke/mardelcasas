import "../styles/NavBar.css"
import React from "react"
import { useState } from "react"
import { useHistory, Link } from "react-router-dom"
import { connect } from "react-redux"
import userActions from "../redux/action/userActions"
import WishList from "./WishList"
import { BookmarkStar, PersonCheck, PersonCheckFill, PersonPlus, PersonX } from "react-bootstrap-icons"


const NavBar = ({token, logOut, photoURL}) => {
  const [navOpen, setNavOpen] = useState(false)
  const [wishlist, setWishList] = useState(false)
  const history = useHistory()
  console.log(token)
  
  const showWishList = () => {
    setWishList(!wishlist)
  }

  const closeWishList = () => {
    setWishList(false)
  }

  const nav = !token ?
    [
      { logo: <PersonCheck /> ,name: "Ingresar", route: "/iniciar-sesion", action: null },
      { logo: <PersonPlus />, name: "Registrarse", route: "/registrarse", action: null },
    ] :
    [ 
      { logo: <PersonX />, name:"Cerrar Sesión", route: "#", action: logOut}, 
      { logo: <BookmarkStar />, name:"Favoritos", route:"#", action: showWishList }
    ]

  var navMap = nav.map((a, index) => (
    <Link key={index} to={a.route} onClick={a.action} style={{display:history.location.pathname !== "/chat-soporte" ? "inherit" : "none"}}>
      {a.logo}{a.name}
    </Link>
  ))
  console.log(photoURL)

  return (
    <div className="navBar">
      <button onClick={() => setNavOpen(!navOpen)}>
        {photoURL === null ? <div style={{backgroundImage: `url("/assets/logo.png")`}} alt="logo user" className="logoUser"></div> : <div style={{backgroundImage: `url("${photoURL}")`}} alt="logo user" className="logoUser"></div>} 
      </button>
      {wishlist &&  <WishList closeWishList={closeWishList} />}
      {navOpen && (
        <div>
          <nav className="userMenu">{navMap}</nav>
          <div className="closeDiv1" 
            onClick={() => setNavOpen(false)}>
          </div>
          <div className="closeDiv2" 
            onClick={() => setNavOpen(false)}>
          </div>
        </div>
      )}
    </div>
  )
}

const mapDispatchToProps = {
  logOut: userActions.logOut,
}

const mapStateToProps = (state) =>{
  return {
    token: state.user.token,
    photoURL: state.user.photoURL
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)


 // <img
        //   className="logoUser"
        //   src={photoURL === null ? "/assets/logo.png" : photoURL}
        //   alt="logo-user"
        //   width="50px"
        //   height="50px"
        // />