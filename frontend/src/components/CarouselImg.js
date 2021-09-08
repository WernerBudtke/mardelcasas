import React from 'react'
import "../styles/App.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import 'swiper/swiper-bundle.min.css'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'

SwiperCore.use([Navigation, Pagination, Autoplay ]); 

const CarouselImg = (props) => {

    // console.log(props)
    return (
        <div className="swiperBox">
            <Swiper
                className="swiper"
                grabCursor={true}
                navigation
                spaceBetween={1} 
                slidesPerView={1}
                loop={true}
                autoplay={{"dealy": 3500, "disableOnInteraction": false, pauseOnMouseEnter: true}}>
                {props.property.map((img, index) => (
                    <SwiperSlide key={index}>
                        <di>
                            <div className="swiperSlide" style={{backgroundImage:`url(${img})`}}
                            alt={img}></div>
                        </di>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>    
    )
}

export default CarouselImg
