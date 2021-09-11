import "../styles/CardProperty.css"
import CarouselImg from "./CarouselImg"
import {Link} from "react-router-dom"
import { BiBath, BiCar } from "react-icons/bi"
import { IoBedOutline } from "react-icons/io5"
import { IoIosPin } from "react-icons/io"

const CardProperty = (props) => {
    const property = props.property
    // console.log(property)
    console.log(props)
    const currency = property.isUSD ? "USD" : "$"
    const contract = property.forSale ? "Propiedad a la venta" : "Propiedad en alquiler"
    const type = property.isHouse ? "Casa" : "Departamento"
    return(
        <>
            <Link to={`/propiedad/${property._id}`} className="cardProperty" id="mobile">
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
                    <p className="propertyInfoTwo"><IoBedOutline/> {property.numberOfBedrooms} / <BiBath/> {property.numberOfBathrooms}
                    {property.haveGarage && " / "}
                    {property.haveGarage && <BiCar/>}</p>
                    <p className="propertyInfoThree"><IoIosPin/> {property.address}, {property.district}</p>
                </div>
            </Link>
            <div className="cardProperty Desktop">
                <div className="pictureCardProperty"  style={{backgroundImage:`url(${property.photosURL[0]})`}}>
                    <CarouselImg property={property.photosURL}/>
                </div>
                <div className="cardPropertyInfo">
                    <div className="infoHeader">
                        <Link to={`/propiedad/${property._id}`} className="buttom">+ Info</Link>
                        <h3>{currency} {property.price}</h3>
                        <h4>{contract}</h4>
                    </div>
                    <p className="propertyInfoOne">{type} {property.numberOfRooms} amb {property.roofedArea}m cubiertos</p>
                    <p className="propertyInfoTwo"><IoBedOutline/> {property.numberOfBedrooms} / <BiBath/> {property.numberOfBathrooms}
                    {property.haveGarage && " / "}
                    {property.haveGarage && <BiCar/>}</p>
                    <p className="propertyInfoThree">{property.address}, {property.district} <IoIosPin/></p>
                </div>
            </div>
        </>
    )
}

export default CardProperty