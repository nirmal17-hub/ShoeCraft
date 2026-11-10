
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Footprints,
  UserRound,
  Mail,
  LockKeyhole
} from 'lucide-react'

function Register() {
  const nav = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  async function registration(e) {
    e.preventDefault()

    setError('')

    if (password.length < 4) {
      setError('Password must contain at least 4 characters.')
      return
    }

    if (password !== confirmpassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      // Check existing users
      const response = await fetch(`${API_URL}/users`)

      if (!response.ok) {
        throw new Error('Unable to connect to the server.')
      }

      const users = await response.json()

      // Check duplicate email
      const exuser = users.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase()
      )

      if (exuser) {
        throw new Error('This email is already registered. Please login.')
      }

      // Register new user
      const registerResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: 'user'
        })
      })

      if (!registerResponse.ok) {
        throw new Error('Registration failed. Please try again.')
      }

      await registerResponse.json()

      nav('/login', {
        state: { message: 'Account created successfully! Please login.' }
      })

    } catch (error) {
      setError(error.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100"

  return (
    <div className="min-h-screen w-full bg-[#111111] flex items-center justify-center p-3 md:p-6">

      <div className="w-full max-w-[1500px] min-h-[750px] bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SIDE - BRANDING */}
        <div className="relative bg-[#171717] text-white flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden min-h-[350px] lg:min-h-full">

          {/* Background Decorations */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/10" />
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-amber-600/10 blur-3xl rounded-full" />

          {/* Brand */}
          <div className="relative z-10">

            <Link to="/" className="inline-flex items-center gap-3">

              <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center">
                <Footprints size={25} className="text-black" />
              </div>

              <span className="text-2xl font-black tracking-[3px]">
                SHOE<span className="text-amber-500">CRAFT</span>
              </span>

            </Link>

          </div>

          {/* Main Branding */}
          <div className="relative z-10 py-10">

            <p className="text-amber-500 text-xs font-bold tracking-[5px] uppercase mb-6">
              Join The Collection
            </p>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
              YOUR STYLE.
              <br />
              YOUR
              <span className="text-amber-500"> STEPS.</span>
              <br />
              YOUR STORY.
            </h1>

            <p className="text-gray-400 mt-7 max-w-md text-sm md:text-base leading-7">
              Great style starts from the ground up.
              Create your ShoeCraft account and explore
              footwear designed for every step of your journey.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mt-10">

              <div className="border border-white/10 bg-white/5 rounded-full px-5 py-3 flex items-center gap-2">
                <ShoppingBag size={16} className="text-amber-500" />
                <span className="text-xs font-semibold text-gray-300">
                  Exclusive Collection
                </span>
              </div>

              <div className="border border-white/10 bg-white/5 rounded-full px-5 py-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-500" />
                <span className="text-xs font-semibold text-gray-300">
                  Secure Account
                </span>
              </div>

            </div>

          </div>

          {/* Bottom */}
          <div className="relative z-10 flex justify-between items-center border-t border-white/10 pt-6">

            <p className="text-xs text-gray-500 tracking-wider">
              WALK YOUR WAY.
            </p>

            <p className="text-xs text-gray-500">
              EST. SHOECRAFT
            </p>

          </div>

        </div>

        {/* RIGHT SIDE - REGISTER */}
        <div className="bg-[#faf9f6] flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 xl:px-24">

          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">

              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                <UserRound size={26} className="text-amber-800" />
              </div>

              <p className="text-xs font-bold tracking-[3px] text-amber-700 uppercase mb-3">
                Get Started Today
              </p>

              <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
                CREATE
                <span className="text-amber-600"> ACCOUNT.</span>
              </h2>

              <p className="text-gray-500 mt-4 text-sm leading-6">
                Join ShoeCraft and discover your perfect pair.
                Create your account to get started.
              </p>

            </div>

            {/* Registration Form */}
            <form onSubmit={registration} className="space-y-4">

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Full Name */}
              <div>

                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className={`${inputClass} pl-12`}
                  />

                </div>

              </div>

              {/* Email */}
              <div>

                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={`${inputClass} pl-12`}
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    minLength={4}
                    required
                    className={`${inputClass} pl-12 pr-14`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-700 transition"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}
              <div>

                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    placeholder="Confirm your password"
                    minLength={4}
                    required
                    className={`${inputClass} pl-12 pr-14`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-700 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-neutral-950 text-white rounded-xl py-4 px-6 font-bold text-sm flex items-center justify-center gap-3 hover:bg-amber-800 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Your Account
                    <ArrowRight size={19} />
                  </>
                )}

              </button>

            </form>

            {/* Login Link */}
            <div className="mt-7 text-center">

              <p className="text-sm text-gray-500">
                Already have an account?

                <Link
                  to="/login"
                  className="font-bold text-neutral-900 hover:text-amber-700 ml-2 transition"
                >
                  Sign In
                </Link>
              </p>

            </div>

            {/* Bottom */}
            <div className="mt-9 pt-6 border-t border-gray-200 flex items-center justify-center gap-2">

              <ShieldCheck size={16} className="text-amber-700" />

              <p className="text-xs text-gray-400">
                Your ShoeCraft journey starts here.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register
