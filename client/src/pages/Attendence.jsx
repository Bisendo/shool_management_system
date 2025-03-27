import React, { useState, useEffect } from "react";

const Attendance = () => {
  // Load data from localStorage or use default data
  const loadData = () => {
    const savedData = localStorage.getItem("attendanceData");
    return savedData
      ? JSON.parse(savedData)
      : [
          { id: 1, name: "John Doe", status: "Present" },
          { id: 2, name: "Jane Smith", status: "Absent" },
          { id: 3, name: "Alice Johnson", status: "Present" },
          { id: 4, name: "Bob Brown", status: "Late" },
        ];
  };

  const [attendanceData, setAttendanceData] = useState(loadData());
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu visibility

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
  }, [attendanceData]);

  // Function to update attendance status
  const updateStatus = (id, newStatus) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
  };

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white p-4 border-b border-black">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-blue-600 text-2xl font-bold">SMS</h1>
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <a href="/dashboard" className="text-gray-800 hover:text-blue-600">
              Dashboard
            </a>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        {/* Mobile Navigation Links */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } mt-4 space-y-2`}
        >
          <a
            href="/dashboard"
            className="block text-gray-800 hover:text-blue-600"
          >
            Dashboard
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg animate-slide-up">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        student.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : student.status === "Absent"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      onChange={(e) => updateStatus(student.id, e.target.value)}
                      className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={student.status}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
