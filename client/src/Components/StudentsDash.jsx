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
  FiClipboard,
  FiHome,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiUsers,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUpload,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
const TeacherDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teacher, setTeacher] = useState({ name: "", school: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [passportPreview, setPassportPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    grade: "",
    rollNumber: "",
    phone: "",
    parentName: "",
    parentContact: "",
    passport: null,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const navigate = useNavigate();

  // Fetch students with pagination
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:4070/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: searchTerm,
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      console.log(response.data);

      setStudents(response.data.students || []);
      setPagination({
        page: response.data.currentPage || 1,
        limit: pagination.limit,
        total: response.data.totalStudents || 0,
        totalPages: response.data.totalPages || 1,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch students. Please try again."
      );
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, searchTerm, pagination.page, pagination.limit]);

  // Effect hook to initialize the teacher data and fetch students on component mount
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

  // Handlers for file selection, search, and notifications
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
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

  // Handlers for student management (edit, delete, form submission)
  const startEditingStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      grade: student.grade,
      rollNumber: student.rollNumber,
      phone: student.phone,
      parentName: student.parentName,
      parentContact: student.parentContact,
      passport: student.passport,
    });
    if (student.picture) {
      setPassportPreview(`http://localhost:4070${student.picture}`);
    } else if (student.passport) {
      setPassportPreview(student.passport);
    }
    setShowStudentForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:4070/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStudents();
      setSuccessMessage("Student deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete student. Please try again."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const schoolName = localStorage.getItem("schoolName");
      const teacherId = localStorage.getItem("teacherId");

      if (!teacherId) {
        throw new Error(
          "Teacher ID is missing. Ensure it's set in localStorage."
        );
      }

      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("grade", formData.grade);
      formDataToSend.append("rollNumber", formData.rollNumber);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("parentName", formData.parentName);
      formDataToSend.append("parentContact", formData.parentContact);
      formDataToSend.append("school", schoolName);
      formDataToSend.append("teacherId", teacherId);

      if (file) {
        formDataToSend.append("passport", file);
      }

      const url = editingStudent
        ? `http://localhost:4070/students/${editingStudent.id}`
        : "http://localhost:4070/students";

      const method = editingStudent ? "put" : "post";

      const response = await axios[method](url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage(
        `Student ${editingStudent ? "updated" : "added"} successfully: ${
          response.data.fullName
        }`
      );
      setTimeout(() => setSuccessMessage(null), 5000);

      setShowStudentForm(false);
      setEditingStudent(null);
      setFormData({
        fullName: "",
        grade: "",
        rollNumber: "",
        phone: "",
        parentName: "",
        parentContact: "",
        passport: null,
      });
      setPassportPreview(null);
      setFile(null);
      fetchStudents();
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Failed to save student. Please try again."
      );
    }
  };

  const navItems = [
    {
      id: "dashboard",
      icon: <FiHome className="h-5 w-5" />,
      label: "Dashboard",
      path: "/teacher/dashboard",
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
            <p className="text-gray-600 text-lg mt-4">
              Loading dashboard data...
            </p>
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
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
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
              <p className="text-sm font-medium text-gray-900">
                {teacher.name}
              </p>
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
              <form
                onSubmit={handleSearch}
                className="relative hidden md:block"
              >
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

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-4 mt-4 rounded">
            <div className="flex justify-between items-center">
              <p>{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-700 hover:text-green-900"
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
              {notifications.filter((n) => !n.read).length} new notifications
              and {pagination.total || 0} students in your school
            </p>
          </motion.div>

          {/* Students Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Students</h2>
              <button
                onClick={() => {
                  setShowStudentForm(true);
                  setEditingStudent(null);
                  setFormData({
                    fullName: "",
                    grade: "",
                    rollNumber: "",
                    phone: "",
                    parentName: "",
                    parentContact: "",
                    passport: null,
                  });
                  setPassportPreview(null);
                }}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FiUserPlus className="mr-2" /> Add Student
              </button>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-8">
                <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No students found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your first student to get started
                </p>
                <button
                  onClick={() => setShowStudentForm(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Student
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
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
                        Parent Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <motion.tr
                        key={student.id}
                        whileHover={{
                          backgroundColor: "rgba(249, 250, 251, 1)",
                        }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  student.picture
                                    ? `http://localhost:4070${student.picture}`
                                    : student.passport ||
                                      "https://randomuser.me/api/portraits/lego/1.jpg"
                                }
                                alt={student.fullName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {student.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.grade}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.parentName && (
                            <div>
                              <div>{student.parentName}</div>
                              <div className="text-xs text-gray-400">
                                {student.parentContact}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => startEditingStudent(student)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FiEdit2 className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Student Form Modal */}
          <AnimatePresence>
            {showStudentForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => {
                  setShowStudentForm(false);
                  setEditingStudent(null);
                  setPassportPreview(null);
                }}
              >
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  exit={{ y: -50 }}
                  className="bg-white rounded-lg p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {editingStudent ? "Edit Student" : "Add New Student"}
                    </h3>
                    <button
                      onClick={() => {
                        setShowStudentForm(false);
                        setEditingStudent(null);
                        setPassportPreview(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmitStudent} className="w-full">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passport Photo
                      </label>
                      <div className="flex items-center justify-center w-full">
                        {passportPreview ? (
                          <div className="relative">
                            <img
                              src={passportPreview}
                              alt="Passport Preview"
                              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-2 border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPassportPreview(null);
                                setFile(null);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-2 text-center">
                              <FiUpload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 mb-2" />
                              <p className="text-xs sm:text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                passport photo
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG (MAX. 5MB)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grade
                        </label>
                        <input
                          list="gradeOptions"
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        <datalist id="gradeOptions">
                          {[1, 2, 3, 4, 5, 6, 7].map((grade) => (
                            <option key={grade} value={`Grade ${grade}`} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Name
                        </label>
                        <input
                          type="text"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Contact
                        </label>
                        <input
                          type="tel"
                          name="parentContact"
                          value={formData.parentContact}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowStudentForm(false);
                          setEditingStudent(null);
                          setPassportPreview(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        {editingStudent ? "Update" : "Add"} Student
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
