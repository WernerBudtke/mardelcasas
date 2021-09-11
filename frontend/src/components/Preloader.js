import "../styles/Preloader.css"
import preloader from '../assets/preloader.gif'

const Preloader = () => {
    return(
        <div className="preloader">
            <img src={preloader} alt="loading..." />
        </div>
    )
}

export default Preloader