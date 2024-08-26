"use client";
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Modal from './Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Content from './Content';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const RichTextEditor = ({ placeholder, onSave }) => {
  const editor = useRef(null);
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState('');
  const [contentData, setContentData] = useState([]);
  const [sections, setSections] = useState([]);
  const [dataSaved, setDataSaved] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Please select a section');
  const {data: session} = useSession();
  

  useEffect(() => {
    const getSection = async() => {
      let res = await fetch(`/api/post?selectedSection=${selectedSection}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      res = await res.json();
      setSections(res.section);
      setContentData(res.content);
      setDataSaved(false);
    }
    getSection();
  },[selectedSection, dataSaved]);
  

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...',
    }),
    [placeholder]
  );

  const handleSave = () => {
    const plainTextContent = content;
    console.log(plainTextContent);
    
    if(selectedSection === 'Pleas select a section'){
      toast.error('Please select a section first!');
      return;
    }

    if(plainTextContent.length === 0){
      toast.error('Please enter some data first!');
      return;
    }
    
    if (onSave) {
      onSave(plainTextContent, selectedSection);
      setDataSaved(true);
    }
    setContent('')
  };
  
  const modalHandler = () => {
    if(!session){
      toast.error('Please login first!')
      return;
    }
    setModal(!modal);
  }

  return (
    <>
    <div className="w-[90vw] mx-auto p-4">
     <div className='flex justify-between'>
     <h1 className='text-2xl font-semibold py-3'>NiveshJano DataBank</h1>
     {session ? <div className='flex gap-3 items-center'>
      <p className='hidden md:block text-xl'>Welcome, {session.user.name}</p>
      <button onClick={() => {
        signOut();
        toast.error('User Logged Out!')
      }} className='bg-red-400 text-white hover:bg-red-500 px-3 py-1 rounded-sm'>Sign Out</button>
      </div> : <div className='flex items-center'><Link href='/login' className='bg-green-400 text-white hover:bg-green-500 px-3 py-1 rounded-sm'>Login</Link></div>}
     </div>
      <div className='flex flex-col w-full md:w-1/2'>
        <label htmlFor="section">Select a section first!</label>
       <div className='relative flex gap-4 py-3 '>
        {modal && session && <Modal onClose={modalHandler}/>}
       <select id='section' onChange={(e) => setSelectedSection(e.target.value)} className='w-1/2'>
        <option value="">Select Section</option>
        {sections.length > 0 && sections.map((section,i) => <option key={i} value={section}>{section}</option>)} 
        </select>
        <button className='px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white' onClick={modalHandler}>Add new section</button>
       </div>
      </div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => setContent(newContent)}
      />
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!session}
      >
        {!session ? 'Login first' : 'Save'}
      </button>
      {session && <Content content={contentData} section={selectedSection} />}
    </div>
    
    </>
  );
};

export default RichTextEditor;
