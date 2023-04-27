import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setSideNavOpen } from '../../../App/AppSlice'
import Sidebar from '../../Sidebar/SideNav'
import ElementMapper from './Elements/ElementMapper'
import DisplayPage from '../DisplayPage'
import { useParams } from 'react-router-dom'
import { selectCourse } from '../../../App/DbSlice'
import "./Course.css"

function Course() {
  const dispatcher = useDispatch()
  const { courseID } = useParams();
  
  useEffect(() => {
    dispatcher(selectCourse(courseID))
    dispatcher(setLoading(true))
  },[courseID])

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