"use client"
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import EmployeesModal from '@/components/EmployeeModal';
import EmployeeCard from '@/components/EmployeeCard';


function Page() {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmployees = async () => {
    setLoading(true);
    const response = await fetch(`/api/hr/employee?search=${search}&page=${page}&limit=6`, {cache: "no-store"});
    const data = await response.json();
    setEmployees(data.employees);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-10">
      <button
              onClick={() => setShowModal(true)}
              className="bg-purple-500 text-white px-6 py-3 rounded-2xl shadow hover:bg-purple-600 transition"
            >
              + Add Employee
            </button>
           
          <AnimatePresence>
            {showModal && <EmployeesModal onClose={() => setShowModal(false)}/>}
          </AnimatePresence>
          <div className="my-6 flex justify-center items-center">
        <input
          type="text"
          placeholder="Search by Department or Role"
          value={search}
          onChange={handleSearch}
          className="p-3 border rounded-xl w-1/3"
        />
      </div>

      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : employees.length === 0 ? (
        <div className="text-center text-white">No employees found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <EmployeeCard key={employee._id} employee={employee} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Page;