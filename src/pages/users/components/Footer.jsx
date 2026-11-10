import React from 'react'

function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="w-full px-5 sm:px-8 lg:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-2xl font-black tracking-widest">
            SHOECRAFT
          </h2>

          <p className="text-gray-400 mt-4 text-sm leading-relaxed">
            Step into your style with footwear made for your everyday
            journey.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>

          <div className="space-y-3 text-sm text-gray-400 flex flex-col">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/shop" className="hover:text-white">Shop</a>
            <a href="/about" className="hover:text-white">About Us</a>
            <a href="/contact" className="hover:text-white">Contact</a>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">Your Account</h3>

          <div className="space-y-3 text-sm text-gray-400 flex flex-col">
            <a href="/login" className="hover:text-white">Login</a>
            <a href="/register" className="hover:text-white">Register</a>
            <a href="/shop" className="hover:text-white">Browse Shoes</a>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">Our Promise</h3>

          <p className="text-sm text-gray-400 leading-relaxed">
            Style, comfort, and a great experience with every visit to
            ShoeCraft.
          </p>
        </div>

      </div>

      <div className="border-t border-white/10 text-center text-sm text-gray-500 py-5 px-4">
        © {new Date().getFullYear()} ShoeCraft. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer