import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaSchool, FaIdCard, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    schoolName: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [apiError, setApiError] = useState(""); // State to handle API errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.schoolName) newErrors.schoolName = "School Name is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop the form submission if validation fails
    }

    try {
      const response = await axios.post("http://localhost:4070/users/register", formData);
      console.log(response);
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      if (error.response && error.response.data.error) {
        // Handle the specific error message from the API
        setApiError(error.response.data.error); // Set the error message
      } else {
        setApiError("An unexpected error occurred. Please try again."); // Generic error message
      }
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo and School Name */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
              <span className="text-xl font-bold">SMS</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">
              School Management System
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className="w-6 h-6" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-lg font-medium hover:text-blue-600 transition duration-300">
              Home
            </a>
            <a href="/about" className="text-lg font-medium hover:text-blue-600 transition duration-300">
              About Us
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 space-y-2 border-t-2 border-gray-200">
            <a href="/" className="block text-center py-2 hover:bg-gray-100 transition duration-200">
              Home
            </a>
            <a href="/about" className="block text-center py-2 hover:bg-gray-100 transition duration-200">
              About Us
            </a>
            <a href="/contact" className="block text-center py-2 hover:bg-gray-100 transition duration-200">
              Contact
            </a>
          </div>
        )}
      </nav>

      {/* Register Form */}
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Register for School Management System
            </h2>
            {/* Display API error message */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {apiError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two-Column Grid for Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="mt-1 relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </motion.div>

                {/* School Name */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    School Name
                  </label>
                  <div className="mt-1 relative">
                    <FaSchool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your school name"
                    />
                  </div>
                  {errors.schoolName && (
                    <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
                  )}
                </motion.div>

                {/* Role */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1 relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your role</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                  )}
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="flex justify-center"
              >
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Register
                </button>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
                className="text-center"
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterForm;