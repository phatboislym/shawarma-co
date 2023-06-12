import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HeroSection from "../../components/landingPage-Compo/HeroSection"
import ShawarmaTypes from "../../components/landingPage-Compo/ShawarmaTypes"
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons"
import { Link } from "react-router-dom"
import AboutUs from "../../components/landingPage-Compo/AboutUs"

const LandingPage = () => {
  return (
    <div>
        <HeroSection />
        <ShawarmaTypes />
        <div className="shawarma-app text-center relative">
            <div className="flex justify-center items-center">
                <div className="p-5">
                    <h1 className="text-white text-2xl font-bold mb-3">Get your Shamarwa delivered to your doorstep</h1>
                    <div className="flex">
                        <Link to="#!" className="mr-5 text-white flex items-center">
                            <FontAwesomeIcon icon={faApple} className="border-2 rounded-full border-white p-2 text-lg mr-3"  />
                            Download on the app store
                        </Link>
                        <Link to="#!" className="text-white flex items-center">
                            <FontAwesomeIcon icon={faGooglePlay} className="border-2 rounded-full border-white p-2 text-lg mr-3"  />
                            Download on the play store
                        </Link>
                    </div>

                </div>
            </div>
        </div>
        <AboutUs />
    </div>
  )
}

export default LandingPage