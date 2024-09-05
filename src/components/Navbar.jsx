import React from 'react';
import Link from 'next/link';

function Navbar() {
  return (
    <nav className='h-16 content-center'>
        <ul className='flex justify-evenly items-center'>
            <li className='hover:underline underline-offset-4'><Link href='/'>DBMS</Link></li>
            <li className='hover:underline underline-offset-4'><Link href='/hr'>HR</Link></li>
            <li className='hover:underline underline-offset-4'><Link href='/research'>Research</Link></li>
            <li className='hover:underline underline-offset-4'><Link href='/development'>Development</Link></li>
            <li className='hover:underline underline-offset-4'><Link href='/iso'>ISO</Link></li>
            <li className='hover:underline underline-offset-4'><Link href='/marketing'>Marketing</Link></li>
            <li className='hover:underline underline-offset-4'><Link href='/sales'>Sales</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar;