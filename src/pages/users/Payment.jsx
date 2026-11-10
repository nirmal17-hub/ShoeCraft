
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Package,
  ShoppingBag
} from 'lucide-react'

import Header from './components/Header'
import Footer from './components/Footer'

function Payment() {
  const navigate = useNavigate()
  const API = 'http://localhost:3000'

  const [checkoutItems, setCheckoutItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [purchaseDate, setPurchaseDate] = useState('')

  // Load only active cart products belonging to this user
  useEffect(() => {
    const fetchCheckoutItems = async () => {
      try {
        const currentUser = JSON.parse(
          localStorage.getItem('user') || 'null'
        )

        const checkoutUserId = sessionStorage.getItem('checkoutUserId')

        if (
          !currentUser?.id ||
          !checkoutUserId ||
          String(currentUser.id) !== String(checkoutUserId)
        ) {
          navigate('/collections', { replace: true })
          return
        }

        const response = await fetch(`${API}/cart`)

        if (!response.ok) {
          throw new Error('Unable to fetch cart.')
        }

        const cartData = await response.json()

        // Get only status 1 products for the logged-in user
        const activeCart = cartData.filter(item =>
          String(item.userId) === String(currentUser.id) &&
          Number(item.status) === 1
        )

        if (activeCart.length === 0) {
          sessionStorage.removeItem('checkoutCart')
          sessionStorage.removeItem('checkoutUserId')
          navigate('/collections', { replace: true })
          return
        }

        // Fetch product details from products endpoint
        const productsResponse = await fetch(`${API}/products`)

        if (!productsResponse.ok) {
          throw new Error('Unable to fetch products.')
        }

        const products = await productsResponse.json()

        const itemsWithProducts = activeCart
          .map(item => {
            const product = products.find(
              p => String(p.id) === String(item.productId)
            )

            if (!product) return null

            return {
              ...item,
              product
            }
          })
          .filter(Boolean)

        if (itemsWithProducts.length === 0) {
          navigate('/collections', { replace: true })
          return
        }

        setCheckoutItems(itemsWithProducts)

        // Keep the current active checkout records in session
        sessionStorage.setItem(
          'checkoutCart',
          JSON.stringify(itemsWithProducts)
        )

      } catch (err) {
        setError(err.message || 'Unable to load checkout.')
      } finally {
        setLoading(false)
      }
    }

    fetchCheckoutItems()
  }, [navigate])

  // Total amount
  const totalAmount = checkoutItems.reduce(
    (total, item) =>
      total +
      Number(item.product?.price || 0) *
      Number(item.quantity || 0),
    0
  )

  // Format date
  const formatDate = date => {
    if (!date) return ''

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Redirect to collection
  const backToCollection = () => {
    sessionStorage.removeItem('checkoutCart')
    sessionStorage.removeItem('checkoutUserId')
    navigate('/collections')
  }

  // Confirm payment
  const confirmPayment = async () => {
    if (checkoutItems.length === 0) {
      backToCollection()
      return
    }

    try {
      setPaymentLoading(true)
      setError('')

      const currentUser = JSON.parse(
        localStorage.getItem('user') || 'null'
      )

      const checkoutUserId = sessionStorage.getItem('checkoutUserId')

      if (
        !currentUser?.id ||
        !checkoutUserId ||
        String(currentUser.id) !== String(checkoutUserId)
      ) {
        throw new Error('Please login with the same account used for checkout.')
      }

      // Fetch latest cart records
      const response = await fetch(`${API}/cart`)

      if (!response.ok) {
        throw new Error('Unable to verify your cart.')
      }

      const databaseCart = await response.json()

      // Validate only active cart items
      const validItems = checkoutItems.map(item =>
        databaseCart.find(cartItem =>
          String(cartItem.id) === String(item.id) &&
          String(cartItem.userId) === String(currentUser.id) &&
          String(cartItem.productId) === String(item.productId) &&
          Number(cartItem.status) === 1 &&
          Number(cartItem.quantity) === Number(item.quantity)
        )
      )

      if (validItems.some(item => !item)) {
        throw new Error(
          'Your cart has changed. Please refresh and try again.'
        )
      }

      const date = new Date().toISOString()

      // Mark purchased items as inactive
      const results = await Promise.all(
        validItems.map(item =>
          fetch(`${API}/cart/${item.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: 0,
              purchaseDate: date
            })
          })
        )
      )

      if (results.some(result => !result.ok)) {
        throw new Error('Unable to complete your order.')
      }

      setPurchaseDate(date)
      setPaymentSuccess(true)

      // Remove checkout session after successful payment
      sessionStorage.removeItem('checkoutCart')
      sessionStorage.removeItem('checkoutUserId')

    } catch (err) {
      setError(err.message || 'Payment failed.')
    } finally {
      setPaymentLoading(false)
    }
  }

  // Redirect 5 seconds after success
  useEffect(() => {
    if (!paymentSuccess) return

    const timer = setTimeout(() => {
      navigate('/collections', { replace: true })
    }, 5000)

    return () => clearTimeout(timer)
  }, [paymentSuccess, navigate])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="mt-4 text-gray-500">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error && checkoutItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center px-5">
          <Package size={55} className="text-gray-300 mb-5" />
          <h2 className="text-2xl font-bold">Unable to Load Checkout</h2>
          <p className="mt-3 text-red-500">{error}</p>
          <button
            onClick={backToCollection}
            className="mt-6 rounded-xl bg-black px-7 py-3 text-white"
          >
            Back to Collection
          </button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen w-full bg-gray-50">

        <section className="w-full bg-gradient-to-r from-gray-950 to-gray-700 px-5 py-12 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
            ShoeCraft Secure Checkout
          </p>

          <h1 className="text-4xl font-black">
            {paymentSuccess ? 'Order Placed' : 'Payment'}
          </h1>

          <p className="mt-3 text-gray-300">
            {paymentSuccess
              ? 'Your order has been placed successfully.'
              : 'Review your active cart products and confirm your payment.'}
          </p>
        </section>

        <section className="w-full px-4 py-10 sm:px-8 lg:px-12">

          {paymentSuccess ? (

            <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">

              <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={65} className="text-green-600" />
              </div>

              <p className="text-sm font-bold uppercase tracking-widest text-green-600">
                Payment Successful
              </p>

              <h2 className="mt-4 text-3xl font-black text-gray-900">
                Order Placed Successfully!
              </h2>

              <p className="mt-4 text-gray-500">
                Thank you for shopping with ShoeCraft.
                Your order has been confirmed.
              </p>

              <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left">

                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="text-xl font-black text-green-600">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-5 flex justify-between">
                  <span className="text-gray-500">Products</span>
                  <span className="font-bold">{checkoutItems.length}</span>
                </div>

                <div className="mt-5 border-t pt-5">
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="mt-2 font-bold">
                    {formatDate(purchaseDate)}
                  </p>
                </div>

              </div>

              <p className="mt-8 text-sm text-gray-500">
                Redirecting to collection in 5 seconds...
              </p>

              <button
                onClick={backToCollection}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-black py-4 font-bold text-white hover:bg-amber-600"
              >
                <ShoppingBag size={20} />
                Continue Shopping
              </button>

            </div>

          ) : (

            <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">

              {/* ACTIVE CART PRODUCTS */}
              <div className="space-y-5 lg:col-span-2">

                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>

                  <span className="text-sm text-gray-500">
                    {checkoutItems.length} products
                  </span>
                </div>

                {checkoutItems.map(item => (

                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
                  >

                    <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-36">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name || 'Product'}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-center">

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {item.product?.category}
                      </p>

                      <h3 className="mt-2 text-lg font-bold text-gray-900">
                        {item.product?.name}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-3 text-lg font-bold">
                        ₹{(
                          Number(item.product?.price || 0) *
                          Number(item.quantity || 0)
                        ).toLocaleString('en-IN')}
                      </p>

                    </div>

                  </div>

                ))}

                <button
                  onClick={backToCollection}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black"
                >
                  <ArrowLeft size={17} />
                  Back to Collection
                </button>

              </div>

              {/* PAYMENT SUMMARY */}
              <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">

                <h2 className="border-b border-gray-200 pb-5 text-xl font-bold">
                  Payment Summary
                </h2>

                <div className="space-y-4 py-6">

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">
                      Free
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-5 text-lg font-bold">
                    <span>Total Amount</span>
                    <span>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                </div>

                <div className="mb-6 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard size={23} className="text-gray-700" />
                    <div>
                      <p className="text-sm font-bold">
                        Payment Confirmation
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Demo payment confirmation
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  onClick={confirmPayment}
                  disabled={paymentLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-4 font-bold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShieldCheck size={19} />
                  {paymentLoading ? 'Processing...' : 'Confirm Payment'}
                </button>

                <p className="mt-4 text-center text-xs text-gray-400">
                  Demo confirmation only. No actual payment is collected.
                </p>

              </aside>

            </div>

          )}

        </section>
      </main>

      <Footer />
    </>
  )
}

export default Payment
