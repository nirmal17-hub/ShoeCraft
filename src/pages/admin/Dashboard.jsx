
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  RefreshCw,
  Boxes,
  CheckCircle2,
  XCircle,
  Activity,
  Plus,
  ShoppingBag,
  Clock3,
} from "lucide-react";

import Header from "./components/Header";

const API = "http://localhost:3000";

const COLORS = [
  "#D97706",
  "#27272A",
  "#64748B",
  "#A1A1AA",
  "#F59E0B",
  "#78716C",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [usersRes, productsRes, cartRes] = await Promise.all([
        fetch(`${API}/users`),
        fetch(`${API}/products`),
        fetch(`${API}/cart`),
      ]);

      if (!usersRes.ok || !productsRes.ok || !cartRes.ok) {
        throw new Error("Unable to load dashboard data");
      }

      const [usersData, productsData, cartData] = await Promise.all([
        usersRes.json(),
        productsRes.json(),
        cartRes.json(),
      ]);

      setUsers(usersData);
      setProducts(productsData);
      setCart(cartData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // USER STATISTICS
  const customers = users.filter(
    (user) => user.role === "user"
  );

  const admins = users.filter(
    (user) => user.role === "admin"
  );

  // PRODUCT STATISTICS
  const activeProducts = products.filter(
    (product) => Number(product.status) === 1
  );

  const unavailableProducts = products.filter(
    (product) => Number(product.status) === 0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity) > 0 &&
      Number(product.quantity) <= 10
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.quantity) === 0
  );

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.quantity || 0),
    0
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0
  );

  // CATEGORY PIE CHART
  const categoryData = useMemo(() => {
    const categories = {};

    products.forEach((product) => {
      const category = product.category || "Other";

      categories[category] =
        (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [products]);

  // INVENTORY PIE CHART
  const inventoryData = [
    {
      name: "Available",
      value: activeProducts.length,
    },
    {
      name: "Unavailable",
      value: unavailableProducts.length,
    },
  ];

  // CART ACTIVITY
  const cartActivity = useMemo(() => {
    const activity = {};

    cart.forEach((item) => {
      const product = products.find(
        (product) =>
          String(product.id) === String(item.productId)
      );

      const name = product?.name || `Product ${item.productId}`;

      activity[name] =
        (activity[name] || 0) +
        Number(item.quantity || 0);
    });

    return Object.entries(activity)
      .map(([name, quantity]) => ({
        name:
          name.length > 13
            ? name.slice(0, 13) + "..."
            : name,
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [cart, products]);

  // CALENDAR
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    ),
  ];

  const today = new Date();

  function changeMonth(direction) {
    setCurrentDate(
      new Date(year, month + direction, 1)
    );
  }

  const stats = [
    {
      label: "Total Customers",
      value: customers.length,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: `${admins.length} admin account(s)`,
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-amber-50 text-amber-600",
      description: `${activeProducts.length} currently available`,
    },
    {
      label: "Cart Items",
      value: cart.length,
      icon: ShoppingCart,
      color: "bg-purple-50 text-purple-600",
      description: `${cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      )} total units in carts`,
    },
    {
      label: "Inventory Value",
      value: formatCurrency(inventoryValue),
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
      description: "Current price × available quantity",
    },
  ];

  return (
    <>
      <Header />

      <main className="ml-64 min-h-screen bg-[#F7F8FA] p-6 lg:p-8">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

          <div>
            <p className="text-xs font-bold tracking-[2px] uppercase text-amber-600 mb-2">
              Store Overview
            </p>

            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Monitor your store performance and inventory.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <Link
              to="/add-products"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-amber-600 transition"
            >
              <Plus size={17} />
              Add Product
            </Link>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center">
            <RefreshCw
              className="animate-spin mx-auto text-amber-600 mb-4"
              size={30}
            />
            <p className="text-gray-500 font-medium">
              Loading dashboard...
            </p>
          </div>
        ) : (
          <>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-500">
                        {item.label}
                      </p>

                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon size={21} />
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-neutral-900 mt-5">
                      {item.value}
                    </h2>

                    <p className="text-xs text-gray-400 mt-2">
                      {item.description}
                    </p>
                  </div>
                );
              })}

            </div>

            {/* SALES REPORT + CALENDAR */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">

              {/* SALES REPORT */}
              <section className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                      Sales Report
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Revenue performance overview
                    </p>
                  </div>

                  <span className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-500">
                    No sales data available
                  </span>

                </div>

                <div className="h-[270px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">

                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4">
                    <TrendingUp
                      size={25}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="font-bold text-gray-700">
                    Sales data will appear here
                  </h3>

                  <p className="text-sm text-gray-400 text-center max-w-sm mt-2 px-4">
                    Add an orders collection with order totals and dates to generate daily, weekly and monthly sales graphs.
                  </p>

                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ₹0
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400">
                      Total Orders
                    </p>
                    <p className="text-lg font-bold mt-2">
                      0
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400">
                      Average Order
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ₹0
                    </p>
                  </div>

                </div>
              </section>

              {/* CALENDAR */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                      Calendar
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Monthly overview
                    </p>
                  </div>

                  <CalendarDays
                    size={21}
                    className="text-amber-600"
                  />

                </div>

                <div className="flex items-center justify-between mb-5">

                  <button
                    onClick={() => changeMonth(-1)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    ‹
                  </button>

                  <h3 className="font-bold text-sm">
                    {monthName}
                  </h3>

                  <button
                    onClick={() => changeMonth(1)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    ›
                  </button>

                </div>

                <div className="grid grid-cols-7 text-center gap-y-3">

                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-xs font-bold text-gray-400"
                      >
                        {day}
                      </div>
                    )
                  )}

                  {calendarDays.map((day, index) => {
                    const isToday =
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-center"
                      >
                        {day ? (
                          <span
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium ${
                              isToday
                                ? "bg-amber-500 text-black font-bold"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {day}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}

                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-xs text-gray-500">
                      Today's date
                    </p>
                  </div>

                  <p className="font-bold text-sm mt-3">
                    {today.toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    No scheduled store events.
                  </p>
                </div>

              </section>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">

              {/* CATEGORY PIE */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6">

                <div className="mb-5">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Products by Category
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Product distribution across categories
                  </p>
                </div>

                {categoryData.length > 0 ? (
                  <div className="flex flex-col sm:flex-row items-center gap-5">

                    <div className="w-full sm:w-1/2 h-[230px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={58}
                            outerRadius={90}
                            paddingAngle={4}
                          >
                            {categoryData.map((item, index) => (
                              <Cell
                                key={item.name}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>

                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full sm:w-1/2 space-y-4">
                      {categoryData.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="text-xs text-gray-600 truncate">
                              {item.name}
                            </span>
                          </div>

                          <span className="text-sm font-bold">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-20 text-center">
                    No category data available.
                  </p>
                )}

              </section>

              {/* INVENTORY PIE */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6">

                <div className="mb-5">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Product Availability
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Available and unavailable products
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">

                  <div className="w-full sm:w-1/2 h-[230px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={inventoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={58}
                          outerRadius={90}
                          paddingAngle={5}
                        >
                          <Cell fill="#16A34A" />
                          <Cell fill="#DC2626" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="w-full sm:w-1/2 space-y-5">

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle2
                          size={17}
                          className="text-green-600"
                        />
                        Available
                      </div>
                      <p className="text-2xl font-black mt-1">
                        {activeProducts.length}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <XCircle
                          size={17}
                          className="text-red-500"
                        />
                        Unavailable
                      </div>
                      <p className="text-2xl font-black mt-1">
                        {unavailableProducts.length}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Total inventory units
                      </p>
                      <p className="text-xl font-bold mt-1">
                        {totalStock}
                      </p>
                    </div>

                  </div>
                </div>
              </section>

            </div>

            {/* CART ACTIVITY + STOCK ALERTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-7">

              {/* CART ACTIVITY */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6">

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Cart Activity
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Product quantities currently recorded in carts
                  </p>
                </div>

                {cartActivity.length > 0 ? (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cartActivity}
                        margin={{
                          top: 10,
                          right: 10,
                          left: -20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="quantity"
                          name="Cart Quantity"
                          fill="#D97706"
                          radius={[6, 6, 0, 0]}
                          barSize={45}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-20 text-center">
                    No cart activity available.
                  </p>
                )}

              </section>

              {/* STOCK ALERTS */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <h2 className="text-lg font-bold text-neutral-900">
                      Inventory Alerts
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Products that need attention
                    </p>
                  </div>

                  <AlertTriangle
                    size={21}
                    className="text-amber-500"
                  />

                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">

                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-xs text-amber-700">
                      Low Stock
                    </p>
                    <p className="text-3xl font-black text-amber-700 mt-2">
                      {lowStockProducts.length}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-xs text-red-700">
                      Out of Stock
                    </p>
                    <p className="text-3xl font-black text-red-700 mt-2">
                      {outOfStockProducts.length}
                    </p>
                  </div>

                </div>

                <div className="space-y-3 max-h-[190px] overflow-y-auto">

                  {[
                    ...lowStockProducts,
                    ...outOfStockProducts,
                  ].length > 0 ? (
                    [
                      ...lowStockProducts,
                      ...outOfStockProducts,
                    ].map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {product.category}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 text-xs font-bold px-3 py-2 rounded-lg ${
                            Number(product.quantity) === 0
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {product.quantity} left
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2
                        size={30}
                        className="mx-auto text-green-500 mb-2"
                      />
                      <p className="text-sm font-semibold text-gray-600">
                        All stock levels look good
                      </p>
                    </div>
                  )}

                </div>

              </section>
            </div>

            {/* BOTTOM SUMMARY */}
            <section className="bg-neutral-900 text-white rounded-2xl p-6 lg:p-8">

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                <div>
                  <p className="text-xs uppercase tracking-[2px] text-amber-400 font-bold">
                    ShoeCraft Overview
                  </p>

                  <h2 className="text-2xl font-black mt-3">
                    Your store at a glance.
                  </h2>

                  <p className="text-sm text-gray-400 mt-2">
                    Keep track of products, customers and inventory from one place.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">

                  <div>
                    <p className="text-xs text-gray-400">
                      Customers
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      {customers.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Products
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      {products.length}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Cart Records
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      {cart.length}
                    </p>
                  </div>

                </div>

              </div>
            </section>

          </>
        )}
      </main>
    </>
  );
}

export default Dashboard;
