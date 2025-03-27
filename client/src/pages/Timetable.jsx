import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Sample timetable data for different class levels
const timetableDataByLevel = {
  "Class Level 1": [
    {
      day: "Monday",
      periods: [
        { time: "8:00 - 9:00", subject: "Math", teacher: "Mr. Smith" },
        { time: "9:00 - 10:00", subject: "Science", teacher: "Ms. Johnson" },
        { time: "10:00 - 11:00", subject: "History", teacher: "Mr. Brown" },
      ],
    },
    {
      day: "Tuesday",
      periods: [
        { time: "8:00 - 9:00", subject: "English", teacher: "Ms. Davis" },
        { time: "9:00 - 10:00", subject: "Physics", teacher: "Mr. Wilson" },
      ],
    },
    // Add more days and periods for Class Level 1
  ],
  "Class Level 2": [
    {
      day: "Monday",
      periods: [
        { time: "8:00 - 9:00", subject: "Chemistry", teacher: "Ms. Lee" },
        { time: "9:00 - 10:00", subject: "Biology", teacher: "Mr. Harris" },
      ],
    },
    {
      day: "Tuesday",
      periods: [
        { time: "8:00 - 9:00", subject: "Math", teacher: "Mr. Smith" },
        { time: "9:00 - 10:00", subject: "Geography", teacher: "Ms. Clark" },
      ],
    },
    // Add more days and periods for Class Level 2
  ],
  // Add more class levels up to Class Level 7
  "Class Level 3": [],
  "Class Level 4": [],
  "Class Level 5": [],
  "Class Level 6": [],
  "Class Level 7": [],
};

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 p-4 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="hidden md:inline">School Management System</span>
          <span className="md:hidden">SMS</span>
        </h1>
        <div className="space-x-4">
          
          <a href="/dashboard" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
            Dashboard
          </a>
          <a href="/profile" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
            Profile
          </a>
        </div>
      </div>
    </nav>
  );
};

// Weekly Timetable Card Component
const WeeklyTimetableCard = ({ timetableData }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300 p-6"
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold text-white mb-4">Full Week Timetable</h2>
      <div className="space-y-4">
        {timetableData.map((day, index) => (
          <motion.div
            key={index}
            className="p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-200"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-lg font-medium text-white">{day.day}</h3>
            <div className="mt-2 space-y-2">
              {day.periods.map((period, idx) => (
                <div key={idx} className="text-sm text-white/80">
                  <span className="font-medium">{period.time}</span>: {period.subject} ({period.teacher})
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Scroll to Top Button Component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          ↑
        </button>
      )}
    </div>
  );
};

// Main Timetable Component
const Timetable = () => {
  const [selectedLevel, setSelectedLevel] = useState("Class Level 1");

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 pt-20">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-bold text-center text-gray-800 mb-8"
            variants={itemVariants}
          >
            Weekly Timetable
          </motion.h1>
          {/* Class Level Selector */}
          <motion.div
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              {[...Array(7).keys()].map((i) => (
                <option key={i + 1} value={`Class Level ${i + 1}`}>
                  Class Level {i + 1}
                </option>
              ))}
            </select>
          </motion.div>
          {/* Weekly Timetable Card */}
          <WeeklyTimetableCard timetableData={timetableDataByLevel[selectedLevel]} />
        </motion.div>
      </div>
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Timetable;