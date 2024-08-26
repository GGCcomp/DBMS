import React from 'react'

function Content({section, content}) {
  return (
    <div className='bg-white shadow-md mt-10 py-10'>
        <div className='text-2xl font-semibold text-center'>
        {section === 'Please select a section' ? <p>No Section Selected</p> : <p className='uppercase'>{section}</p>}
        </div>
        <div className='pt-5'>
            {content && content.length > 0 ?
                content.map((item,i) => <div key={i} className='px-8 text-left' dangerouslySetInnerHTML={{ __html: item }}/>)
             : <p className='text-lg px-8'>No data!</p>}
        </div>
    </div>
  )
}

export default Content;