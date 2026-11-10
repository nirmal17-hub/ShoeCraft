import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const database = await fetch('http://localhost:3000/users')

      if (!database.ok) {
        throw new Error('Could not connect to the server')
      }

      const users = await database.json()

      const user = users.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password
      )

      if (user) {
        const loggedInUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }

        localStorage.setItem('user', JSON.stringify(loggedInUser))

        if (user.role === 'admin') {
          navigate('/dashboard')
        } else {
          navigate('/')
        }
      } else {
        setError('Invalid email or password')
      }
    } catch (error) {
      setError('Unable to connect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-800 to-gray-300 p-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-extrabold text-center tracking-widest text-stone-900">
          SHOECRAFT
        </h1>

        <p className="text-center text-stone-500 mt-2 mb-8">
          Step Into Your Style.
        </p>

        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Welcome Back
        </h2>

        <p className="text-sm text-stone-500 mb-6">
          Sign in to explore the latest footwear.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-stone-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-stone-800"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition duration-300 disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="font-bold text-stone-900 hover:text-amber-800 ml-1"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login