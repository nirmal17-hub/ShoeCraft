import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function Category() {
  const { categoryName } = useParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(categoryName || 'All')

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

  useEffect(() => {
    setCategory(categoryName ? decodeURIComponent(categoryName) : 'All')
  }, [categoryName])

  const categories = [
    'All',
    ...new Set(products.map((product) => product.category))
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || product.category === category

    return matchesSearch && matchesCategory
  })

  const handleCategoryChange = (item) => {
    setCategory(item)

    if (item === 'All') {
      navigate('/category')
    } else {
      navigate(`/category/${encodeURIComponent(item)}`)
    }
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">

        {/* Category Banner */}
        <section className="bg-gradient-to-r from-gray-950 to-gray-700 px-5 sm:px-8 lg:px-12 py-16 text-center text-white">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
            ShoeCraft Collection
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            {category === 'All' ? 'Shop by Category' : category}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Explore our footwear collection and find the perfect pair
            that matches your style.
          </p>

        </section>

        {/* Products Section - Full Width */}
        <section className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 py-12">

          {/* Heading and Search */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {category === 'All' ? 'All Products' : `${category} Shoes`}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredProducts.length} products found
              </p>
            </div>

            <input
              type="text"
              placeholder="Search shoes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black md:w-80"
            />

          </div>

          {/* Category Filter */}
          <div className="mb-10 flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => handleCategoryChange(item)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  category === item
                    ? 'bg-black text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <p className="py-16 text-center text-gray-500">
              Loading products...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="py-16 text-center text-red-500">
              {error}. Please check whether JSON Server is running.
            </p>
          )}

          {/* Empty Products */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="py-16 text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                No products found
              </h3>

              <p className="mt-2 text-gray-500">
                Try another search or category.
              </p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* Product Image */}
                  <div className="h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-5">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {product.category}
                    </p>

                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {product.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">

                      <p className="text-xl font-bold text-gray-900">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </p>

                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                      >
                        View Product
                      </button>

                    </div>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>

      <Footer />
    </>
  )
}

export default Category