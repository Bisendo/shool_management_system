import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { FaInfoCircle, FaSignInAlt, FaGraduationCap } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../helpers/AuthoContex';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const { authState } = useContext(AuthContext);

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
    <nav className="bg-white text-gray-800 shadow-lg border-b-2 border-blue-200">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* School Logo with Sticker */}
        <Link to="/" className="flex items-center space-x-3">
          <motion.div
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex justify-center items-center text-white shadow-lg"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-800"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 20, -20, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              NEW
            </motion.div>
            <FaGraduationCap className="w-7 h-7" />
          </motion.div>
          
          {!isMobileView && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <h1 className="text-xl font-bold text-gray-800">SMS</h1>
              <p className="text-xs text-gray-500">School Management System</p>
            </motion.div>
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link
            to="/about"
            className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition duration-300 group"
          >
            <FaInfoCircle className="mr-2 group-hover:scale-110 transition-transform" />
            <span>About</span>
          </Link>
          
          {authState.status ? (
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">{authState.fullName}</span>
              <Link
                to="/dashboard"
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition duration-300 group"
              >
                <FaSignInAlt className="mr-2 group-hover:scale-110 transition-transform" />
                <span>Login</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition duration-300 group"
              >
                <FiPhone className="mr-2 group-hover:scale-110 transition-transform" />
                <span>Contact</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={isMobileMenuOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 90 },
              closed: { rotate: 0 }
            }}
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
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white py-2 space-y-2 border-t border-gray-100"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/about"
              className="flex items-center justify-center py-3 px-4 hover:bg-blue-50 transition"
              onClick={toggleMobileMenu}
            >
              <FaInfoCircle className="mr-3" />
              About Us
            </Link>
            
            {authState.status ? (
              <>
                <div className="text-center py-2 text-blue-600 font-medium">
                  Welcome, {authState.fullName}
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center py-3 px-4 bg-blue-100 text-blue-600"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center py-3 px-4 hover:bg-blue-50 transition"
                  onClick={toggleMobileMenu}
                >
                  <FaSignInAlt className="mr-3" />
                  Login
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-center py-3 px-4 hover:bg-blue-50 transition"
                  onClick={toggleMobileMenu}
                >
                  <FiPhone className="mr-3" />
                  Contact
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;