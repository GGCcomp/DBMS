'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

export default function InternLetter({ onClose, candidateEmail }) {
  const [form, setForm] = useState({
    email: candidateEmail && candidateEmail.length > 0 ? candidateEmail : '',
    candidate_name: '',
    position: '',
    department: '',
    lead_name: '',
    lead_department: '',
    application_date: '',
    commence_date: '',
    mode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      const res = await fetch('/api/generate_docs', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await res.json();
      if(res.ok){
        toast.success("Email sent successfully!");
        onClose();
      }
    } catch (err) {
      toast.error("Failed to send email!")
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <Toaster position='bottom-right' visibleToasts={1} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl"
      >
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-2xl text-center text-black font-semibold'>Intern Joining Letter</h1>
          <button onClick={onClose} className='hover:text-red-500 font-semibold'>X</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key.replace(/_/g, ' ')}
              className="w-full border p-2 rounded"
              required
            />
          ))}
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {!loading ? "Send" : "This could take a minute.."}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
