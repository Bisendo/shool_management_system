import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardList,
  FaChartLine,
  FaCog,
  FaBars,
  FaTimes,
  FaPlus,
  FaSearch,
  FaIdCard,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaBook,
  FaLock
} from "react-icons/fa";

const TeacherComponent = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [teacher, setTeacher] = useState({
    name: "",
    id: "",
    role: "",
    school: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [newTeacher, setNewTeacher] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    password: "default123",
    confirmPassword: "default123"
  });
  const [formErrors, setFormErrors] = useState({});

  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const validateForm = () => {
    const errors = {};
    if (!newTeacher.fullName.trim()) errors.fullName = "Full name is required";
    if (!newTeacher.subject.trim()) errors.subject = "Subject is required";
    if (!newTeacher.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newTeacher.email)) {
      errors.email = "Email is invalid";
    }
    if (!newTeacher.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(newTeacher.phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (newTeacher.password !== newTeacher.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTeacher = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token provided. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:4070/teachers/register",
        newTeacher,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setTeachers([...teachers, response.data.teacher]);
      setShowAddTeacherForm(false);
      setNewTeacher({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        password: "default123",
        confirmPassword: "default123"
      });
    } catch (error) {
      console.error("Error adding teacher:", error);
      setError(error.response?.data?.error || "Failed to add teacher");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  useEffect(() => {
    try {
      const storedName = localStorage.getItem("teacherName");
      const storedId = localStorage.getItem("teacherId");
      const storedRole = localStorage.getItem("userRole");
      const storedSchool = localStorage.getItem("schoolName");

      if (storedName && storedId && storedRole && storedSchool) {
        setTeacher({
          name: storedName,
          id: storedId,
          role: storedRole,
          school: storedSchool,
        });
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No token provided. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:4070/teachers/teachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTeachers(response.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
        setError(error.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto z-50`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold">School Admin</h1>
        </div>
        <nav className="mt-6">
          <a
            href="/admin/dashboard"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome className="mr-2" /> Dashboard
          </a>
          <a
            href="/students"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserGraduate className="mr-2" /> Students
          </a>
          <a
            href="/teachers"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaChalkboardTeacher className="mr-2" /> Teachers
          </a>
          <a
            href="/attendence"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardList className="mr-2" /> Attendance
          </a>
          <a
            href="/report"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaChartLine className="mr-2" /> Reports
          </a>
          <a 
            href="/teacher/card" 
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaIdCard className="mr-3" /> Teacher Cards
          </a>
          <a
            href="/setting"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaCog className="mr-2" /> Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {teacher.school}
          </h1>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2 hidden sm:inline">
              Admin:{" "}
              <span className="font-semibold text-blue-600">
                {teacher.name}
              </span>
            </span>
            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </header>

        {/* Teachers Table */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Teachers</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <button
                  onClick={() => setShowAddTeacherForm(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 whitespace-nowrap flex items-center justify-center"
                >
                  <FaPlus className="inline-block mr-2" /> Add Teacher
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-4 text-center text-gray-600">
                Loading teachers...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No teachers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Teacher Form Modal */}
      {showAddTeacherForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
              <h2 className="text-xl font-semibold">Register New Teacher</h2>
              <button
                onClick={() => setShowAddTeacherForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddTeacher(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserTie className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={newTeacher.fullName}
                    onChange={handleChange}
                    className={`mt-1 pl-10 p-2 w-full border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="John Doe"
                  />
                </div>
                {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBook className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    value={newTeacher.subject}
                    onChange={handleChange}
                    className={`mt-1 pl-10 p-2 w-full border ${formErrors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Mathematics"
                  />
                </div>
                {formErrors.subject && <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={newTeacher.email}
                    onChange={handleChange}
                    className={`mt-1 pl-10 p-2 w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="teacher@school.edu"
                  />
                </div>
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={newTeacher.phone}
                    onChange={handleChange}
                    className={`mt-1 pl-10 p-2 w-full border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="0712345678"
                  />
                </div>
                {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="password"
                    value={newTeacher.password}
                    onChange={handleChange}
                    className={`mt-1 pl-10 p-2 w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="confirmPassword"
                    value={newTeacher.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 pl-10 p-2 w-full border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    readOnly
                  />
                </div>
                {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
              </div>
              
              <div className="mb-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> The teacher will use their email and default password ("default123") to login for the first time. They should change it immediately after first login.
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherForm(false)}
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
    </div>
  );
};

export default TeacherComponent;