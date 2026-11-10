
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

import Header from './components/Header'
import Footer from './components/Footer'

function Cart() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const API_URL = import.meta.env.VITE_API_URL
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const userId = user?.id

  // FETCH CART AND PRODUCTS
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        setError('')

        const [cartResponse, productResponse] = await Promise.all([
          fetch(`${API_URL}/cart`),
          fetch(`${API_URL}/products`)
        ])

        if (!cartResponse.ok || !productResponse.ok) {
          throw new Error('Failed to load cart')
        }

        const cartData = await cartResponse.json()
        const productData = await productResponse.json()

        const userCart = cartData.filter(
          item =>
            String(item.userId) === String(userId) &&
            Number(item.status ?? 1) === 1
        )

        setCartItems(userCart)
        setProducts(productData)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [userId])

  // MATCH CART WITH PRODUCTS
  const items = cartItems
    .map(item => {
      const product = products.find(
        product => String(product.id) === String(item.productId)
      )

      if (!product) return null

      return {
        ...item,
        product,
        quantity: Number(item.quantity || 1)
      }
    })
    .filter(Boolean)

  // CALCULATE TOTAL
  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.product.price) * item.quantity,
    0
  )

  // UPDATE QUANTITY
  const updateQuantity = async (item, change) => {
    const newQuantity = Number(item.quantity) + change

    if (newQuantity < 1) return

    setCartItems(previous =>
      previous.map(cartItem =>
        String(cartItem.id) === String(item.id)
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    )

    try {
      const response = await fetch(
        `${API_URL}/cart/${item.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quantity: newQuantity
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update quantity')
      }

    } catch (err) {
      console.error(err)
      setError('Failed to save quantity. Please try again.')

      try {
        const response = await fetch(
          `${API_URL}/cart/${item.id}`
        )

        if (response.ok) {
          const serverItem = await response.json()

          setCartItems(previous =>
            previous.map(cartItem =>
              String(cartItem.id) === String(item.id)
                ? {
                    ...cartItem,
                    quantity: Number(serverItem.quantity || 1)
                  }
                : cartItem
            )
          )
        }
      } catch (fetchError) {
        console.error(fetchError)
      }
    }
  }

  // DELETE ITEM
  const removeItem = async item => {
    try {
      setError('')

      const response = await fetch(
        `${API_URL}/cart/${item.id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      setCartItems(previous =>
        previous.filter(
          cartItem => String(cartItem.id) !== String(item.id)
        )
      )

    } catch (err) {
      setError(err.message)
    }
  }

  // SEND CART TO PAYMENT PAGE
  const handleCheckout = () => {
    if (items.length === 0) return

    sessionStorage.setItem(
      'checkoutCart',
      JSON.stringify(items)
    )

    sessionStorage.setItem(
      'checkoutUserId',
      String(userId)
    )

    navigate('/payment')
  }

  return (
    <>
      <Header />

      <main className="min-h-screen w-full bg-gray-50">

        {/* BANNER */}
        <section className="w-full bg-gradient-to-r from-gray-950 to-gray-700 px-4 py-14 text-center text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
            ShoeCraft Collection
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Your Shopping Cart
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Your favorite pairs, all in one place. Review your items
            before checking out.
          </p>
        </section>

        {/* CART CONTENT */}
        <section className="w-full px-3 py-10 sm:px-5 lg:px-8">

          <Link
            to="/user/shop"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-amber-700"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>

          {/* LOADING */}
          {loading && (
            <p className="py-16 text-center text-gray-500">
              Loading your cart...
            </p>
          )}

          {/* ERROR */}
          {!loading && error && (
            <p className="mb-6 rounded-lg bg-red-50 p-4 text-center text-red-600">
              {error}
            </p>
          )}

          {/* NOT LOGGED IN */}
          {!loading && !userId && (
            <div className="w-full rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <ShoppingCart
                size={52}
                className="mx-auto mb-5 text-gray-400"
              />

              <h2 className="text-2xl font-bold text-gray-900">
                Please log in
              </h2>

              <p className="mt-3 text-gray-500">
                Log in to view your shopping cart.
              </p>

              <Link
                to="/login"
                className="mt-6 inline-flex rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-amber-800"
              >
                Login
              </Link>
            </div>
          )}

          {/* EMPTY CART */}
          {!loading && !error && userId && items.length === 0 && (
            <div className="w-full rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <ShoppingCart
                size={52}
                className="mx-auto mb-5 text-gray-400"
              />

              <h2 className="text-2xl font-bold text-gray-900">
                Your cart is empty
              </h2>

              <p className="mt-3 text-gray-500">
                Looks like you haven't added any shoes yet.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-amber-800"
              >
                Explore Products
                <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* CART ITEMS */}
          {!loading && !error && userId && items.length > 0 && (
            <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-3">

              {/* PRODUCT LIST */}
              <div className="min-w-0 space-y-5 lg:col-span-2">

                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cart Items
                  </h2>

                  <span className="text-sm text-gray-500">
                    {items.length} products
                  </span>
                </div>

                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg sm:flex-row sm:p-5"
                  >

                    {/* IMAGE */}
                    <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-40 sm:w-40">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {item.product.category}
                        </p>

                        <h3 className="text-lg font-bold text-gray-900">
                          {item.product.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                          {item.product.description}
                        </p>

                        <p className="mt-3 text-xl font-bold text-gray-900">
                          ₹{Number(item.product.price).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                        {/* QUANTITY */}
                        <div className="inline-flex items-center rounded-lg border border-gray-300">

                          <button
                            type="button"
                            onClick={() => updateQuantity(item, -1)}
                            disabled={item.quantity <= 1}
                            className="p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-10 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item, 1)}
                            className="p-2 transition hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>

                        </div>

                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={() => removeItem(item)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={17} />
                          Remove
                        </button>

                      </div>
                    </div>

                    {/* ITEM TOTAL */}
                    <div className="sm:min-w-28 sm:text-right">
                      <p className="text-xs text-gray-500">
                        Item Total
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        ₹{(
                          Number(item.product.price) * item.quantity
                        ).toLocaleString('en-IN')}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

              {/* ORDER SUMMARY */}
              <aside className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">

                <h2 className="border-b border-gray-200 pb-5 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="space-y-4 py-5">

                  <div className="flex justify-between gap-4 text-sm text-gray-600">
                    <span>Products ({items.length})</span>

                    <span className="font-semibold text-gray-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>

                    <span className="font-semibold text-green-700">
                      Free
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-5 text-lg font-bold text-gray-900">
                    <span>Total</span>

                    <span>
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3.5 font-semibold text-white hover:bg-amber-800"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShoppingCart size={15} />
                  Secure checkout
                </div>

              </aside>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </>
  )
}

export default Cart
