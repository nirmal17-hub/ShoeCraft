import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmpassword] = useState("")
  const [error, setError] = useState("")


    function registration(e){
        e.preventDefault();

        if(password !== confirmpassword){
          setError("Passwords Does Not Match");
          return;
        }
        fetch("http://localhost:3000/users")
        .then((data)=>{
          const exuser = data.find(
            (item) => item.email === email
          )
          if(exuser){
            throw new Error("This Email Already Signin with us please login")
          }
          return;
        })
        
        fetch("http://localhost:3000/users",{
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            name : name,
            email : email,
            password : password,
            role : "user"
          })
        })
        .then((res)=>{
          if(!res.ok){
            throw new Error("Unable To Connect");
          }
          return res.json();
        })
        .then(()=>{
          alert("Signin Successfull");
          nav("/login");
        })
        .catch((error)=>{
          setError(error.message);
        })
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
          Create Account
        </h2>

        <p className="text-sm text-stone-500 mb-6">
          Join ShoeCraft and discover your perfect pair.
        </p>

        <form onSubmit={registration} className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              value = {name}
              onChange={(e)=> setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value = {email}
              onChange={(e)=> setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value = {password}
              onChange={(e)=> setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={4}
              className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value = {confirmpassword}
              onChange={(e)=> setConfirmpassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={4}
              className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-stone-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition duration-300"
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-stone-600 mt-6">
          Already have an account?
          <a
            href="/login"
            className="font-bold text-stone-900 hover:text-amber-800 ml-1"
          >
            Sign In
          </a>
        </p>

      </div>
    </div>
  )
}

export default Register
