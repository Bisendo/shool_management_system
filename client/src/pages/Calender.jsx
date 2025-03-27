import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For navigation

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate(); // Hook for navigation

  // Get the current month and year
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  // Get the first day of the month and the number of days in the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDay = firstDayOfMonth.getDay();

  // Generate the days of the month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Handle navigation to the dashboard
  const handleGoToDashboard = () => {
    navigate("/dashboard"); // Replace with your dashboard route
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto"
    >
      {/* Dashboard Button */}
      <button
        onClick={handleGoToDashboard}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        ← Back to Dashboard
      </button>

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          ◀️
        </button>
        <h2 className="text-xl font-semibold">
          {month} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          ▶️
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}

        {/* Empty Days for Starting Day */}
        {Array.from({ length: startingDay }).map((_, index) => (
          <div key={`empty-${index}`} className="text-center p-2"></div>
        ))}

        {/* Days of the Month */}
        <AnimatePresence>
          {daysArray.map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`text-center p-2 rounded-lg cursor-pointer transition-all ${
                isToday(day)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {day}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Calendar;