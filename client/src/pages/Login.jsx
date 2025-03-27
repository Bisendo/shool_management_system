import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../helpers/AuthoContex";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Components/Navibar";
import backgroundImage from "../assets/images/15.jpg";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://localhost:4070/users/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data); // Debugging response

      if (!response.data.token) {
        throw new Error("Invalid response format: No token found");
      }

      const token = response.data.token; // ✅ Correctly extracting token
      console.log("Extracted Token:", token);

      // ✅ Decode the token safely
      let decoded;
      try {
        decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
      } catch (decodeError) {
        throw new Error("Invalid token format");
      }

      const { fullName, id, role, schoolName } = decoded;

      console.log("User Name:", fullName);
      console.log("User ID:", id);
      console.log("User Role:", role);
      console.log("School Name:", schoolName);

      // ✅ Store token and user details in localStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("teacherName", fullName);
      localStorage.setItem("teacherId", id);
      localStorage.setItem("userRole", role);
      localStorage.setItem("schoolName", schoolName);

      // ✅ Update Auth Context
      setAuthState({
        accessToken: token,
        teacherName: fullName,
        teacherId: id,
        schoolName: schoolName,
        role,
        authenticated: true,
      });

      // ✅ Redirect based on role
      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (role === "teacher") {
          window.location.href = "/teacher/form";
        } else {
          setErrors({ general: "Unauthorized role" });
          setLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setErrors({ general: error.response?.data?.error || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-purple-50">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <motion.div
          className="w-full max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col lg:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="hidden lg:block lg:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>

          <div className="w-full lg:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 lg:hidden">
              Welcome Back!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {errors.general && <p className="text-red-500 text-sm mt-2">{errors.general}</p>}

              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
