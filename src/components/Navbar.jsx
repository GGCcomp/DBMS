'use client';
import { useState } from "react";
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LeaveModal from "./LeaveModal";

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: session } = useSession();
  const pathName = usePathname();
  const [isLeaveModal, setIsLeaveModal] = useState(false);

  const openModal = () => setIsLeaveModal(true);
  const closeModal = () => setIsLeaveModal(false);
  

  return (
    <header className="bg-blue-700 text-white shadow-lg py-4 relative">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {isLeaveModal && <LeaveModal onClose={closeModal} name={session.user.name} role={session.user.role} email={session.user.email} />}
        {/* Logo / Title */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          IG VERSE
        </Link>

        {/* Navigation */}
        {pathName !== ('/login' || 'register') && (
          <nav className="hidden lg:flex">
            <ul className="flex space-x-6">
              {session?.user?.role === "admin" && (
                <li className="hover:underline">
                  <Link href="/admin">Admin</Link>
                </li>
              )}
              {["IT", "admin"].includes(session?.user?.role) && (
                <li className="hover:underline">
                  <Link href="/dbms">DBMS</Link>
                </li>
              )}
              {["HR", "admin"].includes(session?.user?.role) && (
                <li className="hover:underline">
                  <Link href="/hr">HR</Link>
                </li>
              )}
              {["Analyst", "admin"].includes(session?.user?.role) && (
                <>
                  <li className="hover:underline">
                    <Link href="/research">Research</Link>
                  </li>
                  <li className="hover:underline">
                    <Link href="/iso">ISO</Link>
                  </li>
                </>
              )}
              {["IT", "admin"].includes(session?.user?.role) && (
                <li className="hover:underline">
                  <Link href="/development">Development</Link>
                </li>
              )}
              {["Marketing", "admin"].includes(session?.user?.role) && (
                <li className="hover:underline">
                  <Link href="/marketing">Marketing</Link>
                </li>
              )}
              {["Sales", "admin"].includes(session?.user?.role) && (
                <li className="hover:underline">
                  <Link href="/sales">Sales</Link>
                </li>
              )}
              {["IT", "admin"].includes(session?.user?.role) && (
                <li className="hover:underline">
                  <Link href="/softwareNeeded">Software Needed</Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* Mobile Menu */}
        {pathName !== ('/login' || 'register') && (
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white focus:outline-none"
            >
              ☰
            </button>
            {showMobileMenu && (
              <div className="absolute top-16 right-4 bg-blue-700 text-white p-4 shadow-lg rounded-lg">
                <ul className="flex flex-col space-y-4">
                  {session?.user?.role === "admin" && (
                    <li>
                      <Link href="/admin">Admin</Link>
                    </li>
                  )}
                  {["IT", "admin"].includes(session?.user?.role) && (
                    <li>
                      <Link href="/dbms">DBMS</Link>
                    </li>
                  )}
                  {["HR", "admin"].includes(session?.user?.role) && (
                    <li>
                      <Link href="/hr">HR</Link>
                    </li>
                  )}
                  {["Analyst", "admin"].includes(session?.user?.role) && (
                    <>
                      <li>
                        <Link href="/research">Research</Link>
                      </li>
                      <li>
                        <Link href="/iso">ISO</Link>
                      </li>
                    </>
                  )}
                  {["IT", "admin"].includes(session?.user?.role) && (
                    <li>
                      <Link href="/development">Development</Link>
                    </li>
                  )}
                  {["Marketing", "admin"].includes(session?.user?.role) && (
                    <li>
                      <Link href="/marketing">Marketing</Link>
                    </li>
                  )}
                  {["Sales", "admin"].includes(session?.user?.role) && (
                    <li>
                      <Link href="/sales">Sales</Link>
                    </li>
                  )}
                  {["IT", "admin"].includes(session?.user?.role) && (
                    <li>
                      <Link href="/softwareNeeded">Software Needed</Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Welcome Message */}
        <div className="relative group py-2">
          <p className="font-semibold text-xl cursor-pointer">
            {session ? `Welcome, ${session.user.name}!` : "Welcome!"}
          </p>
          {session && <div className="absolute top-10 w-full z-50 hidden group-hover:flex flex-col justify-center items-center">
            {session.user.role !== "admin" && <button
              className="bg-blue-800 w-full px-4 py-2 rounded shadow-lg mb-2"
              onClick={openModal}>
              Request Leave</button>}
            <button
              className="bg-blue-800 w-full px-4 py-2 rounded shadow-lg"
              onClick={() => signOut()}
            >
              Log Out!
            </button>
          </div>}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
