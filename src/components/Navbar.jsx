'use client';
import { useState } from "react";
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import LeaveModal from "./LeaveModal";

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [isLeaveModal, setIsLeaveModal] = useState(false);

  const openModal = () => setIsLeaveModal(true);
  const closeModal = () => setIsLeaveModal(false);
  

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg py-4 relative">
  <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
    {isLeaveModal && (
      <LeaveModal
        onClose={closeModal}
        name={session?.user?.name}
        role={session?.user?.role}
        email={session?.user?.email}
      />
    )}

    {/* Logo / Title */}
    <Link href="/" className="text-2xl font-bold tracking-wide">
      IG VERSE
    </Link>

    {/* Navigation (Only show if user is logged in) */}
    {session && (
      <nav className="hidden md:flex space-x-6">
        {session?.user?.role === "admin" && <Link href="/admin" className="hover:text-gray-300">
          Admin
        </Link>}
        <Link href="/development" className="hover:text-gray-300">
          Development
        </Link>
        <Link href="/hr" className="hover:text-gray-300">
          HR
        </Link>
        <Link href="/sales" className="hover:text-gray-300">
          Sales
        </Link>
        <Link href="/marketing" className="hover:text-gray-300">
          Marketing
        </Link>
        <Link href="/tech" className="hover:text-gray-300">
          IT
        </Link>
        <Link href="/research" className="hover:text-gray-300">
          Research
        </Link>
      </nav>
    )}

    {/* Welcome Message & Logout */}
    <div className="relative group py-2">
      <p className="font-semibold text-xl cursor-pointer">
        {session ? `Welcome, ${session.user.name}!` : "Welcome!"}
      </p>

      {session && (
        <div className="absolute top-10 w-full z-50 hidden group-hover:flex flex-col justify-center items-center">
          {session.user.role !== "admin" && (
            <button
              className="bg-blue-800 w-full px-4 py-2 rounded shadow-lg mb-2"
              onClick={openModal}
            >
              Request Leave
            </button>
          )}
          {(session.user.role === "admin" || session.user.role === "Lead") && (
            <button
              className="bg-blue-800 w-full px-4 py-2 rounded shadow-lg mb-2"
              onClick={() => router.push("/announcement")}
            >
              Announcement
            </button>
          )}

          <button
            className="bg-blue-800 w-full px-4 py-2 rounded shadow-lg"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Log Out!
          </button>
        </div>
      )}
    </div>
  </div>
</header>

  );
}

export default Navbar;
