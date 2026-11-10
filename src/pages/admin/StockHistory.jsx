
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  History,
  Package,
  Boxes,
  CalendarDays,
  Clock,
  RefreshCw,
  Filter,
  TrendingUp,
} from "lucide-react";

import Header from "./components/Header";

function StockHistory() {
  const API = "http://localhost:3000";

  const [history, setHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get date in YYYY-MM-DD format using local time
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Convert history date into YYYY-MM-DD
  const getHistoryDate = (item) => {
    if (item.timestamp) {
      const date = new Date(item.timestamp);

      if (!Number.isNaN(date.getTime())) {
        return getDateKey(date);
      }
    }

    // Fallback for dates stored as DD/MM/YYYY
    if (item.date) {
      const parts = item.date.split("/");

      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
      }
    }

    return "";
  };

  // Format date for display
  const formatDate = (item) => {
    const dateKey = getHistoryDate(item);

    if (!dateKey) return item.date || "N/A";

    const date = new Date(`${dateKey}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fetch stock history and products
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [historyResponse, productsResponse] = await Promise.all([
        fetch(`${API}/stockHistory`),
        fetch(`${API}/products`),
      ]);

      if (!historyResponse.ok || !productsResponse.ok) {
        throw new Error("Unable to fetch stock history.");
      }

      const historyData = await historyResponse.json();
      const productsData = await productsResponse.json();

      const sortedHistory = historyData.sort((a, b) => {
        return (
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime()
        );
      });

      setHistory(sortedHistory);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Find product using productId
  const getProduct = (productId) => {
    return products.find(
      (product) => String(product.id) === String(productId)
    );
  };

  // Search and date filtering
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const product = getProduct(item.productId);

      const searchText = search.toLowerCase().trim();

      const searchMatch =
        !searchText ||
        String(item.id || "").toLowerCase().includes(searchText) ||
        String(item.productId || "").toLowerCase().includes(searchText) ||
        String(product?.name || "").toLowerCase().includes(searchText) ||
        String(product?.productCode || "").toLowerCase().includes(searchText);

      const itemDate = getHistoryDate(item);

      const fromMatch = !fromDate || itemDate >= fromDate;
      const toMatch = !toDate || itemDate <= toDate;

      return searchMatch && fromMatch && toMatch;
    });
  }, [history, products, search, fromDate, toDate]);

  // Summary values based on filtered records
  const totalUpdates = filteredHistory.length;

  const totalStockAdded = filteredHistory.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const today = getDateKey(new Date());

  const todayUpdates = filteredHistory.filter(
    (item) => getHistoryDate(item) === today
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="ml-64 px-8 pb-10 pt-24">
        {/* Page Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-600">
              <History size={17} />
              INVENTORY MANAGEMENT
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Stock Update History
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Track all stock additions and their update details.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Updates
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {totalUpdates}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-blue-600">
                <History size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Records matching your filters
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Stock Added
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {totalStockAdded.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="rounded-xl bg-green-50 p-4 text-green-600">
                <Boxes size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Total quantity added
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Today's Updates
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {todayUpdates}
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-4 text-amber-600">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Updates made today
            </p>
          </div>
        </div>

        {/* Search and Date Filters */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Filter size={18} className="text-amber-600" />
            <h2 className="font-bold text-gray-800">
              Filter Stock History
            </h2>
          </div>

          <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Search
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-amber-500">
                <Search size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Search product name, code or update ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* From Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              {fromDate || toDate
                ? `Showing records ${
                    fromDate ? `from ${fromDate}` : ""
                  } ${toDate ? `to ${toDate}` : ""}`
                : "Select a date range to filter stock updates."}
            </p>

            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                setSearch("");
              }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* History Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="font-bold text-gray-900">
                Stock Update Records
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Complete history of stock additions
              </p>
            </div>

            <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
              {filteredHistory.length} Records
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw
                size={30}
                className="animate-spin text-amber-500"
              />
              <p className="mt-3 text-sm text-gray-500">
                Loading stock history...
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="rounded-full bg-gray-100 p-5">
                <Package size={30} className="text-gray-400" />
              </div>

              <h3 className="mt-4 font-bold text-gray-700">
                No Stock History Found
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Try changing your search or date filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Product Details
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Product Code
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Quantity Added
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredHistory.map((item) => {
                    const product = getProduct(item.productId);

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-gray-50"
                      >

                        {/* Product Details */}
                        <td className="px-6 py-5">
                          {product ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-xl border border-gray-100 bg-gray-50 object-cover"
                              />

                              <div>
                                <p className="font-semibold text-gray-800">
                                  {product.name}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  Product details
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Product not found
                            </span>
                          )}
                        </td>

                        {/* Product Code */}
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-amber-600">
                            {product?.productCode || "N/A"}
                          </span>
                        </td>

                        {/* Quantity Added */}
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-sm font-bold text-green-700">
                            <TrendingUp size={15} />
                            +{Number(item.quantity || 0)}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays
                              size={15}
                              className="text-gray-400"
                            />
                            {formatDate(item)}
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock
                              size={15}
                              className="text-gray-400"
                            />
                            {formatTime(item.timestamp)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredHistory.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {filteredHistory.length} of {history.length} stock
                update records
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StockHistory;
