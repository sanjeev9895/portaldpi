import { useState } from 'react'

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'


export default function Login() {

  const navigate =
    useNavigate()

  // =====================================
  // STATES
  // =====================================

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, ] =
    useState(false)

  // =====================================
  // LOGIN
  // =====================================

const handleLogin = () => {

  // =====================================
  // VALIDATION
  // =====================================

  if (
    !email ||
    !password
  ) {

    alert(
      'Enter Email and Password'
    )

    return
  }

  // =====================================
  // STATIC LOGIN
  // =====================================

  if (

    email ===
      'resource@gmail.com' &&

    password ===
      'resource1'

  ) {

    localStorage.setItem(

      'user',

      JSON.stringify({

        name: 'Resource',

        email:
          'resource@gmail.com',

        role: 'manager',

      })

    )

    alert(
      'Login Successful'
    )

    navigate('/dashboard')

  } else {

    alert(
      'Invalid Email or Password'
    )
  }
}

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 flex items-center justify-center px-3 py-4">

      <div className="w-full max-w-sm bg-white rounded-[24px] shadow-xl p-5 border border-slate-200">

        {/* ===================================== */}
        {/* LOGO */}
        {/* ===================================== */}

        <div className="flex flex-col items-center mb-5">

          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white">

            <img
              src="/vizhuthugal.png"
              alt="Vizhuthugal Logo"
              className="w-full h-full object-cover"
            />

          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-800 tracking-wide">

            விழுதுகள்

          </h1>

          <p className="text-slate-500 text-xs mt-1">

            Employee Management System

          </p>

        </div>

        {/* ===================================== */}
        {/* HEADING */}
        {/* ===================================== */}

        <div className="text-center mb-5">

          <h1 className="text-2xl font-bold text-slate-800 mb-2">

            Welcome Back

          </h1>

          <p className="text-slate-500 text-sm leading-relaxed">

            Login to continue

          </p>

        </div>

        {/* ===================================== */}
        {/* EMAIL */}
        {/* ===================================== */}

        <div className="mb-4">

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
                setEmail(
                  e.target.value
                )
              }

            />

          </div>

        </div>

        {/* ===================================== */}
        {/* PASSWORD */}
        {/* ===================================== */}

        <div className="mb-3">

          <label className="block text-xs font-semibold text-slate-700 mb-2">

            Password

          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input

              type={
                showPassword
                  ? 'text'
                  : 'password'
              }

              placeholder="Enter your password"

              className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none pl-10 pr-12 py-2.5 rounded-xl text-sm transition-all"

              value={password}

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

            />

            {/* Show Password */}

            <button

              type="button"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"

            >

              {
                showPassword

                  ? <EyeOff size={18} />

                  : <Eye size={18} />
              }

            </button>

          </div>

        </div>

        {/* ===================================== */}
        {/* FORGOT PASSWORD */}
        {/* ===================================== */}

        <div className="flex justify-end mb-4">

          <button

            onClick={() =>
              navigate(
                '/Forgotpassword'
              )
            }

            className="text-xs text-blue-600 hover:underline"

          >

            Forgot Password?

          </button>

        </div>

        {/* ===================================== */}
        {/* LOGIN BUTTON */}
        {/* ===================================== */}

        <button

          onClick={handleLogin}

          disabled={loading}

          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-300 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-80"

        >

          {
            loading ? (

              <>

                {/* Spinner */}

                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                Loading...

              </>

            ) : (

              'Log In'

            )
          }

        </button>

        {/* ===================================== */}
        {/* REGISTER */}
        {/* ===================================== */}

        <div className="mt-5 text-center">

          <p className="text-xs text-slate-500">

            Don’t have an account?

          </p>

          <button

            onClick={() =>
              navigate(
                '/register'
              )
            }

            className="mt-2 inline-flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-700 transition"

          >

            <UserPlus size={16} />

            Create Account

          </button>

        </div>

        {/* ===================================== */}
        {/* FOOTER */}
        {/* ===================================== */}

        <p className="text-center text-[11px] text-slate-400 mt-6">

          © 2026 Vizhuthugal Employee Management System

        </p>

      </div>

    </div>
  )
}