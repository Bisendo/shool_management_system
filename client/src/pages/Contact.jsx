import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiHome, FiInfo, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Contact = () => {
  const [currentSticker, setCurrentSticker] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const stickers = ["📧", "📞", "📍", "✉️", "📩", "📝", "📱", "🏫"];
  const socialLinks = [
    { icon: <FiMail />, name: "Email", color: "text-blue-600", href: "mailto:info@sms.com" },
    { icon: <FiPhone />, name: "Phone", color: "text-green-600", href: "tel:+11234567890" },
    { icon: <FiMapPin />, name: "Location", color: "text-red-600", href: "#map" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSticker((prev) => (prev + 1) % stickers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stickers.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const navItems = [
    { name: "Home", icon: <FiHome />, href: "/" },
    { name: "About", icon: <FiInfo />, href: "/about" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-3 md:py-4">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl md:text-3xl">🏫</span>
              <span className="text-lg md:text-xl font-bold text-gray-800">SMS</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:flex space-x-6 lg:space-x-8"
            >
              {navItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-all duration-300 hover:scale-105 text-sm lg:text-base"
                >
                  <span className="mr-1 md:mr-2">{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </motion.div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white overflow-hidden"
            >
              <div className="px-4 py-2 flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 py-2 flex items-center text-sm"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="py-12 md:py-16 relative">
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-10 left-4 md:left-10 text-4xl md:text-6xl opacity-10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          📧
        </motion.div>
        
        <motion.div 
          className="absolute top-1/4 right-4 md:right-10 text-5xl md:text-7xl opacity-10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          📞
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 left-1/4 text-6xl md:text-8xl opacity-10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          📍
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/3 right-4 md:right-10 text-4xl md:text-6xl opacity-10"
          animate={{
            y: [0, -25, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          ✉️
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-block mb-3 md:mb-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span 
                className="text-4xl md:text-5xl inline-block"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                {stickers[currentSticker]}
              </motion.span>
            </motion.div>
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Contact <span className="text-blue-600">SMS</span>
            </motion.h1>
            <motion.p 
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              We're here to help! Reach out to us for any inquiries or support.
            </motion.p>
          </motion.div>

          {/* Contact Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Contact Form */}
            <motion.div 
              className="bg-white p-6 md:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4 md:mb-6">
                <motion.span 
                  className="text-2xl md:text-3xl mr-2 md:mr-3"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  📝
                </motion.span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Send Us a Message
                </h2>
              </div>
              
              <AnimatePresence>
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 md:mb-6 text-sm md:text-base"
                  >
                    <p>Thank you! Your message has been sent successfully.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                  >
                    <div className="mb-4 md:mb-6">
                      <label htmlFor="name" className="block text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">
                        Your Name
                      </label>
                      <motion.input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="John Doe"
                        required
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                      />
                    </div>
                    <div className="mb-4 md:mb-6">
                      <label htmlFor="email" className="block text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">
                        Your Email
                      </label>
                      <motion.input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="johndoe@example.com"
                        required
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                      />
                    </div>
                    <div className="mb-4 md:mb-6">
                      <label htmlFor="message" className="block text-sm md:text-base font-medium text-gray-700 mb-1 md:mb-2">
                        Your Message
                      </label>
                      <motion.textarea
                        id="message"
                        name="message"
                        rows="4"
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="Write your message here..."
                        required
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg md:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center text-sm md:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="mr-1 md:mr-2">Send Message</span>
                      <motion.span
                        animate={{ 
                          y: [0, -3, 0],
                          rotate: [0, 15, 0]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity
                        }}
                      >
                        🚀
                      </motion.span>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="bg-white p-6 md:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4 md:mb-6">
                <motion.span 
                  className="text-2xl md:text-3xl mr-2 md:mr-3"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  🌐
                </motion.span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Contact Information
                </h2>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <motion.div 
                  className="flex items-center p-3 md:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 3 }}
                >
                  <motion.div 
                    className="p-2 md:p-3 bg-blue-100 rounded-full"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiMapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </motion.div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      123 School Street, Education City, EC 12345
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center p-3 md:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 3 }}
                >
                  <motion.div 
                    className="p-2 md:p-3 bg-blue-100 rounded-full"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiPhone className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </motion.div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600 text-sm md:text-base">+1 (123) 456-7890</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center p-3 md:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 3 }}
                >
                  <motion.div 
                    className="p-2 md:p-3 bg-blue-100 rounded-full"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FiMail className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  </motion.div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600 text-sm md:text-base">info@sms.com</p>
                  </div>
                </motion.div>
              </div>
              
              {/* Social Media */}
              <div className="mt-6 md:mt-8">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Quick Links</h3>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`p-2 md:p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition duration-300 ${social.color} flex items-center justify-center`}
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      aria-label={social.name}
                    >
                      <span className="text-lg md:text-xl">{social.icon}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;