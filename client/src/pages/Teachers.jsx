import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHome, FaUserGraduate, FaChalkboardTeacher, FaClipboardList,
  FaChartLine, FaCog, FaBars, FaTimes, FaPlus, FaSearch,
  FaIdCard, FaUserTie, FaPhone, FaEnvelope, FaBook, FaLock,
  FaSpinner, FaPaperPlane, FaComments
} from "react-icons/fa";

const TeacherComponent = () => {
  // State management
  const [state, setState] = useState({
    teachers: [],
    loading: true,
    error: null,
    showAddForm: false,
    showMessageForm: false,
    searchTerm: "",
    selectedTeacher: null,
    messages: [],
    unreadCount: 0
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    password: "default123",
    confirmPassword: "default123"
  });

  const [messageData, setMessageData] = useState({
    recipientId: "",
    subject: "",
    content: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [messageErrors, setMessageErrors] = useState({});
  const [user, setUser] = useState({
    name: "",
    id: "",
    role: "",
    school: ""
  });

  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Fetch teachers data
  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get("http://localhost:4070/teachers/teachers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setState(prev => ({
        ...prev,
        teachers: response.data,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || "Failed to fetch teachers"
      }));
    }
  };

  // Fetch messages for admin
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get("http://localhost:4070/messages/admin", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const unread = response.data.filter(msg => !msg.read).length;
      
      setState(prev => ({
        ...prev,
        messages: response.data,
        unreadCount: unread
      }));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Load user data, teachers, and messages
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = {
          name: localStorage.getItem("teacherName"),
          id: localStorage.getItem("teacherId"),
          role: localStorage.getItem("userRole"),
          school: localStorage.getItem("schoolName")
        };

        if (Object.values(storedUser).every(Boolean)) {
          setUser(storedUser);
          await fetchTeachers();
          if (storedUser.role === "admin") {
            await fetchMessages();
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: "Session expired. Please login again."
        }));
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    loadUserData();
  }, [navigate]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (state.sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setState(prev => ({ ...prev, sidebarOpen: false }));
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
    if (!messageData.content.trim()) errors.content = "Message content is required";
    
    setMessageErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        "http://localhost:4070/teachers/register",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setState(prev => ({
        ...prev,
        teachers: [...prev.teachers, response.data.teacher],
        showAddForm: false
      }));

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        password: "default123",
        confirmPassword: "default123"
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.error || "Failed to add teacher"
      }));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!validateMessage()) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      await axios.post(
        "http://localhost:4070/messages",
        {
          recipientId: messageData.recipientId,
          subject: messageData.subject,
          content: messageData.content,
          senderRole: "admin"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setState(prev => ({
        ...prev,
        showMessageForm: false,
        error: null
      }));

      setMessageData({
        recipientId: "",
        subject: "",
        content: ""
      });

      // Refresh messages
      await fetchMessages();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.error || "Failed to send message"
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleMessageInputChange = (e) => {
    const { name, value } = e.target;
    setMessageData(prev => ({ ...prev, [name]: value }));
    
    if (messageErrors[name]) {
      setMessageErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  const openMessageForm = (teacher) => {
    setState(prev => ({
      ...prev,
      showMessageForm: true,
      selectedTeacher: teacher
    }));
    setMessageData(prev => ({
      ...prev,
      recipientId: teacher.id
    }));
  };

  const filteredTeachers = state.teachers.filter(teacher =>
    teacher.fullName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(state.searchTerm.toLowerCase())
  );

  if (state.loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="inline-block animate-spin text-blue-500 text-4xl mb-4" />
            <p className="text-gray-600 text-lg">Loading teachers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        ref={sidebarRef}
        isOpen={state.sidebarOpen}
        school={user.school}
        onClose={() => setState(prev => ({ ...prev, sidebarOpen: false }))}
        unreadCount={state.unreadCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          sidebarOpen={state.sidebarOpen}
          onToggleSidebar={toggleSidebar}
          school={user.school}
          userName={user.name}
          unreadCount={state.unreadCount}
          onMessagesClick={() => navigate("/messages")}
        />

        {/* Teachers Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Teachers</h2>
                <p className="text-sm text-gray-600">
                  Total Teachers: <span className="font-bold">{state.teachers.length}</span>
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
                    onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>
                
                {user.role === "admin" && (
                  <>
                    <button
                      onClick={() => setState(prev => ({ ...prev, showAddForm: true }))}
                      className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 whitespace-nowrap flex items-center justify-center"
                    >
                      <FaPlus className="inline-block mr-2" /> Add Teacher
                    </button>
                  </>
                )}
              </div>
            </div>

            {state.error ? (
              <div className="p-4 text-center text-red-600">{state.error}</div>
            ) : (
              <TeachersTable 
                teachers={filteredTeachers} 
                onMessageClick={openMessageForm}
                isAdmin={user.role === "admin"}
              />
            )}
          </div>
        </main>
      </div>

      {/* Add Teacher Modal */}
      {state.showAddForm && (
        <AddTeacherForm
          formData={formData}
          formErrors={formErrors}
          onChange={handleInputChange}
          onSubmit={handleAddTeacher}
          onClose={() => setState(prev => ({ ...prev, showAddForm: false }))}
        />
      )}

      {/* Send Message Modal */}
      {state.showMessageForm && (
        <SendMessageForm
          messageData={messageData}
          errors={messageErrors}
          onChange={handleMessageInputChange}
          onSubmit={handleSendMessage}
          onClose={() => setState(prev => ({ ...prev, showMessageForm: false }))}
          teacher={state.selectedTeacher}
          teachers={state.teachers}
        />
      )}
    </div>
  );
};

// Updated Sidebar with Messages link
const Sidebar = React.forwardRef(({ isOpen, school, onClose, unreadCount }, ref) => (
  <div
    ref={ref}
    className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white transform ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto z-50`}
  >
    <div className="p-4">
      <h1 className="text-2xl font-bold">School Admin</h1>
    </div>
    <nav className="mt-6">
      <NavItem icon={<FaHome />} text="Dashboard" href="/admin/dashboard" onClick={onClose} />
      <NavItem icon={<FaUserGraduate />} text="Students" href="/students" onClick={onClose} />
      <NavItem icon={<FaChalkboardTeacher />} text="Teachers" href="/teachers" onClick={onClose} active />
      <NavItem icon={<FaClipboardList />} text="Attendance" href="/attendence" onClick={onClose} />
      <NavItem icon={<FaChartLine />} text="Reports" href="/report" onClick={onClose} />
      <NavItem icon={<FaIdCard />} text="Teacher Cards" href="/teacher/card" onClick={onClose} />
      <NavItem 
        icon={<FaComments />} 
        text="Messages" 
        href="/messages" 
        onClick={onClose} 
        badge={unreadCount > 0 ? unreadCount : null}
      />
      <NavItem icon={<FaCog />} text="Settings" href="/setting" onClick={onClose} />
    </nav>
  </div>
));

const NavItem = ({ icon, text, href, onClick, active = false, badge = null }) => (
  <a
    href={href}
    className={`flex items-center p-3 ${active ? 'bg-blue-700' : 'hover:bg-blue-700'} transition duration-200 relative`}
    onClick={onClick}
  >
    <span className="mr-2">{icon}</span>
    {text}
    {badge !== null && (
      <span className="absolute right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        {badge}
      </span>
    )}
  </a>
);

// Updated Header with Messages notification
const Header = ({ sidebarOpen, onToggleSidebar, school, userName, unreadCount, onMessagesClick }) => (
  <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
    <button
      onClick={onToggleSidebar}
      className="lg:hidden text-gray-700 focus:outline-none"
      aria-label="Toggle sidebar"
    >
      {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
    </button>
    <h1 className="text-xl font-semibold text-gray-800">{school}</h1>
    <div className="flex items-center space-x-4">
      <button 
        onClick={onMessagesClick}
        className="relative text-gray-700 hover:text-blue-600"
        aria-label="Messages"
      >
        <FaComments size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <span className="text-gray-800 mr-2 hidden sm:inline">
        Admin: <span className="font-semibold text-blue-600">{userName}</span>
      </span>
      <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
    </div>
  </header>
);

// Updated TeachersTable with Message button
const TeachersTable = ({ teachers, onMessageClick, isAdmin }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <TableHeader>Teacher ID</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Phone</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Subject</TableHeader>
          {isAdmin && <TableHeader>Actions</TableHeader>}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {teachers.length > 0 ? (
          teachers.map(teacher => (
            <tr key={teacher.id} className="hover:bg-gray-50">
              <TableCell>{teacher.id}</TableCell>
              <TableCell className="font-medium text-blue-600">{teacher.fullName}</TableCell>
              <TableCell>{teacher.phone}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.subject}</TableCell>
              {isAdmin && (
                <TableCell>
                  <button
                    onClick={() => onMessageClick(teacher)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-300 flex items-center text-sm"
                  >
                    <FaPaperPlane className="mr-1" /> Message
                  </button>
                </TableCell>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
              No teachers found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const TableHeader = ({ children }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}>
    {children}
  </td>
);

const AddTeacherForm = ({ formData, formErrors, onChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
        <h2 className="text-xl font-semibold">Register New Teacher</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <FormField
          icon={<FaUserTie />}
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={onChange}
          error={formErrors.fullName}
          placeholder="John Doe"
          required
        />
        <FormField
          icon={<FaBook />}
          label="Subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={onChange}
          error={formErrors.subject}
          placeholder="Mathematics"
          required
        />
        <FormField
          icon={<FaEnvelope />}
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          error={formErrors.email}
          placeholder="teacher@school.edu"
          required
        />
        <FormField
          icon={<FaPhone />}
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          error={formErrors.phone}
          placeholder="0712345678"
          required
        />
        <FormField
          icon={<FaLock />}
          label="Password"
          name="password"
          type="text"
          value={formData.password}
          onChange={onChange}
          readOnly
        />
        <FormField
          icon={<FaLock />}
          label="Confirm Password"
          name="confirmPassword"
          type="text"
          value={formData.confirmPassword}
          onChange={onChange}
          error={formErrors.confirmPassword}
          readOnly
        />
        
        <div className="mb-4 p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> The teacher will use their email and default password ("default123") to login for the first time.
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white py-2">
          <button
            type="button"
            onClick={onClose}
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
);

// New SendMessageForm component
const SendMessageForm = ({ messageData, errors, onChange, onSubmit, onClose, teacher, teachers }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
        <h2 className="text-xl font-semibold">Send Message</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient <span className="text-red-500">*</span>
          </label>
          {teacher ? (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="font-medium">{teacher.fullName}</p>
              <p className="text-sm text-gray-600">{teacher.subject} Teacher</p>
            </div>
          ) : (
            <select
              name="recipientId"
              value={messageData.recipientId}
              onChange={onChange}
              className={`mt-1 p-2 w-full border ${errors.recipientId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select a teacher</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.subject})
                </option>
              ))}
            </select>
          )}
          {errors.recipientId && <p className="mt-1 text-sm text-red-600">{errors.recipientId}</p>}
        </div>
        
        <FormField
          icon={<FaBook />}
          label="Subject"
          name="subject"
          type="text"
          value={messageData.subject}
          onChange={onChange}
          error={errors.subject}
          placeholder="Regarding..."
          required
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={messageData.content}
            onChange={onChange}
            rows="5"
            className={`mt-1 p-2 w-full border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Write your message here..."
            required
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>
        
        <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white py-2">
          <button
            type="button"
            onClick={onClose}
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
);

const FormField = ({ icon, label, name, type, value, onChange, error, placeholder, required = false, readOnly = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 ${icon ? 'pl-10' : 'pl-3'} p-2 w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default TeacherComponent;