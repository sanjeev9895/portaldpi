import { useState } from 'react';

import {
  Mail,
  Lock,
  ArrowLeft,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {

    if (!email || !newPassword) {
      alert('Please enter your email and a new password');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        new_password: newPassword,
      });
      alert('Password updated successfully. Please log in.');
      navigate('/login');
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        'Could not reset password. Please check the email and try again.';
      alert(message);
    } finally {
      setLoading(false);
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

            Enter your email and choose a new password

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

        {/* New Password */}
        <div className="mb-5">

          <label className="block text-xs font-semibold text-slate-700 mb-2">

            New Password

          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="password"
              placeholder="Enter a new password"
              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10 pr-3 py-2.5 rounded-xl text-sm transition-all"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />

          </div>

        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md disabled:opacity-80"
        >

          {loading ? 'Updating...' : 'Update Password'}

        </button>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">

          © 2026 Vizhuthugal Alumni Connect

        </p>

      </div>

    </div>
  );
}
