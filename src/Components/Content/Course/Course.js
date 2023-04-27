import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSideNavOpen } from '../../../App/AppSlice'
import Sidebar from '../../Sidebar/SideNav'
import ElementMapper from './Elements/ElementMapper'
import DisplayPage from '../DisplayPage'
import { useParams } from 'react-router-dom'
import { selectCourse } from '../../../App/DbSlice'

function Course() {
  const dispatcher = useDispatch()
  const { courseID } = useParams();
  
  useEffect(() => {
    dispatcher(selectCourse(courseID))
  },[courseID])

  // Open the sidebar after the page has loaded
  useEffect(() => {
    setTimeout(() => {
      dispatcher(setSideNavOpen(true))
    
    }, 100)
  }, [])

  return (
    <DisplayPage>
        <Sidebar></Sidebar>
        <div className='course'>
          <ElementMapper></ElementMapper>
        </div>
    </DisplayPage>
  )
}

export default Course