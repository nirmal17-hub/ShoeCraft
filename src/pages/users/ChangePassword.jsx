import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
      setError('New password must contain at least 8 characters.')
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
      // Get the latest user details from JSON Server
      const response = await fetch(
        `http://localhost:3000/users/${user.id}`
      )

      if (!response.ok) {
        throw new Error('Unable to find your account.')
      }

      const databaseUser = await response.json()

      // Check the current password
      if (databaseUser.password !== currentPassword) {
        setError('Your current password is incorrect.')
        return
      }

      // Update the password in JSON Server
      const updateResponse = await fetch(
        `http://localhost:3000/users/${user.id}`,
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
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">

      <div className="max-w-xl mx-auto">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Change Password
          </h1>

          <p className="text-gray-500 mt-2">
            Keep your ShoeCraft account secure by updating your password.
          </p>
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-9V7a4 4 0 00-8 0v3"
              />
            </svg>
          </div>

          {message && (
            <div className="mb-5 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleChangePassword}>

            {/* Current Password */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                required
              />
            </div>

            {/* New Password */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                minLength={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                required
              />

              <p className="text-xs text-gray-500 mt-2">
                Use at least 4 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-7">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                minLength={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="submit"
                className="flex-1 bg-neutral-900 text-white rounded-lg px-6 py-3 font-semibold hover:bg-amber-800 transition"
              >
                Update Password
              </button>

              <button
                type="button"
                onClick={() => navigate('/user/home')}
                className="border border-gray-300 rounded-lg px-6 py-3 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default ChangePassword