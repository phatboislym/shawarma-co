import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faMedium,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import logo from "../../assets/logo.svg";
import {Link} from "react-router-dom";

const footer = () => {
  return (
    <footer className="text-center lg:text-left bg-metal-dark text-gray-600">
      {/* Destination links */}
      <section className="mx-6 py-10 text-center md:text-left">
        <div className="grid   grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo */}
          <div>
            <img
              src={logo}
              alt="logo"
              width={106}
              height={24}
            />
          </div>

          <div>
            <h6 className="uppercase text-grey font-semibold mb-4 flex justify-center md:justify-start">
              Community
            </h6>
            <p className="mb-4 text-white">
              <Link to="#!" className="">
                Lexir for Brands
              </Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Business Buyers</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Sales Affiliates</Link>
            </p>
          </div>

          <div>
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Platform
            </h6>
            <p className="mb-4 text-white">
              <Link to="#!">Resources</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Pricing</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Get Started</Link>
            </p>
          </div>

          <div>
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Company
            </h6>
            <p className="mb-4 text-white">
              <Link to="#!">About</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Contact</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Legal</Link>
            </p>
          </div>

          <div>
            <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Lexir Shop
            </h6>
            <p className="mb-4 text-white">
              <Link to="#!">Brands</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Spirits</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Wine</Link>
            </p>
            <p className="mb-4 text-white">
              <Link to="#!">Blog</Link>
            </p>
          </div>

          <div>
            <ul className="flex justify-center md:justify-end">
              <li className="mr-5">
                <Link
                  target="_blank"
                  rel="noreferrer"
                  to="!#"
                >
                  <FontAwesomeIcon icon={faMedium} color="#fff" />
                </Link>
              </li>
              <li className="mr-5">
                <Link
                  target="_blank"
                  rel="noreferrer"
                  to="!#"
                >
                  <FontAwesomeIcon icon={faFacebook} color="#fff" />
                </Link>
              </li>
              <li className="mr-5">
                <Link
                  target="_blank"
                  rel="noreferrer"
                  to="!#"
                >
                  <FontAwesomeIcon icon={faInstagram} color="#fff" />
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  to="!#"
                >
                  <FontAwesomeIcon icon={faLinkedin} color="#fff" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Copy right section */}

      <section className="flex justify-center items-center lg:justify-between p-6 border-t border-gray-500">
        <div className='mr-12 lg:block"'>
          <span className="text-white">© 2022 Lexir Inc.</span>
        </div>
        <div>
          <span className="mr-5 text-white">Privacy</span>
          <span className="text-white">Terms of service</span>
        </div>
      </section>
    </footer>
  );
};

export default footer;