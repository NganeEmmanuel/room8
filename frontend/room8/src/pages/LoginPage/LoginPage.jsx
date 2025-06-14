import React from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Room8 Logo" className="h-12" />
        </div>

        {/* Headings */}
        <h2 className="text-center text-lg font-medium mb-1 text-gray-600">Welcome to ROOM8</h2>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Login and keep exploring</h2>

        {/* Email */}
        <div className="mb-4">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <FiMail className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full bg-transparent outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <FiLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-transparent outline-none placeholder-gray-400"
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={() => alert('Login clicked')}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Continue
        </button>

        {/* Links */}
        <div className="mt-4 text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Signup
        </Link>
      </div>

      <div className="mt-1 text-center text-sm">
        <a href="#" className="text-blue-600 hover:underline block">
          Privacy Policy
        </a>
        <div className="flex justify-center gap-8 mt-1">
          <Link to="/home" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link to="/search" className="text-blue-600 hover:underline">
            Browse Listings
          </Link>
        </div>
</div>

      </div>
    </div>
  );
}

export default LoginPage;
