import "../styles/BigFilter.css"
import React, { useEffect, useState } from 'react'
import { PlusSquare, Search } from "react-bootstrap-icons"
import {connect} from 'react-redux'
import propertiesActions from "../redux/action/propertiesActions"
// import CardProperty from "./CardProperty"
import FiltersSelected from "./FiltersSelected"
import citiesActions from "../redux/action/citiesActions"
import Swal from "sweetalert2"
// import "animate.css"

const BigFilter = (props) => {
    const {filterObj, setFilter, getCities, cities, properties} = props
    console.log("Estoy en Big Filter")
    console.log("Filter que llega del store", filterObj)
    const [bigFilter, setBigFilter] = useState(filterObj)
    const [render, setRender] = useState(false)
    const [formFilter, setFormFilter] = useState({
        operation: "allCases",  city:"allCases", isHouse: "allCases", 
        numberOfRooms:"allCases", numberOfBedrooms: "allCases", numberOfBathrooms: "allCases",
        isUSD:"allCases", greater:"", lower:"", roofedArea:"allCases",
        isBrandNew:false, haveGarden:false, haveGarage:false, havePool:false
    })

    useEffect(() => {
        if (!cities.length) {
            getCities().then(res => {
                if(!res.success){
                    throw new Error()
                }
            })
            .catch(() => {
                renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
            })
        }   
        // eslint-disable-next-line react-hooks/exhaustive-deps     
    }, [])

    useEffect(() => {
        let newOperation = "allCases"
        let numOfBath = "allCases"  
        let numOfBed = "allCases"
        let numOfRoom = "allCases"
        let isHouse = "allCases"
        let roofed = "allCases"
        setBigFilter(filterObj)
        console.log(numOfBed)
        if(Object.keys(filterObj).length > 0){
            if(filterObj.forSale){
                newOperation = "forSale"
            } 
            if(typeof filterObj.forSale === "boolean" && typeof filterObj.shortRental === "boolean"){
              if(!filterObj.forSale && !filterObj.shortRental){
                  newOperation = "forRental"
              }
              if(!filterObj.forSale && filterObj.shortRental){
                  newOperation = "shortRental"
              }
            }
            if(filterObj.numberOfBathrooms){
                console.log(filterObj.numberOfBathrooms)
                numOfBath = typeof filterObj.numberOfBathrooms  === "object" ? "6AndMore" : filterObj.numberOfBathrooms
                console.log(numOfBath)
            }
            if(filterObj.numberOfBedrooms){
                console.log(filterObj.numberOfBedrooms)
                numOfBed = typeof filterObj.numberOfBedrooms  === "object" ? "6AndMore" : filterObj.numberOfBedrooms
                console.log(numOfBed)
            }
            if(filterObj.numberOfRooms){
              console.log(filterObj.numberOfRooms)
              numOfRoom = typeof filterObj.numberOfRooms  === "object" ? "6AndMore" : filterObj.numberOfRooms
              console.log(numOfBed)
            }
    
            if(typeof filterObj.isHouse !== "undefined"){
                isHouse = filterObj.isHouse ? 'house' : 'apartment'
            }        
        }
        setFormFilter({...formFilter,...filterObj, operation: newOperation, numberOfRooms: numOfRoom, numberOfBedrooms: numOfBed, numberOfBathrooms: numOfBath, isHouse: isHouse, roofedArea: roofed})
    // eslint-disable-next-line
    },[filterObj])

    // variable de estado para que se muestre o no los formularios del filtro
    const [selectFilters, setSelectFilters] = useState(false)

    const deletePropertieFromObject = (name) => {
        let objectAux = {};
        Object.keys(bigFilter).forEach((key) =>{
            if(key !== name) objectAux[key] = bigFilter[key] //limpio el objeto filtro sin esta propiedad
        })
        setBigFilter(objectAux)
        return objectAux
    }

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
    
    const operationHandler = (e) => {
        switch (e.target.value) {
            case "allCases":
                let objectAux = {};
                Object.keys(bigFilter).forEach((key) =>{
                    if(!(key === "forSale" || key ==="shortRental")) objectAux[key] = bigFilter[key]
                })
                setBigFilter(objectAux)
                break;
            
            case "forSale":
                setBigFilter({ ...bigFilter, forSale: true, shortRental:false })
                
                break;
             
            case "forRental":
                setBigFilter({ ...bigFilter, forSale: false, shortRental:false })                
                break;                
            
            case "shortRental":
                setBigFilter({ ...bigFilter, forSale: false, shortRental: true })                
                break;

            default:
                break;
        }
        setFormFilter({ ...formFilter, operation: e.target.value})
    }

    const selectHandler = (e, condition, firstValue, secondValue) => {
        if (e.target.value === "allCases") {
            deletePropertieFromObject(e.target.name)
        } else if( e.target.value === condition) {
            setBigFilter( { ...bigFilter, [e.target.name]: firstValue } )
        } else {
            setBigFilter( { ...bigFilter, [e.target.name]: secondValue } )
        }
        setFormFilter({ ...formFilter, [e.target.name]: e.target.value})
    }

    const priceHandler = (e) => {
        if(e.target.value<0) e.target.value = 0 // SI ENTRA EL e NUMERO CAPAZ ROMPE TODO
        if(e.target.value === "") {
            deletePropertieFromObject(e.target.name)
        } else {
            setBigFilter( { ...bigFilter, [e.target.name]: parseInt(e.target.value) } )
        }
        setFormFilter({ ...formFilter, [e.target.name]: e.target.value})
    }    

    const checkBoxHandler = (e) => {
        if (!e.target.checked) {
            deletePropertieFromObject(e.target.name)
        } else {
            setBigFilter( { ...bigFilter, [e.target.name]: e.target.checked })
        }
        setFormFilter({ ...formFilter, [e.target.name]: e.target.checked})
    }

    const searchProperties = () => {
        props.getPropertiesFiltered(bigFilter)
        .then(res => {
            if(!res.success){
                throw new Error()
            }
        })
        .catch(() => {
            renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
        })
        setSelectFilters(false)
    }

    return (
        <div className="bigFilter">
            <div className="image"></div>          
            <div className="bigFilterBox">
                <div>
                    {!selectFilters &&
                    <button onClick={() => setSelectFilters(true) }>
                        Más Filtros <PlusSquare />
                    </button>}
                    {selectFilters &&
                    <button onClick={searchProperties}>
                        Buscar <Search />
                    </button>}
                </div>
                {selectFilters &&   
                <div className="filtersToSelect">
                    <div> {/* 1 */}
                        <div>
                            <h5>Operación</h5>
                            <select name="operation" value={formFilter.operation} onChange={operationHandler}>
                                <option value="allCases">Todas las Operaciones</option>
                                <option value="forSale">Venta</option>
                                <option value="forRental">Alquiler</option>
                                <option value="shortRental">Alquiler Temporario</option>
                            </select>
                        </div>
                        <div>
                            <h5>Ciudad o región</h5>
                            <select name="city" value={filterObj.city} onChange={(e) => selectHandler(e, e.target.value, e.target.value, null)}>
                                <option value="allCases">Todas</option>
                                { cities.map(city => <option value={city._id} key={city._id}>{city.cityName}</option> )}
                            </select>
                        </div>
                    </div>
                    <div> { /* 2 */}
                        <h5>Tipo de propiedad</h5>
                        <select name="isHouse" value={formFilter.isHouse} onChange={(e) => selectHandler(e, "house", true, false)}>
                            <option value="allCases">Todos</option>
                            <option value="house">Casa</option>
                            <option value="apartment">Departamento</option>
                        </select>
                    </div>                
                    <div> {/* 3 */}
                        <div className="propiedadBigFilterDesktopResponsive"> { /* 2 - responsividad desktop */}
                            <h5>Tipo de propiedad</h5>
                            <select name="isHouse" value={formFilter.isHouse} onChange={(e) => selectHandler(e, "house", true, false)}>
                                <option value="allCases">Todos</option>
                                <option value="house">Casa</option>
                                <option value="apartment">Departamento</option>
                            </select>
                        </div>
                        <div>
                            <h5>Ambientes</h5>
                            <select name="numberOfRooms" value={formFilter.numberOfRooms} onChange={(e) => selectHandler(e, "6AndMore",{"$gte":6}, parseInt(e.target.value))}>
                                <option value="allCases">Todos</option>
                                {[1,2,3,4,5].map((x )=> <option value={x} key={x}>{x}</option>)}
                                <option value="6AndMore"> 6 o más</option>
                            </select>
                        </div>
                        <div>
                            <h5>Dormitorios</h5>
                            <select name="numberOfBedrooms" value={formFilter.numberOfBedrooms} onChange={(e) => selectHandler(e, "6AndMore",{"$gte":6}, parseInt(e.target.value))}>
                                <option value="allCases">Todos</option>
                                {[1,2,3,4,5].map((x )=> <option value={x} key={x+10}>{x}</option>)}
                                <option value="6AndMore"> 6 o más</option>
                            </select>
                        </div>
                        <div>
                            <h5>Baños</h5>
                            <select name="numberOfBathrooms" value={formFilter.numberOfBathrooms} onChange={(e) => selectHandler(e, "6AndMore",{"$gte":6}, parseInt(e.target.value))}>
                                <option value="allCases">Todos</option>
                                {[1,2,3,4,5].map((x )=> <option value={x} key={x+20}>{x}</option>)}
                                <option value="6AndMore"> 6 o más</option>
                            </select>
                        </div>
                    </div>
                    <div> {/* 4 */}
                        {/* <div className="metrosBigFilterDesktopResponsive"> 5 responsividad desktop */}
                            {/* <h5>M² Metro Cuadrados Cubiertos</h5>
                            <select name="roofedArea" value={formFilter.roofedArea} onChange={(e) => selectHandler(e, e.target.value,((e.target.value.length===8 && e.target.value) || JSON.parse(e.target.value)), null)}>
                                <option value="allCases">Todas</option>
                                <option value='{"$lte": 40}'>Hasta 40m²</option>
                                <option value='{"$gte":41,"$lte": 80}'>41m² a 80m²</option>
                                <option value='{"$gte":81,"$lte": 200}'>81m² a 200m²</option>
                                <option value='{"$gte":201,"$lte": 600}'>201m² a 600m²</option>
                                <option value='{"$gte":600}'>601m² o más</option>
                            </select> */}
                        {/* </div> */}
                        <div>
                            <h5>Moneda</h5>
                            <select name="isUSD" value={formFilter.isUSD} onChange={(e) => selectHandler(e, "pesos", false, true)}>
                                <option value="allCases">Todas</option>
                                <option value="pesos">Pesos</option>
                                <option value="dolars">Dólares</option>
                            </select>
                        </div>
                        <div>
                            <h5>Precio desde</h5>
                            <input type="number" name="greater" min={0} value={formFilter.greater} onChange={priceHandler} />
                        </div>
                        <div>
                            <h5>Precio hasta</h5>
                            <input type="number" name="lower" min={0} value={formFilter.lower} onChange={priceHandler} />
                        </div>

                    </div>
                    <div> {/* 5 */}
                        {/* <h5>M² Metro Cuadrados Cubiertos</h5>
                        <select name="roofedArea" value={formFilter.roofedArea} onChange={(e) => selectHandler(e, e.target.value,((e.target.value.length===8 && e.target.value) || JSON.parse(e.target.value)), null)}>
                            <option value="allCases">Todas</option>
                            <option value='{"$lte": 40}'>Hasta 40m²</option>
                            <option value='{"$gte":41,"$lte": 80}'>41m² a 80m²</option>
                            <option value='{"$gte":81,"$lte": 200}'>81m² a 200m²</option>
                            <option value='{"$gte":201,"$lte": 600}'>201m² a 600m²</option>
                            <option value='{"$gte":600}'>601m² o más</option>
                        </select> */}
                    </div>
                    <div> {/* 6 */}
                        <div>
                            <div>
                                <input type="checkbox" id="isBrandNew" name="isBrandNew" checked={formFilter.isBrandNew} onChange={checkBoxHandler}/>
                                <label htmlFor="isBrandNew" >Solo a estrenar</label>
                            </div>
                            <div>
                                <input type="checkbox" id="haveGarden" name="haveGarden" checked={formFilter.haveGarden} onChange={checkBoxHandler}/>
                                <label htmlFor="haveGarden" >Con Jardín </label>
                            </div>
                        </div>
                        <div>
                            <div>
                                <input type="checkbox" id="haveGarage" name="haveGarage" checked={formFilter.haveGarage} onChange={checkBoxHandler}/>
                                <label htmlFor="haveGarage" >Con Cochera</label>
                            </div>
                            <div>
                                <input type="checkbox" id="havePool" name="havePool" checked={formFilter.havePool} onChange={checkBoxHandler}/>
                                <label htmlFor="havePool" >Con Pileta</label>
                            </div>
                        </div>
                        <div className="buscarBigFilterResponsiveDesktop"> {/* 7 */}
                            <button onClick={searchProperties}>Buscar</button>
                        </div>
                    </div>
                    <div> {/* 7 */}
                        <button onClick={searchProperties}>Buscar</button>
                    </div>
                </div>}
            </div>
        </div>
    )
}
const mapStateToProps = (state) =>{
    return {
        cities: state.allCities.cities,
        properties: state.properties.properties
    }
}
const mapDispatchToProps = {
    getPropertiesFiltered: propertiesActions.getPropertiesFiltered,
    setFilter: propertiesActions.setFilter,
    getCities: citiesActions.getCities
}

export default connect(mapStateToProps, mapDispatchToProps)(BigFilter)