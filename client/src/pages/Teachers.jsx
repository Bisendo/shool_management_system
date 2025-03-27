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

  const [newTeacher, setNewTeacher] = useState({
    fullName: "",
    subject: "",
    email: "",
  });

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle the submission of the Add Teacher form
  const handleAddTeacher = async () => {
    try {
      // You can call your API to save the teacher to the database
      const response = await axios.post(
        "http://localhost:4070/users",
        newTeacher
      );
      setTeachers([...teachers, response.data]);
      setShowAddTeacherForm(false); // Close the form
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    try {
      // Retrieve data from localStorage
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
        navigate("/login"); // Redirect to login if something is missing
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
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
  
        const teachersResponse = await axios.get(
          "http://localhost:4070/teachers", // Your API endpoint for teachers
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token for authentication
            },
          }
        );
  
        setTeachers(teachersResponse.data); // Update state with filtered teachers
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
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
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
          >
            <FaHome className="mr-2" /> Dashboard
          </a>

          <a
            href="/students"
            className="flex items-center p-3 hover:bg-blue-700 transition duration-200"
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
            {teacher.school} Dashboard
          </h1>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">
              Admin:{" "}
              <span className="font-semibold text-blue-600">
                {teacher.name}
              </span>
            </span>
            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </header>

        {/* Teachers Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Teachers</h2>
              <button
                onClick={() => setShowAddTeacherForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
              >
                <FaPlus className="inline-block mr-2" /> Add Teacher
              </button>
            </div>

            {/* Conditional rendering for loading or error state */}
            {loading ? (
              <div className="p-4 text-center text-gray-600">
                Loading teachers...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">{error}</div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">
                      Subject
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {teacher.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {teacher.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {teacher.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                            {teacher.subject}
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Teacher Form */}
      {showAddTeacherForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Teacher</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={newTeacher.fullName}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={newTeacher.subject}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newTeacher.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTeacher}
                  className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
                >
                  Add Teacher
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
