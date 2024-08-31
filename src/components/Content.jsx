import React from 'react'

function Content({ title, content }) {
  return (
    <div className='bg-white shadow-md mt-10 py-10'>
      <div className='text-xl font-semibold text-center'>
        {title === 'Please select a section' ? <p>No Section Selected</p> : <p className='uppercase'>{title}</p>}
      </div>
      <div className='pt-5'>
        {content && content.length > 0 ?
          content.map((item, i) => <div key={i} className='px-8 text-left' dangerouslySetInnerHTML={{ __html: item }} />)
          : <p className='text-lg px-8'>No data, Check the nestings!</p>}
      </div>
    </div>
  );
}


export default Content;