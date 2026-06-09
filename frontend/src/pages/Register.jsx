import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom' 
import axios from 'axios'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import {toast} from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    
   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(
      "http://localhost:5000/api/auth",
      { name, email, password }
    );

    toast.success("Registration successful! Please login. 🎉");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err) {
    console.error(err);
    toast.error("Registration failed. Please try again.");
  }
};

    return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
    <div className="w-full max-w-md">

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
            <User className="w-10 h-10 text-purple-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join us today and manage tasks smarter 🚀
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600">
            Already have an account?
          </span>

          <Link
            to="/login"
            className="ml-2 text-purple-600 font-semibold hover:text-purple-700"
          >
            Sign In
          </Link>
        </div>
      </div>

      <p className="text-center text-white/80 text-sm mt-6">
        © 2026 Task Manager • Stay Organized 🚀
      </p>
    </div>
  </div>
);
}

export default Register;