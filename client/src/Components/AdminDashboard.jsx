import React, { useState, useEffect } from "react";
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
  FaEdit,
  FaTrash,
  FaUpload,
  FaUserCircle,
  FaCheckCircle,
  FaSearch,
  FaPhone,
  FaIdCard,
  FaUserFriends
} from "react-icons/fa";

const AdminDashboard = () => {
  // State management
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacher, setTeacher] = useState({
    name: "",
    id: "",
    role: "",
    school: "",
  });
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    grade: "",
    rollNumber: "",
    phone: "",
    parentName: "",
    parentContact: "",
    passport: null,
  });
  const [passportPreview, setPassportPreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newlyAddedStudent, setNewlyAddedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check authentication and load user data on component mount
  useEffect(() => {
    const checkAuthAndLoadUser = () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const teacherName = localStorage.getItem("teacherName");
        const teacherId = localStorage.getItem("teacherId");
        const userRole = localStorage.getItem("userRole");
        const schoolName = localStorage.getItem("schoolName");
        const cachedStudents = localStorage.getItem("cachedStudents");

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

          // Load students from cache if available
          if (cachedStudents) {
            try {
              const parsedStudents = JSON.parse(cachedStudents);
              setStudents(parsedStudents);
            } catch (e) {
              console.error("Error parsing cached students:", e);
            }
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadUser();
  }, [navigate]);

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const teachersResponse = await axios.get("http://localhost:4070/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(teachersResponse.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  // Handle input changes for new student form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload for student passport
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewStudent(prev => ({
        ...prev,
        passport: file,
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token provided. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", newStudent.fullName);
      formData.append("grade", newStudent.grade);
      formData.append("rollNumber", newStudent.rollNumber);
      formData.append("phone", newStudent.phone);
      formData.append("parentName", newStudent.parentName || "");
      formData.append("parentContact", newStudent.parentContact || "");
      if (newStudent.passport) {
        formData.append("passport", newStudent.passport);
      }

      const response = await axios.post(
        "http://localhost:4070/students/addstudent",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        const updatedStudents = [response.data.student, ...students];
        setStudents(updatedStudents);
        localStorage.setItem("cachedStudents", JSON.stringify(updatedStudents));
        
        setNewlyAddedStudent(response.data.student);
        setNewStudent({
          fullName: "",
          grade: "",
          rollNumber: "",
          phone: "",
          parentName: "",
          parentContact: "",
          passport: null,
        });
        setPassportPreview(null);
        setShowAddStudentForm(false);
        setShowSuccessModal(true);
        setSuccess("Student added successfully!");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setError(error.response?.data?.error || "Failed to add student. Please try again.");
    }
  };

  // Delete a student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token provided. Please log in.");
        return;
      }

      await axios.delete(`http://localhost:4070/students/deletestudent/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      localStorage.setItem("cachedStudents", JSON.stringify(updatedStudents));
      setSuccess("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      setError(error.response?.data?.error || "Failed to delete student. Please try again.");
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(searchLower) ||
      student.grade.toLowerCase().includes(searchLower) ||
      student.rollNumber.toLowerCase().includes(searchLower) ||
      student.phone.toLowerCase().includes(searchLower) ||
      (student.parentName && student.parentName.toLowerCase().includes(searchLower)) ||
      (student.parentContact && student.parentContact.toLowerCase().includes(searchLower))
    );
  });

  // Display loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Success Modal */}
      {showSuccessModal && newlyAddedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-green-500 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Student Added Successfully!
              </h3>
              <div className="w-full border-t border-gray-200 my-4"></div>
              
              <div className="w-full mb-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Student Details:</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaUserGraduate className="text-gray-500 mr-2" />
                    <span className="font-medium">{newlyAddedStudent.fullName}</span>
                  </div>
                  <div className="flex items-center">
                    <FaIdCard className="text-gray-500 mr-2" />
                    <span>Grade: {newlyAddedStudent.grade} | Roll: {newlyAddedStudent.rollNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-500 mr-2" />
                    <span>{newlyAddedStudent.phone}</span>
                  </div>
                  {newlyAddedStudent.parentName && (
                    <div className="flex items-center">
                      <FaUserFriends className="text-gray-500 mr-2" />
                      <span>Parent: {newlyAddedStudent.parentName} ({newlyAddedStudent.parentContact})</span>
                    </div>
                  )}
                </div>
                {newlyAddedStudent.picture && (
                  <div className="mt-4 flex justify-center">
                    <img 
                      src={newlyAddedStudent.picture} 
                      alt="Student passport" 
                      className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto z-50`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold">{teacher.school}</h1>
          <p className="text-sm text-blue-200">Admin Dashboard</p>
        </div>
        <nav className="mt-6">
          <a
            href="/admin/dashboard"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaHome className="mr-2" /> Dashboard
          </a>
          <a
            href="/students"
            className="flex items-center p-3 bg-blue-700 transition duration-200"
          >
            <FaUserGraduate className="mr-2" /> Students
          </a>
          <a
            href="/teachers"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaChalkboardTeacher className="mr-2" /> Teachers
          </a>
          <a
            href="/attendence"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaClipboardList className="mr-2" /> Attendance
          </a>
          <a
            href="/report"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaChartLine className="mr-2" /> Reports
          </a>
          <a
            href="/setting"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
          >
            <FaCog className="mr-2" /> Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 focus:outline-none"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Student Management
          </h1>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2 hidden sm:inline">
              Welcome, <span className="font-semibold text-blue-600">{teacher.name}</span>
            </span>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              {teacher.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="p-4 mx-6 mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
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

        {/* Success State */}
        {success && !showSuccessModal && (
          <div className="p-4 mx-6 mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
            <div className="flex justify-between items-center">
              <p>{success}</p>
              <button 
                onClick={() => setSuccess(null)} 
                className="ml-2 text-green-800 hover:text-green-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <>
          {/* Summary Cards */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <FaUserGraduate size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Total Students
                  </h2>
                  <p className="text-3xl font-bold text-blue-600">
                    {filteredStudents.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FaChalkboardTeacher size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Total Teachers
                  </h2>
                  <p className="text-3xl font-bold text-green-600">
                    {teachers.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <FaClipboardList size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Today's Attendance
                  </h2>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Management Section */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Student Records
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage all student information in one place
                  </p>
                </div>
                <div className="flex space-x-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
                  >
                    <FaPlus className="mr-2" /> Add Student
                  </button>
                </div>
              </div>

              {/* Add Student Form */}
              {showAddStudentForm && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">New Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={newStudent.fullName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Grade/Class *
                        </label>
                        <input
                          type="text"
                          name="grade"
                          value={newStudent.grade}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          placeholder="Enter grade/class"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Roll Number *
                        </label>
                        <input
                          type="text"
                          name="rollNumber"
                          value={newStudent.rollNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          placeholder="Enter roll number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={newStudent.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Name
                        </label>
                        <input
                          type="text"
                          name="parentName"
                          value={newStudent.parentName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter parent name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Contact
                        </label>
                        <input
                          type="text"
                          name="parentContact"
                          value={newStudent.parentContact}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter parent contact"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passport Photo
                        </label>
                        <div className="flex items-center">
                          <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200">
                            <FaUpload className="mr-2" />
                            Upload Passport
                            <input
                              type="file"
                              name="passport"
                              onChange={handleFileChange}
                              className="sr-only"
                              accept="image/*"
                            />
                          </label>
                          {passportPreview ? (
                            <div className="ml-4">
                              <img 
                                src={passportPreview} 
                                alt="Passport preview" 
                                className="h-16 w-16 rounded-full object-cover border border-gray-200"
                              />
                            </div>
                          ) : (
                            <div className="ml-4 text-gray-400">
                              <FaUserCircle className="h-16 w-16" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddStudentForm(false);
                          setPassportPreview(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Save Student
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Students List */}
              <div className="divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {student.picture ? (
                            <img 
                              src={student.picture} 
                              alt="Student passport" 
                              className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <FaUserCircle size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 truncate">
                                {student.fullName}
                              </h3>
                              <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                                <span className="flex items-center mr-3">
                                  <FaIdCard className="mr-1 text-gray-500" />
                                  {student.grade} | {student.rollNumber}
                                </span>
                                <span className="flex items-center mr-3">
                                  <FaPhone className="mr-1 text-gray-500" />
                                  {student.phone}
                                </span>
                                {student.parentName && (
                                  <span className="flex items-center">
                                    <FaUserFriends className="mr-1 text-gray-500" />
                                    {student.parentName}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => console.log("Edit student:", student)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <FaUserGraduate className="mx-auto text-gray-400 text-4xl mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {searchTerm ? 'No students found' : 'No students yet'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? 'Try adjusting your search query'
                        : 'Add your first student by clicking the "Add Student" button'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default AdminDashboard;