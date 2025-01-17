'use client';

import { useState, useEffect } from 'react';
import ApprovalCard from '../../components/ApprovalCard';
import Pagination from '../../components/Pagination';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovals(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchApprovals = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/data_approval?page=${page}&limit=10`);
      const data = await response.json();

      if (data.success) {
        setApprovals(data.approvalData);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Approval System</h1>

      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : approvals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvals.map((approval) => (
            <ApprovalCard key={approval._id} approval={approval} />
          ))}
        </div>
      ) : (
        <div className="text-center text-xl">No approvals found.</div>
      )}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
      />
    </div>
  );
}
