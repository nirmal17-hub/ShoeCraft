
import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ShoppingCart,
  UserRound,
  ChevronDown,
  Package,
  Lock,
  MessageCircle,
  LogOut,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", updateUser);
    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);

    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "Categories", path: "/category" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-20 w-full items-center justify-between px-6 md:px-10 lg:px-12">

        {/* LOGO */}
        <Link to="/" className="shrink-0">
          <h1 className="text-2xl font-black tracking-wider text-gray-900">
            SHOE<span className="text-amber-700">CRAFT</span>
          </h1>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? "text-amber-700"
                  : "text-gray-800 hover:text-amber-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex shrink-0 items-center gap-4">

          {!user ? (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-amber-700 hover:text-amber-700"
              >
                Login
              </Link>

              {/* SIGN UP */}
              <Link
                to="/register"
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* PROFILE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                    <UserRound size={18} />
                  </div>

                  <span className="max-w-24 truncate text-sm font-semibold text-gray-800">
                    {user.name || "User"}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <UserRound size={17} />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <Package size={17} />
                      My Orders
                    </Link>

                    <Link
                      to="/change-password"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <Lock size={17} />
                      Change Password
                    </Link>

                    <Link
                      to="/enquiries"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <MessageCircle size={17} />
                      Enquiries
                    </Link>

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* CART */}
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                <ShoppingCart size={18} />
                Cart
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
