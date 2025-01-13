'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch email and role using the token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/register?token=${token}`,{
          headers: {
            'Content-Type': 'application/json',
          }});
        if (!response.ok) {
          throw new Error((await response.json()).error || 'Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        
        setFormData((prev) => ({
          ...prev,
          email: data.email,
          role: data.role,
        }));
      } catch (error) {
        toast.error('Invalid or expired token');
        //router.push('/'); // Redirect to the homepage if token is invalid
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          token, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful');
        router.push('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-10">
      <form onSubmit={handleSubmit} className="w-full md:w-1/3 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block mb-2">Role:</label>
          <input
            type="text"
            name="role"
            id="role"
            className="w-full p-2 border rounded bg-gray-100"
            value={formData.role}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full p-2 border rounded"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="w-full p-2 border rounded"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="text-center pt-3">
          <Link href="/login" className="hover:underline underline-offset-2">Login</Link>
        </div>
      </form>
    </div>
  );
}
