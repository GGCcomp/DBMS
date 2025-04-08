"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Access query parameters
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '', 
    role: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    aadhar: '',
    panCard: '',
    privateKey: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch email and role using the token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/register?token=${token}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error((await response.json()).error || 'Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);

        setFormData((prev) => ({
          ...prev,
          email: data.email,
          department: data.department,
          role: data.role,
        }));
      } catch (error) {
        toast.error('Invalid or expired token');
        // router.push('/'); // Redirect to the homepage if token is invalid
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
          department: formData.department,
          role: formData.role,
          mobile: formData.mobile,
          aadhar: formData.aadhar,
          panCard: formData.panCard,
          token,
          privateKey: formData.privateKey
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
    <div className="flex justify-center items-center p-10 bg-gradient-to-r from-blue-500 to-purple-500">
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <div className='flex gap-3'>
        <div className="mb-4 w-full">
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
        <div className="mb-4 w-full">
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
        </div>
        <div className='flex gap-3'>
        <div className="mb-4 w-full">
          <label htmlFor="private-key" className="block mb-2">Private Key:</label>
          <input
            type="text"
            name="privateKey"
            id="private-key"
            className="w-full p-2 border rounded"
            placeholder="Enter the private key here"
            value={formData.privateKey}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="mobile" className="block mb-2">Mobile No:</label>
          <input
            type="tel"
            name="mobile"
            id="mobile"
            className="w-full p-2 border rounded bg-gray-100"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        </div>
        <div className='flex gap-3'>
        <div className="mb-4 w-full">
          <label htmlFor="department" className="block mb-2">Department:</label>
          <input
            type="text"
            name="department"
            id="department"
            className="w-full p-2 border rounded bg-gray-100"
            value={formData.department}
            readOnly
          />
        </div>
        <div className="mb-4 w-full">
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
        </div>
        <div className='flex gap-3'>
        <div className="mb-4 w-full">
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
        <div className="mb-4 w-full">
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
        </div>
        <div className='flex gap-3'>
        <div className="mb-4 w-full">
          <label htmlFor="aadhar" className="block mb-2">Aadhar Number:</label>
          <input
            type="number"
            name="aadhar"
            id="aadhar"
            className="w-full p-2 border rounded"
            placeholder="Enter your Aadhar No:"
            value={formData.aadhar}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="pancard" className="block mb-2">PAN:</label>
          <input
            type="text"
            name="pancard"
            id="pancard"
            className="w-full p-2 border rounded"
            placeholder="Enter your PAN No:"
            value={formData.panCard}
            onChange={handleChange}
            required
          />
        </div>
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

export default function SuspendedRegisterForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
