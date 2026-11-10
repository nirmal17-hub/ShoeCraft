
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
    quantity: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [addedProduct, setAddedProduct] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // Generate Unique Product Code
  async function generateProductCode() {
    const response = await fetch(
      "http://localhost:3000/products"
    );

    if (!response.ok) {
      throw new Error("Unable to generate product code");
    }

    const products = await response.json();

    const highestNumber = products.reduce((max, item) => {
      const match = item.productCode?.match(/^SHO-(\d+)$/);

      if (!match) return max;

      return Math.max(max, Number(match[1]));
    }, 0);

    const nextNumber = highestNumber + 1;

    return `SHO-${String(nextNumber).padStart(3, "0")}`;
  }

  // Handle Input Changes
  function handleChange(e) {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle Image Selection
  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  // Remove Image
  function removeImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImageFile(null);
    setPreview("");
  }

  // Reset Form
  function resetForm() {
    setProduct({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
      quantity: "",
    });

    removeImage();
    setGeneratedCode("");
    setError("");
  }

  // Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    // Validate Required Fields
    if (
      !product.name.trim() ||
      !product.category ||
      !product.price ||
      !product.description.trim() ||
      product.quantity === "" ||
      !imageFile
    ) {
      setError("Please fill all fields and select an image");
      return;
    }

    // Validate Price and Quantity
    if (
      !Number.isFinite(Number(product.price)) ||
      Number(product.price) <= 0 ||
      !Number.isFinite(Number(product.quantity)) ||
      Number(product.quantity) < 0
    ) {
      setError("Enter a valid price and quantity");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: Generate Product Code
      const productCode = await generateProductCode();

      // STEP 2: Upload Image
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadResponse = await fetch(
        "http://localhost:3001/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadResponse.json();

      // STEP 3: Save Product
      const response = await fetch(
        "http://localhost:3000/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...product,
            productCode: productCode,
            name: product.name.trim(),
            price: Number(product.price),
            quantity: Number(product.quantity),
            image: uploadData.image,
            status: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to add product");
      }

      const savedProduct = await response.json();

      // STEP 4: Show Success Popup
      setAddedProduct(savedProduct.name);
      setGeneratedCode(savedProduct.productCode);
      setShowPopup(true);

      // STEP 5: Reset Form
      setProduct({
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        quantity: "",
      });

      removeImage();

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <div className="ml-64 min-h-screen bg-gray-50 p-6 md:p-10">

        {/* PAGE HEADING */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Add New Product
            </h1>

            <p className="text-gray-500 mt-2">
              Add a new shoe to your ShoeCraft store.
            </p>
          </div>

          <button
            onClick={() => navigate("/view-products")}
            className="px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-100"
          >
            Back to Products
          </button>
        </div>

        {/* FORM CONTAINER */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* LEFT SIDE */}
              <div className="space-y-6">

                <h2 className="text-lg font-bold border-b pb-4">
                  Product Information
                </h2>

                {/* PRODUCT NAME */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Casual Sneakers">
                      Casual Sneakers
                    </option>
                    <option value="Lifestyle Shoes">
                      Lifestyle Shoes
                    </option>
                    <option value="Running Shoes">
                      Running Shoes
                    </option>
                    <option value="Sports Shoes">
                      Sports Shoes
                    </option>
                    <option value="Formal Shoes">
                      Formal Shoes
                    </option>
                  </select>
                </div>

                {/* PRICE AND QUANTITY */}
                <div className="grid grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Price (₹) *
                    </label>

                    <input
                      type="number"
                      name="price"
                      min="1"
                      value={product.price}
                      onChange={handleChange}
                      placeholder="2499"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Stock Quantity *
                    </label>

                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      value={product.quantity}
                      onChange={handleChange}
                      placeholder="40"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500"
                    />
                  </div>

                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Enter product description"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-6">

                <h2 className="text-lg font-bold border-b pb-4">
                  Product Image
                </h2>

                <label className="block text-sm font-semibold">
                  Upload Shoe Image *
                </label>

                <label className="cursor-pointer block">

                  <div className="border-2 border-dashed border-gray-300 rounded-2xl min-h-80 flex flex-col items-center justify-center p-6 hover:border-amber-500 hover:bg-amber-50/30 transition">

                    {preview ? (
                      <img
                        src={preview}
                        alt="Product Preview"
                        className="max-h-72 w-full object-contain"
                      />
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl mb-4">
                          📷
                        </div>

                        <p className="font-semibold text-gray-700">
                          Click to upload image
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                          PNG, JPG, WEBP (Max 5MB)
                        </p>
                      </>
                    )}

                  </div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                {/* IMAGE DETAILS */}
                {imageFile && (
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">

                    <div className="overflow-hidden">
                      <p className="font-medium text-sm truncate">
                        {imageFile.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {(imageFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-red-500 text-sm font-semibold"
                    >
                      Remove
                    </button>

                  </div>
                )}

                {/* IMAGE STORAGE INFO */}
                <div className="bg-amber-50 rounded-xl p-4">

                  <p className="text-sm font-semibold text-amber-800">
                    Image Storage
                  </p>

                  <p className="text-xs text-amber-700 mt-2">
                    Your uploaded image will be saved inside
                    public/images automatically.
                  </p>

                </div>

              </div>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p className="mt-6 bg-red-50 text-red-600 rounded-xl p-4 text-sm">
                {error}
              </p>
            )}

            {/* FORM BUTTONS */}
            <div className="flex justify-end gap-4 border-t mt-10 pt-8">

              <button
                type="button"
                onClick={() => navigate("/view-products")}
                className="px-7 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Add Product"}
              </button>

            </div>

          </form>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-2xl">

            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl font-bold">
              ✓
            </div>

            <h2 className="text-2xl font-bold text-neutral-900">
              Product Added!
            </h2>

            <p className="text-gray-500 mt-3">
              <span className="font-semibold text-neutral-800">
                {addedProduct}
              </span>{" "}
              has been successfully added to your store.
            </p>

            {/* GENERATED PRODUCT CODE */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-5">
              <p className="text-xs text-amber-700 font-semibold">
                GENERATED PRODUCT CODE
              </p>

              <p className="text-2xl font-bold text-amber-800 mt-1 tracking-wider">
                {generatedCode}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-7">

              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/admin/products");
                }}
                className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700"
              >
                View Products
              </button>

              <button
                onClick={() => {
                  setShowPopup(false);
                  resetForm();
                }}
                className="w-full border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100"
              >
                Add Another Product
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default AddProduct;
