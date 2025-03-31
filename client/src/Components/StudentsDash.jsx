import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBook,
  FiAward,
  FiCalendar,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiBell,
  FiSearch,
  FiBookOpen,
  FiClipboard,
  FiBarChart2,
  FiHome,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teacher, setTeacher] = useState({ name: "", school: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const schoolName = localStorage.getItem("schoolName");
      
      if (!schoolName) {
        throw new Error("School information not found");
      }
  
      const response = await axios.get("http://localhost:4070/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          school: schoolName,
          search: searchTerm,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
  
      console.log("Fetched students data:", response.data); // Add this line
      
      setStudents(response.data.students || []);
      setPagination({
        page: response.data.currentPage,
        limit: pagination.limit,
        total: response.data.totalStudents,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again.");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  }, [navigate, searchTerm, pagination.page, pagination.limit]);

  useEffect(() => {
    const storedName = localStorage.getItem("teacherName");
    const schoolName = localStorage.getItem("schoolName");
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (storedName && schoolName) {
      setTeacher({ name: storedName, school: schoolName });
    } else {
      navigate("/login");
    }

    // Load initial data
    fetchStudents();

    // Simulate loading notifications
    const timer = setTimeout(() => {
      setNotifications([
        {
          id: 1,
          message: "New assignment submitted by Student A",
          time: "10 min ago",
          read: false,
          icon: <FiCheckCircle className="text-green-500" />,
        },
        {
          id: 2,
          message: "Meeting with department head tomorrow",
          time: "25 min ago",
          read: false,
          icon: <FiMessageSquare className="text-blue-500" />,
        },
        {
          id: 3,
          message: "Faculty meeting rescheduled",
          time: "1 hour ago",
          read: true,
          icon: <FiAlertCircle className="text-yellow-500" />,
        },
        {
          id: 4,
          message: "New curriculum guidelines available",
          time: "3 hours ago",
          read: true,
          icon: <FiBook className="text-indigo-500" />,
        },
      ]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, fetchStudents]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );
  };

  const toggleMenu = (menuId) => {
    setExpandedMenu((prev) => (prev === menuId ? null : menuId));
  };

  const stats = [
    {
      title: "Active Classes",
      icon: <FiBookOpen className="h-6 w-6" />,
      value: "4",
      change: "+1",
      trend: "up",
    },
    {
      title: "Total Students",
      value: pagination.total.toString(),
      icon: <FiUsers className="h-6 w-6" />,
      change: `+${Math.max(0, pagination.total - 3)}`,
      trend: "up",
    },
    {
      title: "Avg. Class Performance",
      value: "82%",
      icon: <FiBarChart2 className="h-6 w-6" />,
      change: "+2%",
      trend: "up",
    },
    {
      title: "Unread Messages",
      value: notifications.filter((n) => !n.read).length.toString(),
      icon: <FiMessageSquare className="h-6 w-6" />,
      change: "+2",
      trend: "up",
    },
  ];

  const navItems = [
    {
      id: "dashboard",
      icon: <FiHome className="h-5 w-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      id: "classes",
      icon: <FiBook className="h-5 w-5" />,
      label: "Classes",
      path: "/classes",
    },
    {
      id: "assignments",
      icon: <FiClipboard className="h-5 w-5" />,
      label: "Assignments",
      path: "/assignments",
      subItems: [
        { label: "Create New", path: "/assignments/new" },
        { label: "View All", path: "/assignments/all" },
      ],
    },
    {
      id: "grades",
      icon: <FiAward className="h-5 w-5" />,
      label: "Grades",
      path: "/grades",
    },
    {
      id: "calendar",
      icon: <FiCalendar className="h-5 w-5" />,
      label: "Calendar",
      path: "/calendar",
    },
    {
      id: "messages",
      icon: <FiMessageSquare className="h-5 w-5" />,
      label: "Messages",
      path: "/messages",
    },
  ];

  const bottomNavItems = [
    {
      id: "settings",
      icon: <FiSettings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
    {
      id: "profile",
      icon: <FiUser className="h-5 w-5" />,
      label: "Profile",
      path: "/profile",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
            <p className="text-gray-600 text-lg mt-4">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed md:relative z-40 flex flex-col w-64 bg-white border-r border-gray-200 h-full transition-all duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FiBook className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">EduPortal</span>
          </Link>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Teacher profile"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
              <p className="text-xs text-gray-500">{teacher.school}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {expandedMenu === item.id ? (
                        <FiChevronUp className="h-4 w-4" />
                      ) : (
                        <FiChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedMenu === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-12 space-y-1"
                        >
                          {item.subItems.map((subItem, index) => (
                            <Link
                              to={subItem.path}
                              key={index}
                              className="block px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="px-2 py-4 border-t border-gray-200">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                to={item.path}
                key={item.id}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("teacherName");
                localStorage.removeItem("schoolName");
                navigate("/login");
              }}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="mr-3">
                <FiLogOut className="h-5 w-5" />
              </span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-500 hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </form>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FiBell className="h-6 w-6" />
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </motion.button>
              </div>

              <div className="flex items-center">
                <Link to="/profile">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer"
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></span>
                  </motion.div>
                </Link>
                <div className="ml-2 text-sm font-medium hidden md:inline">
                  {teacher.name}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded">
            <div className="flex justify-between items-center">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 mb-6 text-white shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {teacher.name}!
            </h2>
            <p className="opacity-90">
              {teacher.school} | You have{" "}
              {notifications.filter((n) => !n.read).length} new notifications and{" "}
              {pagination.total} students in your school
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-800"
                        : stat.trend === "down"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Students Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Students Management</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchStudents()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={() => setShowAddClassForm(!showAddClassForm)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Class
                </button>
              </div>
            </div>

            {showAddClassForm && (
              <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Enter class name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowAddClassForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={student.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=random`}
                                  alt={student.fullName}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.parentName || "No parent info"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.grade || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.rollNumber || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.phone || "N/A"}
                            </div>
                            {student.parentContact && (
                              <div className="text-xs text-gray-500">
                                Parent: {student.parentContact}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Message
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No students found in {teacher.school}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{" "}
                        of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === pagination.page
                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-50"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <motion.li
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0 ml-3">
                              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No notifications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You'll see notifications here when you get them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;