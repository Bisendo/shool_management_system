import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiArrowRight } from "react-icons/fi";

const TeacherLoginComponent = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentSticker, setCurrentSticker] = useState(0);

  const stickers = ["🧑‍🏫", "📚", "📝", "🎓", "🏫"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSticker((prev) => (prev + 1) % stickers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [stickers.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!loginData.email.trim() && !loginData.phone.trim()) {
      newErrors.general = "Email or phone number is required";
      setError(newErrors.general)
      return false;
    }

    if (loginData.email.trim()) {
      if (!/\S+@\S+\.\S+/.test(loginData.email)) {
        newErrors.email = "Please enter a valid email address";
        setError(newErrors.email);
        return false;
      }
    }

    if (loginData.phone.trim()) {
      if (!/^[0-9]{10,15}$/.test(loginData.phone)) {
        newErrors.phone = "Please enter a valid phone number (10-15 digits)";
        setError(newErrors.phone);
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const loginPayload = {
        email: loginData.email.trim() || undefined,
        phone: loginData.phone.trim() || undefined,
      };

      const response = await axios.post(
        "http://localhost:4070/teachers/login",
        loginPayload
      );

      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("teacherName", response.data.teacher.fullName);
      localStorage.setItem("teacherId", response.data.teacher.id);
      localStorage.setItem("userRole", "teacher");
      localStorage.setItem("schoolName", response.data.teacher.school || "School");

      navigate("/teacher/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative">
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

      <nav className="bg-blue-800 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Teacher Login</h1>
          <motion.div
            className="inline-block"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <span className="text-3xl">{stickers[currentSticker]}</span>
          </motion.div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiPhone className="mr-2" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={loginData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="0712345678"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    type="submit"
                    className={`w-full px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center ${
                      loading ? "bg-blue-400" : "bg-gradient-to-r from-blue-600 to-indigo-600"
                    }`}
                    whileHover={!loading ? {
                      scale: 1.02,
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                    } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        🔄
                      </motion.span>
                    ) : (
                      <>
                        <span>Login</span>
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
                {error && (
                  <motion.p
                    className="text-red-500 text-sm text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>

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

export default TeacherLoginComponent;