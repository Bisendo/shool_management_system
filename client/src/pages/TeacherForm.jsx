 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeacherForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    experience: "",
    email: "",
    phone: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and registration
    setErrorMessage(""); // Clear error messages
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.phone) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4070/teachers/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.message === "Login successful") {
        console.log("Login successful");
        navigate("/dashboard"); // Navigate to the dashboard on successful login
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
      console.error("Error during login:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.subject || !formData.experience || !formData.email || !formData.phone) {
      setErrorMessage("All fields are required");
      return;
    }

    const updatedFormData = {
      ...formData,
      experience: formData.experience ? Number(formData.experience) : "",
    };

    console.log("Form Data Sent:", updatedFormData);

    try {
      const response = await axios.post("http://localhost:4070/teachers/register", updatedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.message === "Teacher already exists, access granted to the dashboard") {
        console.log("Teacher already exists. Access granted.");
        navigate("/dashboard");
      } else {
        console.log("Form Data Submitted Successfully:", response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        console.error("Backend Error Response:", error.response);
        setErrorMessage(error.response.data?.error || "An error occurred. Please try again.");
      } else {
        setErrorMessage("Network error. Please check your connection.");
        console.error("Error submitting form:", error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-500 scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isLogin ? "Login" : "Teacher Registration"}
        </h2>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={loginData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleToggleForm}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Don't have an account? Register
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                Experience (Years)
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleToggleForm}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Already have an account? Login
              </button>
              <div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherForm;