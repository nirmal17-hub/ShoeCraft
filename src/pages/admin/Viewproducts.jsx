
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";

const API = "http://localhost:3000/products";

function ViewProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);

  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Products
  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Categories
  const categories = [
    "All Categories",
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  // Search and Filter
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  // Open Edit Modal
  function handleEdit(item) {
    setSelectedProduct(item);

    setFormData({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      price: item.price || "",
    });

    // Show existing image
    setImagePreview(item.image || "");

    // No new image selected initially
    setSelectedImage(null);

    setShowEditModal(true);
  }

  // Form Input
  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Image Upload
  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be below 5MB");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  }

  // Convert Image to Base64
  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Image upload failed"));
    });
  }

  // Update Product
  async function handleUpdate(e) {
  e.preventDefault();

  try {
    setSaving(true);

    const updatedData = {
      ...formData,
      price: Number(formData.price),
    };

    // Keep existing image if no new image is selected
    if (selectedImage) {
      updatedData.image = await convertImageToBase64(selectedImage);
    }

    const response = await fetch(`${API}/${selectedProduct.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    // Get actual server response
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Server Error ${response.status}: ${responseText}`
      );
    }

    const updatedProduct = JSON.parse(responseText);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );

    setShowEditModal(false);
    setSelectedProduct(null);
    setSelectedImage(null);

    alert("Product updated successfully!");

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    alert(err.message);
  } finally {
    setSaving(false);
  }
}

  // Available / Unavailable
  async function handleAvailability(item) {
    const newStatus = Number(item.status) === 0 ? 1 : 0;

    try {
      const response = await fetch(`${API}/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      const updatedProduct = await response.json();

      setProducts((prev) =>
        prev.map((product) =>
          product.id === item.id ? updatedProduct : product
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  // Delete Product
  async function handleDelete() {
    if (!deleteProduct) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API}/${deleteProduct.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((item) => item.id !== deleteProduct.id)
      );

      setDeleteProduct(null);

      alert("Product deleted successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Header />

      <div className="ml-64 min-h-screen bg-gray-50 p-6 md:p-8">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Products
            </h1>
            <p className="text-gray-500 mt-2">
              Manage all your store products.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-products")}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700"
          >
            + Add New Product
          </button>
        </div>


        {/* Search and Filter */}
        <div className="bg-white border rounded-2xl p-5 mb-6">

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-white md:w-64 outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="border rounded-xl px-5 py-3 hover:bg-gray-100"
            >
              ↻ Refresh
            </button>

          </div>
        </div>

        {/* List Heading */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            All Products
          </h2>

          <p className="text-sm text-gray-500">
            {filteredProducts.length} products
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl p-12 text-center">
            Loading products...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-6">
            {error}
            <button
              onClick={fetchProducts}
              className="ml-4 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Product List */}
        {!loading && !error && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

            {filteredProducts.length > 0 ? (

              <div className="divide-y divide-gray-100">

                {filteredProducts.map((item) => {
                  const isAvailable = Number(item.status) !== 0;

                  return (
                    <div
                      key={item.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center gap-5 hover:bg-gray-50 transition"
                    >

                      {/* Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-contain ${
                            !isAvailable ? "opacity-40 grayscale" : ""
                          }`}
                        />
                      </div>

                      {/* Product Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wide font-semibold text-amber-600">
                          {item.category}
                        </p>

                        <h3 className="font-bold text-neutral-900 text-lg mt-1">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          Product Code: {item.productCode}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="lg:w-28">
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="font-bold text-lg mt-1">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Stock */}
                      <div className="lg:w-24">
                        <p className="text-xs text-gray-400">Stock</p>
                        <p className="font-semibold text-lg mt-1">
                          {item.quantity ?? 0}
                        </p>
                      </div>

                      {/* Availability */}
                      <div className="lg:w-32">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 lg:w-64">

                        <button
                          onClick={() => handleEdit(item)}
                          className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => handleAvailability(item)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            isAvailable
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {isAvailable ? "Unavailable" : "Available"}
                        </button>

                        <button
                          onClick={() => setDeleteProduct(item)}
                          className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            ) : (

              <div className="p-16 text-center">
                <div className="text-5xl mb-4">👟</div>

                <h3 className="text-xl font-bold">
                  No Products Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try another search or category.
                </p>
              </div>

            )}

          </div>
        )}

      </div>

      {/* EDIT PRODUCT MODAL */}
      {showEditModal && selectedProduct && (

        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !saving && setShowEditModal(false)}
        >

          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="bg-neutral-900 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  Edit Product
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Update product information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-5">

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Image
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-5">

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="h-40 w-40 object-contain rounded-xl bg-gray-100 p-2"
                      />
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center cursor-pointer text-center">

                    <span className="text-3xl mb-2">📷</span>

                    <span className="font-semibold text-gray-700">
                      Click to upload new image
                    </span>

                    <span className="text-xs text-gray-400 mt-2">
                      PNG, JPG, WEBP (Maximum 5MB)
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                  {selectedImage && (
                    <p className="text-sm text-green-600 text-center mt-3">
                      ✓ {selectedImage.name}
                    </p>
                  )}

                  {!selectedImage && (
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Existing image will remain if no new image is selected.
                    </p>
                  )}

                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">

                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={saving}
                  className="flex-1 border rounded-xl py-3 font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-amber-600 text-white rounded-xl py-3 font-semibold hover:bg-amber-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteProduct && (

        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => !deleting && setDeleteProduct(null)}
        >

          <div
            className="bg-white w-full max-w-md rounded-2xl p-7 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">
              🗑
            </div>

            <h2 className="text-xl font-bold">
              Delete Product?
            </h2>

            <p className="text-gray-500 mt-3">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                {deleteProduct.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-7">

              <button
                onClick={() => setDeleteProduct(null)}
                disabled={deleting}
                className="flex-1 border rounded-xl py-3 font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white rounded-xl py-3 font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default ViewProducts;
