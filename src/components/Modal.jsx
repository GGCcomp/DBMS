"use client"
import {useState} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Modal({onClose}) {

  const [section, setSection] = useState("");

  const submitHandler = async(e) => {
    e.preventDefault();
    try{
      const response = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, content: [] }),
      });
  
      if (response.ok) {
        toast.success("Post saved successfully!");
      } else {
        toast.error("Failed to save post");
      }
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div className='absolute left-[10%] md:left-[65%] top-[270%] w-9/12 md:w-1/2 z-50 h-32 flex justify-between bg-white rounded-md shadow-md'>
      <div className='order-2'>
      <button onClick={() => onClose()} className='bg-red-400 p-2 rounded-tr-md'>X</button>
      </div>
        <form onSubmit={submitHandler}>
            <div className='flex flex-col justify-center gap-3 h-full pl-10'>
                <label htmlFor="section">New Section:</label>
                <input type="text" name="section" id="section" onChange={(e) => setSection(e.target.value)} required
                  className='border'
                />
                <button className='px-3 py-1 bg-blue-300'>Add Section</button>
            </div>
            
        </form>
    </div>
  )
}

export default Modal;