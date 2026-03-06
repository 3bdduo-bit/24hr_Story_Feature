import {  } from 'react'
import './App.css'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import About from './Components/About/About'
import Contacts from './Components/Contacts/Contacts'
import Gallary from './Components/Gallary/Gallary'
import Web from './Components/Web/Web'
import Ux from './Components/Ux/Ux'
import Mobile from './Components/Mobile/Mobile'


let x= createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
    
      {index:true, element:<Home/>},
      {path:'about' , element:<About/>},
      {path:'contacts' , element:<Contacts/>},
      {path: 'gallary', element: <Gallary />, children: [
        { path:'web' , element: <Web/> },
          { path: 'ux', element: <Ux/> },
          { path: 'mobile', element: <Mobile/>}
      ]}

  ]}
])

export default function App() {
  return <>
       <RouterProvider router={x}></RouterProvider>
     
    </>

}






