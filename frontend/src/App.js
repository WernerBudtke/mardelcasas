import "./styles/App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import PropertiesList from "./pages/PropertiesList";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Property from "./pages/Property"
import ValidateEmail from "./pages/ValidateEmail";
import UserChat from "./components/UserChat";
import Admin from "./pages/Admin";
import AdminForm from "./pages/AdminForm";
import BanAnAccount from "./pages/BanAnAccount";
import { connect } from "react-redux";
import ResetPassword from "./pages/ResetPassword";
function App (props) {
  const {admin, token} = props
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/usuario/validar-email/:id" component={ValidateEmail} />
        <Route path="/usuario/restablecer-contraseña/:id" component={ResetPassword} />
        <Route path="/lista-de-propiedades" component={PropertiesList} />
        <Route path="/propiedad/:id" component={Property}/>
        {!token && <Route path="/registrarse" component={SignUp} />}
        {!token && <Route path="/iniciar-sesion" component={SignIn} />}
        {admin && <Route path="/chat-soporte" component={Admin}/>}
        {admin && <Route path="/formulario-propiedades" component={AdminForm}/>}
        <Route path="/usuario/confirmacion-deshabilitar-cuenta/:id" component={BanAnAccount} />
        <Redirect to="/" />
      </Switch>
      {(!admin) && <UserChat/>}
    </BrowserRouter>
  );
}
const mapStateToProps = (state) =>{
  return {
    admin: state.user.admin,
    token: state.user.token
  } 
}
export default connect(mapStateToProps)(App);
