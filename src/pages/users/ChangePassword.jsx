
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LockKeyhole,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  KeyRound
} from 'lucide-react'

import Header from './components/Header'
import Footer from './components/Footer'

function ChangePassword() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  if (!user || !user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">
            Please login first
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  async function handleChangePassword(e) {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (newPassword.length < 4) {
      setError('New password must contain at least 4 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from your current password.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `${API_URL}/users/${user.id}`
      )

      if (!response.ok) {
        throw new Error('Unable to find your account.')
      }

      const databaseUser = await response.json()

      if (databaseUser.password !== currentPassword) {
        setError('Your current password is incorrect.')
        return
      }

      const updateResponse = await fetch(
        `${API_URL}/users/${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: newPassword
          })
        }
      )

      if (!updateResponse.ok) {
        throw new Error('Password update failed.')
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setMessage('Password changed successfully!')

    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passwordField = (
    label,
    value,
    setValue,
    visible,
    setVisible,
    placeholder,
    autoComplete
  ) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={4}
          required
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pr-12 text-sm outline-none transition focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex flex-col">

      <Header />

      <main className="flex-1 w-full">

        {/* Hero Section */}
        <section className="w-full bg-neutral-950 text-white px-6 md:px-12 lg:px-20 py-12 md:py-16">

          <div className="max-w-[1600px] mx-auto">

            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition mb-8 text-sm"
            >
              <ArrowLeft size={17} />
              Back to Profile
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

              <div>
                <p className="text-amber-500 font-bold tracking-[3px] text-xs uppercase mb-4">
                  Account Security
                </p>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                  CHANGE YOUR
                  <span className="text-amber-500"> PASSWORD.</span>
                </h1>

                <p className="text-gray-400 mt-5 max-w-xl text-sm md:text-base leading-relaxed">
                  Keep your ShoeCraft account protected.
                  Update your password regularly to keep
                  your personal information secure.
                </p>
              </div>

              <div className="hidden md:flex items-center justify-center w-28 h-28 rounded-3xl border border-gray-700 bg-white/5">
                <ShieldCheck size={55} className="text-amber-500" />
              </div>

            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="w-full px-5 md:px-12 lg:px-20 py-12 md:py-16">

          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            {/* Left Information */}
            <div className="lg:col-span-1">

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-7 md:p-9">

                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <LockKeyhole size={27} className="text-amber-800" />
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  Protect Your Account
                </h2>

                <p className="text-gray-600 text-sm leading-7">
                  Your password is the first layer of protection
                  for your ShoeCraft account. Choose a password
                  that is difficult for others to guess.
                </p>

                <div className="border-t border-amber-200 mt-7 pt-6 space-y-5">

                  <div className="flex items-start gap-3">
                    <CheckCircle size={19} className="text-amber-700 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700">
                      Use at least 4 characters.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle size={19} className="text-amber-700 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700">
                      Choose a password different from your old one.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle size={19} className="text-amber-700 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700">
                      Never share your password with anyone.
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <KeyRound size={23} className="text-gray-700" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Password Security
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Keep your account safe and secure.
                  </p>
                </div>
              </div>

            </div>

            {/* Password Form */}
            <div className="lg:col-span-2">

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-6 md:px-10 py-7 border-b border-gray-100">

                  <h2 className="text-2xl font-black text-gray-900">
                    Update Password
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    Enter your current password and create a new one.
                  </p>

                </div>

                <form
                  onSubmit={handleChangePassword}
                  className="p-6 md:p-10 space-y-6"
                >

                  {message && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                      <CheckCircle size={20} />
                      {message}
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {passwordField(
                    'Current Password',
                    currentPassword,
                    setCurrentPassword,
                    showCurrent,
                    setShowCurrent,
                    'Enter your current password',
                    'current-password'
                  )}

                  {passwordField(
                    'New Password',
                    newPassword,
                    setNewPassword,
                    showNew,
                    setShowNew,
                    'Enter your new password',
                    'new-password'
                  )}

                  {passwordField(
                    'Confirm New Password',
                    confirmPassword,
                    setConfirmPassword,
                    showConfirm,
                    setShowConfirm,
                    'Re-enter your new password',
                    'new-password'
                  )}

                  <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-4">

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-neutral-950 text-white rounded-xl px-6 py-4 font-bold text-sm hover:bg-amber-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                      {!loading && <CheckCircle size={18} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="sm:w-40 border border-gray-300 text-gray-700 rounded-xl px-6 py-4 font-bold text-sm hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  )
}

export default ChangePassword
