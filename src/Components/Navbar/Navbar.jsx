import React from 'react'
import { Link , NavLink } from 'react-router-dom'
  
export default function Navbar() {
  return (
    <>
        <div className=' container mx-auto w-1/4' >
          <ul className='flex flex-wrap justify-around mt-3 items-center'>
            <li> <NavLink className="text-slate-900 font-normal text-lg" to="">Home</NavLink>  </li>
            <li> <NavLink className="text-slate-900 font-normal text-lg" to="about">About</NavLink>  </li>
            <li> <NavLink className="text-slate-900 font-normal text-lg" to="contacts">Contacts</NavLink>  </li>
            <li> <NavLink className="text-slate-900 font-normal text-lg" to="gallary">Gallary</NavLink>  </li>
          </ul>
      </div>
      
      <div className='w-3/4'>
      </div>


    </>
  )
}
