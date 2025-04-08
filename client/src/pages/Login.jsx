import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../helpers/AuthoContex";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Components/Navibar";
import { FiMail, FiLock, FiArrowRight, FiUserPlus } from "react-icons/fi";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSticker, setCurrentSticker] = useState(0);

  const stickers = ["📚", "🎓", "🏫", "✏️", "📝", "🧑‍🏫"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSticker((prev) => (prev + 1) % stickers.length);
    }, 2000);
    return () => clearInterval(interval);
  });

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://localhost:4070/staffs/login", {
        email,
        password,
      });
      if (!response.data.token)
        throw new Error("Invalid response format: No token found");

      const token = response.data.token;
      const decoded = jwtDecode(token);
      const { fullName, id, role, schoolName } = decoded;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("teacherName", fullName);
      localStorage.setItem("teacherId", id);
      localStorage.setItem("userRole", role);
      localStorage.setItem("schoolName", schoolName);

      setAuthState({
        accessToken: token,
        teacherName: fullName,
        teacherId: id,
        schoolName,
        role,
        authenticated: true,
      });

      setTimeout(() => {
        if (role === "admin") window.location.href = "/admin/dashboard";
        else if (role === "teacher") window.location.href = "/teacher/form";
        else setErrors({ general: "Unauthorized role" });
      }, 500);
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative">
      {/* Animated floating stickers */}
      <motion.div
        className="absolute top-1/4 left-10 text-6xl opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🎒
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 right-10 text-7xl opacity-20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        📖
      </motion.div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated sticker header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
            <motion.div
              className="inline-block mb-2"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <span className="text-5xl">{stickers[currentSticker]}</span>
            </motion.div>
            <motion.h2
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to SMS
            </motion.h2>
          </div>

          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiMail className="mr-2" /> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiLock className="mr-2" /> Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                <AnimatePresence>
                  {errors.general && (
                    <motion.p
                      className="text-red-500 text-sm text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {errors.general}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    type="submit"
                    className={`w-full px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center ${
                      loading
                        ? "bg-blue-400"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600"
                    }`}
                    whileHover={
                      !loading
                        ? {
                            scale: 1.02,
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                          }
                        : {}
                    }
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="inline-block"
                      >
                        🔄
                      </motion.span>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <motion.span
                          animate={isHovered ? { x: [0, 5, 0] } : {}}
                          transition={{ duration: 0.6 }}
                          className="ml-2"
                        >
                          <FiArrowRight />
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              <motion.div
                className="mt-6 text-center text-sm text-gray-600 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <FiUserPlus className="mr-1" />
                <p>
                  Don't have an account?{" "}
                  <a href="/register" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                </p>
              </motion.div>

              <motion.div
                className="mt-6 text-center text-sm text-gray-600 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p>
                  Login As Teacher{" "}
                  <a
                    href="/login/teacher"
                    className="text-blue-600 hover:underline font-black"
                  >
                    Login{" "}
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative corner stickers */}
          <motion.div
            className="absolute -bottom-4 -left-4 text-4xl opacity-30"
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✏️
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4 text-4xl opacity-30"
            animate={{
              rotate: [0, -15, 15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            📚
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
