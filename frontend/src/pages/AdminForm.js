import "../styles/Form.css";
import { useState } from "react";
import { connect } from "react-redux";
import propertiesActions from "../redux/action/propertiesActions";
import Swal from "sweetalert2"

const AdminForm = (props) => {
  let initState = {
    agents: ["61376cc8c4636a73e669b809"], // hardcodeado 1
    city: "61339e91002bc214e66e9770", // me la traigo por props.. dar opciones
    address: "", // ok
    district: "", // ok
    houseStyle: "", // te lo pongo como input pasar a text area
    videoURL: "", // ok
    photosURL: ["", "", "", ""], // x4
    isBrandNew: true, //
    isHouse: false, // ok
    forSale: true, // ok
    shortRental: false, // ok
    haveGarden: false, //
    haveGarage: false, //
    haveCameras: false,
    havePool: false, //
    hasAttendant: false, //
    isUSD: false, // ok
    numberOfBathrooms: 0, // ok
    numberOfBedrooms: 0, // ok
    numberOfRooms: 0, // ok
    roofedArea: 0, // ok
    totalArea: 0, // ok
    price: 0, // ok
    rentDuration: 0, // ok
  };
  const [newForm, setNewForm] = useState({
    agents: ["61376cc8c4636a73e669b809"], // hardcodeado 1
    city: "61339e91002bc214e66e9770", // me la traigo por props.. dar opciones
    address: "", // ok
    district: "", // ok
    houseStyle: "", // te lo pongo como input pasar a text area
    videoURL: "", // ok
    photosURL: ["", "", "", ""], // x4
    isBrandNew: true, //
    isHouse: false, // ok
    forSale: true, // ok
    shortRental: false, // ok
    haveGarden: false, //
    haveGarage: false, //
    haveCameras: false,
    havePool: false, //
    hasAttendant: false, //
    isUSD: false, // ok
    numberOfBathrooms: 0, // ok
    numberOfBedrooms: 0, // ok
    numberOfRooms: 0, // ok
    roofedArea: 0, // ok
    totalArea: 0, // ok
    price: 0, // ok
    rentDuration: 0, // ok
  });

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
    setNewForm({
      ...newForm,
      [e.target.name]: e.target.value,
    });
  };
  const forSaleHandler = (e) => {
    switch (e.target.value) {
      case "rental":
        setNewForm({
          ...newForm,
          forSale: false,
          shortRental: false,
        });
        break;
      case "shortRental":
        setNewForm({
          ...newForm,
          forSale: false,
          shortRental: true,
        });
        break;
      case "forSale":
        setNewForm({
          ...newForm,
          forSale: true,
          shortRental: false,
        });
        break;
      default:
        return false;
    }
  };
  const checkBoxHandler = (e) => {
    setNewForm({
      ...newForm,
      [e.target.name]: e.target.checked,
    });
  };
  const selectCityHandler = (e) => {
    let citySelected = props.cities.filter(
      (city) => city.cityName === e.target.value
    );
    setNewForm({
      ...newForm,
      [e.target.name]: citySelected[0]._id,
    });
  };
  const photoHandler = (e) => {
    switch (e.target.name) {
      case "photosURL1":
        setNewForm({
          ...newForm,
          photosURL: newForm.photosURL.map((photo, index) => {
            if (index === 0) {
              photo = e.target.value;
            }
            return photo;
          }),
        });
        break;
      case "photosURL2":
        setNewForm({
          ...newForm,
          photosURL: newForm.photosURL.map((photo, index) => {
            if (index === 1) {
              photo = e.target.value;
            }
            return photo;
          }),
        });
        break;
      case "photosURL3":
        setNewForm({
          ...newForm,
          photosURL: newForm.photosURL.map((photo, index) => {
            if (index === 2) {
              photo = e.target.value;
            }
            return photo;
          }),
        });
        break;
      case "photosURL4":
        setNewForm({
          ...newForm,
          photosURL: newForm.photosURL.map((photo, index) => {
            if (index === 3) {
              photo = e.target.value;
            }
            return photo;
          }),
        });
        break;
      default:
        return;
    }
  };
  const submitPropertyHandler = () => {
    let treatedForm = {
      ...newForm,
      numberOfBathrooms: parseInt(newForm.numberOfBathrooms),
      numberOfBedrooms: parseInt(newForm.numberOfBedrooms),
      numberOfRooms: parseInt(newForm.numberOfRooms),
      roofedArea: parseInt(newForm.roofedArea),
      totalArea: parseInt(newForm.totalArea),
      price: parseInt(newForm.price),
      rentDuration: parseInt(newForm.rentDuration),
    };
    props.postNewProperty(treatedForm, props.token)
    .then(res => {
      if (res.success) {
        renderToast("Propiedad cargada exitósamente", "success")
        setNewForm(initState)
      } else {
        renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
      }
    })
  }

  return (
    <div className="formProperties">
      <h1>Formulario de carga propiedades:</h1>
      <div>
        <h4>Locación:</h4>
        <label htmlFor="address">Domicilio:</label>
        <input
          type="text"
          name="address"
          id="address"
          onChange={inputHandler}
          value={newForm.address}
        ></input>
        <label htmlFor="district">Barrio:</label>
        <input
          type="text"
          name="district"
          id="district"
          onChange={inputHandler}
          value={newForm.district}
        ></input>
      </div>
      <div>
        <h4>Video:</h4>
        <label htmlFor="videoURL">Url Video youtube:</label>
        <input
          type="text"
          name="videoURL"
          id="videoURL"
          onChange={inputHandler}
          value={newForm.videoURL}
        ></input>
      </div>
      <div>
        <h4>Venta, Alquiler, Alquiler temporario:</h4>
        <label htmlFor="isRental">Alquiler:</label>
        <input
          type="radio"
          name="isForSaleOrWhat"
          value="rental"
          id="isRental"
          onChange={forSaleHandler}
        ></input>
        <label htmlFor="isShortRental">Alquiler Temporario:</label>
        <input
          type="radio"
          name="isForSaleOrWhat"
          value="shortRental"
          id="isShortRental"
          onChange={forSaleHandler}
        ></input>
        <label htmlFor="isForSale">Venta:</label>
        <input
          type="radio"
          name="isForSaleOrWhat"
          value="forSale"
          id="isForSale"
          onChange={forSaleHandler}
          checked={newForm.forSale}
        ></input>
        <label htmlFor="rentDuration">
          Duración del contrato (SI ES ALQUILER):
        </label>
        <input
          type="number"
          name="rentDuration"
          id="rentDuration"
          onChange={inputHandler}
          value={newForm.rentDuration}
        ></input>
        <label htmlFor="price">Precio:</label>
        <input
          type="number"
          name="price"
          id="price"
          onChange={inputHandler}
          value={newForm.price}
        ></input>
        <label htmlFor="isUSD">
          {newForm.isUSD ? "En dolares" : "En pesos"}
        </label>
        <input
          type="checkbox"
          name="isUSD"
          id="isUSD"
          checked={newForm.isUSD}
          onChange={checkBoxHandler}
        ></input>
      </div>
      <div>
        <h4>Cantidades y precio:</h4>
        <label htmlFor="numberOfBathrooms">Numero de baños:</label>
        <input
          type="number"
          name="numberOfBathrooms"
          id="numberOfBathrooms"
          onChange={inputHandler}
          value={newForm.numberOfBathrooms}
        ></input>
        <label htmlFor="numberOfBedrooms">Numero de dormitorios:</label>
        <input
          type="number"
          name="numberOfBedrooms"
          id="numberOfBedrooms"
          onChange={inputHandler}
          value={newForm.numberOfBedrooms}
        ></input>
        <label htmlFor="numberOfRooms">Numero de ambientes:</label>
        <input
          type="number"
          name="numberOfRooms"
          id="numberOfRooms"
          onChange={inputHandler}
          value={newForm.numberOfRooms}
        ></input>
        <label htmlFor="roofedArea">Superficie cubierta:</label>
        <input
          type="number"
          name="roofedArea"
          id="roofedArea"
          onChange={inputHandler}
          value={newForm.roofedArea}
        ></input>
        <label htmlFor="totalArea">Superficie total:</label>
        <input
          type="number"
          name="totalArea"
          id="totalArea"
          onChange={inputHandler}
          value={newForm.totalArea}
        ></input>
      </div>
      <div>
        <h4>Tipo propiedad</h4>
        <label htmlFor="isHouse">
          {newForm.isHouse ? "Casa" : "Departamento"}
        </label>
        <input
          type="checkbox"
          name="isHouse"
          id="isHouse"
          checked={newForm.isHouse}
          onChange={checkBoxHandler}
        ></input>
      </div>
      <div>
        <h4>Informacion adicional:</h4>
        <label htmlFor="isBrandNew">A estrenar:</label>
        <input
          type="checkbox"
          name="isBrandNew"
          id="isBrandNew"
          checked={newForm.isBrandNew}
          onChange={checkBoxHandler}
        ></input>
        <label htmlFor="haveGarage">Tiene garage:</label>
        <input
          type="checkbox"
          name="haveGarage"
          id="haveGarage"
          checked={newForm.haveGarage}
          onChange={checkBoxHandler}
        ></input>
        <label htmlFor="havePool">Tiene piscina:</label>
        <input
          type="checkbox"
          name="havePool"
          id="havePool"
          checked={newForm.havePool}
          onChange={checkBoxHandler}
        ></input>
        <label htmlFor="haveGarden">Tiene jardín:</label>
        <input
          type="checkbox"
          name="haveGarden"
          id="haveGarden"
          checked={newForm.haveGarden}
          onChange={checkBoxHandler}
        ></input>
        <label htmlFor="hasAttendant">Tiene portero:</label>
        <input
          type="checkbox"
          name="hasAttendant"
          id="hasAttendant"
          checked={newForm.hasAttendant}
          onChange={checkBoxHandler}
        ></input>
        <label htmlFor="haveCameras">Tiene camaras:</label>
        <input
          type="checkbox"
          name="haveCameras"
          id="haveCameras"
          checked={newForm.haveCameras}
          onChange={checkBoxHandler}
        ></input>
      </div>
      <div>
        <h4>Descripcion:</h4>
        <label htmlFor="houseStyle">
          Descripcion de la propiedad (MAX 200 caracteres):
        </label>
        <textarea
          id="houseStyle"
          name="houseStyle"
          rows="4"
          cols="50"
          onChange={inputHandler}
          value={newForm.houseStyle}
        ></textarea>
      </div>
      <div>
        <h4>URL fotos:</h4>
        <label htmlFor="photosURL1">Foto 1:</label>
        <input
          type="text"
          name="photosURL1"
          id="photosURL1"
          onChange={photoHandler}
          value={newForm.photosURL[0]}
        ></input>
        <label htmlFor="photosURL2">Foto 2:</label>
        <input
          type="text"
          name="photosURL2"
          id="photosURL2"
          onChange={photoHandler}
          value={newForm.photosURL[1]}
        ></input>
        <label htmlFor="photosURL3">Foto 3:</label>
        <input
          type="text"
          name="photosURL3"
          id="photosURL3"
          onChange={photoHandler}
          value={newForm.photosURL[2]}
        ></input>
        <label htmlFor="photosURL4">Foto 4:</label>
        <input
          type="text"
          name="photosURL4"
          id="photosURL4"
          onChange={photoHandler}
          value={newForm.photosURL[3]}
        ></input>
      </div>
      <div>
        <h4>Ciudad:</h4>
        <label htmlFor="city-select">Seleccione ciudad:</label>
        <select name="city" id="city-select" onChange={selectCityHandler}>
          {props.cities.map((city) => (
            <option key={city._id}>{city.cityName}</option>
          ))}
        </select>
      </div>
      <button type="button" onClick={submitPropertyHandler}>
        CARGAR PROPIEDAD
      </button>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    // admin: state.user.admin
    cities: state.allCities.cities,
  };
};
const mapDispatchToProps = {
  postNewProperty: propertiesActions.postNewProperty,
};
export default connect(mapStateToProps, mapDispatchToProps)(AdminForm);
