
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  X,
  LockKeyhole,
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package
} from 'lucide-react'

import Header from './components/Header'
import Footer from './components/Footer'

function Product() {
  const API = 'http://localhost:3000'

  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user') || 'null')
  })

  const [isInCart, setIsInCart] = useState(false)

  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  })

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    })

    setTimeout(() => {
      setToast({
        show: false,
        message: '',
        type: 'success'
      })
    }, 3000)
  }

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        const response = await fetch(`${API}/products/${id}`)

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Product fetch error:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Check whether product is already in the user's active cart
  const checkCart = async (userId) => {
    if (!userId || !product?.id) {
      setIsInCart(false)
      return false
    }

    try {
      const response = await fetch(`${API}/cart`)

      if (!response.ok) {
        throw new Error('Unable to check cart')
      }

      const cartData = await response.json()

      const existingItem = cartData.some(item =>
        String(item.userId) === String(userId) &&
        String(item.productId) === String(product.id) &&
        Number(item.status) === 1
      )

      setIsInCart(existingItem)

      return existingItem
    } catch (error) {
      console.error('Cart check error:', error)
      return false
    }
  }

  // Check cart whenever product or logged-in user changes
  useEffect(() => {
    if (product?.id && user?.id) {
      checkCart(user.id)
    } else {
      setIsInCart(false)
    }
  }, [product, user])

  // Add product to JSON Server cart
  const addToCart = async (userId) => {
    const response = await fetch(`${API}/cart`)

    if (!response.ok) {
      throw new Error('Unable to fetch cart')
    }

    const cartData = await response.json()

    const existingItem = cartData.find(item =>
      String(item.userId) === String(userId) &&
      String(item.productId) === String(product.id) &&
      Number(item.status) === 1
    )

    if (existingItem) {
      const updateResponse = await fetch(
        `${API}/cart/${existingItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quantity: Number(existingItem.quantity || 1) + 1
          })
        }
      )

      if (!updateResponse.ok) {
        throw new Error('Unable to update cart')
      }

      const updatedItem = await updateResponse.json()

      return {
        ...updatedItem,
        product
      }
    }

    const addResponse = await fetch(`${API}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        productId: product.id,
        quantity: 1,
        status: 1
      })
    })

    if (!addResponse.ok) {
      throw new Error('Unable to add product to cart')
    }

    const newItem = await addResponse.json()

    return {
      ...newItem,
      product
    }
  }

  // Add to Cart button
  const handleAddToCart = async () => {
    if (!user?.id) {
      setPendingAction('cart')
      setShowLoginPopup(true)
      return
    }

    if (isInCart) {
      return
    }

    try {
      setCartLoading(true)

      const alreadyExists = await checkCart(user.id)

      if (alreadyExists) {
        showToast('Product is already in your cart', 'error')
        return
      }

      await addToCart(user.id)

      setIsInCart(true)

      showToast('Product added to cart successfully')
    } catch (error) {
      console.error('Add to cart error:', error)
      showToast('Unable to add product to cart', 'error')
    } finally {
      setCartLoading(false)
    }
  }

  // Buy Now button
  const processBuyNow = async (userId) => {
    try {
      setCartLoading(true)

      const cartItem = await addToCart(userId)

      setIsInCart(true)

      sessionStorage.setItem(
        'checkoutCart',
        JSON.stringify([cartItem])
      )

      sessionStorage.setItem(
        'checkoutUserId',
        String(userId)
      )

      navigate('/payment')
    } catch (error) {
      console.error('Buy now error:', error)
      showToast('Unable to process your order', 'error')
    } finally {
      setCartLoading(false)
    }
  }

  const handleBuyNow = () => {
    if (!user?.id) {
      setPendingAction('buy')
      setShowLoginPopup(true)
      return
    }

    processBuyNow(user.id)
  }

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault()

    setLoginError('')
    setLoginLoading(true)

    try {
      const response = await fetch(`${API}/users`)

      if (!response.ok) {
        throw new Error('Unable to fetch users')
      }

      const users = await response.json()

      const loggedInUser = users.find(
        item =>
          item.email === loginEmail &&
          item.password === loginPassword
      )

      if (!loggedInUser) {
        setLoginError('Invalid email or password')
        return
      }

      if (loggedInUser.role !== 'user') {
        setLoginError('Please login with a customer account')
        return
      }

      const userData = {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        role: loggedInUser.role
      }

      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)

      window.dispatchEvent(new Event('userChanged'))

      setShowLoginPopup(false)

      const action = pendingAction

      setPendingAction(null)
      setLoginEmail('')
      setLoginPassword('')

      if (action === 'cart') {
        setCartLoading(true)

        const alreadyExists = await checkCart(userData.id)

        if (alreadyExists) {
          showToast('Product is already in your cart')
        } else {
          await addToCart(userData.id)
          setIsInCart(true)
          showToast('Product added to cart successfully')
        }

        setCartLoading(false)
      }

      if (action === 'buy') {
        processBuyNow(userData.id)
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Something went wrong. Please try again.')
      setCartLoading(false)
    } finally {
      setLoginLoading(false)
    }
  }

  // Loading screen
  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">
              Loading product...
            </p>
          </div>
        </div>

        <Footer />
      </>
    )
  }

  // Product not found
  if (!product) {
    return (
      <>
        <Header />

        <div className="min-h-[70vh] flex flex-col items-center justify-center px-5">
          <Package size={55} className="text-gray-300 mb-4" />

          <h2 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            This product may have been removed.
          </p>

          <button
            onClick={() => navigate('/collections')}
            className="mt-6 bg-black text-white px-7 py-3 rounded-xl font-semibold hover:bg-gray-800"
          >
            Back to Collection
          </button>
        </div>

        <Footer />
      </>
    )
  }

  const productImage =
    product.image ||
    product.imageUrl ||
    product.img ||
    ''

  return (
    <>
      <Header />

      <main className="w-full bg-white min-h-screen">

        {/* Toast notification */}
        {toast.show && (
          <div
            className={`fixed top-24 right-5 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-white ${
              toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-green-600'
            }`}
          >
            {toast.type === 'error' ? (
              <X size={20} />
            ) : (
              <CheckCircle size={20} />
            )}

            <span className="font-medium">
              {toast.message}
            </span>
          </div>
        )}

        {/* Back button */}
        <div className="w-full px-5 md:px-10 lg:px-16 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition"
          >
            <ArrowLeft size={19} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Product section */}
        <section className="w-full px-5 md:px-10 lg:px-16 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Product image */}
            <div className="w-full">
              <div className="w-full bg-gray-100 rounded-3xl overflow-hidden min-h-[350px] md:min-h-[550px] flex items-center justify-center">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full max-h-[650px] object-contain"
                  />
                ) : (
                  <Package
                    size={100}
                    className="text-gray-300"
                  />
                )}
              </div>
            </div>

            {/* Product details */}
            <div className="flex flex-col justify-center py-3">

              <p className="text-sm font-bold tracking-[0.2em] text-amber-600 uppercase">
                {product.category || 'SHOECRAFT COLLECTION'}
              </p>

              <h1 className="text-3xl md:text-5xl font-black text-gray-950 mt-4 leading-tight">
                {product.name}
              </h1>

              {product.brand && (
                <p className="text-gray-500 text-lg mt-3">
                  {product.brand}
                </p>
              )}

              <div className="mt-6 flex items-center gap-3">
                <span className="text-3xl font-black text-gray-950">
                  ₹{Number(product.price || 0).toLocaleString('en-IN')}
                </span>

                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{Number(product.oldPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="h-px bg-gray-200 w-full my-8"></div>

              <h3 className="font-bold text-gray-900 text-lg mb-3">
                Product Description
              </h3>

              <p className="text-gray-600 leading-8 text-base">
                {product.description ||
                  'Experience comfort and style with this premium footwear from ShoeCraft. Designed for everyday use with quality materials and a comfortable fit.'}
              </p>

              {/* Product information */}
              <div className="grid grid-cols-2 gap-4 mt-8">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                    Category
                  </p>
                  <p className="font-semibold text-gray-900 mt-2">
                    {product.category || 'Footwear'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                    Product Code
                  </p>
                  <p className="font-semibold text-gray-900 mt-2">
                    {product.productCode || product.id}
                  </p>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || isInCart}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 border-2 rounded-xl font-bold transition ${
                    isInCart
                      ? 'border-green-600 bg-green-50 text-green-700 cursor-not-allowed'
                      : 'border-black text-black hover:bg-black hover:text-white'
                  } disabled:opacity-90`}
                >
                  {isInCart ? (
                    <>
                      <CheckCircle size={21} />
                      Already in Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={21} />
                      {cartLoading ? 'Please wait...' : 'Add to Cart'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={cartLoading}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-60"
                >
                  {cartLoading ? (
                    'Please wait...'
                  ) : (
                    <>
                      <LockKeyhole size={20} />
                      Buy Now
                    </>
                  )}
                </button>

              </div>

              {/* Service information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 pt-8 border-t border-gray-200">

                <div className="flex items-center gap-3">
                  <Truck size={25} className="text-gray-700" />
                  <div>
                    <p className="font-bold text-sm">Delivery</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Home delivery
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RotateCcw size={25} className="text-gray-700" />
                  <div>
                    <p className="font-bold text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Hassle-free returns
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck size={25} className="text-gray-700" />
                  <div>
                    <p className="font-bold text-sm">Secure Shopping</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Safe experience
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Login popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 md:p-9">

            <button
              onClick={() => {
                setShowLoginPopup(false)
                setPendingAction(null)
                setLoginError('')
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X size={23} />
            </button>

            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
              <LockKeyhole size={30} className="text-gray-900" />
            </div>

            <h2 className="text-2xl font-black text-center mt-5">
              Login Required
            </h2>

            <p className="text-gray-500 text-center text-sm mt-2">
              Please login to continue shopping with ShoeCraft.
            </p>

            <form onSubmit={handleLogin} className="mt-8">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black"
              />

              <label className="block text-sm font-semibold text-gray-700 mb-2 mt-5">
                Password
              </label>

              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black"
              />

              {loginError && (
                <p className="text-red-600 text-sm mt-4">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-black text-white rounded-xl py-4 font-bold mt-7 hover:bg-gray-800 transition disabled:opacity-60"
              >
                {loginLoading ? 'Logging in...' : 'Login Now'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLoginPopup(false)
                  setPendingAction(null)
                  setLoginError('')
                }}
                className="w-full border border-gray-200 rounded-xl py-4 font-bold mt-3 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

            </form>

          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Product
