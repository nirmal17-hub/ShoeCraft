
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  X,
  Package,
  Boxes,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import Header from "./components/Header";

function Stock() {
  const API = "http://localhost:3000/products";
  const HISTORY_API = "http://localhost:3000/stockHistory";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [productCode, setProductCode] = useState("SHO-");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addQuantity, setAddQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Check JSON Server.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Stock Status
  const getStockStatus = (quantity) => {
    if (quantity <= 5) {
      return {
        label: "Low Stock",
        color: "bg-red-100 text-red-600",
        text: "text-red-600",
        dot: "bg-red-500",
        order: 1,
      };
    }

    if (quantity <= 10) {
      return {
        label: "Medium Stock",
        color: "bg-orange-100 text-orange-600",
        text: "text-orange-500",
        dot: "bg-orange-500",
        order: 2,
      };
    }

    return {
      label: "Good Stock",
      color: "bg-green-100 text-green-600",
      text: "text-green-600",
      dot: "bg-green-500",
      order: 3,
    };
  };

  // Search and Sort Products
  const sortedProducts = [...products]
    .filter((product) => {
      const name = product.name || "";

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        String(product.id).includes(search) ||
        String(product.productCode || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      const quantityA = Number(a.quantity) || 0;
      const quantityB = Number(b.quantity) || 0;

      return (
        getStockStatus(quantityA).order -
          getStockStatus(quantityB).order ||
        quantityA - quantityB
      );
    });

  // Summary Counts
  const lowStock = products.filter(
    (p) => (Number(p.quantity) || 0) <= 5
  ).length;

  const mediumStock = products.filter(
    (p) =>
      (Number(p.quantity) || 0) > 5 &&
      (Number(p.quantity) || 0) <= 10
  ).length;

  const goodStock = products.filter(
    (p) => (Number(p.quantity) || 0) > 10
  ).length;

  // Product Code Input - Fixed SHO- Prefix
  const handleProductCodeChange = (e) => {
    let value = e.target.value.toUpperCase();

    // Prevent removing the SHO- prefix
    if (!value.startsWith("SHO-")) {
      value = "SHO-" + value.replace(/^SHO-?/i, "");
    }

    setProductCode(value);
    setSearchError("");
  };

  // Search Product Using Product Code
  const handleProductSearch = (e) => {
    e.preventDefault();

    const code = productCode.trim().toUpperCase();

    if (!code || code === "SHO-") {
      setSearchError("Please enter the product number.");
      return;
    }

    setSearchError("");
    setSelectedProduct(null);
    setAddQuantity("");

    const foundProduct = products.find(
      (product) =>
        product.productCode?.trim().toUpperCase() === code
    );

    if (foundProduct) {
      openStockPopup(foundProduct);
    } else {
      setSearchError(`No product found with code ${code}`);
    }
  };

  // Open Stock Popup From Inventory Table
  const openStockPopup = (product) => {
    setSelectedProduct(product);
    setAddQuantity("");
    setError("");
  };

  // Close Popup
  const closePopup = () => {
    setSelectedProduct(null);
    setAddQuantity("");
    setError("");
  };

  // Update Stock and Save History
  const handleUpdateStock = async (e) => {
    e.preventDefault();

    const amount = Number(addQuantity);

    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const currentQuantity =
        Number(selectedProduct.quantity) || 0;

      // Update Product Stock
      const response = await fetch(
        `${API}/${selectedProduct.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: currentQuantity + amount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Stock update failed");
      }

      const updatedProduct = await response.json();

      // Save Stock History
      const now = new Date();

      const historyResponse = await fetch(HISTORY_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: amount,
          date: now.toLocaleDateString(),
          timestamp: now.toISOString(),
        }),
      });

      if (!historyResponse.ok) {
        throw new Error("Stock history could not be saved");
      }

      // Update Local Product List
      setProducts((prev) =>
        prev.map((product) =>
          String(product.id) === String(updatedProduct.id)
            ? updatedProduct
            : product
        )
      );

      closePopup();
      setProductCode("SHO-");
      setSearchError("");

    } catch (err) {
      console.error(err);
      setError(
        "Unable to complete stock update or save history. Please check your database."
      );
      fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Header />

      <main className="ml-64 pt-20 min-h-screen p-6 md:p-8">

        {/* PAGE HEADING */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stock Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor and manage your product inventory
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
            <Boxes size={19} className="text-amber-500" />
            <span className="text-sm font-semibold text-gray-700">
              {products.length} Products
            </span>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-7">

          {/* LOW STOCK */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <h2 className="text-3xl font-bold text-red-600 mt-3">
                  {lowStock}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  5 or fewer units
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle size={23} className="text-red-500" />
              </div>
            </div>
          </div>

          {/* MEDIUM STOCK */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Medium Stock</p>
                <h2 className="text-3xl font-bold text-orange-500 mt-3">
                  {mediumStock}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  6–10 units
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <Package size={23} className="text-orange-500" />
              </div>
            </div>
          </div>

          {/* GOOD STOCK */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Good Stock</p>
                <h2 className="text-3xl font-bold text-green-600 mt-3">
                  {goodStock}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Above 10 units
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle size={23} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* QUICK STOCK UPDATE */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
              <Package size={22} className="text-amber-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Quick Stock Update
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter a product code to find and update stock
              </p>
            </div>
          </div>

          <form
            onSubmit={handleProductSearch}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={productCode}
                onChange={handleProductCodeChange}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    e.currentTarget.selectionStart <= 4 &&
                    e.currentTarget.selectionEnd <= 4
                  ) {
                    e.preventDefault();
                  }
                }}
                onClick={(e) => {
                  if (e.currentTarget.selectionStart < 4) {
                    e.currentTarget.setSelectionRange(4, 4);
                  }
                }}
                placeholder="SHO-001"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 uppercase"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-gray-900 hover:bg-amber-500 text-white rounded-xl font-semibold text-sm transition"
            >
              Search Product
            </button>
          </form>

          {searchError && (
            <p className="mt-3 text-sm text-red-500">
              {searchError}
            </p>
          )}
        </div>

        {/* PRODUCT INVENTORY */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Product Inventory
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Low stock products appear first
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search product or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          {error && !selectedProduct && (
            <div className="mx-5 mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase text-gray-500">
                  <th className="px-6 py-4 font-semibold">Product Code</th>
                  <th className="px-6 py-4 font-semibold">Product Name</th>
                  <th className="px-6 py-4 font-semibold">Quantity</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {sortedProducts.map((product) => {
                  const quantity = Number(product.quantity) || 0;
                  const status = getStockStatus(quantity);

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                        {product.productCode || `#${product.id}`}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-gray-800">
                          {product.name || "Unnamed Product"}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`text-lg font-bold ${status.text}`}>
                          {quantity}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          units
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => openStockPopup(product)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition"
                        >
                          <Plus size={15} />
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {sortedProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-16 text-gray-400 text-sm">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* UPDATE STOCK POPUP */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              closePopup();
            }
          }}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Update Stock
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Add quantity to existing inventory
                </p>
              </div>

              <button
                type="button"
                onClick={closePopup}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="p-6">
              {/* PRODUCT IMAGE AND DETAILS */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Package size={35} className="text-gray-300" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Product Code</p>
                    <p className="font-bold text-amber-600">
                      {selectedProduct.productCode || `#${selectedProduct.id}`}
                    </p>
                    <p className="font-semibold text-gray-800 mt-2 break-words">
                      {selectedProduct.name}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <p className="text-xs text-gray-400">Current Quantity</p>
                  <p className="text-2xl font-bold text-amber-500 mt-1">
                    {Number(selectedProduct.quantity) || 0} units
                  </p>
                </div>
              </div>

              {/* ADD STOCK INPUT */}
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add Stock Quantity
              </label>

              <input
                type="number"
                min="1"
                step="1"
                required
                autoFocus
                placeholder="Enter quantity to add"
                value={addQuantity}
                onChange={(e) => setAddQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />

              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}

              {/* NEW STOCK PREVIEW */}
              {addQuantity &&
                Number.isInteger(Number(addQuantity)) &&
                Number(addQuantity) > 0 && (
                  <div className="mt-4 bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-green-700">
                      New stock quantity
                    </p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {(Number(selectedProduct.quantity) || 0) +
                        Number(addQuantity)} units
                    </p>
                  </div>
                )}

              {/* BUTTONS */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closePopup}
                  disabled={loading}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition"
                >
                  {loading ? "Updating..." : "Add Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;
