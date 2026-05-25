import { useState } from 'react';

import {
  Mail,
  ArrowLeft,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleReset = () => {

    if (email) {

      alert(
        'Password reset link sent to your email'
      );

    } else {

      alert('Please enter your email');

    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 flex items-center justify-center px-3 py-4">

      <div className="w-full max-w-sm bg-white rounded-[24px] shadow-xl p-5 border border-slate-200">

        {/* Back Button */}
        <button
          onClick={() =>
            navigate('/')
          }
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition mb-5"
        >

          <ArrowLeft size={18} />

          Back

        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-5">

          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white">

            <img
              src="/vizhuthugal.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />

          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-800 tracking-wide">

            விழுதுகள்

          </h1>

          <p className="text-slate-500 text-xs mt-1">

            Alumni Connect

          </p>

        </div>

        {/* Heading */}
        <div className="text-center mb-5">

          <h1 className="text-2xl font-bold text-slate-800 mb-2">

            Forgot Password

          </h1>

          <p className="text-slate-500 text-sm leading-relaxed">

            Enter your email to receive a password reset link

          </p>

        </div>

        {/* Email */}
        <div className="mb-5">

          <label className="block text-xs font-semibold text-slate-700 mb-2">

            Email Address

          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10 pr-3 py-2.5 rounded-xl text-sm transition-all"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md"
        >

          Send Reset Link

        </button>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">

          © 2026 Resource Management System

        </p>

      </div>

    </div>
  );
}