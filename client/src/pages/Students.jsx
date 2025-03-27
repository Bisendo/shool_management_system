import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaCog,
  FaBars,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaEye,
} from "react-icons/fa";

const TeacherDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("students");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({
    fullName: "",
    grade: "",
    phone: "",
    rollNumber: "",
    picture: null,
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:4070/students/getstudent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        if (error.response && error.response.status === 403) {
          setError("You do not have permission to access this resource.");
        } else {
          setError("Failed to load students. Please try again.");
        }
      }
    };

    fetchStudents();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "students", icon: <FaUsers />, label: "Students", link: "/students" },
    { id: "teachers", icon: <FaChalkboardTeacher />, label: "Teachers", link: "/teachers" },
    { id: "courses", icon: <FaBook />, label: "Courses", link: "/courses" },
    { id: "calendar", icon: <FaCalendarAlt />, label: "Calendar", link: "/calendar" },
    { id: "settings", icon: <FaCog />, label: "Settings", link: "/settings" },
    { id: "logout", icon: <FaSignOutAlt />, label: "Log Out", link: "/login" },
  ];

  const handleMenuItemClick = (link) => {
    navigate(link);
    if (windowWidth < 768) setIsSidebarOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setStudent((prevState) => ({
      ...prevState,
      picture: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", student.fullName);
    formData.append("grade", student.grade);
    formData.append("phone", student.phone);
    formData.append("rollNumber", student.rollNumber);
    formData.append("picture", student.picture);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4070/students/addstudent",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const newStudent = response.data;
        setStudents([...students, newStudent]);
        setStudent({ fullName: "", grade: "", phone: "", rollNumber: "", picture: null });
        setShowForm(false);
        setError("");
        alert("Student added successfully!");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setError("Failed to add student. Please try again.");
    }
  };

  const handleEditStudent = (student) => {
    console.log("Editing student:", student);
    // Implement edit functionality here
  };

  const handleDeleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4070/students/deletestudent/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student.");
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
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
        <div className="p-6 text-2xl font-bold text-blue-600">Teacher Dashboard</div>
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
              onClick={() => {
                setSelectedMenu(item.id);
                handleMenuItemClick(item.link);
              }}
            >
              <span className="mr-3 text-blue-500">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Students List</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
            >
              <FaPlus className="inline-block mr-2" /> Add New Student
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Student Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={student.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade
                    </label>
                    <input
                      type="text"
                      name="grade"
                      value={student.grade}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={student.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={student.rollNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Picture
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Add Student
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Grade</th>
                  <th className="px-4 py-2 text-left">Roll Number</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-2">{student.fullName}</td>
                    <td className="px-4 py-2">{student.grade}</td>
                    <td className="px-4 py-2">{student.rollNumber}</td>
                    <td className="px-4 py-2">{student.phone}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-blue-500 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-500 mr-2"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="text-green-500"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <div>
              <p><strong>Name:</strong> {selectedStudent.fullName}</p>
              <p><strong>Grade:</strong> {selectedStudent.grade}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone}</p>
              <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;