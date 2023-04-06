import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSideNavOpen } from '../../../App/AppSlice'
import Sidebar from '../../Sidebar/SideNav'
import ElementMapper from './Elements/ElementMapper'

function Course() {
  const dispatcher = useDispatch()
  
  // Open the sidebar after the page has loaded
  useEffect(() => {
    setTimeout(() => {
      dispatcher(setSideNavOpen(true))
    
    }, 100)
  }, [])

  return (
    <>
        <Sidebar></Sidebar>
        <div className='course'>
          <ElementMapper></ElementMapper>
        </div>
    </>
  )
}

export default Course