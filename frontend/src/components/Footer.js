import "../styles/Footer.css"
import React from 'react'
import { IoIosPin } from "react-icons/io"
import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare } from "react-icons/fa"
import { EnvelopeFill, Telephone } from "react-bootstrap-icons"

const Footer = () => {
    return (
    <footer>
        <div className="contact">
            <div className="addresses">
                <div className="contactInfo infoOne">
                    <IoIosPin />
                    <p>Jujuy 995, Mar del Plata, <br id="footerBr"/>Buenos Aires</p>
                </div>
                <div className="mob">
                <div  className="contactInfo infoTwo">
                    <Telephone />
                    <p>+54 2235391098</p>
                </div>
                <div  className="contactInfo infoThree">
                    <EnvelopeFill />
                    <p>info@mardelcasas.com</p>
                </div>
                </div>
            </div>
            <div className="socialNetworks">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" >
                    <FaFacebookSquare />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                    <FaInstagramSquare />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                    <FaTwitterSquare />
                </a>
            </div>
        </div>
        <div className="copyright">
            <p> Copyright Cohort 21 | MindHub</p>
        </div>
    </footer>
    )
}

export default Footer