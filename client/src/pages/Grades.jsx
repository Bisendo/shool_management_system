import React, { useState, useEffect } from "react";

const GradesManagement = () => {
  // Load grades data from localStorage or use default data
  const loadData = () => {
    const savedData = localStorage.getItem("gradesData");
    return savedData
      ? JSON.parse(savedData)
      : [
          { id: 1, name: "John Doe", grade: "A", subject: "Math" },
          { id: 2, name: "Jane Smith", grade: "B", subject: "Science" },
          { id: 3, name: "Alice Johnson", grade: "C", subject: "History" },
          { id: 4, name: "Bob Brown", grade: "A", subject: "English" },
        ];
  };

  const [gradesData, setGradesData] = useState(loadData());
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gradesData", JSON.stringify(gradesData));
  }, [gradesData]);

  // Function to update a student's grade
  const updateGrade = (id, newGrade) => {
    setGradesData((prevData) =>
      prevData.map((student) =>
        student.id === id ? { ...student, grade: newGrade } : student
      )
    );
  };

  // Filter students based on search query
  const filteredStudents = gradesData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-600">
                SMS
              </a>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
            
              <a href="/dashboard" className="text-blue-600 font-semibold">
                Dashboard
              </a>
              <a href="/attendance" className="text-gray-700 hover:text-blue-600">
                Attendance
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-gray-700 focus:outline-none">
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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 animate-fade-in">
          Grades Management
        </h1>

        {/* Search Bar */}
        <div className="mb-6 max-w-md mx-auto animate-slide-up">
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg animate-slide-up">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        student.grade === "A"
                          ? "bg-green-100 text-green-800"
                          : student.grade === "B"
                          ? "bg-blue-100 text-blue-800"
                          : student.grade === "C"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      onChange={(e) => updateGrade(student.id, e.target.value)}
                      value={student.grade}
                      className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scroll-to-Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
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
              d="M5 15l7-7 7 7"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default GradesManagement;