import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Modal from './Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Content from './Content';
import Sidebar from './Sidebar';
import * as XLSX from 'xlsx'; // Import xlsx library

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const RichTextEditor = ({ placeholder, onSave, onUpdate, api, pageTitle, addAPI }) => {
  const editor = useRef(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [contentData, setContentData] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionID, setSectionID] = useState('');
  const [dataSaved, setDataSaved] = useState(false);
  const [selectedTitle, setselectedTitle] = useState('Please select a section');
  const { data: session } = useSession();

  useEffect(() => {
    const getSection = async () => {
      setLoading(true);
      let res = await fetch(`${api}?selectedTitle=${selectedTitle}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      });
      res = await res.json();

      setSections(res.section);
      setContentData(res.content);
      setLoading(false);
      setDataSaved(false);
    };
    getSection();
  }, [selectedTitle, dataSaved]);

  const handleSectionAdded = () => {
    setDataSaved(true);
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...',
    }),
    [placeholder]
  );

  const handleSave = () => {
    const plainTextContent = content;

    if (selectedTitle === 'Please select a section') {
      toast.error('Please select a section first!');
      return;
    }

    if (plainTextContent.length === 0) {
      toast.error('Please enter some data first!');
      return;
    }

    if (onSave) {
      onSave(plainTextContent, selectedTitle, api='/api/post');
      setDataSaved(true);
    }
    setContent('');
  };

  const modalHandler = () => {
    if (!session) {
      toast.error('Please login first!');
      return;
    }
    setModal(!modal);
  };

  // Handle file upload and conversion to formatted content
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert to array of rows

        // Format data into readable HTML structure
        let formattedContent = jsonData
          .map((row, rowIndex) => {
            if (rowIndex === 0 || !row[0]) return ''; // Skip the header row or empty rows
            return `
              <div>
                <h3>${row[0]}</h3>
                <p>${row.slice(1).filter(Boolean).join(' ')}</p>
              </div>
            `;
          })
          .join('');

        setContent(formattedContent);
        toast.success('File uploaded and converted successfully!');
      };
      reader.readAsBinaryString(file);
    } else {
      toast.error('Please upload a valid .xls or .xlsx file');
    }
  };

  return (
    <>
      <div className="relative flex">
        {/* Sidebar */}
        <Sidebar sections={sections} onTitleChange={(data) => setselectedTitle(data)} onIDchange={(id) => setSectionID(id)} loading={loading} />

        {/* Main content */}
        <div className="flex-1 w-[90vw] mx-auto p-4">
          <div className='flex justify-between'>
            <h1 className='text-2xl font-semibold py-3'>NiveshJano: {pageTitle}</h1>
            {session ? (
              <div className='flex gap-3 items-center'>
                <p className='hidden md:block text-xl'>Welcome, {session.user.name}</p>
                <button
                  onClick={() => {
                    signOut();
                    toast.error('User Logged Out!');
                  }}
                  className='bg-red-400 text-white hover:bg-red-500 px-3 py-1 rounded-sm'
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className='flex items-center'>
                <Link href='/login' className='bg-green-400 text-white hover:bg-green-500 px-3 py-1 rounded-sm'>Login</Link>
              </div>
            )}
          </div>
          <div className='flex flex-col w-full'>
            <label htmlFor="section" className="text-lg font-medium mb-2">Select a section first!</label>
            <div className='relative flex flex-col md:flex-row gap-4 py-3'>
              {modal && session && <Modal onClose={modalHandler} id={sectionID} selectedSection={selectedTitle} api={addAPI} onSectionAdded={handleSectionAdded} />}

              <button
                className='px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md self-start md:self-center'
                onClick={modalHandler}
              >
                Add new section
              </button>
            </div>
          </div>

          {/* File upload button */}
          {session && <div className='my-4'>
            <label className="block text-lg font-medium mb-2">Upload Excel File:</label>
            <input
              type="file"
              accept=".xls, .xlsx"
              onChange={handleFileUpload}
              className="border p-2 rounded-md"
            />
          </div>}

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
          {session && <Content content={contentData} title={selectedTitle} onUpdate={onUpdate} dataSave={setDataSaved} />}
        </div>
      </div>
    </>
  );
};

export default RichTextEditor;
