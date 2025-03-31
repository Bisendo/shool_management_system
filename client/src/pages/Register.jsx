import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaSchool,
  FaBars,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffRegisterForm = () => {
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
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.schoolName.trim())
      newErrors.schoolName = "School Name is required";
    if (!formData.role) newErrors.role = "Please select your role";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    // Prevent teachers from registering themselves
    if (formData.role === "teacher") {
      setApiError(
        "Only administrators can create teacher accounts. Please ask your administrator or log in."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:4070/staffs/register",
        {
          ...formData,
          role: "admin", // Ensure only admins can register
        }
      );

      if (response.data.success) {
        navigate("/login", { state: { registrationSuccess: true } });
      } else {
        setApiError(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      if (error.response) {
        setApiError(
          error.response.data.error ||
            error.response.data.message ||
            "Registration failed"
        );
      } else {
        setApiError(
          "Network error. Please check your connection and try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              <FaChalkboardTeacher className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">
              School Staff Portal
            </h1>
          </div>

          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className="w-6 h-6" />
          </button>

          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-lg font-medium hover:text-indigo-600 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-lg font-medium hover:text-indigo-600 transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-4 space-y-2 border-t-2 border-gray-200">
            <Link
              to="/"
              className="block text-center py-2 hover:bg-gray-100 transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="block text-center py-2 hover:bg-gray-100 transition duration-200"
            >
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* Register Form */}
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Staff Registration
              </h2>
              <p className="text-gray-600 mt-2">
                Register as school administrator or teacher
              </p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="your.email@school.edu"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="+1234567890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* School Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <div className="relative">
                    <FaSchool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.schoolName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Your school name"
                    />
                  </div>
                  {errors.schoolName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.schoolName}
                    </p>
                  )}
                </div>

                {/* Role - Staff Only */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Role
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                      <FaUserShield className="text-gray-400" />
                      <span className="text-gray-400">|</span>
                      <FaChalkboardTeacher className="text-gray-400" />
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full pl-16 pr-4 py-2 border ${
                        errors.role ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="">Select your staff role</option>
                      <option value="admin">School Administrator</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                  )}

                  {/* Show Message if User Selects "Teacher" */}
                  {formData.role === "teacher" && (
                    <p className="mt-2 text-yellow-600 bg-yellow-100 border-l-4 border-yellow-500 p-2 rounded">
                      ⚠️ Teachers cannot register themselves. Please ask an
                      administrator to create an account for you.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Re-enter your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Register as Staff"
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffRegisterForm;
