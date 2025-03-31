import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Student from "./pages/Students";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendence";
import TeacherComponent from "./pages/Teachers";
import Timetable from "./pages/Timetable";
import GradesManagement from "./pages/Grades";
import RegisterForm from "./pages/Register";
import LoginForm from "./pages/Login";
import Settings from "./pages/setting";
import AboutUs from "./pages/About";
import Contact from "./pages/Contact";
import { AuthContext } from "./helpers/AuthoContex";
import Calendar from "./pages/Calender";
import CourseList from "./pages/Courses";
import AdminDashboard from "./Components/AdminDashboard";
import TeacherForm from "./pages/TeacherForm";
import CreateStudentComponent from "./pages/CreateStudents";
import TeacherIDCardApp from "./pages/Teacher-card";
import StudentDashboard from "./Components/StudentsDash";
import TeacherDashboard from "./Components/TeachersDash";
import TeacherLoginComponent from "./pages/TeacherLogin";

function App() {
  const [authState, setAuthState] = useState({
    fullName: "",
    id: 0,
    status: false,
  });

  

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teachers" element={<TeacherComponent />} />
            <Route path="/teacher/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard/attendence" element={<Attendance />} />    
            <Route path="/dashboard/student" element={<StudentDashboard />} />    
            <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/form" element={<TeacherForm/>} />
            <Route path="/teacher/card" element={<TeacherIDCardApp />} />
            <Route path="/teacher/Login " element={<TeacherLoginComponent/>} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/grades" element={<GradesManagement />} />
            <Route path="/create/students" element={<CreateStudentComponent />} />
            <Route path="/students" element={<Student />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
