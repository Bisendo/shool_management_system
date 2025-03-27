import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// Import React Icons
import {  FaInfoCircle, FaUser, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {AuthContext} from '../helpers/AuthoContex'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [authState, setAuthState] = useState({
    fullName: "",
    id: 0,
    status: false,
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>

    <nav className="bg-white text-gray-800 shadow-lg border-b-2 border-black">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* School Name and Icon */}
        <div className="flex items-center space-x-4">
          {/* Icon for School Logo */}
          <motion.div
            className="w-12 h-12 bg-black rounded-full flex justify-center items-center text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white font-bold text-lg">SMS</span>
          </motion.div>
          {/* Hide "School Management System" on mobile screens */}
          {!isMobileView && (
            <h1 className="text-2xl font-semibold tracking-wide">School Management System</h1>
          )}
        </div>

        {/* Desktop Menu (No Icons on Desktop) */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/about"
            className="text-lg font-medium hover:text-blue-500 transition duration-300 ease-in-out border-1 border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            About Us
          </Link>
          
          {/* Login and Register Links */}
          <Link
            to="/login"
            className="text-lg font-medium hover:text-blue-500 transition duration-300 ease-in-out border-1 border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            Login
          </Link>
          {authState.fullName}
          <Link
            to="/register"
            className="text-lg font-medium hover:text-blue-500 transition duration-300 ease-in-out border-1 border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            Register
          </Link>
          {authState.fullName}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (visible on small screens) */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white text-gray-800 py-4 space-y-4 border-t-2 border-gray-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/about"
            className="block text-center flex items-center justify-center py-2 hover:text-blue-500 transition duration-200 border-1 border-gray-300 mx-4 rounded-lg hover:bg-blue-50"
          >
            <FaInfoCircle className="w-5 h-5 mr-2" />
            About Us
          </Link>
          
          {/* Login and Register Links for Mobile */}
          <Link
            to="/login"
            className="block text-center flex items-center justify-center py-2 hover:text-blue-500 transition duration-200 border-1 border-gray-300 mx-4 rounded-lg hover:bg-blue-50"
          >
            <FaSignInAlt className="w-5 h-5 mr-2" />
            Login
          </Link>
          <Link
            to="/register"
            className="block text-center flex items-center justify-center py-2 hover:text-blue-500 transition duration-200 border-1 border-gray-300 mx-4 rounded-lg hover:bg-blue-50"
          >
            <FaUser className="w-5 h-5 mr-2" />
            Register
          </Link>
        </motion.div>
      )}
    </nav>
    </AuthContext.Provider>
  );
};

export default Navbar;