import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaArrowUp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaYoutube,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa";
import Navbar from "../Components/Navibar";

import bg1 from "../assets/images/1.jpg";
import bg2 from "../assets/images/12.jpg";
import bg3 from "../assets/images/13.jpg";
import bg4 from "../assets/images/14.jpg";
import bg5 from "../assets/images/15.jpg";
import bg6 from "../assets/images/3.jpg";
import bg7 from "../assets/images/4.jpg";
import bg8 from "../assets/images/9.jpg";

const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8];

const Home = () => {
  const [services, setServices] = useState([]);
  const [showTopButton, setShowTopButton] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:4040/service");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md animate-fadeInDown">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[70vh] sm:h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${backgroundImages[currentBg]})`,
          backgroundPositionY: `${scrollY * 0.5}px`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center text-center text-white h-full px-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 animate-fadeIn">
            Welcome to Our School Management System
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto animate-fadeIn delay-200">
            We provide a comprehensive solution for managing school activities
            efficiently.
          </p>
          <a
            href="/login" // Replace with your desired link
            className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white border-2 border-white rounded-full shadow-lg hover:bg-white hover:text-gray-800 transition duration-300 animate-fadeIn delay-400"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 px-4 bg-white text-center animate-fadeIn delay-500">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Our Mission
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
          Enhancing educational experiences and fostering student growth through
          innovative management systems.
        </p>
        <a
          href="/services"
          className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold bg-blue-800 text-white rounded-full shadow-lg hover:scale-110 transition duration-300"
        >
          Discover Our Services
        </a>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gray-100 text-center animate-fadeIn delay-600">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">
          Explore Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="bg-white shadow-lg rounded-lg p-4 sm:p-6 hover:scale-105 transition duration-500"
              >
                <div className="w-full h-48 sm:h-64 overflow-hidden rounded-lg">
                  {service.image ? (
                    <img
                      src={`http://localhost:4040${service.image}`}
                      alt={service.title}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-4 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {service.description}
                </p>
                <a href="/events" className="text-blue-600 hover:text-blue-800">
                  View More
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No services available at the moment.
            </p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white text-center animate-fadeIn delay-700">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Student Management */}
          <div className="bg-gray-100 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <FaUsers className="w-12 h-12 text-blue-600" /> {/* Icon for Students */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Student Management
            </h3>
            <p className="text-gray-600">
              Efficiently manage student records, attendance, and performance.
            </p>
          </div>

          {/* Teacher Management */}
          <div className="bg-gray-100 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <FaChalkboardTeacher className="w-12 h-12 text-green-600" /> {/* Icon for Teachers */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Teacher Management
            </h3>
            <p className="text-gray-600">
              Streamline teacher assignments, schedules, and evaluations.
            </p>
          </div>

          {/* Attendance Tracking */}
          <div className="bg-gray-100 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <FaClipboardList className="w-12 h-12 text-purple-600" /> {/* Icon for Attendance */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Attendance Tracking
            </h3>
            <p className="text-gray-600">
              Automate attendance tracking for students and staff.
            </p>
          </div>

          {/* Grade Management */}
          <div className="bg-gray-100 p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <FaChartLine className="w-12 h-12 text-red-600" /> {/* Icon for Grades */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Grade Management
            </h3>
            <p className="text-gray-600">
              Easily manage and analyze student grades and reports.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gray-100 text-center animate-fadeIn delay-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-600 mb-4">
              "This system has transformed how we manage our school. Highly
              recommended!"
            </p>
            <p className="text-gray-800 font-semibold">- John Doe, Principal</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-600 mb-4">
              "The attendance tracking feature is a game-changer for our staff."
            </p>
            <p className="text-gray-800 font-semibold">- Jane Smith, Teacher</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-600 mb-4">
              "Easy to use and has everything we need to manage our school
              effectively."
            </p>
            <p className="text-gray-800 font-semibold">
              - Michael Brown, Admin
            </p>
          </div>
        </div>
      </section>

      {/* Scroll-to-Top Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-110 animate-bounce"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-teal-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <p className="text-sm">
                &copy; 2025 School Management System. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-black transition-colors"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-600 transition-colors"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-600 transition-colors"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;