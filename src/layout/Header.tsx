import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../state-control/store/hooks';
import { isAuthenticated } from '../state-control/features/authSlice';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  let activeUser = useAppSelector(isAuthenticated);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  

  
    const handleLogout = () => {
      // Clear authentication-related data (e.g., remove token from local storage)
      localStorage.removeItem('access_token');
      
      // Update application state (e.g., set isAuthenticated to false)
      activeUser = false
    
      // Redirect to the login page or any other page
      navigate('/');
    };
    




  return (
    <nav className="top-0 left-0 right-0 z-10 bg-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-white text-lg font-bold">Shamarwa Co</div>
        <div className="sm:hidden">
          <button
            type="button"
            onClick={toggleNavbar}
            className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
          >
            <svg
              className="h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.78 4.22a.75.75 0 1 1 1.06-1.06L12 10.94l7.16-7.78a.75.75 0 1 1 1.06 1.06l-7.78 7.78a.75.75 0 0 1-1.06 0L3.78 4.22z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.22 3.78a.75.75 0 0 0-1.06 1.06L10.94 12l-7.78 7.16a.75.75 0 1 0 1.06 1.06l7.78-7.78a.75.75 0 0 0 0-1.06L4.22 3.78z"
                />
              )}
            </svg>
          </button>
        </div>
        <div className={`hidden sm:flex sm:items-center space-x-4 ${isOpen ? 'block' : 'hidden'}`}>
          <Link to="#" className="text-white hover:text-gray-300">Home</Link>
          <Link to="#" className="text-white hover:text-gray-300">About</Link>
          <Link to="#" className="text-white hover:text-gray-300">Contact</Link>
          {!activeUser ? 
            (
              <Fragment>

                <Link to="/login" className="text-white hover:text-gray-300 p-3 bg-[#FAA401] mr-3 rounded-3xl w-28 text-center hover:bg-yellow-500">Login</Link>
                <Link to="/register" className="text-white  bg-[#FAA401] rounded-3xl w-28 text-center hover:bg-yellow-500 hover:text-gray-300 p-3">Register</Link>
              </Fragment>

            )
            :
            (
              <Link to="/" onClick={handleLogout}className="text-white  bg-[#FAA401] rounded-3xl w-28 text-center hover:bg-yellow-500 hover:text-gray-300 p-3">Logout</Link>   
            )
          }
        </div>
        </div>
    </nav>
  );
};

export default Header;
