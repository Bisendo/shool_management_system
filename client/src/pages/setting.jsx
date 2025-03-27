import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMoon, FaLock, FaBell, FaUser, FaLanguage, FaArrowLeft, FaCog } from "react-icons/fa"; // Added FaCog here
import { Link } from "react-router-dom";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      
      {/* Header with Navbar */}
      <div className="flex items-center justify-between px-6 py-4 shadow-lg bg-white dark:bg-gray-900 text-black dark:text-white border-b-2 border-black">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <FaArrowLeft className="w-6 h-6" />
          <span className="text-lg font-semibold">Back</span>
        </Link>
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* Settings Sections */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Dark Mode Toggle */}
        <motion.div 
          className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3">
            <FaMoon className="text-blue-600 dark:text-yellow-400 w-6 h-6" />
            <span className="text-lg font-semibold">Dark Mode</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-16 h-8 flex items-center rounded-full transition-all duration-300 ${darkMode ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"}`}
          >
            <motion.div className="w-6 h-6 bg-white rounded-full shadow-md"
              layout transition={{ type: "spring", stiffness: 700, damping: 30 }} />
          </button>
        </motion.div>

        {/* Language Selection */}
        <motion.div 
          className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3">
            <FaLanguage className="text-green-600 w-6 h-6" />
            <span className="text-lg font-semibold">Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-1"
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </motion.div>

        {/* Profile Settings */}
        <motion.div 
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <FaUser className="text-indigo-600 w-6 h-6" />
            <h3 className="text-lg font-semibold">Profile Settings</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Update your profile information.</p>
          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Edit Profile</button>
        </motion.div>

        {/* Notification Settings */}
        <motion.div 
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <FaBell className="text-yellow-600 w-6 h-6" />
            <h3 className="text-lg font-semibold">Notification Settings</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage email and push notifications.</p>
          <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition">Manage Notifications</button>
        </motion.div>

        {/* Security Settings */}
        <motion.div 
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <FaLock className="text-red-600 w-6 h-6" />
            <h3 className="text-lg font-semibold">Security & Privacy</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Change password and enable two-factor authentication.</p>
          <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Manage Security</button>
        </motion.div>

        {/* Additional Settings Section */}
        <motion.div 
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <FaCog className="text-gray-700 dark:text-gray-300 w-6 h-6" />
            <h3 className="text-lg font-semibold">Additional Settings</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Configure advanced settings such as backup and integration.</p>
          <button className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition">Advanced Settings</button>
        </motion.div>

      </div>
    </div>
  );
};

export default Settings;
