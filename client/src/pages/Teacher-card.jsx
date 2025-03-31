import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardList,
  FaChartLine,
  FaCog,
  FaBars,
  FaTimes,
  FaSearch,
  FaQrcode,
  FaEdit,
  FaPrint,
  FaSave,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaBook,
  FaSchool,
} from "react-icons/fa";

const TeacherIDCardApp = () => {
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const fileInputRef = useRef(null);

  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedTeacher((prev) => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No token provided. Please log in.");
        return;
      }

      const response = await axios.put(
        `http://localhost:4070/teachers/${editedTeacher.id}`,
        editedTeacher,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeachers(
        teachers.map((t) => (t.id === editedTeacher.id ? response.data : t))
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
      setError(error.response?.data?.error || "Failed to update teacher");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTeacher(null);
  };

  const handleEdit = (teacher) => {
    setEditedTeacher({
      ...teacher,
      photo: teacher.photo || "https://randomuser.me/api/portraits/lego/5.jpg",
    });
    setIsEditing(true);
  };

  const handlePrint = (teacher) => {
    console.log("Printing ID card for:", teacher.name);
    alert(`Printing ID card for ${teacher.name}`);
  };

  const handleQrClick = (teacher) => {
    setSelectedTeacher(teacher);
    setQrModalOpen(true);
  };

  const generateTeacherDataUrl = (teacher) => {
    const teacherData = {
      name: teacher.name,
      id: teacher.id,
      subject: teacher.subject,
      email: teacher.email,
      school: teacher.school,
      photo: teacher.photo,
    };
    return JSON.stringify(teacherData);
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
          "http://localhost:4070/teachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTeachers(
          teachersResponse.data.map((t) => ({
            ...t,
            name: t.name || "Unknown Teacher",
            subject: t.subject || "Not Specified",
            email: t.email || "No email",
            photo: t.photo || "https://randomuser.me/api/portraits/lego/5.jpg",
            school: t.school || "PRIMARY SCHOOL",
          }))
        );
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

  const filteredTeachers = teachers.filter((teacher) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (teacher.name && teacher.name.toLowerCase().includes(searchLower)) ||
      (teacher.email && teacher.email.toLowerCase().includes(searchLower)) ||
      (teacher.subject && teacher.subject.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* QR Code Modal */}
      {qrModalOpen && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Teacher Details
              </h3>
              <button
                onClick={() => setQrModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 w-40 h-48 bg-gray-200 rounded-lg overflow-hidden border-2 border-blue-300">
                  {selectedTeacher.photo ? (
                    <img
                      src={selectedTeacher.photo}
                      alt="Teacher"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <FaUser className="text-gray-500 text-4xl" />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <QRCodeCanvas
                    value={generateTeacherDataUrl(selectedTeacher)}
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                  <p className="mt-2 text-xs text-gray-600">
                    Scan to view teacher details
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaUser className="text-blue-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium">{selectedTeacher.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaBook className="text-blue-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Subject</p>
                      <p className="font-medium">{selectedTeacher.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaEnvelope className="text-blue-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{selectedTeacher.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaSchool className="text-blue-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">School</p>
                      <p className="font-medium">{selectedTeacher.school}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaQrcode className="text-blue-500 mt-1 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Teacher ID</p>
                      <p className="font-medium">{selectedTeacher.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto z-40`}
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
            className="flex items-center p-3 bg-blue-700 transition duration-200"
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
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-30">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {teacher.school} - Teacher ID Cards
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

        {/* Teacher ID Cards */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* Search and Filter */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Teacher ID Cards
              </h2>

              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Conditional rendering for loading or error state */}
          {loading ? (
            <div className="p-4 text-center text-gray-600">
              Loading teachers...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="flex flex-col items-center">
                  {/* Teacher ID Card */}
                  <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-300">
                    {/* School Header */}
                    <div className="bg-blue-600 py-2 px-4 text-center">
                      <h2 className="text-white font-bold text-lg">
                        {teacher.school}
                      </h2>
                      <p className="text-white text-xs">
                        TEACHER IDENTIFICATION CARD
                      </p>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      {/* Photo and Basic Info */}
                      <div className="flex items-center mb-4">
                        {/* Passport Photo */}
                        <div className="relative mr-4">
                          <div className="w-24 h-28 bg-gray-200 rounded border-2 border-blue-400 overflow-hidden">
                            {isEditing && editedTeacher?.id === teacher.id ? (
                              <img
                                src={editedTeacher.photo}
                                alt="Teacher"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={teacher.photo}
                                alt="Teacher"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          {isEditing && editedTeacher?.id === teacher.id && (
                            <button
                              onClick={() => fileInputRef.current.click()}
                              className="absolute -bottom-3 left-0 right-0 mx-auto bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition"
                            >
                              Change Photo
                            </button>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1">
                          <div className="mb-2">
                            <label className="text-xs text-gray-500 block">
                              Name
                            </label>
                            {isEditing && editedTeacher?.id === teacher.id ? (
                              <input
                                type="text"
                                name="name"
                                value={editedTeacher.name}
                                onChange={handleInputChange}
                                className="w-full border-b border-blue-300 focus:border-blue-500 outline-none text-sm font-bold"
                              />
                            ) : (
                              <p className="text-sm font-bold">
                                {teacher.name}
                              </p>
                            )}
                          </div>

                          <div className="mb-2">
                            <label className="text-xs text-gray-500 block">
                              Subject
                            </label>
                            {isEditing && editedTeacher?.id === teacher.id ? (
                              <input
                                type="text"
                                name="subject"
                                value={editedTeacher.subject}
                                onChange={handleInputChange}
                                className="w-full border-b border-blue-300 focus:border-blue-500 outline-none text-sm font-bold"
                              />
                            ) : (
                              <p className="text-sm font-bold flex items-center">
                                <FaChalkboardTeacher className="mr-1 text-blue-500" />{" "}
                                {teacher.subject}
                              </p>
                            )}
                          </div>

                          <div className="mb-2">
                            <label className="text-xs text-gray-500 block">
                              Email
                            </label>
                            <p className="text-sm font-bold">{teacher.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* QR Code - Clickable */}
                      <div
                        className="flex justify-center mb-2 cursor-pointer"
                        onClick={() => handleQrClick(teacher)}
                      >
                        <div className="bg-gray-100 p-2 rounded border border-gray-200 hover:bg-gray-200 transition">
                          <div className="flex flex-col items-center">
                            <QRCodeCanvas
                              value={generateTeacherDataUrl(teacher)}
                              size={80}
                              level="H"
                              includeMargin={false}
                            />
                            <p className="text-xs text-center mt-1 text-gray-600">
                              Scan for details
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-blue-100 py-2 px-4 flex justify-between items-center border-t border-blue-200">
                      {isEditing && editedTeacher?.id === teacher.id ? (
                        <>
                          <button
                            onClick={handleCancel}
                            className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 flex items-center"
                          >
                            <FaTimesCircle className="mr-1" /> Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                          >
                            <FaSave className="mr-1" /> Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handlePrint(teacher)}
                            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 flex items-center"
                          >
                            <FaPrint className="mr-1" /> Print
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherIDCardApp;
