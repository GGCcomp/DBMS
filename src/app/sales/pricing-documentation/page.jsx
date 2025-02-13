"use client";

import { motion } from "framer-motion";

const Page = () => {
  // Dummy Data
  const data = {
    productCatalog: ["Loans", "Investments", "Payments", "Insurance"],
    pricingModels: [
      { model: "Tiered Pricing", discount: "10%" },
      { model: "Flat Fee", discount: "5%" },
      { model: "Volume-based", discount: "15%" },
    ],
    crossSelling: [
      { strategy: "Bundle Loans + Insurance", effect: "Higher conversions" },
      { strategy: "Recommend SIPs with MF", effect: "Boosts long-term investments" },
    ],
    commissionStructures: [
      { role: "Sales Executive", commission: "2%" },
      { role: "Senior Manager", commission: "5%" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Product Catalog */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-indigo-600">📦 Product Catalog</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            {data.productCatalog.map((item, index) => (
              <li key={index} className="p-2 bg-gray-200 rounded-lg">{item}</li>
            ))}
          </ul>
        </div>

        {/* Pricing Models & Discount Structures */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-green-600">₹ Pricing & Discounts</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            {data.pricingModels.map((item, index) => (
              <li key={index} className="p-2 bg-gray-200 rounded-lg">
                {item.model} - <span className="font-semibold">{item.discount}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cross-Selling & Upselling Recommendations */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-blue-600">📈 Cross-Selling & Upselling</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            {data.crossSelling.map((item, index) => (
              <li key={index} className="p-2 bg-gray-200 rounded-lg">
                <span className="font-semibold">{item.strategy}</span> - {item.effect}
              </li>
            ))}
          </ul>
        </div>

        {/* Commission Structures */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-red-600">🏆 Commission Structures</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            {data.commissionStructures.map((item, index) => (
              <li key={index} className="p-2 bg-gray-200 rounded-lg">
                {item.role} - <span className="font-semibold">{item.commission}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
