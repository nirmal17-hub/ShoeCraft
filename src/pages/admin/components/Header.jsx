
import React, { useState, useEffect } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ChartNoAxesCombined,
  Settings,
  ChevronDown,
  Bell,
  Search,
  Footprints,
  UserRound,
  LogOut,
  Boxes,
  CircleAlert,
  History,
  AlertTriangle,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // DROPDOWN STATES
  const isProductPage =
    location.pathname === "/add-products" ||
    location.pathname.startsWith("/view-products");

  const isStockPage =
    location.pathname === "/stock-management" ||
    location.pathname === "/stock-history";

  const [productOpen, setProductOpen] = useState(isProductPage);
  const [stockOpen, setStockOpen] = useState(isStockPage);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // STOCK NOTIFICATIONS
  const [stockNotifications, setStockNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [notificationError, setNotificationError] = useState("");

  // FETCH LOW AND MEDIUM STOCK PRODUCTS
  useEffect(() => {
    let isMounted = true;

    const fetchStockNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stock details");
        }

        const products = await response.json();

        if (!isMounted) return;

        const notifications = products
          .filter((product) => {
            const quantity = Number(product.quantity);
            return Number.isFinite(quantity) && quantity <= 10;
          })
          .sort((a, b) => {
            return Number(a.quantity) - Number(b.quantity);
          });

        setStockNotifications(notifications);
        setNotificationError("");
      } catch (error) {
        if (isMounted) {
          setNotificationError("Unable to load stock notifications.");
        }
      } finally {
        if (isMounted) {
          setNotificationLoading(false);
        }
      }
    };

    fetchStockNotifications();

    // Refresh stock notifications every 30 seconds
    const interval = setInterval(fetchStockNotifications, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // REDIRECT IF USER NOT AVAILABLE
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // CLOSE DROPDOWNS ON PAGE CHANGE
  useEffect(() => {
    setProductOpen(isProductPage);
    setStockOpen(isStockPage);
    setProfileOpen(false);
    setNotificationOpen(false);
  }, [location.pathname, isProductPage, isStockPage]);

  // SIDEBAR MENU ITEMS
  const menuItems = [
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Customers",
      path: "/view-customers",
      icon: Users,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Issues",
      path: "/admin/issues",
      icon: CircleAlert,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  // PAGE TITLES
  const pageNames = {
    "/dashboard": "Dashboard",
    "/add-products": "Add Product",
    "/view-products": "View Products",
    "/admin/orders": "Orders",
    "/view-customers": "Customers",
    "/admin/notifications": "Notifications",
    "/stock-management": "Update Stock",
    "/stock-history": "Stock Update History",
    "/admin/reports": "Reports",
    "/admin/issues": "Issues",
    "/admin/settings": "Settings",
  };

  const title =
    pageNames[location.pathname] ||
    location.pathname.split("/").pop().replaceAll("-", " ");

  const formattedTitle =
    title.charAt(0).toUpperCase() + title.slice(1);

  // NAVIGATION STYLE
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl mb-1 transition-all duration-200 ${
      isActive
        ? "bg-amber-500 text-neutral-950 font-semibold shadow-lg shadow-amber-500/10"
        : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
    }`;

  // PREVENT RENDERING WITHOUT USER
  if (!user) return null;

  return (
    <>
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#171717] text-white flex flex-col z-50">

        {/* LOGO */}
        <div className="h-24 px-7 flex items-center border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center">
              <Footprints size={25} className="text-black" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-wider">
                SHOE<span className="text-amber-400">CRAFT</span>
              </h1>

              <p className="text-[10px] text-gray-500 tracking-[3px] mt-1">
                ADMIN PANEL
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-7 overflow-y-auto custom-scrollbar">

          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] px-4 mb-4">
            Main Menu
          </p>

          {/* DASHBOARD */}
          <NavLink to="/dashboard" end className={navClass}>
            <LayoutDashboard size={19} />
            <span className="text-sm">Dashboard</span>
          </NavLink>

          {/* PRODUCTS DROPDOWN */}
          <div className="mb-1">
            <button
              onClick={() => {
                setProductOpen((prev) => !prev);
                setStockOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isProductPage
                  ? "text-amber-400 bg-white/[0.04]"
                  : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={19} />
                <span className="text-sm font-semibold">
                  Products
                </span>
              </div>

              <ChevronDown
                size={17}
                className={`transition-transform duration-200 ${
                  productOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                productOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="ml-6 mt-1 mb-2 pl-4 border-l border-white/10">

                  <NavLink
                    to="/view-products"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                        isActive
                          ? "text-amber-400 bg-amber-400/10 font-semibold"
                          : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    View Products
                  </NavLink>

                  <NavLink
                    to="/add-products"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                        isActive
                          ? "text-amber-400 bg-amber-400/10 font-semibold"
                          : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Add Product
                  </NavLink>

                </div>
              </div>
            </div>
          </div>

          {/* STOCK DROPDOWN */}
          <div className="mb-1">
            <button
              onClick={() => {
                setStockOpen((prev) => !prev);
                setProductOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isStockPage
                  ? "text-amber-400 bg-white/[0.04]"
                  : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes size={19} />
                <span className="text-sm font-semibold">
                  Stock
                </span>
              </div>

              <ChevronDown
                size={17}
                className={`transition-transform duration-200 ${
                  stockOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                stockOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="ml-6 mt-1 mb-2 pl-4 border-l border-white/10">

                  <NavLink
                    to="/stock-management"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                        isActive
                          ? "text-amber-400 bg-amber-400/10 font-semibold"
                          : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    Update Stock
                  </NavLink>

                  <NavLink
                    to="/stock-history"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                        isActive
                          ? "text-amber-400 bg-amber-400/10 font-semibold"
                          : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
                      }`
                    }
                  >
                    <History size={15} />
                    Stock Update History
                  </NavLink>

                </div>
              </div>
            </div>
          </div>

          {/* MANAGEMENT */}
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] px-4 mt-8 mb-4">
            Management
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end
                className={navClass}
              >
                <Icon size={19} />
                <span className="text-sm">{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

        {/* SIDEBAR ADMIN PROFILE */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04]">

            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user.name}
              </p>

              <p className="text-xs text-gray-500">
                {user.role}
              </p>
            </div>

            <Settings size={17} className="text-gray-500" />
          </div>
        </div>
      </aside>

      {/* TOP NAVBAR */}
      <header className="ml-64 h-[76px] bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30">

        {/* PAGE TITLE */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>SHOECRAFT</span>
            <span>/</span>

            <span className="text-amber-600 font-semibold">
              {formattedTitle}
            </span>
          </div>

          <h2 className="text-xl font-bold text-neutral-900">
            {formattedTitle}
          </h2>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">

          {/* SEARCH */}
          <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400">
            <Search size={17} />
            <span className="text-sm">Search...</span>
          </div>

          {/* NOTIFICATION BELL AND HOVER DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setNotificationOpen(true)}
            onMouseLeave={() => setNotificationOpen(false)}
          >
            <button
              type="button"
              onClick={() => setNotificationOpen((prev) => !prev)}
              onFocus={() => setNotificationOpen(true)}
              aria-label="Stock notifications"
              aria-expanded={notificationOpen}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition ${
                notificationOpen
                  ? "bg-amber-50 text-amber-600"
                  : "bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <Bell size={19} />

              {stockNotifications.length > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white">
                    {stockNotifications.length > 99
                      ? "99+"
                      : stockNotifications.length}
                  </span>
                </>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {notificationOpen && (
              <div
                className="absolute right-0 top-full mt-3 w-[360px] sm:w-[400px] rounded-2xl bg-white shadow-2xl border border-gray-100 z-[100] overflow-hidden"
                onMouseEnter={() => setNotificationOpen(true)}
              >
                {/* DROPDOWN HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Stock Notifications
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      Products requiring stock attention
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Bell size={19} />
                  </div>
                </div>

                {/* NOTIFICATION COUNT */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500">
                    STOCK ALERTS
                  </span>

                  <span className="text-xs font-bold text-red-600">
                    {stockNotifications.length} Products
                  </span>
                </div>

                {/* NOTIFICATION CONTENT */}
                <div className="max-h-[360px] overflow-y-auto">

                  {notificationLoading ? (
                    <div className="flex flex-col items-center py-10">
                      <RefreshCw
                        size={23}
                        className="animate-spin text-amber-500"
                      />
                      <p className="mt-3 text-sm text-gray-400">
                        Loading notifications...
                      </p>
                    </div>
                  ) : notificationError ? (
                    <div className="px-5 py-10 text-center">
                      <AlertTriangle
                        size={28}
                        className="mx-auto text-red-400"
                      />
                      <p className="mt-3 text-sm text-red-500">
                        {notificationError}
                      </p>
                    </div>
                  ) : stockNotifications.length === 0 ? (
                    <div className="flex flex-col items-center py-10 px-5">
                      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <PackageCheck size={28} />
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-800">
                        All Stock Levels Are Good
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        No low or medium stock products.
                      </p>
                    </div>
                  ) : (
                    stockNotifications.map((product) => {
                      const quantity = Number(product.quantity);
                      const isLowStock = quantity <= 5;

                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setNotificationOpen(false);
                            navigate("/stock-management");
                          }}
                          className="w-full flex items-center gap-3 px-5 py-4 text-left border-b border-gray-50 hover:bg-gray-50 transition"
                        >
                          {/* STATUS ICON */}
                          <div
                            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                              isLowStock
                                ? "bg-red-50 text-red-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            <AlertTriangle size={19} />
                          </div>

                          {/* PRODUCT DETAILS */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {product.productCode || "No product code"}
                            </p>

                            <span
                              className={`inline-block mt-2 rounded-md px-2 py-1 text-[10px] font-bold ${
                                isLowStock
                                  ? "bg-red-50 text-red-600"
                                  : "bg-orange-50 text-orange-600"
                              }`}
                            >
                              {isLowStock ? "LOW STOCK" : "MEDIUM STOCK"}
                            </span>
                          </div>

                          {/* QUANTITY */}
                          <div className="text-right shrink-0">
                            <p
                              className={`text-xl font-black ${
                                isLowStock
                                  ? "text-red-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {quantity}
                            </p>

                            <p className="text-[10px] text-gray-400">
                              Available
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* DROPDOWN FOOTER */}
                <div className="p-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate("/stock-management");
                    }}
                    className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition"
                  >
                    Manage Stock
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative border-l border-gray-200 pl-5">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 transition"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-800">
                  {user.name}
                </p>

                <p className="text-xs text-gray-400">
                  {user.email}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-neutral-900 text-amber-400 flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase() || "N"}
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* PROFILE DROPDOWN CONTENT */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100]">

                <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500 truncate mt-1">
                    {user.email}
                  </p>

                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-1 rounded-md">
                    {user.role}
                  </span>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/settings");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
                  >
                    <UserRound size={17} />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/logout");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>

                <div className="px-5 py-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400">
                    SHOECRAFT ADMIN PANEL
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
