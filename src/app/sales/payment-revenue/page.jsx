"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = ["Transactions", "Subscriptions", "Commissions", "Taxes"];

const Page = () => {
  const [activeSection, setActiveSection] = useState("Transactions");
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPayments = async ({ type, createdAt, productName, email, userId, page = 1 }) => {
    const params = new URLSearchParams();

    if (createdAt) params.append("createdAt", createdAt);
    if (productName) params.append("productName", productName);
    if (email) params.append("email", email);
    if (userId) params.append("userId", userId);
    if (type) params.append("type", type); // Filter by type
    params.append("page", page);

    try {
      const response = await fetch(`/api/payment-details?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to fetch payments");

      return result;
    } catch (error) {
      console.error("Error fetching payments:", error);
      return null;
    }
  };


  useEffect(() => {
    loadPayments();
  }, [activeSection, page]);

  const loadPayments = async () => {
    setLoading(true);
    setError("");

    const data = await fetchPayments({ page });

    if (data) {
      let filteredData = data.data;

      if (activeSection === "Subscriptions") {
        filteredData = filteredData.filter((payment) => payment.type === "SIP");
      } else if (activeSection === "Commissions") {
        filteredData = filteredData.map((payment) => ({
          ...payment,
          amount: (payment.amount * 20) / 100, // Calculate 20% commission
        }));
      } else if (activeSection === "Taxes") {
        filteredData = filteredData.map((payment) => ({
          ...payment,
          taxAmount: payment.amount - payment.amount / 1.18, // Extract GST (18%) from stored amount
        }));
      }

      setPayments(filteredData);
      setTotalPages(data.totalPages);
    } else {
      setError("Failed to load payments");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-screen pt-12">
      <div className="p-6 max-w-5xl mx-auto bg-gray-50 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">📊 Payments Dashboard</h2>

        {/* Section Tabs */}
        <div className="flex space-x-4 mb-6 justify-center">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => {
                setActiveSection(section);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-md transition-all ${activeSection === section ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
                }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Loading & Error Handling */}
        {/* {loading && <p className="text-center">🔄 Loading {activeSection.toLowerCase()}...</p>} */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Animated Section Change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white p-4 rounded-md shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-3">💳 {activeSection}</h3>

            {/* Handling different sections */}
            {activeSection === "Subscriptions" && payments.length === 0 ? (
              <p className="text-center">No SIP purchases yet.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Product Name</th>
                    <th className="border p-2">
                      {activeSection === "Taxes" ? "Tax Amount (₹)" : "Amount (₹)"}
                    </th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id} className="text-center">
                      <td className="border p-2">{payment.productName}</td>
                      <td className="border p-2">
                        {activeSection === "Taxes"
                          ? `₹${((payment.amount * 18) / 118).toFixed(2)}`
                          : `₹${payment.amount}`}
                      </td>
                      <td className="border p-2">{payment.email}</td>
                      <td className="border p-2">{new Date(payment.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <p>
                Page {page} of {totalPages}
              </p>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;
