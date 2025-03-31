import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBook, FiAward, FiCalendar, FiMessageSquare, 
  FiSettings, FiLogOut, FiBell, FiSearch,
  FiUsers, FiClipboard, FiBarChart2, 
  FiHome, FiCheckCircle, FiAlertCircle, FiUser, FiChevronRight, FiFileText
} from 'react-icons/fi';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setNotifications([
        { id: 1, message: 'Assignment #3 submissions - 25/30 received', time: '15 min ago', read: false, icon: <FiFileText className="text-blue-500" /> },
        { id: 2, message: 'New message from Student: Alex Johnson', time: '35 min ago', read: false, icon: <FiMessageSquare className="text-indigo-500" /> },
        { id: 3, message: 'Department meeting tomorrow', time: '2 hours ago', read: true, icon: <FiAlertCircle className="text-yellow-500" /> },
        { id: 4, message: 'New teaching material available', time: '4 hours ago', read: true, icon: <FiBook className="text-purple-500" /> },
      ]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const stats = [
    { title: 'Active Courses', value: '4', icon: <FiBook className="h-6 w-6" />, change: '+0', trend: 'neutral' },
    { title: 'Assignments to Grade', value: '12', icon: <FiClipboard className="h-6 w-6" />, change: '+3', trend: 'up' },
    { title: 'Avg. Class Grade', value: '84%', icon: <FiBarChart2 className="h-6 w-6" />, change: '+2%', trend: 'up' },
    { title: 'Unread Messages', value: '5', icon: <FiMessageSquare className="h-6 w-6" />, change: '+2', trend: 'up' },
  ];

  const recentActivities = [
    { id: 1, title: 'Grading Completed', description: 'Finished grading Math 101 Quiz', time: 'Just now', icon: <FiCheckCircle className="h-5 w-5 text-green-500" /> },
    { id: 2, title: 'New Submission', description: 'Physics Lab Report submitted by Sarah', time: '30 min ago', icon: <FiFileText className="h-5 w-5 text-blue-500" /> },
    { id: 3, title: 'Department Announcement', description: 'Curriculum changes for next semester', time: '2 hours ago', icon: <FiAlertCircle className="h-5 w-5 text-yellow-500" /> },
  ];

  const courses = [
    { id: 1, name: 'Mathematics 101', students: 30, progress: 85, color: 'bg-indigo-600', upcoming: 'Quiz on Friday' },
    { id: 2, name: 'Physics 201', students: 24, progress: 72, color: 'bg-blue-600', upcoming: 'Lab Report grading' },
    { id: 3, name: 'Advanced Calculus', students: 18, progress: 65, color: 'bg-green-600', upcoming: 'Midterm preparation' },
    { id: 4, name: 'Linear Algebra', students: 22, progress: 90, color: 'bg-purple-600', upcoming: 'Final exam' },
  ];

  const assignments = [
    { id: 1, name: 'Chapter 5 Problems', course: 'Math 101', due: 'May 15, 2023', submissions: '25/30', status: 'Grading', priority: 'high' },
    { id: 2, name: 'Lab Report #3', course: 'Physics 201', due: 'May 18, 2023', submissions: '18/24', status: 'Submitted', priority: 'medium' },
    { id: 3, name: 'Research Paper', course: 'Advanced Calculus', due: 'May 20, 2023', submissions: '10/18', status: 'Draft', priority: 'high' },
    { id: 4, name: 'Midterm Exam', course: 'Linear Algebra', due: 'May 22, 2023', submissions: '0/22', status: 'Preparing', priority: 'critical' },
  ];

  const students = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@university.edu', course: 'Math 101', grade: 'A', attendance: '95%' },
    { id: 2, name: 'Sarah Williams', email: 'sarah.w@university.edu', course: 'Physics 201', grade: 'B+', attendance: '92%' },
    { id: 3, name: 'Michael Brown', email: 'michael.b@university.edu', course: 'Advanced Calculus', grade: 'A-', attendance: '88%' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@university.edu', course: 'Linear Algebra', grade: 'B', attendance: '90%' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`hidden md:flex flex-col w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-lg ${isMobileMenuOpen ? 'flex absolute z-50 h-full' : 'hidden'}`}
      >
        <div className="flex items-center justify-center h-16 px-4 border-b border-indigo-500">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <FiBook className="h-8 w-8 text-indigo-200 mr-2" />
            <span className="text-xl font-bold tracking-wide">EduConnect</span>
          </motion.div>
        </div>
        
        <div className="flex flex-col flex-grow px-4 py-6">
          <nav className="flex-1 space-y-2">
            {[
              { id: 'dashboard', icon: <FiHome className="h-5 w-5" />, label: 'Dashboard' },
              { id: 'courses', icon: <FiBook className="h-5 w-5" />, label: 'Courses' },
              { id: 'students', icon: <FiUsers className="h-5 w-5" />, label: 'Students' },
              { id: 'grading', icon: <FiAward className="h-5 w-5" />, label: 'Grading' },
              { id: 'calendar', icon: <FiCalendar className="h-5 w-5" />, label: 'Calendar' },
              { id: 'messages', icon: <FiMessageSquare className="h-5 w-5" />, label: 'Messages' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg w-full transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800'}`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <FiChevronRight className="h-4 w-4" />
              </motion.button>
            ))}
          </nav>
          
          <div className="mt-auto pb-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between px-4 py-3 rounded-lg w-full text-indigo-200 hover:bg-indigo-800 transition-colors"
            >
              <div className="flex items-center">
                <FiSettings className="h-5 w-5 mr-3" />
                <span className="font-medium">Settings</span>
              </div>
              <FiChevronRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between px-4 py-3 rounded-lg w-full text-indigo-200 hover:bg-indigo-800 transition-colors"
            >
              <div className="flex items-center">
                <FiUser className="h-5 w-5 mr-3" />
                <span className="font-medium">Profile</span>
              </div>
              <FiChevronRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between px-4 py-3 rounded-lg w-full text-indigo-200 hover:bg-indigo-800 transition-colors"
            >
              <div className="flex items-center">
                <FiLogOut className="h-5 w-5 mr-3" />
                <span className="font-medium">Logout</span>
              </div>
              <FiChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button 
                className="md:hidden mr-4 text-gray-500 hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FiBell className="h-6 w-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </motion.button>
              </div>
              
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative cursor-pointer"
                >
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></span>
                </motion.div>
                <span className="ml-2 text-sm font-medium hidden md:inline">Prof. Smith</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>
              {/* Welcome Banner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 mb-6 text-white shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-2">Welcome back, Professor Smith!</h2>
                <p className="opacity-90">You have {notifications.filter(n => !n.read).length} new notifications and {stats[1].value} assignments to grade</p>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {stat.value}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-800' : 
                        stat.trend === 'down' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Courses Section */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {courses.map((course) => (
                      <motion.div
                        key={course.id}
                        whileHover={{ x: 5 }}
                        className="p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {course.name}
                            </h3>
                            <p className="text-sm text-gray-500">{course.students} students enrolled</p>
                            <p className="text-xs text-indigo-500 mt-1">
                              <span className="font-medium">Upcoming:</span> {course.upcoming}
                            </p>
                          </div>
                          <button className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                            Manage
                          </button>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${course.color}`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Course Completion</span>
                            <span>{course.progress}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activities */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        whileHover={{ x: 5 }}
                        className="p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                              {activity.icon}
                            </div>
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                            <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Students List */}
                {activeTab === 'students' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900">Students</h2>
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                        View All
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Grade
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Attendance
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Action</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => (
                            <motion.tr 
                              key={student.id}
                              whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full" src={`https://randomuser.me/api/portraits/${student.id % 2 === 0 ? 'women' : 'men'}/${student.id}.jpg`} alt="" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.course}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${student.grade.includes('A') ? 'bg-green-100 text-green-800' : 
                                    student.grade.includes('B') ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}>
                                  {student.grade}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.attendance}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900">View</button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* Assignments to Grade */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Assignments to Grade</h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignment
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submissions
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Action</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {assignments.map((assignment) => (
                          <motion.tr 
                            key={assignment.id}
                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`h-3 w-3 rounded-full mr-3 ${
                                  assignment.priority === 'critical' ? 'bg-red-500' :
                                  assignment.priority === 'high' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}></div>
                                <div className="text-sm font-medium text-gray-900">{assignment.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {assignment.course}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {assignment.due}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {assignment.submissions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${assignment.status === 'Grading' ? 'bg-yellow-100 text-yellow-800' : 
                                  assignment.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-gray-100 text-gray-800'}`}>
                                {assignment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900">Grade</button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-50"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all as read
                  </button>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <motion.li 
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0 ml-3">
                              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">You'll see notifications here when you get them.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;