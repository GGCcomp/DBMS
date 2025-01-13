import Link from "next/link";

export default function page() {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
        <Link href='/' className="bg-blue-300 border-0 px-5 py-2 rounded-sm">Go Back</Link>
      </div>
    );
  }
  