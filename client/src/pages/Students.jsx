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
  FaEdit,
  FaTrash,
  FaUserCircle,
  FaIdCard,
  FaSpinner,
} from "react-icons/fa";

const TeacherDashboard = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacher, setTeacher] = useState({
    name: "",
    id: "",
    role: "",
    school: "",
  });

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalStudents: 0,
  });

  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const sidebarToggleRef = useRef(null);

  // Grade definitions with colors and student counts
  const [grades, setGrades] = useState([
    { name: "Grade 1", color: "bg-blue-100 border-blue-300", count: 0 },
    { name: "Grade 2", color: "bg-green-100 border-green-300", count: 0 },
    { name: "Grade 3", color: "bg-yellow-100 border-yellow-300", count: 0 },
    { name: "Grade 4", color: "bg-purple-100 border-purple-300", count: 0 },
    { name: "Grade 5", color: "bg-red-100 border-red-300", count: 0 },
    { name: "Grade 6", color: "bg-indigo-100 border-indigo-300", count: 0 },
    { name: "Grade 7", color: "bg-pink-100 border-pink-300", count: 0 },
  ]);

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
    const loadUserData = () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const teacherName = localStorage.getItem("teacherName");
        const teacherId = localStorage.getItem("teacherId");
        const userRole = localStorage.getItem("userRole");
        const schoolName = localStorage.getItem("schoolName");

        if (!accessToken) {
          navigate("/login");
          return;
        }

        if (teacherName && teacherId && userRole && schoolName) {
          setTeacher({
            name: teacherName,
            id: teacherId,
            role: userRole,
            school: schoolName,
          });
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Failed to load user data");
      }
    };

    loadUserData();
  }, [navigate]);

  // Fetch student data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (selectedGrade) {
        params.grade = selectedGrade;
      }

      const response = await axios.get("http://localhost:4070/students", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setStudents(response.data.students);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalStudents: response.data.totalStudents,
      }));

      // Update grade counts
      setGrades((prevGrades) => {
        return prevGrades.map((grade) => {
          const count = response.data.students.filter(
            (s) => s.grade === grade.name
          ).length;
          return { ...grade, count };
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, selectedGrade]);

  // Fetch data when component mounts or pagination/search changes
  useEffect(() => {
    if (teacher.id) {
      fetchData();
    }
  }, [teacher.id, fetchData]);

  // Delete a student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:4070/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting student:", error);
      setError(error.response?.data?.error || "Failed to delete student");
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // View students in a specific grade
  const viewGradeStudents = (grade) => {
    setSelectedGrade(grade);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Clear grade filter
  const clearGradeFilter = () => {
    setSelectedGrade(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Filter students by selected grade
  const filteredStudents = selectedGrade
    ? students.filter((student) => student.grade === selectedGrade)
    : students;

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
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-2xl font-bold">{teacher.school}</h1>
          <p className="text-sm text-blue-200">Admin Dashboard</p>
        </div>
        <nav className="mt-2">
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
            href="/attendence"
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
          <a
            href="/setting"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaCog className="mr-3" /> Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40">
          <button
            ref={sidebarToggleRef}
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Student Management
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 hidden sm:inline">
              <span className="font-semibold text-blue-600">
                {teacher.name}
              </span>
            </span>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              {teacher.name.charAt(0).toUpperCase()}
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
          {/* Student Management Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedGrade
                    ? `${selectedGrade} Students`
                    : "Student Grades"}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedGrade
                    ? `Showing ${filteredStudents.length} students in ${selectedGrade}`
                    : "Select a grade to view students"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {selectedGrade && (
                  <button
                    onClick={clearGradeFilter}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
                  >
                    Back to Grades
                  </button>
                )}
                {!selectedGrade && (
                  <div className="relative flex-grow">
                    
                  </div>
                )}
              </div>
            </div>

            {!selectedGrade ? (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {grades.map((grade) => (
                  <div
                    key={grade.name}
                    className={`p-6 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${grade.color}`}
                    onClick={() => viewGradeStudents(grade.name)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <FaUserGraduate className="text-3xl text-gray-600 mb-2" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {grade.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {grade.count} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStudents.length > 0 ? (
              <>
                <div className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {student.picture ? (
                            <img
                              src={   student.picture
                                ? `http://localhost:4070${student.picture}`
                                : student.passport ||
                                  "https://randomuser.me/api/portraits/lego/1.jpg"}
                              alt="Student"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <FaUserCircle className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {student.fullName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            Roll: {student.rollNumber} • Phone: {student.phone}
                          </p>
                          {student.parentName && (
                            <p className="text-xs text-gray-400 truncate">
                              Parent: {student.parentName} (
                              {student.parentContact})
                            </p>
                          )}
                        </div>
                        <div className="ml-3 flex-shrink-0 flex space-x-1">
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 bg-gray-50">
                  <div>
                    <span className="text-xs text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-xs"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-xs"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <FaUserGraduate className="mx-auto text-gray-300 text-4xl mb-3" />
                <h3 className="text-md font-medium text-gray-700 mb-1">
                  No students found
                </h3>
                <p className="text-gray-500 text-sm">
              
                </p>
              </div>
            )}
          </div>

          {/* Add/Edit Student Form */}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
