import React, { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    setSubmitted(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    setSubmitted(true)

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-950 to-gray-700 px-5 sm:px-8 lg:px-12 py-20 text-center text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
            We're Here to Help
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            Contact Us
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-300">
            Have a question about our products or your order?
            Get in touch with us, and we'll be happy to help.
          </p>
        </section>

        {/* Contact Information and Form - Full Width */}
        <section className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 py-16 md:py-20">

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

            {/* Contact Information */}
            <div className="lg:col-span-1">

              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
                Get In Touch
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                We'd Love to Hear From You
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                Our team is ready to assist you with product questions,
                orders, returns, and other shopping-related enquiries.
              </p>

              <div className="mt-8 space-y-6">

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl text-white">
                    ✉
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Email Us
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Send us your questions anytime.
                    </p>

                    <a
                      href="mailto:support@shoecraft.com"
                      className="mt-2 inline-block text-sm font-semibold text-gray-900 hover:underline"
                    >
                      support@shoecraft.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl text-white">
                    ☎
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Call Us
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Need quick assistance? Give us a call.
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      Add your business phone number
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl text-white">
                    ◷
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Working Hours
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Monday – Saturday
                      <br />
                      Add your business working hours
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10 lg:col-span-2">

              <h2 className="text-2xl font-bold text-gray-900">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Fill out the form below and tell us how we can help.
              </p>

              {submitted && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                  Your message has been submitted successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">

                {/* Name and Email */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  >
                    <option value="">Select a subject</option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Return or Exchange">Return or Exchange</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Your Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    rows="5"
                    required
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-black px-6 py-3.5 font-semibold text-white transition hover:bg-gray-700 sm:w-auto"
                >
                  Send Message
                </button>

              </form>
            </div>

          </div>
        </section>

        {/* Bottom Banner */}
        <section className="bg-gradient-to-r from-gray-950 to-gray-700 px-5 sm:px-8 lg:px-12 py-14 text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">
            Your Satisfaction Matters to Us
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-300">
            Thank you for choosing ShoeCraft. We're here to make
            your shopping experience better.
          </p>
        </section>

      </div>

      <Footer />
    </>
  )
}

export default Contact