import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaCog,
  FaBars, FaSignOutAlt, FaTable, FaGraduationCap
} from "react-icons/fa";

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [teacher, setTeacher] = useState({ name: "", id: "", role: "" ,school:"" });
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    try {
      // Retrieve data from localStorage (or use AuthContext if you prefer)
      const storedName = localStorage.getItem("teacherName");
      const storedId = localStorage.getItem("teacherId");
      const storedRole = localStorage.getItem("userRole");  // Ensure you're retrieving the correct key
      const schoolName = localStorage.getItem("schoolName");  // Ensure you're retrieving the correct key

      console.log("Retrieved from localStorage:", storedName, storedId, storedRole,schoolName);
  
      if (storedName && storedId && storedRole) {
        setTeacher({ name: storedName, id: storedId, role: storedRole,school:schoolName });
      } else {
        navigate("/login");  // Redirect to login if something is missing
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [navigate]);
  
  
  const menuItems = [
    { id: "students", icon: <FaUsers />, label: "Students", link: "/dashboard/student" },
    { id: "teachers", icon: <FaChalkboardTeacher />, label: "Teachers", link: "/dashboard/teacher" },
    { id: "courses", icon: <FaBook />, label: "Courses", link: "/courses" },
    { id: "calendar", icon: <FaCalendarAlt />, label: "Calendar", link: "/calendar" },
    { id: "timetables", icon: <FaTable />, label: "Timetables", link: "/timetable" },
    { id: "grades", icon: <FaGraduationCap />, label: "Grades", link: "/grades" },
    { id: "settings", icon: <FaCog />, label: "Settings", link: "/settings" },
    { id: "logout", icon: <FaSignOutAlt />, label: "Log Out", link: "/login" },
  ];

  const cardData = [
    { title: "Total Students", value: "1,250", color: "bg-blue-500" },
    { title: "Total Teachers", value: "85", color: "bg-green-500" },
    { title: "Active Courses", value: "32", color: "bg-purple-500" },
    { title: "Upcoming Events", value: "5", color: "bg-yellow-500" },
  ];

  const handleMenuItemClick = (link, menuId) => {
    setSelectedMenu(menuId);
    navigate(link);
    if (windowWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="text-xl" />
      </button>

      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen || windowWidth >= 768 ? 0 : -250 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed md:relative w-64 bg-white shadow-xl h-full z-40"
      >
        <div className="p-6 text-2xl font-bold text-blue-600">{teacher.school} Dashboard</div>
        <nav>
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center p-4 cursor-pointer transition-all ${
                selectedMenu === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleMenuItemClick(item.link, item.id)}
            >
              <span className="mr-3 text-blue-500">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </nav>
      </motion.div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg transform -rotate-1"></div>
          <div className="relative p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {teacher.name}
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Your ID:{" "}
              <span className="font-semibold text-blue-600">{teacher.id}</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Role:{" "}
              <span className="font-semibold text-blue-600">{teacher.role}</span>
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`p-6 rounded-xl shadow-lg text-white ${card.color} hover:shadow-xl transition-all`}
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Chart Placeholder</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
