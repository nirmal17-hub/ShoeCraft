
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserRound,
  Package,
  Lock,
  MessageCircle,
  LogOut,
  Mail,
  Phone,
  Edit3,
  ShieldCheck,
  ChevronRight,
  Save,
  X,
} from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL
  // Fetch latest user details from JSON Server
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        if (!loggedUser?.id) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          `http://localhost:3000/users/${loggedUser.id}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch user details.");
        }

        const data = await response.json();

        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");

        // Update localStorage with latest database information
        localStorage.setItem("user", JSON.stringify(data));

        window.dispatchEvent(new Event("userChanged"));
      } catch (error) {
        console.error("Profile fetch error:", error);
        setMessage("Unable to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Edit profile
  const handleEdit = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setMessage("");
    setEdit(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setEdit(false);
    setMessage("");
  };

  // Save profile
  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `http://localhost:3000/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const updatedUser = await response.json();

      setUser(updatedUser);
      setName(updatedUser.name || "");
      setEmail(updatedUser.email || "");
      setPhone(updatedUser.phone || "");

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      window.dispatchEvent(new Event("userChanged"));

      setEdit(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-500"></div>
            <p className="mt-4 text-sm text-gray-500">
              Loading your profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">{message || "Unable to load profile."}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 rounded-xl bg-black px-6 py-3 text-white"
            >
              Login Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const firstLetter = (user.name || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full bg-[#f7f7f5] flex flex-col">

      <Header />

      {/* Profile Banner */}
      <section className="relative w-full overflow-hidden bg-[#171717] px-4 py-12 sm:px-8 lg:px-12 xl:px-16 md:py-16">

        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl"></div>

        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5 sm:gap-7">

            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-amber-500/30 bg-amber-500 text-3xl font-bold text-black sm:h-28 sm:w-28 sm:text-5xl">
              {firstLetter}

              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-[#171717] bg-green-500"></span>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                My Account
              </p>

              <h1 className="text-2xl font-bold text-white sm:text-4xl">
                Hello, {user.name}
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Manage your personal information and account settings.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-green-500/10 px-4 py-1.5 text-xs font-medium text-green-400">
                  ● Active Account
                </span>

                <span className="text-xs text-gray-400">
                  Customer ID: #{user.id}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </section>

      {/* Main Profile Layout */}
      <main className="w-full flex-1 px-4 py-8 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">

        <div className="grid w-full grid-cols-1 gap-7 lg:grid-cols-12">

          {/* Sidebar */}
          <aside className="lg:col-span-3">

            <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-400">
                Account Menu
              </h2>

              <div className="space-y-2">

                <Link
                  to="/profile"
                  className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-700"
                >
                  <span className="flex items-center gap-3">
                    <UserRound size={19} />
                    Personal Information
                  </span>
                  <ChevronRight size={17} />
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black"
                >
                  <Package size={19} />
                  My Orders
                </Link>

                <Link
                  to="/change-password"
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black"
                >
                  <Lock size={19} />
                  Change Password
                </Link>

                <Link
                  to="/enquiries"
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black"
                >
                  <MessageCircle size={19} />
                  My Enquiries
                </Link>

              </div>

              <div className="my-5 border-t border-gray-100"></div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>

            </div>

            {/* Support Card */}
            <div className="mt-6 rounded-2xl bg-[#171717] p-6 text-white">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-black">
                <MessageCircle size={22} />
              </div>

              <h3 className="text-lg font-bold">Need Help?</h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Have questions about your orders or account?
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                Contact Support
                <ChevronRight size={16} />
              </Link>

            </div>
          </aside>

          {/* Profile Information */}
          <section className="lg:col-span-9">

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* Section Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    View and update your personal details.
                  </p>
                </div>

                {!edit && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-black"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}

              </div>

              {/* Form */}
              <div className="p-5 sm:p-8 lg:p-10">

                <div className="mb-8 flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <UserRound size={27} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Account Details
                    </h3>

                    <p className="text-sm text-gray-500">
                      Your registered account information
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={name}
                        disabled={!edit}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:bg-white disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={email}
                        disabled={!edit}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:bg-white disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="tel"
                        value={phone}
                        disabled={!edit}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:bg-white disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Customer ID */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Customer ID
                    </label>

                    <div className="relative">
                      <ShieldCheck
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={`#${user.id}`}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 py-4 pl-12 pr-4 text-sm text-gray-500"
                      />
                    </div>
                  </div>

                </div>

                {/* Message */}
                {message && (
                  <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {message}
                  </p>
                )}

                {/* Buttons */}
                {edit && (
                  <div className="mt-9 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">

                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={17} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                  </div>
                )}

              </div>
            </div>

            {/* Security Information */}
            <div className="mt-7 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Account Security
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Keep your account secure by updating your password regularly.
                  </p>
                </div>

              </div>

              <Link
                to="/change-password"
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-amber-500 hover:text-amber-600"
              >
                Change Password
                <ChevronRight size={17} />
              </Link>

            </div>

          </section>
        </div>
      </main>

      <Footer />

    </div>
  );
}

export default Profile;
