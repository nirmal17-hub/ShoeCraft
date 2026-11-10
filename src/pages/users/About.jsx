import React from 'react'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function About() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-950 to-gray-700 px-5 sm:px-8 lg:px-12 py-20 text-center text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
            Welcome to ShoeCraft
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            Step Into Your Style
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
            Discover footwear that combines comfort, quality, and style.
            At ShoeCraft, we believe every step should feel special.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-lg bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Explore Our Collection
          </Link>
        </section>

        {/* About Us Section */}
        <section className="w-full grid grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:px-12 xl:px-16 py-16 md:grid-cols-2 md:py-24">

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Who We Are
            </p>

            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              More Than Just Shoes
            </h2>

            <p className="mt-6 leading-7 text-gray-600">
              At ShoeCraft, we believe footwear is more than something
              you wear. It is a part of your personality, your lifestyle,
              and the journey you take every day.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Our collection brings together stylish designs, everyday
              comfort, and versatile options for different occasions.
              Whether you are heading out with friends, going to work,
              or enjoying your daily routine, we help you find footwear
              that suits your needs.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Our goal is to make finding your perfect pair simple,
              convenient, and enjoyable.
            </p>
          </div>

          <div className="flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-gray-600 p-8 text-center shadow-xl md:h-96">
            <div>
              <h3 className="text-4xl font-bold tracking-wider text-white md:text-5xl">
                SHOECRAFT
              </h3>

              <p className="mt-4 text-lg text-gray-300">
                Find Your Fit. Define Your Style.
              </p>
            </div>
          </div>

        </section>

        {/* Mission and Vision */}
        <section className="w-full bg-white px-5 sm:px-8 lg:px-12 xl:px-16 py-16 md:py-20">

          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
              What Drives Us
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Our Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* Mission */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-black text-2xl text-white">
                ★
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                Our Mission
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                To provide a convenient shopping experience with a
                diverse footwear collection that brings together
                quality, comfort, and modern style at accessible prices.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-black text-2xl text-white">
                ✦
              </div>

              <h3 className="text-2xl font-bold text-gray-900">
                Our Vision
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                To become a trusted destination for footwear by
                continuously improving our collection, customer
                experience, and the way people shop for shoes.
              </p>
            </div>

          </div>
        </section>

        {/* Why Choose Us */}
        <section className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 py-16 md:py-20">

          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
              The ShoeCraft Difference
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Why Choose Us?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              We focus on the things that make your footwear shopping
              experience better.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 text-4xl">👟</div>

              <h3 className="text-xl font-bold text-gray-900">
                Stylish Collection
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Explore different designs and styles to find footwear
                that matches your personality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 text-4xl">✓</div>

              <h3 className="text-xl font-bold text-gray-900">
                Quality & Comfort
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Find footwear designed to balance everyday comfort
                with practical style.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 text-4xl">🛍️</div>

              <h3 className="text-xl font-bold text-gray-900">
                Easy Shopping
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Browse products, compare your options, and find your
                preferred pair through a simple shopping experience.
              </p>
            </div>

          </div>
        </section>

        {/* Call To Action */}
        <section className="bg-gradient-to-r from-gray-950 to-gray-700 px-5 sm:px-8 lg:px-12 py-16 text-center text-white md:py-20">

          <h2 className="text-3xl font-bold md:text-4xl">
            Your Next Favourite Pair Awaits
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-300">
            Explore our collection and find footwear that fits your
            style, your comfort, and your everyday life.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Shop Now
          </Link>

        </section>

      </div>

      <Footer />
    </>
  )
}

export default About