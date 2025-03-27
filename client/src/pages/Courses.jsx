import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa"; // Scroll-to-top icon

// Import images
import mathImage from "../assets/images/7.jpg";
import physicsImage from "../assets/images/15.jpg";
import chemistryImage from "../assets/images/12.jpg";

const courses = [
  {
    id: 1,
    title: "Mathematics 101",
    instructor: "Dr. John Doe",
    progress: 75,
    duration: "12 weeks",
    status: "In Progress",
    image: mathImage, // Use imported image
  },
  {
    id: 2,
    title: "Physics 201",
    instructor: "Prof. Jane Smith",
    progress: 50,
    duration: "10 weeks",
    status: "In Progress",
    image: physicsImage, // Use imported image
  },
  {
    id: 3,
    title: "Chemistry 101",
    instructor: "Dr. Emily Brown",
    progress: 100,
    duration: "8 weeks",
    status: "Completed",
    image: chemistryImage, // Use imported image
  },
];

const CourseCard = ({ course }) => {
  const { title, instructor, progress, duration, status, image } = course;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Course Image */}
      <div className="w-full h-40 overflow-hidden">
        <img
          src={image} // Use imported image
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Details */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">Instructor: {instructor}</p>
        <p className="text-sm text-gray-600 mt-1">Duration: {duration}</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{progress}% Completed</p>
        </div>

        {/* Status and Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {status}
          </span>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            View Course
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">School Management System</h1>
        <div className="flex space-x-4">
          <a href="/dashboard" className="text-gray-600 hover:text-blue-500">
            Dashboard
          </a>
          
          <a href="/profile" className="text-gray-600 hover:text-blue-500">
            Profile
          </a>
        </div>
      </div>
    </nav>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
    >
      <FaArrowUp />
    </motion.button>
  );
};

const CourseList = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-8"> {/* Add padding-top for navbar */}
      {/* Navbar */}
      <Navbar />

      {/* Course List */}
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Scroll-to-Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default CourseList;