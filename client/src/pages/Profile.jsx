import React, { useState, useEffect } from "react";
import { FaUserGraduate, FaChartLine, FaAward, FaArrowUp } from "react-icons/fa";

const Profile = () => {
  // Sample data for the student
  const studentData = {
    name: "John Doe",
    grade: "10th Grade",
    rollNumber: "1025",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
    address: "123 Main St, City, Country",
    attendance: "95%",
    performance: {
      math: 85,
      science: 90,
      english: 78,
      history: 88,
    },
    attendanceRecords: [
      { date: "2023-10-01", status: "Present" },
      { date: "2023-10-02", status: "Absent" },
      { date: "2023-10-03", status: "Present" },
      { date: "2023-10-04", status: "Present" },
      { date: "2023-10-05", status: "Present" },
    ],
    activities: [
      { title: "Science Fair", date: "2023-09-15", description: "Won 1st prize in the regional science fair." },
      { title: "Math Olympiad", date: "2023-08-20", description: "Participated in the national math olympiad." },
      { title: "Debate Competition", date: "2023-07-10", description: "Secured 2nd position in the inter-school debate." },
    ],
  };

  // State for scroll-to-top button visibility
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll event
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
    <div className="relative flex flex-col min-h-screen bg-gray-50">
     

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[30vh] sm:h-[40vh] md:h-[50vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fadeIn">
            Student Profile
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 animate-fadeIn delay-200">
            Welcome back, {studentData.name}! Here's your complete profile.
          </p>
        </div>
      </section>

      {/* Personal Information Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 bg-white text-center animate-fadeIn delay-300">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(studentData).map(([key, value], index) => {
              if (typeof value !== "object" && key !== "attendance") {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 sm:p-6 rounded-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <FaUserGraduate className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <p className="text-gray-600">{value}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>

      {/* Academic Performance Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 bg-gray-100 text-center animate-fadeIn delay-400">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Academic Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(studentData.performance).map(([subject, score]) => (
              <div
                key={subject}
                className="bg-white p-4 sm:p-6 rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <FaChartLine className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 capitalize">
                  {subject}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 mt-2">{score}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attendance Records Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 bg-white text-center animate-fadeIn delay-500">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Attendance Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-800">
                    Date
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-800">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentData.attendanceRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 sm:px-6 sm:py-4 border-b border-gray-200 text-sm text-gray-700">
                      {record.date}
                    </td>
                    <td
                      className={`px-4 py-2 sm:px-6 sm:py-4 border-b border-gray-200 text-sm ${
                        record.status === "Present" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {record.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-8 bg-gray-100 text-center animate-fadeIn delay-600">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Activities & Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {studentData.activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <FaAward className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600 mb-2">{activity.date}</p>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll-to-Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 sm:p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300 animate-bounce"
        >
          <FaArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  );
};

export default Profile;