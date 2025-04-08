import React, { useState, useEffect, useCallback, useRef } from "react";
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
  FaIdCard,
  FaSpinner,
  FaSearch,

} from "react-icons/fa";

const AdminDashboard = () => {
  // State management
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacher, setTeacher] = useState({
    name: "",
    id: "",
    role: "",
    school: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalStudents: 0,
  });

  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const sidebarToggleRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarToggleRef.current &&
        !sidebarToggleRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check authentication and load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        // Fetch user profile if not in localStorage
        const teacherName = localStorage.getItem("teacherName");
        const teacherId = localStorage.getItem("teacherId");
        const userRole = localStorage.getItem("userRole");
        const schoolName = localStorage.getItem("schoolName");

        if (!teacherName || !teacherId || !userRole || !schoolName) {
          const response = await axios.get("http://localhost:4070/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const userData = response.data;
          localStorage.setItem("teacherName", userData.name);
          localStorage.setItem("teacherId", userData.id);
          localStorage.setItem("userRole", userData.role);
          localStorage.setItem("schoolName", userData.school);

          setTeacher({
            name: userData.name,
            id: userData.id,
            role: userData.role,
            school: userData.school,
          });
        } else {
          setTeacher({
            name: teacherName,
            id: teacherId,
            role: userRole,
            school: schoolName,
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    loadUserData();
  }, [navigate]);

  // Fetch all data (teachers and students)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const [teachersResponse, studentsResponse] = await Promise.all([
        axios.get("http://localhost:4070/teachers/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:4070/students", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm,
          },
        }),
      ]);

      setTeachers(teachersResponse.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: studentsResponse.data.totalPages,
        totalStudents: studentsResponse.data.totalStudents,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  // Fetch data when component mounts or pagination/search changes
  useEffect(() => {
    if (teacher.id) {
      fetchData();
    }
  }, [teacher.id, fetchData]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="inline-block animate-spin text-blue-500 text-4xl mb-4" />
            <p className="text-gray-600 text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto z-50`}
      >
        <div className="p-4 border-b border-blue-700 flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-xl font-bold">
              {teacher.school.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold truncate">{teacher.school}</h1>
            <p className="text-xs text-blue-200">Admin Dashboard</p>
          </div>
        </div>
        <nav className="mt-4">
          <a
            href="/admin/dashboard"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaHome className="mr-3" /> Dashboard
          </a>
          <a
            href="/students"
            className="flex items-center p-3 bg-blue-700 transition duration-200"
          >
            <FaUserGraduate className="mr-3" /> Students
          </a>
          <a
            href="/teachers"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaChalkboardTeacher className="mr-3" /> Teachers
          </a>
          <a
            href="/dashboard/attendence"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaClipboardList className="mr-3" /> Attendance
          </a>
          <a
            href="/report"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaChartLine className="mr-3" /> Reports
          </a>
          <a
            href="/teacher/card"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaIdCard className="mr-3" /> Teacher Cards
          </a>
          <div className="border-t border-blue-700 my-2"></div>
          <a
            href="/setting"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaCog className="mr-3" /> Settings
          </a>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-medium">
                {teacher.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{teacher.name}</p>
              <p className="text-xs text-blue-200">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center">
            <button
              ref={sidebarToggleRef}
              onClick={toggleSidebar}
              className="lg:hidden text-gray-700 focus:outline-none mr-4"
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex items-center"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                type="submit"
                className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Search
              </button>
            </form>
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 hidden md:inline">
                <span className="font-semibold text-blue-600">
                  {teacher.name}
                </span>
              </span>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {teacher.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Error/Success Messages */}
        <div className="px-4">
          {error && (
            <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex justify-between items-center">
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-800 hover:text-red-900"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <form onSubmit={handleSearch} className="sm:hidden">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-2 top-3 text-gray-400" />
                </div>
              </form>
            
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FaUserGraduate size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Total Students
                  </h2>
                  <p className="text-2xl font-bold text-gray-800">
                    {pagination.totalStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                  <FaChalkboardTeacher size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Total Teachers
                  </h2>
                  <p className="text-2xl font-bold text-gray-800">
                    {teachers.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                  <FaClipboardList size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Today's Attendance
                  </h2>
                  <p className="text-2xl font-bold text-gray-800">85%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <FaIdCard size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">School</h2>
                  <p className="text-md font-medium text-gray-800 truncate">
                    {teacher.school}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
