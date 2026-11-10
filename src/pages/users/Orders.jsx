
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  IndianRupee,
  CalendarDays
} from 'lucide-react'

import Header from './components/Header'
import Footer from './components/Footer'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  )

  const userId = user?.id

  // FETCH PURCHASED ITEMS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError('')

        if (!userId) {
          setOrders([])
          return
        }

        const [cartResponse, productsResponse] = await Promise.all([
          fetch('http://localhost:3000/cart'),
          fetch('http://localhost:3000/products')
        ])

        if (!cartResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch orders.')
        }

        const cartData = await cartResponse.json()
        const productsData = await productsResponse.json()

        // GET ONLY LOGGED-IN USER'S PURCHASED ITEMS
        const purchasedItems = cartData.filter(
          item =>
            String(item.userId) === String(userId) &&
            Number(item.status) === 0
        )

        // ADD PRODUCT DETAILS
        const orderDetails = purchasedItems.map(item => {
          const product = productsData.find(
            product =>
              String(product.id) === String(item.productId)
          )

          return {
            ...item,
            product
          }
        })

        // NEWEST PURCHASE FIRST
        orderDetails.sort(
          (a, b) =>
            new Date(b.purchaseDate || 0) -
            new Date(a.purchaseDate || 0)
        )

        setOrders(orderDetails)

      } catch (err) {
        setError('Unable to load your orders. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  // FORMAT PRICE
  const formatPrice = amount =>
    Number(amount || 0).toLocaleString('en-IN')

  // FORMAT PURCHASE DATE
  const formatDate = date => {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(date)

    if (isNaN(parsedDate.getTime())) {
      return 'Date unavailable'
    }

    return parsedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // TOTAL PURCHASED ITEMS
  const totalOrders = orders.length

  // TOTAL PURCHASE VALUE
  const totalAmount = orders.reduce(
    (total, item) =>
      total +
      Number(item.product?.price || 0) *
      Number(item.quantity || 0),
    0
  )

  return (
    <>
      <Header />

      <main className="min-h-screen w-full bg-gray-50">

        {/* PAGE HEADER */}
        <section className="w-full bg-black px-5 py-12 text-white md:px-12">

          <div className="mb-4 flex items-center gap-3">
            <Package
              size={30}
              className="text-amber-400"
            />

            <span className="font-semibold uppercase tracking-widest text-sm text-amber-400">
              ShoeCraft
            </span>
          </div>

          <h1 className="text-3xl font-extrabold md:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 text-gray-400">
            View your previously purchased products.
          </p>

        </section>

        <section className="w-full px-4 py-10 md:px-10 lg:px-12">

          {/* SUMMARY CARDS */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
                <ShoppingBag
                  size={27}
                  className="text-amber-600"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Purchased Items
                </p>

                <h2 className="text-2xl font-bold text-gray-900">
                  {totalOrders}
                </h2>
              </div>

            </div>

            <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-6">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                <IndianRupee
                  size={27}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total Purchase Value
                </p>

                <h2 className="text-2xl font-bold text-gray-900">
                  ₹{formatPrice(totalAmount)}
                </h2>
              </div>

            </div>

          </div>

          {/* ORDER HISTORY HEADING */}
          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order History
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your purchased products
              </p>
            </div>

            <Link
              to="/collections"
              className="hidden items-center gap-2 text-sm font-semibold text-amber-600 hover:text-black sm:flex"
            >
              Continue Shopping
              <ArrowRight size={17} />
            </Link>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="rounded-2xl bg-white p-16 text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>

              <p className="text-gray-500">
                Loading your orders...
              </p>

            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY ORDERS */}
          {!loading && !error && orders.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center md:py-20">

              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag
                  size={42}
                  className="text-gray-400"
                />
              </div>

              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                No Orders Yet
              </h2>

              <p className="mb-7 text-gray-500">
                You haven't purchased any products yet.
              </p>

              <Link
                to="/user/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-8 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-black"
              >
                <ShoppingBag size={18} />
                Start Shopping
              </Link>

            </div>
          )}

          {/* ORDER LIST */}
          {!loading && !error && orders.length > 0 && (

            <div className="space-y-5">

              {orders.map(item => {

                const product = item.product

                const price = Number(product?.price || 0)
                const quantity = Number(item.quantity || 0)
                const itemTotal = price * quantity

                const purchaseDate = formatDate(
                  item.purchaseDate
                )

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md"
                  >

                    {/* ORDER TOP */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4 md:px-7">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Order Reference
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          #{item.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        <CheckCircle size={16} />
                        Purchased
                      </div>

                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="flex flex-col gap-6 p-5 md:flex-row md:p-7">

                      {/* PRODUCT IMAGE */}
                      <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-40 md:w-40">

                        {product?.image || product?.imageUrl ? (

                          <img
                            src={product.image || product.imageUrl}
                            alt={product.name || 'Product'}
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center">
                            <Package
                              size={45}
                              className="text-gray-300"
                            />
                          </div>

                        )}

                      </div>

                      {/* PRODUCT INFORMATION */}
                      <div className="flex flex-1 flex-col justify-center">

                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                          {product?.category || 'ShoeCraft Product'}
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                          {product?.name ||
                            product?.productName ||
                            'Product details unavailable'}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          Product ID: {item.productId}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">

                          <div>
                            <p className="text-xs uppercase text-gray-400">
                              Price
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                              ₹{formatPrice(price)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase text-gray-400">
                              Quantity
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                              {quantity}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase text-gray-400">
                              Total
                            </p>

                            <p className="mt-1 font-bold text-green-600">
                              ₹{formatPrice(itemTotal)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase text-gray-400">
                              Payment
                            </p>

                            <p className="mt-1 font-semibold text-green-600">
                              Completed
                            </p>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* PURCHASE DATE */}
                    <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays
                          size={18}
                          className="text-amber-600"
                        />

                        <span className="font-medium">
                          Purchased on:
                        </span>

                        <span>
                          {purchaseDate}
                        </span>
                      </div>

                      <p className="font-bold text-gray-900">
                        Order Total: ₹{formatPrice(itemTotal)}
                      </p>

                    </div>

                  </div>
                )
              })}

            </div>
          )}

          {/* MOBILE SHOPPING LINK */}
          <div className="mt-8 sm:hidden">

            <Link
              to="/user/shop"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-semibold text-white"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  )
}

export default Orders
