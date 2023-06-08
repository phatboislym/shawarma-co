import React from 'react';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between px-6 py-4 bg-transparent">
        <div className="text-white text-lg font-bold">Logo</div>
        <div className="space-x-4">
          <a href="#" className="text-white hover:text-gray-300">Home</a>
          <a href="#" className="text-white hover:text-gray-300">Pages</a>
          <a href="#" className="text-white hover:text-gray-300">Contact</a>
        </div>
        <div>
          <a href="#" className="text-white hover:text-gray-300">Login</a>
          <a href="#" className="text-white hover:text-gray-300">Sign Up</a>

        </div>
      </div>
    </nav>
  );
};

export default Header;
