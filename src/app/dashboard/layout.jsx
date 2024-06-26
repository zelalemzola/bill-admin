import React from 'react'

import Sidebar from './_components/SideBar'
import Navbar from './_components/Navbar'
const layout = ({children}) => {
  return (
    <div className='w-full '>
    <Navbar/>
    <div className='flex pt-[53px] z-0 '>
        <div className='w-1/6 fixed h-screen border-r border-r-primary '><Sidebar/></div>
        <div className='pl-[230px]'>{children}</div>
    </div>
    </div>
  )
}

export default layout