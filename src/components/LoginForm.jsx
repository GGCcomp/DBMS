"use client"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Logged in successfully');
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen px-10">
      <form onSubmit={handleSubmit} className="w-full md:w-1/3 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
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
            required
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
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className='text-center pt-3'>
        <Link href='/register' className='hover:underline underline-offset-2'>Register</Link>
        </div>
      </form>
      
    </div>
  );
}
