import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaChalkboardTeacher,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaPaperPlane,
  FaComments,
  FaBook,
  FaUserTie,
  FaLock,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { AuthContext } from "../helpers/AuthoContex"; // Adjust the import path as needed

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  const sidebarRef = useRef(null);

  const [state, setState] = useState({
    teachers: [],
    loading: true,
    error: null,
    showAddForm: false,
    showMessageForm: false,
    searchTerm: "",
    selectedTeacher: null,
    messages: [],
    unreadCount: 0,
    sidebarOpen: false,
    notifications: [],
    showNotifications: false,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    password: "default123",
    confirmPassword: "default123",
  });

  const [messageData, setMessageData] = useState({
    recipientId: "",
    subject: "",
    content: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [messageErrors, setMessageErrors] = useState({});

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authState.authenticated) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        // Load teachers if admin
        if (authState.role === "admin") {
          const response = await axios.get(
            `http://localhost:4070/teachers/admin/${authState.teacherId}`,
            {
              headers: { Authorization: `Bearer ${authState.accessToken}` },
            }
          );

          setState((prev) => ({
            ...prev,
            teachers: response.data || [],
            loading: false,
            error: null,
          }));
        } else {
          // For regular teachers, just set loading to false
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.response?.data?.error || "Failed to fetch data",
        }));

        // If unauthorized, clear auth and redirect to login
        if (error.response?.status === 401) {
          setAuthState({
            accessToken: "",
            teacherName: "",
            teacherId: "",
            role: "",
            schoolName: "",
            authenticated: false,
          });
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    loadData();
  }, [authState, navigate, setAuthState]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        state.sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setState((prev) => ({ ...prev, sidebarOpen: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [state.sidebarOpen]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.subject.trim()) errors.subject = "Subject is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Message validation
  const validateMessage = () => {
    const errors = {};
    if (!messageData.recipientId) errors.recipientId = "Recipient is required";
    if (!messageData.subject.trim()) errors.subject = "Subject is required";
    if (!messageData.content.trim())
      errors.content = "Message content is required";

    setMessageErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:4070/teachers/register",
        formData,
        {
          headers: { Authorization: `Bearer ${authState.accessToken}` },
        }
      );

      setState((prev) => ({
        ...prev,
        teachers: [...prev.teachers, response.data.teacher],
        showAddForm: false,
      }));

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        password: "default123",
        confirmPassword: "default123",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.error || "Failed to add teacher",
      }));

      if (error.response?.status === 401) {
        setAuthState({
          accessToken: "",
          teacherName: "",
          teacherId: "",
          role: "",
          schoolName: "",
          authenticated: false,
        });
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!validateMessage()) return;

    try {
      await axios.post(
        "http://localhost:4070/messages",
        {
          senderId: authState.teacherId,
          recipientId: messageData.recipientId,
          subject: messageData.subject,
          content: messageData.content,
        },
        {
          headers: { Authorization: `Bearer ${authState.accessToken}` },
        }
      );

      setState((prev) => ({
        ...prev,
        showMessageForm: false,
        error: null,
      }));

      setMessageData({
        recipientId: "",
        subject: "",
        content: "",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.error || "Failed to send message",
      }));

      if (error.response?.status === 401) {
        setAuthState({
          accessToken: "",
          teacherName: "",
          teacherId: "",
          role: "",
          schoolName: "",
          authenticated: false,
        });
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleMessageInputChange = (e) => {
    const { name, value } = e.target;
    setMessageData((prev) => ({ ...prev, [name]: value }));

    if (messageErrors[name]) {
      setMessageErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleSidebar = () => {
    setState((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  const openMessageForm = (teacher) => {
    setState((prev) => ({
      ...prev,
      showMessageForm: true,
      selectedTeacher: teacher,
    }));
    setMessageData((prev) => ({
      ...prev,
      recipientId: teacher.id,
    }));
  };

  const handleLogout = () => {
    setAuthState({
      accessToken: "",
      teacherName: "",
      teacherId: "",
      role: "",
      schoolName: "",
      authenticated: false,
    });
    localStorage.clear();
    navigate("/login");
  };

  const filteredTeachers = state.teachers.filter(
    (teacher) =>
      teacher.fullName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: "Active Courses",
      value: "4",
      icon: <FaBook className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Teachers",
      value: state.teachers.length.toString(),
      icon: <FaChalkboardTeacher className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Assignments",
      value: "12",
      icon: <FaClipboardList className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Messages",
      value: "5",
      icon: <FaComments className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
  ];

  if (state.loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="inline-block animate-spin text-blue-500 text-4xl mb-4" />
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white transform ${
          state.sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto z-50`}
      >
        <div className="p-6 text-2xl font-bold text-white">
          {authState.schoolName}
        </div>

        <div className="px-4 py-6 border-t border-indigo-600">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover border-2 border-white"
            />
            <div>
              <h3 className="font-medium">{authState.teacherName}</h3>
              <p className="text-xs text-indigo-200">ID: {authState.teacherId}</p>
              <p className="text-xs text-indigo-200">Role: {authState.role}</p>
            </div>
          </div>
        </div>

        <nav className="px-4">
          <button
            onClick={() => {
              setState((prev) => ({ ...prev, sidebarOpen: false }));
              navigate("/teacher/dashboard");
            }}
            className={`flex items-center w-full p-4 mb-1 rounded-lg cursor-pointer transition-all ${
              window.location.pathname === "/teacher/dashboard"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-indigo-200 hover:bg-indigo-800"
            }`}
          >
            <FaHome className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          {authState.role === "admin" && (
            <button
              onClick={() => {
                setState((prev) => ({ ...prev, sidebarOpen: false }));
                navigate("/teacher/teachers");
              }}
              className={`flex items-center w-full p-4 mb-1 rounded-lg cursor-pointer transition-all ${
                window.location.pathname === "/teacher/teachers"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-indigo-200 hover:bg-indigo-800"
              }`}
            >
              <FaChalkboardTeacher className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Teachers</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center w-full p-4 mb-1 rounded-lg cursor-pointer transition-all text-indigo-200 hover:bg-indigo-800"
          >
            <FaTimes className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {state.sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            {authState.schoolName}
          </h1>

          <div className="flex items-center space-x-4">
            <span className="text-gray-800 mr-2 hidden sm:inline">
              Teacher:{" "}
              <span className="font-semibold text-blue-600">
                {authState.teacherName}
              </span>
            </span>

            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 mb-6 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {authState.teacherName}!
            </h2>
            <p className="opacity-90">
              {authState.schoolName} | You have{" "}
              {state.notifications.filter((n) => !n.read).length} new
              notifications and {state.teachers.length} teachers in your school
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className={`p-6 rounded-xl shadow-lg text-white ${stat.color} hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{stat.title}</h2>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white bg-opacity-20">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Teachers Section - Only show for admin */}
          {authState.role === "admin" && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Teachers
                  </h2>
                  <p className="text-sm text-gray-600">
                    Total Teachers:{" "}
                    <span className="font-bold">{state.teachers.length}</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative w-full">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={state.searchTerm}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          searchTerm: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <button
                    onClick={() =>
                      setState((prev) => ({ ...prev, showAddForm: true }))
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 whitespace-nowrap flex items-center justify-center"
                  >
                    <FaPlus className="inline-block mr-2" /> Add Teacher
                  </button>
                </div>
              </div>

              {state.error ? (
                <div className="p-4 text-center text-red-600">{state.error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <tr key={teacher.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {teacher.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {teacher.fullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {teacher.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {teacher.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {teacher.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => openMessageForm(teacher)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-300 flex items-center text-sm"
                              >
                                <FaPaperPlane className="mr-1" /> Message
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            No teachers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              School Analytics
            </h2>
            <div className="h-64 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">
                Performance Chart Placeholder
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Add Teacher Modal */}
      {state.showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
              <h2 className="text-xl font-semibold">Register New Teacher</h2>
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, showAddForm: false }))
                }
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddTeacher}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`mt-1 pl-10 p-2 w-full border ${
                      formErrors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="John Doe"
                  />
                </div>
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`mt-1 pl-10 p-2 w-full border ${
                      formErrors.subject ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Mathematics"
                  />
                </div>
                {formErrors.subject && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.subject}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 pl-10 p-2 w-full border ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="teacher@school.edu"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`mt-1 pl-10 p-2 w-full border ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="0712345678"
                  />
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`mt-1 pl-10 p-2 w-full border ${
                      formErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    readOnly
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> The teacher will use their email and
                  default password ("default123") to login for the first time.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, showAddForm: false }))
                  }
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center"
                >
                  <FaUserTie className="mr-2" /> Register Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {state.showMessageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
              <h2 className="text-xl font-semibold">Send Message</h2>
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, showMessageForm: false }))
                }
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient <span className="text-red-500">*</span>
                </label>
                {state.selectedTeacher ? (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="font-medium">
                      {state.selectedTeacher.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {state.selectedTeacher.subject} Teacher
                    </p>
                  </div>
                ) : (
                  <select
                    name="recipientId"
                    value={messageData.recipientId}
                    onChange={handleMessageInputChange}
                    className={`mt-1 p-2 w-full border ${
                      messageErrors.recipientId
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  >
                    <option value="">Select a teacher</option>
                    {state.teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.subject})
                      </option>
                    ))}
                  </select>
                )}
                {messageErrors.recipientId && (
                  <p className="mt-1 text-sm text-red-600">
                    {messageErrors.recipientId}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    value={messageData.subject}
                    onChange={handleMessageInputChange}
                    className={`mt-1 pl-10 p-2 w-full border ${
                      messageErrors.subject
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Regarding..."
                  />
                </div>
                {messageErrors.subject && (
                  <p className="mt-1 text-sm text-red-600">
                    {messageErrors.subject}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={messageData.content}
                  onChange={handleMessageInputChange}
                  rows="5"
                  className={`mt-1 p-2 w-full border ${
                    messageErrors.content ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Write your message here..."
                  required
                />
                {messageErrors.content && (
                  <p className="mt-1 text-sm text-red-600">
                    {messageErrors.content}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, showMessageForm: false }))
                  }
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
                >
                  <FaPaperPlane className="mr-2" /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;