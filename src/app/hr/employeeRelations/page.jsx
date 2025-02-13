"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function EmployeeSelfService() {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Doe",
      profile: {
        contact: "johndoe@example.com",
        emergency: "Jane Doe (Spouse) - 1234567890",
        bank: "Bank of America - XXXX1234",
      },
      employment: {
        title: "Software Engineer",
        department: "Engineering",
        workModel: "Hybrid",
        promotions: ["Jr. Engineer (2021)", "Software Engineer (2023)"],
      },
      benefits: ["Health Insurance", "Remote Work Allowance", "Gym Membership"],
    },
    {
      id: 2,
      name: "Jane Smith",
      profile: {
        contact: "janesmith@example.com",
        emergency: "John Smith (Brother) - 9876543210",
        bank: "Chase Bank - XXXX5678",
      },
      employment: {
        title: "HR Manager",
        department: "Human Resources",
        workModel: "On-site",
        promotions: ["HR Associate (2019)", "HR Manager (2022)"],
      },
      benefits: ["Dental Insurance", "Paid Time Off", "Employee Stock Options"],
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-2xl max-w-5xl w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Employee Information & Self-Service
        </h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          Manage personal and employment details seamlessly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <motion.div
              key={employee.id}
              className="bg-gray-100 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                {employee.name}
              </h2>
              <div className="text-gray-600">
                <h3 className="font-semibold text-lg mt-4">Personal Profile</h3>
                <p>📧 Contact: {employee.profile.contact}</p>
                <p>🚑 Emergency: {employee.profile.emergency}</p>
                <p>🏦 Bank Details: {employee.profile.bank}</p>

                <h3 className="font-semibold text-lg mt-4">Employment Info</h3>
                <p>💼 Job Title: {employee.employment.title}</p>
                <p>🏢 Department: {employee.employment.department}</p>
                <p>🏠 Work Model: {employee.employment.workModel}</p>
                <p>📈 Promotions: {employee.employment.promotions.join(", ")}</p>

                <h3 className="font-semibold text-lg mt-4">Benefits Overview</h3>
                <ul className="list-disc ml-5">
                  {employee.benefits.map((benefit, index) => (
                    <li key={index}>✨ {benefit}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}