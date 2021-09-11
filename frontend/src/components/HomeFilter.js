import React, {useState } from 'react'
import { connect } from "react-redux"
import { useHistory } from "react-router-dom"
import propertiesActions from '../redux/action/propertiesActions'
import Swal from "sweetalert2"

const HomeFilter = (props) => {

    const [filter, setFilter] = useState({ forSale: true, shortRental: false})

    const history = useHistory()

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
    
    const searchInPropertiesList = async () => {
        try {            
            let res = await props.getPropertiesFiltered(filter)
            if (!res.success) {
                throw new Error()
            } else {
                history.push("/lista-de-propiedades") 
            }
            if (!res.response) throw res.response
        } catch {
            renderToast("Tenemos un problema, por favor intenta más tarde", "warning")
        }
    }

    const changeClassHandle = (e) => {
        let elementClicked = e.target.dataset.type
        let childrenUl = e.target.parentNode.children 
        var forSaleValue = true
        var shortRentValue = false
        for (var i = 0; i < childrenUl.length; i++) {
            if (childrenUl[i].dataset !== elementClicked) {
                childrenUl[i].className=" "
            } 
        }
        e.target.className="active"
        if (e.target.dataset.type === "forSale") {
            forSaleValue = true
            shortRentValue = false
        } else if (e.target.dataset.type === "shortRent") {
            forSaleValue = false
            shortRentValue = true
        } else {
            forSaleValue = false
            shortRentValue = false
        }
        setFilter({
            ...filter,
            forSale: forSaleValue,
            shortRental: shortRentValue,
        })
    }

    const checkHandler = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.checked
        })
    }

    const inputHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value === "allCases" ) {
            let objectAux = {};
            Object.keys(filter).forEach((key) =>{
                if(key !== e.target.name) objectAux[key] = filter[key]
            })
            setFilter(objectAux)
        } else {
            let inputValue = e.target.value === "house" ? true : false
            setFilter({
                ...filter,
                [e.target.name]: inputValue,
            })
        }
        
    }  // VER LA FORMA DE UNIR LOS DOS
    const inputHandlerBedBath = (e) =>{
        if(e.target.value === "allCases"){
            let objectAux = {};
            Object.keys(filter).forEach((key) =>{
                if(key !== e.target.name) objectAux[key] = filter[key]
            })
            setFilter(objectAux)
        } else { 
            setFilter({
                ...filter,
                [e.target.name]: parseInt(e.target.value) === 6 ? {"$gte": 6} : parseInt(e.target.value)
            })
        }
    }

    return (
        <div className="homeFilter">
            <div className="firstRow">
                <ul>
                    <li className="active" onClick={changeClassHandle} data-type="forSale">Venta</li>
                    <li onClick={changeClassHandle} data-type="forRent" >Alquiler</li>
                    <li onClick={changeClassHandle} data-type="shortRent" >Alquiler temporario</li>
                </ul>    
            </div>
            <div className="secondRow" >
                <div>
                    <select name="isHouse" onChange={inputHandler}>
                        <option value="allCases">Todas</option>
                        <option value="house">Casa</option>     
                        <option value="apartment">Departamento</option>     
                    </select>
                </div>
                <div>
                    <div>
                        <select name="numberOfBedrooms" onChange={inputHandlerBedBath} >
                            <option value="allCases">Dormitorios</option>
                            <option value={1}>1 dormitorio</option>
                            <option value={2}>2 dormitorios</option>
                            <option value={3}>3 dormitorios</option>
                            <option value={4}>4 dormitorios</option>
                            <option value={5}>5 dormitorios</option>
                            <option value={6}>6 o más</option>
                        </select>
                    </div>
                    <div>
                        <select name="numberOfBathrooms" onChange={inputHandlerBedBath} >
                            <option value="allCases">Baños</option>
                            <option value={1}>1 baño</option>
                            <option value={2}>2 baños</option>
                            <option value={3}>3 baños</option>
                            <option value={4}>4 baños</option>
                            <option value={5}>5 baños</option>
                            <option value={6}>6 o más</option>
                        </select>
                    </div>
                </div>
                <div className="boxes">
                    <div>
                        <input type="checkbox" id="aEstrenar" name="isBrandNew" onChange={checkHandler}/>
                        <label htmlFor="aEstrenar">A estrenar</label>
                    </div>
                    <div>
                        <input type="checkbox" id="conCochera"name="haveGarage" onChange={checkHandler}/>
                        <label htmlFor="conCochera">Con cochera</label>
                    </div>
                </div>
                <div className="homeFilterButtonBigResponsive">
                    <button onClick={searchInPropertiesList}>Buscar</button>
                </div>
            </div>
            <div className="homeFilterButton">
                <button onClick={searchInPropertiesList}>Buscar</button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        propertiesFiltered: state.properties.properties
    }
}

const mapDispatchToProps = {
    getPropertiesFiltered: propertiesActions.getPropertiesFiltered

}
export default connect(mapStateToProps, mapDispatchToProps)(HomeFilter)
