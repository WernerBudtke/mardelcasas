import React, {useEffect, useState} from "react"
import {connect} from 'react-redux'
import propertiesActions from "../redux/action/propertiesActions"
import Header from "../components/Header";
import Footer from "../components/Footer";
// import CarouselImg from "../components/CarouselImg";
import "../styles/Property.css";

const Property = (props) => {
    const [connectionWithAPI, setConnectionWithAPI] = useState("connected")
    const [loading, setLoading] = useState(true)
    const [property, setProperty] = useState({})
    useEffect(() => {
        window.scroll(0,0)
        if (props.properties.length === 0) {
            props.getProperty(props.match.params.id)
            .then(res => {
                if (!res.success) {
                    setConnectionWithAPI(res.error)
                } else {
                    setProperty(res.response)
                }
                setLoading(false)
            })
        } else {
            const propertySelected = props.properties.filter(property => property._id === props.match.params.id)
            setProperty(propertySelected[0])
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderVideo = () => {
        return (
            <section className="videoSection">
                <article className="videoArticle">
                    <iframe src={property.videoURL}
                        title="YouTube video player" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </article>
            </section>
        )
    }

    const renderCarrouselAndTitle = () => {
        return (
            <section className="carrouselAndTitleSection">
                <h1>{property.houseStyle}</h1>
                {/* <CarouselImg property={property.photosURL}/> */}
                <p style={{textAlign: "center", paddingTop: "50px"}}>carrusel WIP</p> {/* DELETE */}
            </section>
        )
    }

    const renderCalendar = () => {
        return (
            <section className="calendarSection">
                <p>calendar WIP</p>
            </section>
        )
    }

    const renderProperty = () => {
        return (
            <>
                {renderCarrouselAndTitle()}
                <section className="dataSection">
                    <p>datos</p>
                </section>
                {renderVideo()}
                {renderCalendar()}
            </>
        )
    }

    console.log(property, connectionWithAPI, loading)
    return (
        <>
            <Header/>
            <main className="propertyMain">
                {
                    loading ?
                    <section className="propertyLoading">
                        <p>Cargando...</p>
                    </section> :
                    connectionWithAPI === "connected" ?
                    renderProperty() :
                    <section className="propertyErrorConnection">
                        <p>{connectionWithAPI}</p>
                    </section>
                }
            </main>
            <Footer/>
        </>
    )
}

const mapStateToProps = (state) =>{
    return {
        properties: state.properties.properties
    }
}
const mapDispatchToProps = {
    getProperty: propertiesActions.getProperty
}

export default connect(mapStateToProps, mapDispatchToProps)(Property)