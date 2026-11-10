
import React, { useEffect, useState } from "react";
import Header from "./components/Header";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch customers
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        return response.json();
      })
      .then((data) => {
        const customerList = data.filter(
          (user) => user.role === "user"
        );

        setCustomers(customerList);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Search customers
  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const phoneCount = customers.filter(
    (customer) => customer.phone
  ).length;

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Header />

      {/* Main Content */}
      <main className="ml-64 px-6 pt-8 pb-8 min-h-screen">

        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

          <div>
            <p className="text-sm text-neutral-500 mb-1">
              Dashboard / Customers
            </p>

            <h1 className="text-3xl font-bold text-neutral-900">
              Customers
            </h1>

            <p className="text-sm text-neutral-500 mt-2">
              View and manage your registered customers.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl px-5 py-3 text-sm text-neutral-600 shadow-sm">
            Customer Management
          </div>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-7">

          {/* Total Customers */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Total Customers
                </p>

                <h2 className="text-3xl font-bold text-neutral-900 mt-3">
                  {customers.length}
                </h2>
              </div>

              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100 text-amber-700 text-2xl">
                ♙
              </div>

            </div>

            <p className="text-xs text-neutral-400 mt-4">
              Registered user accounts
            </p>
          </div>

          {/* Matching Customers */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Matching Customers
                </p>

                <h2 className="text-3xl font-bold text-neutral-900 mt-3">
                  {filteredCustomers.length}
                </h2>
              </div>

              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-2xl">
                ⌕
              </div>

            </div>

            <p className="text-xs text-neutral-400 mt-4">
              Based on your search
            </p>
          </div>

          {/* Phone Numbers */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Customers With Phone
                </p>

                <h2 className="text-3xl font-bold text-neutral-900 mt-3">
                  {phoneCount}
                </h2>
              </div>

              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-green-700 text-2xl">
                ☎
              </div>

            </div>

            <p className="text-xs text-neutral-400 mt-4">
              Contact details available
            </p>
          </div>

        </div>

        {/* Customer List */}
        <div className="w-full bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">

          {/* Table Heading and Search */}
          <div className="p-6 border-b border-neutral-100">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  All Customers
                </h2>

                <p className="text-sm text-neutral-500 mt-1">
                  Complete list of registered customers
                </p>
              </div>

              <div className="relative w-full md:w-80">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm outline-none focus:border-amber-500 focus:bg-white transition"
                />

              </div>

            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center text-neutral-500">
              Loading customers...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-20 text-center text-red-500">
              {error}
            </div>
          )}

          {/* Empty Result */}
          {!loading && !error && filteredCustomers.length === 0 && (
            <div className="py-20 text-center">

              <div className="text-4xl mb-3">♙</div>

              <h3 className="font-semibold text-neutral-800">
                No customers found
              </h3>

              <p className="text-sm text-neutral-500 mt-2">
                Try searching with another name or email.
              </p>

            </div>
          )}

          {/* Customer Table */}
          {!loading && !error && filteredCustomers.length > 0 && (
            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="bg-neutral-50">

                  <tr className="text-xs uppercase tracking-wider text-neutral-500">

                    <th className="text-left font-semibold px-7 py-5">
                      Customer
                    </th>

                    <th className="text-left font-semibold px-5 py-5">
                      Email Address
                    </th>

                    <th className="text-left font-semibold px-5 py-5">
                      Phone Number
                    </th>

                    <th className="text-left font-semibold px-5 py-5">
                      Customer ID
                    </th>

                    <th className="text-left font-semibold px-5 py-5">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCustomers.map((customer) => (

                    <tr
                      key={customer.id}
                      className="border-t border-neutral-100 hover:bg-amber-50/30 transition"
                    >

                      {/* Customer Name */}
                      <td className="px-7 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 shrink-0 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-neutral-800">
                              {customer.name}
                            </p>

                            <p className="text-xs text-neutral-400 mt-1">
                              Registered Customer
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-5 py-5 text-sm text-neutral-600">
                        {customer.email}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-5 text-sm text-neutral-600">
                        {customer.phone || (
                          <span className="text-neutral-400">
                            Not provided
                          </span>
                        )}
                      </td>

                      {/* Customer ID */}
                      <td className="px-5 py-5">

                        <span className="text-xs font-medium bg-neutral-100 text-neutral-600 px-3 py-2 rounded-lg">
                          #{customer.id}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">

                        <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-2 rounded-full">

                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>

                          Active

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

          {/* Table Footer */}
          {!loading && !error && (
            <div className="px-6 py-4 border-t border-neutral-100 flex flex-col sm:flex-row justify-between gap-2 text-sm text-neutral-500">

              <p>
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>

              <p className="font-medium">
                SHOECRAFT Admin Panel
              </p>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default Customers;
