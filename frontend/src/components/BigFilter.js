import "../styles/BigFilter.css"
import React, { useEffect, useState } from 'react'
import { PlusSquare } from "react-bootstrap-icons"
import {connect} from 'react-redux'
import propertiesActions from "../redux/action/propertiesActions"
import CardProperty from "./CardProperty"
import FiltersSelected from "./FiltersSelected"
import citiesActions from "../redux/action/citiesActions"

const BigFilter = (props) => {
    const {filterObj, setFilter, getCities, cities} = props
    console.log("Estoy en Big Filter")
    console.log("Filter que llega del store", filterObj)
    const [formFilter, setFormFilter] = useState({
        operation: "allCases",  city:"allCases", isHouse: "allCases", 
        numberOfRooms:"allCases", numberOfBedrooms: "allCases", numberOfBathrooms: "allCases",
        isUSD:"allCases", greater:"", lower:"", roofedArea:"allCases",
        isBrandNew:false, haveGarden:false, haveGarage:false, havePool:false
    })

    useEffect(() => {
        if (!cities.length) {
            getCities().then(res => {
                if(!res.data.success){
                    throw new Error('Something went wrong')
                }
                console.log(res.data.response)
                })
                .catch(err => console.log(err))
        }        
        console.log("el filtro la PRIMERA VEZ QUE LLEGA", filterObj)
    }, [])

    useEffect( () => {
        let newOperation
        let nameFormFilter
        let valueFormFilter
        let enterSale 
        let enterShortRental
        if(Object.keys(filterObj).length){
            Object.keys(filterObj).forEach( key => {
                if(key==="forSale" && filterObj[key]){
                    nameFormFilter = "operation"
                    valueFormFilter = "forSale"
                    enterSale = true
                } 
                if(key === "shortRental" && filterObj[key]){
                    valueFormFilter = "shortRental"
                    nameFormFilter = "operation"
                    enterShortRental = true
                }
                if( !enterSale && !enterShortRental && !filterObj.shortRental && !filterObj.forSale){
                    valueFormFilter = "forRental"
                    nameFormFilter = "operation"
                    enterShortRental = true
                    enterSale = true
                } 
                if( key.startsWith("numberOf") ){
                    nameFormFilter = key
                    valueFormFilter = typeof filterObj[key]  === "object" ? "6AndMore" : filterObj[key]
                }
                if (key === "isHouse") {
                    nameFormFilter = key
                    valueFormFilter = filterObj[key] ? "house" : "apartment"
                } 
                if (key ==="greater" || key === "lower") {
                    nameFormFilter = key
                    valueFormFilter = filterObj[key]>=0 ? filterObj[key] : ""
                }
                if (key === "city") {
                    nameFormFilter = key
                    valueFormFilter = filterObj[key]
                }
                if(key === "isBrandNew"){
                    nameFormFilter = key
                    valueFormFilter = filterObj[key]
                }
                if(key.startsWith("have")){
                    nameFormFilter = key
                    valueFormFilter = filterObj[key] ? true : false
                }            
                setFormFilter({ ...formFilter, [nameFormFilter]: valueFormFilter})
            })
        }

        console.log("Valores del formulario en BigFilter", formFilter)
    // eslint-disable-next-line
    },[filterObj])
    // variable de estado para que se muestre o no los formularios del filtro
    const [selectFilters, setSelectFilters] = useState(false)

    const deletePropertieFromObject = (name) => {
        let objectAux = {};
        Object.keys(filterObj).forEach((key) =>{
            if(key !== name) objectAux[key] = filterObj[key] //limpio el objeto filtro sin esta propiedad
        })
        setFilter(objectAux)
        return objectAux
    }

    const operationHandler = (e) => {
        switch (e.target.value) {
            case "allCases":
                let objectAux = {};
                Object.keys(filterObj).forEach((key) =>{
                    if(!(key === "forSale" || key ==="shortRental")) objectAux[key] = filterObj[key]
                })
                setFilter(objectAux)
                break;
            
            case "forSale":
                setFilter({ ...filterObj, forSale: true, shortRental:false })
                
                break;
             
            case "forRental":
                setFilter({ ...filterObj, forSale: false, shortRental:false })                
                break;                
            
            case "shortRental":
                setFilter({ ...filterObj, forSale: false, shortRental: true })                
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
            setFilter( { ...filterObj, [e.target.name]: firstValue } )
        } else {
            setFilter( { ...filterObj, [e.target.name]: secondValue } )
        }
        setFormFilter({ ...formFilter, [e.target.name]: e.target.value})
    }

    const priceHandler = (e) => {
        if(e.target.value<0) e.target.value = 0 // SI ENTRA EL e NUMERO CAPAZ ROMPE TODO
        if(e.target.value === "") {
            deletePropertieFromObject(e.target.name)
        } else {
            setFilter( { ...filterObj, [e.target.name]: parseInt(e.target.value) } )
        }
        setFormFilter({ ...formFilter, [e.target.name]: e.target.value})
    }    

    const checkBoxHandler = (e) => {
        if (!e.target.checked) {
            deletePropertieFromObject(e.target.name)
        } else {
            setFilter( { ...filterObj, [e.target.name]: e.target.checked })
        }
        setFormFilter({ ...formFilter, [e.target.name]: e.target.checked})
    }

    const searchProperties = () => {
        console.log("objeto que filtra")
        console.log(filterObj)// llamar al action con axios
        props.getPropertiesFiltered(filterObj)
        .then(res => {
            if(!res.data.success){
                throw new Error('Something went wrong')
            }
            console.log(res.data.response)
        })
        .catch(err => console.log(err))
        console.log("objeto con las opciones actuales")
        console.log(formFilter)
        setSelectFilters(false)
    }
    console.log("Aca tengo las properties q vienen de props")
    console.log(props.properties)
    const [sortedProperties, setSortedProperties] = useState(props.properties)
    useEffect(()=>{
        setSortedProperties(props.properties)
    },[props.properties])
    const listFilterHandler = (e) => {
        switch (e.target.value){
            case "minPrice":
                setSortedProperties(
                    sortedProperties.sort((a, b) => {
                        return a.price - b.price;
                    })
                )
                break;
            case "maxPrice":
                setSortedProperties(
                    sortedProperties.sort((a, b) => {
                        return b.price - a.price;
                    })
                )
                break;
            case "minArea":
                setSortedProperties(
                    sortedProperties.sort((a, b) => {
                        return a.roofedArea - b.roofedArea;
                    })
                )
                break;
            case "maxArea":
                setSortedProperties(
                    sortedProperties.sort((a, b) => {
                        return b.roofedArea - a.roofedArea;
                    })
                )
                break;
            default:
                setSortedProperties(props.properties)
                return   
        }
        
        console.log(e.target.value)
        console.log("ordenar")
        console.log(sortedProperties) //ESTE ARRAY SE TIENE QUE ENVIAR EN 
    }

    return (
        <div className="bigFilter">
            <div>
                {!selectFilters &&
                <button onClick={() => setSelectFilters(true) }>
                    Más Filtros <PlusSquare />
                </button>}
                <FiltersSelected 
                    deletePropertieFromObject={deletePropertieFromObject}
                    formFilter={formFilter}
                    setFormFilter={setFormFilter}
                />
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
                            { cities.map(city => <option value={city.cityName} key={city._id}>{city.cityName}</option> )}
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
                    <h5>M² Metro Cuadrados Cubiertos</h5>
                    <select name="roofedArea" value={formFilter.roofedArea} onChange={(e) => selectHandler(e, e.target.value,((e.target.value.length===8 && e.target.value) || JSON.parse(e.target.value)), null)}>
                        <option value="allCases">Todas</option>
                        <option value='{"$lte": 40}'>Hasta 40m²</option>
                        <option value='{"$gte":41,"$lte": 80}'>41m² a 80m²</option>
                        <option value='{"$gte":81,"$lte": 200}'>81m² a 200m²</option>
                        <option value='{"$gte":201,"$lte": 600}'>201m² a 600m²</option>
                        <option value='{"$gte":600}'>601m² o más</option>
                    </select>
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
                </div>
                <div> {/* 7 */}
                    <button onClick={searchProperties}>Buscar</button>
                </div>
            </div>}

            <div className="sortList">
                <select onChange={listFilterHandler}>
                    <option value="noSort">Mas relevante</option>
                    <option value="minPrice">Menor precio</option>
                    <option value="maxPrice">Mayor precio</option>
                    <option value="minArea">Menor superficie</option>
                    <option value="maxArea">Mayor superficie</option>
                </select>
            </div>
            <div className="propertiesCardList">
                {props.properties.map(property =><CardProperty property={property}/>)}
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
