import "../styles/CardProperty.css"
import CarouselImg from "./CarouselImg"
import {Link} from "react-router-dom"
import { BiBath } from "react-icons/bi"
import { BiCar } from "react-icons/bi"
import { IoBedOutline } from "react-icons/io5"
import { IoIosPin } from "react-icons/io"

const CardProperty = (props) => {
    const property = props.property
    // console.log(property)
    const currency = property.isUSD ? "USD" : "$"
    const contract = property.forSale ? "Propiedad a la venta" : "Propiedad en alquiler"
    const type = property.isHouse ? "Casa" : "Departamento"
    const bathrooms = property.numberOfBathrooms === 1 ? "baño" : "baños"
    const garage = property.haveGarage > 0 ? " cochera" : null
    const goToProperty = () => {
        // console.log(property._id)
    }
    return(

        <>
        <Link property={property} to={`/propiedad/${property._id}`} className="cardProperty" id="mobile">
            <div className="pictureCardProperty"  style={{backgroundImage:`url(${property.photosURL[0]})`}}>
                <h3>{currency} {property.price}</h3>
                <h4>{contract}</h4>
            </div>
            <div className="cardPropertyInfo">
                <div className="infoHeader">
                    <h3>{currency} {property.price}</h3>
                    <h4>{contract}</h4>
                </div>
                <p className="propertyInfoOne">{type} {property.numberOfRooms} amb {property.roofedArea}m cubiertos</p>
                <p className="propertyInfoTwo"><IoBedOutline/> {property.numberOfBedrooms} hab / <BiBath/> {property.numberOfBathrooms} {bathrooms}
                {garage && " / "}
                {garage && <BiCar/>}
                {garage} </p>
                <p className="propertyInfoThree"><IoIosPin/> {property.address}, {property.district}</p>
            </div>
        </Link>
        <div property={property} className="cardProperty Desktop">
            <div className="pictureCardProperty"  style={{backgroundImage:`url(${property.photosURL[0]})`}}>
                <h3>{currency} {property.price}</h3>
                <h4>{contract}</h4>
            </div>
            <div className="cardPropertyInfo">
                <div className="infoHeader">
                    <CarouselImg property={property.photosURL}/>
                    <h3 onClick={goToProperty}>Ir</h3>
                    <h3>{currency} {property.price}</h3>
                    <h4>{contract}</h4>
                </div>
                <p className="propertyInfoOne">{type} {property.numberOfRooms} amb {property.roofedArea}m cubiertos</p>
                <p className="propertyInfoTwo"><IoBedOutline/> {property.numberOfBedrooms} hab / <BiBath/> {property.numberOfBathrooms} {bathrooms}
                {garage && " / "}
                {garage && <BiCar/>}
                {garage} </p>
                <p className="propertyInfoThree">{property.address}, {property.district} <IoIosPin/></p>
            </div>
        </div>
        </>
    )
}

export default CardProperty