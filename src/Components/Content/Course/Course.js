import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setSideNavOpen } from '../../../App/AppSlice'
import Sidebar from '../../Sidebar/SideNav'
import ElementMapper from './Elements/ElementMapper'
import DisplayPage from '../DisplayPage'
import { useParams } from 'react-router-dom'
import { selectCourse } from '../../../App/DbSlice'
import "./Course.css"
import certificateImage from "../../../Images/certificateNoName.jpg"

function Course() {
  const userData = useSelector(state => state.dbslice.userData)
  const [courseComplete, setCourseComplete] = useState()
  const [displayCertificate, setDisplayCertificate] = useState()
  const dispatcher = useDispatch()
  const { courseID } = useParams();  
  
  useEffect(() => {
    dispatcher(selectCourse(courseID))
    dispatcher(setLoading(true))
  },[courseID])
  
  useEffect(() => {
    checkIfComplete()
  },[courseID, userData])

  function checkIfComplete(){
    let complete = userData?.courses[courseID]?.complete
    setCourseComplete(complete)
    if(complete)
      showCertificate()
  }
  function showCertificate(){
    setDisplayCertificate(true)
    dispatcher(setSideNavOpen(false))
  }

  return (
    <DisplayPage>
        {displayCertificate ? 
          <>
            <div className='certificate'>
              <div className='certificateName'>
                {userData?.accountData?.firstName+" "} {" "+userData?.accountData?.lastName}
              </div>
              <img src={certificateImage}></img>
            </div>
            <div>
              <button onClick={()=>{setDisplayCertificate(false)}}>View Course</button>
            </div>
          </>  
          :
          <>
            <Sidebar></Sidebar>
            <div className='course'>
              {courseComplete &&
                <button onClick={()=>{showCertificate(true)}}>View Certificate</button>
              }
              <ElementMapper></ElementMapper>
            </div>
          </>  
        }
    </DisplayPage>
  )
}

export default Course