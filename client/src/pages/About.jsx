import React, { useState, useEffect } from "react";
import backgroundimage from "../assets/images/15.jpg";

const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Check if screen is mobile

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle window resize to toggle mobile menu
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // Close mobile menu on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-gray-800">
              <a href="/">SMS</a>
            </div>

            {/* Hamburger Menu for Mobile */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <a href="/" className="text-gray-800 hover:text-blue-600">
                Home
              </a>
           
             
              <a href="/contact" className="text-gray-800 hover:text-blue-600">
                Contact
              </a>
              <a
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobile && isMenuOpen && (
            <div className="lg:hidden">
              <div className="flex flex-col space-y-4 mt-4 pb-4">
                <a href="/" className="text-gray-800 hover:text-blue-600">
                  Home
                </a>
               
                <a href="/contact" className="text-gray-800 hover:text-blue-600">
                  Contact
                </a>
                <a
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                >
                  Login
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* About Us Section */}
      <section className="py-16 bg-gray-50 mt-16"> {/* Add margin-top to account for fixed Navbar */}
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in-down">
              About Us
            </h1>
            <p className="text-lg text-gray-600 animate-fade-in-up">
              Empowering Education Through Innovation
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Image */}
            <div className="w-full lg:w-1/2 animate-fade-in-left">
              <img
                src={backgroundimage} // Replace with your image
                alt="School Management System"
                className="rounded-lg shadow-lg"
              />
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2 text-left animate-fade-in-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome to Our School Management System
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our School Management System is designed to streamline administrative tasks, enhance communication, and provide a seamless experience for students, parents, and staff. With cutting-edge technology and user-friendly interfaces, we aim to revolutionize the way educational institutions operate.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="mr-2 text-green-500">✔</span>
                  Efficient Administration: Simplify daily operations with automated processes.
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2 text-green-500">✔</span>
                  Enhanced Communication: Foster better collaboration between teachers, students, and parents.
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2 text-green-500">✔</span>
                  Data-Driven Insights: Make informed decisions with comprehensive analytics.
                </li>
              </ul>
              <a
                href="/login"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;