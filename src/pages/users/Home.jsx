import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        return response.json()
      })
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-white text-neutral-900">

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-neutral-800 to-neutral-500 text-white">
        <div className="w-full px-5 sm:px-8 lg:px-12 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-amber-400 uppercase tracking-[0.3em] text-sm font-semibold mb-5">
              Discover Your Perfect Pair
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              STEP INTO
              <br />
              YOUR <span className="text-amber-400">STYLE.</span>
            </h1>

            <p className="text-gray-300 mt-6 text-lg leading-relaxed max-w-lg">
              Find your next favourite pair. Explore stylish sneakers,
              everyday essentials, and footwear made for every step.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="/shop"
                className="bg-amber-600 hover:bg-amber-700 px-7 py-3.5 rounded-lg font-semibold transition"
              >
                Shop Collection →
              </a>

              <a
                href="/categories"
                className="border border-white/50 hover:bg-white hover:text-black px-7 py-3.5 rounded-lg font-semibold transition"
              >
                Explore Categories
              </a>
            </div>

            <div className="flex gap-8 mt-12 border-t border-white/20 pt-6">
              <div>
                <h3 className="text-2xl font-bold">100+</h3>
                <p className="text-sm text-gray-300">Styles</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">Premium</h3>
                <p className="text-sm text-gray-300">Collections</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">Everyday</h3>
                <p className="text-sm text-gray-300">Comfort</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-4 bg-amber-500/20 blur-3xl rounded-full"></div>

            <img
              src="/images/1.png"
              alt="Featured red sneaker"
              className="relative w-full h-80 md:h-[480px] object-cover rounded-3xl shadow-2xl"
            />

            <div className="absolute bottom-5 left-5 bg-white text-neutral-900 rounded-xl px-5 py-4 shadow-lg">
              <p className="text-xs text-gray-500">
                FEATURED COLLECTION
              </p>
              <h3 className="font-bold text-lg">Made to Move.</h3>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="flex items-center gap-4">
            <span className="text-3xl">🚚</span>
            <div>
              <h3 className="font-bold">Easy Delivery</h3>
              <p className="text-sm text-gray-500">Convenient shopping</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl">👟</span>
            <div>
              <h3 className="font-bold">Stylish Footwear</h3>
              <p className="text-sm text-gray-500">Styles for every occasion</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl">↩️</span>
            <div>
              <h3 className="font-bold">Easy Returns</h3>
              <p className="text-sm text-gray-500">Shop with confidence</p>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products from JSON Server */}
      <section className="w-full px-5 sm:px-8 lg:px-12 mx-auto px-6 py-20">

        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <p className="text-amber-700 font-semibold uppercase tracking-widest text-xs mb-3">
              Handpicked for You
            </p>

            <h2 className="text-3xl md:text-4xl font-black">
              Featured Footwear
            </h2>

            <p className="text-gray-500 mt-3">
              Find the perfect pair for your everyday style.
            </p>
          </div>

          <a
            href="/shop"
            className="font-semibold border-b-2 border-neutral-900 pb-1 hover:text-amber-700 hover:border-amber-700"
          >
            View All Products →
          </a>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading products...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center py-10">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {products.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300"
              >
                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    {product.category}
                  </p>

                  <h3 className="text-lg font-bold mt-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mt-4">
                    <p className="font-bold text-lg">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </p>

                    <a
                      href="/shop"
                      className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-800 transition"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Promotional Banner */}
      <section className="px-6 pb-20">
        <div className="w-full px-5 sm:px-8 lg:px-12 bg-gradient-to-r from-neutral-950 to-neutral-700 text-white rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">

          <div>
            <p className="text-amber-400 uppercase tracking-widest text-sm font-semibold">
              Find Your Next Favourite
            </p>

            <h2 className="text-3xl md:text-4xl font-black mt-3">
              Every Step Tells a Story.
            </h2>

            <p className="text-gray-300 mt-3">
              Discover footwear that matches your personality.
            </p>
          </div>

          <a
            href="/shop"
            className="shrink-0 bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-amber-400 transition"
          >
            Start Shopping →
          </a>

        </div>
      </section>

      <Footer />

    </div>
  )
}

export default Home