"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ email: "", mobile: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
        setFormData({ email: data.email, mobile: data.mobile });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 border border-gray-200 mb-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">User Profile</h2>
      <div className="space-y-2">
        <ProfileDetail label="Name" value={user.name} />
        <ProfileDetail label="Department" value={user.department} />
        <ProfileDetail label="Role" value={user.role} />
        <ProfileDetail label="Permission" value={user.permission ? "Granted" : "Not Granted"} />
        <ProfileDetail label="Aadhar" value={user.aadhar !== 0 ? user.aadhar : "Not Provided"} />
        <ProfileDetail label="PAN Card" value={user.panCard !== 0 ? user.panCard : "Not Provided"} />

        {editing ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 mt-4"
          >
            <EditableField label="Email" name="email" value={formData.email} onChange={handleChange} />
            <EditableField label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
            <div className="flex gap-3 justify-center">
              <Button type="submit" color="blue">Save</Button>
              <Button type="button" color="gray" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </motion.form>
        ) : (
          <>
            <ProfileDetail label="Email" value={user.email} />
            <ProfileDetail label="Mobile" value={user.mobile} />
            <div className="text-center mt-4">
              <Button color="green" onClick={() => setEditing(true)}>Edit</Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}


const ProfileDetail = ({ label, value }) => (
  <p className="text-gray-700">
    <strong className="text-gray-800">{label}:</strong> {value}
  </p>
);


const EditableField = ({ label, name, value, onChange }) => (
  <label className="block">
    <span className="text-gray-800">{label}:</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>
);

const Button = ({ children, color, ...props }) => {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    gray: "bg-gray-400 hover:bg-gray-500",
    green: "bg-green-500 hover:bg-green-600",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 text-white rounded-lg transition ${colors[color]}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
