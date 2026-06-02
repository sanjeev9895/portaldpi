import { useState } from 'react';

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (
      name &&
      phone &&
      email &&
      password
    ) {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (registeredUsers.some((u: any) => u.email === email)) {
        alert('Email is already registered!');
        return;
      }
      
      // Save in localStorage for auth validation
      registeredUsers.push({ name, phone, email, password, role });
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Save in SQLite Database as Employee
      const todayStr = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().split('T')[0];
      axios.post('http://127.0.0.1:8000/employees', {
        name: name,
        email: email,
        contact: phone,
        department: 'Development',
        role: role.charAt(0).toUpperCase() + role.slice(1),
        joining_date: todayStr
      }).then(() => {
        console.log('Employee stored in backend');
      }).catch(err => {
        console.error('Failed to store employee in backend:', err);
      });

      alert('Registration Successful');
      navigate('/login');
    } else {
      alert('Please fill all fields');
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 border border-slate-200">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">

          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">

            <img
              src="/vizhuthugal.png"
              alt="Vizhuthugal Logo"
              className="w-full h-full object-cover"
            />

          </div>

          <h1 className="mt-5 text-4xl font-bold text-slate-800 tracking-wide">

            விழுதுகள்

          </h1>

          <p className="text-slate-500 text-sm mt-2">

            Alumni Connect

          </p>

        </div>

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-slate-800 mb-3">

            Create Account

          </h1>

          <p className="text-slate-500 leading-relaxed">

            Register to access the dashboard

          </p>

        </div>

        {/* Full Name */}
        <div className="mb-5">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Full Name

          </label>

          <div className="relative">

            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-12 pr-4 py-3 rounded-2xl transition-all"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

        </div>

        {/* Phone */}
        <div className="mb-5">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Phone Number

          </label>

          <div className="relative">

            <Phone
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-12 pr-4 py-3 rounded-2xl transition-all"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

          </div>

        </div>

        {/* Email */}
        <div className="mb-5">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Email Address

          </label>

          <div className="relative">

            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-12 pr-4 py-3 rounded-2xl transition-all"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

        </div>

        {/* Role Selection */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Select Role
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none px-4 py-3 rounded-2xl transition-all bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Password

          </label>

          <div className="relative">

            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none pl-12 pr-14 py-3 rounded-2xl transition-all"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
            >

              {showPassword
                ? <EyeOff size={20} />
                : <Eye size={20} />
              }

            </button>

          </div>

        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 text-white py-3 rounded-2xl font-semibold shadow-lg"
        >

          Create Account

        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-500 mt-6">

          Already have an account?{' '}

          <span
            onClick={() =>
              navigate('/login')
            }
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >

            Sign In

          </span>

        </p>

      </div>

    </div>
  );
}