import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white py-12 mx-0">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Gilgal Revival Church</h3>
            <p className="text-sm">
              Join us for services and events throughout the week. We're here to support your spiritual journey.
            </p>
            <p className="text-sm">© 2025 Gilgal Revival Church. All Rights Reserved.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="/ministries" className="hover:text-blue-400">Our Ministries</a></li>
              <li><a href="/events" className="hover:text-blue-400">Upcoming Events</a></li>
              <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <p className="text-sm">123 Church St, Cityville, ST 12345</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
            <p className="text-sm">Email: info@gilgalchurch.com</p>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-2xl hover:text-blue-500">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" className="text-2xl hover:text-blue-400">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="text-2xl hover:text-pink-500">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 bg-blue-500 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Stay Updated!</h3>
          <p className="text-sm mb-4">Sign up for our newsletter to receive the latest news and event updates.</p>
          <form className="flex space-x-4">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="p-2 w-full rounded-lg bg-gray-100 text-white focus:outline-none"
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-sm">© 2025 Gilgal Revival Church | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
