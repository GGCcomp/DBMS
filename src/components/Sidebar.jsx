import { useState } from 'react';

const Sidebar = ({ sections, onTitleChange, onIDchange }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSection = (sectionTitle, id, parentTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));

    const fullTitle = parentTitle ? `${parentTitle} > ${sectionTitle}` : sectionTitle;
    onTitleChange(fullTitle);
    onIDchange(id);
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button
        className="fixed top-[90%] left-4 z-50 md:hidden bg-blue-500 text-white p-2 rounded-full"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? 'X' : 'Sections'}
      </button>

      <div
        className={`z-40 fixed top-100 left-0 h-screen w-56 bg-gray-300 text-black transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:w-56 md:bg-gray-300 md:text-black`}
      >
        <div className="flex justify-between items-center p-4 md:hidden">
          <h2 className="text-lg font-medium">Select a section:</h2>
        </div>
        <h2 className="text-lg font-medium p-3 hidden md:block">Select a section:</h2>
        <ul className='w-full'>
          {sections.length > 0 && sections.map((section, i) => (
            <li key={i} className='p-4'>
              <div
                className='cursor-pointer rounded-md hover:text-white'
                onClick={() => toggleSection(section.title, section._id)}
              >
                {section.title}
              </div>
              {expandedSections[section.title] && section.subSection.length > 0 && (
                <ul className='pl-6'>
                  {section.subSection.map((subSec, j) => (
                    <li key={j} className='p-2'>
                      <div
                        className='cursor-pointer rounded-md hover:text-white'
                        onClick={() => toggleSection(subSec.title, subSec._id, section.title)}
                      >
                        {subSec.title}
                      </div>
                      {expandedSections[subSec.title] && subSec.subSection1.length > 0 && (
                        <ul className='pl-6'>
                          {subSec.subSection1.map((subSec1, k) => (
                            <li key={k} className='p-2'>
                              <div
                                className='cursor-pointer rounded-md hover:text-white'
                                onClick={() => toggleSection(subSec1.title,  subSec1._id, `${section.title} > ${subSec.title}`)}
                              >
                                {subSec1.title}
                              </div>
                              {expandedSections[subSec1.title] && subSec1.subSection2.length > 0 && (
                                <ul className='pl-6'>
                                  {subSec1.subSection2.map((subSec2, l) => (
                                    <li key={l} className='p-2'>
                                      <div
                                        className='cursor-pointer rounded-md hover:text-white'
                                        onClick={() => toggleSection(subSec2.title, subSec2._id, `${section.title} > ${subSec.title} > ${subSec1.title}`)}
                                      >
                                        {subSec2.title}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
