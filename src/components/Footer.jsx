"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import AllLeaves from "./AllLeaves";
import Link from "next/link";

function Footer() {
  const [showLeaves, setShowLeaves] = useState(false);
  const {data: session} = useSession();

  return (
    <>
    {
      session && <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      {/* Navigation Links */}
      <nav className="flex justify-center space-x-6 py-4">
        {["/crm", "/thread", "/announcement"].map((link, i) => (
          <Link
            href={link}
            key={i}
            className="text-lg font-semibold hover:text-gray-300 transition-all duration-300"
          >
            {link.replace("/", "").toUpperCase()}
          </Link>
        ))}
      </nav>

      {/* All Leaves Modal Trigger */}
      {showLeaves && <AllLeaves onClose={() => setShowLeaves(false)} />}
      <div className="flex justify-center py-4">
        <button
          className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300"
          onClick={() => setShowLeaves(!showLeaves)}
        >
          View All Leaves
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-white/30">
        <p className="text-sm opacity-90">
          &copy; 2025 Innate Gamma Private Limited. All rights reserved.
        </p>
      </footer>
    </div>}
    </>
  );
}

export default Footer;
