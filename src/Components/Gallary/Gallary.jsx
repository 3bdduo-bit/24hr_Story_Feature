import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Gallary() {
  return (
    <div>
          <div className='row'>
              <ul className='flex justify-center items-center content-center'>
                  <li className='ps-5'><NavLink to='web'>Web</NavLink></li>
                  <li className='ps-5'><NavLink to='mobile'>Mobile</NavLink></li>
                  <li className='ps-5'><NavLink to='ux'>Ux</NavLink></li>
              </ul>
          </div>
          <Outlet></Outlet>
    </div>
  )
}
