import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserGraduate, FaPlus, FaTimes } from "react-icons/fa";

const CreateStudentComponent = () => {
  const [showForm, setShowForm] = useState(false);
  const [student, setStudent] = useState({
    fullName: "",
    grade: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data Submitted:", student);
    setStudent({ fullName: "", grade: "", email: "", phone: "" }); // Reset form
    setShowForm(false); // Close form
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <header className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
      </header>

      {/* Add Student Button */}
      <div className="flex justify-end mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-full flex items-center hover:bg-green-700 transition duration-300"
        >
          <FaPlus className="mr-2" /> Add Student
        </motion.button>
      </div>

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
                onClick={() => setShowForm(false)}
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={student.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Add Student
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Student List (Placeholder) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUserGraduate className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
                <p className="text-sm text-gray-600">Grade 10</p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p>Email: john.doe@school.com</p>
              <p>Phone: +123 456 7890</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CreateStudentComponent;